import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Native console subscription and frozen build boundaries.
import test from 'node:test'
import ts from 'typescript'
import { decodeGitSource, verifyForkOutput, verifyGitSource } from '../scripts/site-vendor/console/attribution.ts'
import { generateConsole, moduleRanges, obsoleteMap, upstreamSha256 } from '../scripts/site-vendor/console/build.ts'
import { extractNotice } from '../scripts/site-vendor/console/embedded-notices.ts'
import { verifyMappedSources, verifyTransformedSources } from '../scripts/site-vendor/console/embedded-sources.ts'
import { hash, parcelModules, verifyArchive, verifyModules, verifyPackageEdges } from '../scripts/site-vendor/console/provenance.ts'
import { reconstructModule, verifyPrelude } from '../scripts/site-vendor/console/reconstruction.ts'
import { errorArgument } from '../scripts/site-vendor/console/runtime/errors.ts'
import { css } from '../scripts/site-vendor/console/runtime/style.ts'
import { createSubscriptions } from '../scripts/site-vendor/console/runtime/subscriptions.ts'

test('Immutable Git attribution verifies original blob identity and rejects altered API content', () => {
  const record = JSON.parse(fs.readFileSync('refactor/baselines/console-derived-attribution.json', 'utf8'))
  const source = record.remotes.find(source => source.id === 'gary-readme')
  const bytes = fs.readFileSync(source.source)
  const response = Buffer.from(JSON.stringify({ encoding: 'base64', content: bytes.toString('base64') }))
  assert.deepEqual(decodeGitSource(response, source), bytes)
  assert.throws(() => verifyGitSource(bytes, { ...source, gitBlobSha: '0'.repeat(40) }), /blob identity/)
  assert.throws(() => verifyGitSource(Buffer.from('shortened license'), source), /content changed/)
  assert.throws(() => decodeGitSource(Buffer.from(JSON.stringify({ encoding: 'utf8', content: bytes.toString() })), source), /encoding/)
  assert.throws(() => decodeGitSource(Buffer.from('{"encoding":"base64"}'), source), /Missing Git/)
})

test('Fork reproduction permits only the pinned terminal source map and exact runtime bytes', () => {
  const code = 'var value = 1;\n'
  const trailer = '//# sourceMappingURL=data:application/json;base64,e30='
  verifyForkOutput(code, code + trailer)
  assert.throws(() => verifyForkOutput(code, code), /one terminal/)
  assert.throws(() => verifyForkOutput(code, code + trailer + trailer), /one terminal/)
  assert.throws(() => verifyForkOutput(code, `${code + trailer}\nrun()`), /trailer/)
  assert.throws(() => verifyForkOutput('var value = 2;\n', code + trailer), /runtime differs/)
})

test('Embedded source maps reject omitted dependencies and content from a different release', () => {
  const upstream = Buffer.from('export const value = 1;\n')
  const map = { sources: ['../../src/owned.js', '../../node_modules/library/index.js'], sourcesContent: ['owned', upstream.toString()] }
  let mapBytes = Buffer.from(JSON.stringify(map))
  const record = { source: { archive: 'parent', member: 'index.js.map', sha256: hash(mapBytes) }, externalPrefix: '../../node_modules/', sources: [{ path: map.sources[1], upstream: { archive: 'library', member: 'index.js', sha256: hash(upstream) } }] }
  const read = member => member.archive === 'parent' ? mapBytes : upstream
  assert.equal(verifyMappedSources(record, read), 1)
  assert.throws(() => verifyMappedSources({ ...record, sources: [] }, read), /Empty embedded/)
  assert.throws(() => verifyMappedSources({ ...record, sources: [...record.sources, ...record.sources] }, read), /Duplicate/)
  const changed = Buffer.from('export const value = 2;\n')
  const otherVersion = structuredClone(record)
  otherVersion.sources[0].upstream.sha256 = hash(changed)
  assert.throws(() => verifyMappedSources(otherVersion, member => member.archive === 'parent' ? mapBytes : changed), /content differs/)
  for (const changedMap of [
    { ...map, sources: [...map.sources, '../../node_modules/hidden/index.js'], sourcesContent: [...map.sourcesContent, 'hidden'] },
    { ...map, sourcesContent: ['owned', null] },
  ]) {
    mapBytes = Buffer.from(JSON.stringify(changedMap))
    assert.throws(() => verifyMappedSources({ ...record, source: { ...record.source, sha256: hash(mapBytes) } }, read), /inventory changed|content differs/)
  }
})

test('Embedded transforms compare exact target bytes and reject duplicate or altered evidence', () => {
  const input = Buffer.from('export const value = 1;')
  const output = Buffer.from('exports.value = 1;')
  const source = { archive: 'upstream', member: 'index.js', sha256: hash(input) }
  const target = { archive: 'consumer', member: 'index.js', sha256: hash(output) }
  const read = member => member.archive === 'upstream' ? input : output
  const transform = () => output.toString()
  assert.equal(verifyTransformedSources([{ source, target }], read, transform), 1)
  assert.throws(() => verifyTransformedSources([{ source, target }], read, () => `${output}\n`), /transform differs/)
  assert.throws(() => verifyTransformedSources([{ source: { ...source, sha256: hash('changed') }, target }], read, transform), /member changed/)
  assert.throws(() => verifyTransformedSources([{ source, target }, { source, target }], read, transform), /Duplicate/)
})

test('Embedded notices retain exact headers and reject missing or changed mapped sources', () => {
  const source = '// Copyright owner\n// Full permission and disclaimer.\nconst value = 1;'
  const text = '// Copyright owner\n// Full permission and disclaimer.\n'
  const bytes = Buffer.from(source)
  const notice = { archive: 'fixture', member: 'index.js', memberSha256: hash(bytes), sourceSha256: hash(source), start: '// Copyright owner', end: '// Full permission and disclaimer.\n', source: 'LICENSE', sha256: hash(text) }
  assert.equal(extractNotice(bytes, notice), text)
  assert.throws(() => extractNotice(Buffer.from(`${source}\n`), notice), /archive member changed/)
  assert.throws(() => extractNotice(bytes, { ...notice, end: 'absent' }), /Missing notice end/)
  assert.throws(() => extractNotice(bytes, { ...notice, sha256: hash('shortened') }), /excerpt changed/)
  const map = { sources: ['../src/plugin.js'], sourcesContent: [source] }
  const mapped = Buffer.from(JSON.stringify(map))
  const mappedNotice = { ...notice, mapSource: map.sources[0], memberSha256: hash(mapped) }
  assert.equal(extractNotice(mapped, mappedNotice), text)
  assert.throws(() => extractNotice(mapped, { ...mappedNotice, mapSource: 'missing.js' }), /map source/)
  for (const changed of [{ ...map, sourcesContent: [null] }, { sources: [...map.sources, ...map.sources], sourcesContent: [source, source] }, { ...map, sourcesContent: ['changed'] }]) {
    const changedBytes = Buffer.from(JSON.stringify(changed))
    assert.throws(() => extractNotice(changedBytes, { ...mappedNotice, memberSha256: hash(changedBytes) }), /source content|map source|source changed/)
  }
})

function fixture() {
  const jobs = new Map()
  let id = 0
  const calls = []
  const parsed = []
  const clock = {
    setTimeout(fn) {
      jobs.set(++id, fn)
      return id
    },
    clearTimeout(key) { jobs.delete(key) },
  }
  const original = function (...args) {
    calls.push({ receiver: this, args })
    return 123
  }
  const target = { log: original }
  const subscribe = createSubscriptions(target, ['log'], (method, data) => {
    parsed.push({ method, data })
    return { method, data }
  }, clock)
  const flush = () => {
    for (const [key, fn] of [...jobs]) {
      jobs.delete(key)
      fn()
    }
  }
  return { jobs, calls, parsed, target, original, subscribe, flush, clock }
}

test('Console subscriptions forward once with the original receiver and independently remove either viewer', () => {
  for (const first of [true, false]) {
    const f = fixture()
    const a = []
    const b = []
    const offA = f.subscribe(log => a.push(log))
    const hook = f.target.log
    const offB = f.subscribe(log => b.push(log))
    assert.equal(f.target.log, hook)
    const receiver = {}
    const object = { nested: true }
    assert.equal(f.target.log.call(receiver, object), undefined)
    assert.equal(f.calls.length, 1)
    assert.equal(f.calls[0].receiver, receiver)
    f.flush()
    assert.equal(f.parsed.length, 1)
    assert.equal(a[0].data[0], object)
    assert.equal(b[0].data[0], object)
    ;(first ? offA : offB)()
    f.target.log('survivor')
    f.flush()
    assert.equal(first ? b.length : a.length, 2)
    ;(first ? offB : offA)()
    assert.equal(f.target.log, f.original)
    assert(!('feed' in f.target))
  }
})

test('Console subscriptions cancel abandoned logs and do not replay prior logs into a new viewer', () => {
  const f = fixture()
  const a = []
  const b = []
  const offA = f.subscribe(log => a.push(log))
  f.target.log('old')
  const offB = f.subscribe(log => b.push(log))
  offA()
  f.flush()
  assert.deepEqual([a, b], [[], []])
  f.target.log('cancelled')
  offB()
  assert.equal(f.jobs.size, 0)
  const off = f.subscribe(log => a.push(log))
  f.target.log('new')
  f.flush()
  assert.deepEqual(a.map(log => log.data[0]), ['new'])
  off()
})

test('Console ownership preserves preexisting metadata and wrappers installed later', () => {
  const f = fixture()
  const previous = { pointers: { unrelated: true } }
  const rows = []
  Object.defineProperty(f.target, 'feed', { configurable: true, value: previous, writable: true, enumerable: false })
  const before = Object.getOwnPropertyDescriptor(f.target, 'feed')
  const off = f.subscribe(log => rows.push(log))
  const own = f.target.log
  const foreign = function (...args) {
    return own.apply(this, args)
  }
  f.target.log = foreign
  off()
  assert.equal(f.target.log, foreign)
  assert.deepEqual(Object.getOwnPropertyDescriptor(f.target, 'feed'), before)
  f.target.log('after-dispose')
  assert.equal(f.calls.length, 1)
  assert.equal(f.jobs.size, 0)
  assert.deepEqual(rows, [])
  const again = f.subscribe(log => rows.push(log))
  f.target.log('again')
  f.flush()
  assert.equal(rows.length, 1)
  again()
  assert.equal(f.target.log, foreign)
})

test('Console installation rolls back on a readonly method and keeps other viewers live after a callback throws', () => {
  const f = fixture()
  Object.defineProperty(f.target, 'error', { value() {}, configurable: true })
  const subscribe = createSubscriptions(f.target, ['log', 'error'], () => false, f.clock)
  assert.throws(() => subscribe(() => {}), TypeError)
  assert.equal(f.target.log, f.original)
  assert(!('feed' in f.target))
  const failure = new Error('listener failed')
  const rows = []
  const offA = f.subscribe(() => {
    throw failure
  })
  const offB = f.subscribe(log => rows.push(log))
  f.target.log('delivery')
  assert.throws(f.flush, error => error === failure)
  assert.equal(rows.length, 1)
  offA()
  offB()
})

test('Console error adaptation keeps existing stacks and arbitrary objects, and adds missing native messages without mutation', () => {
  const error = new Error('message')
  const object = { stack: 'custom', message: 'keep-object' }
  assert.equal(errorArgument(object), object)
  assert.equal(errorArgument(error), error)
  error.stack = 'method@file:1:2'
  assert.equal(errorArgument(error), 'Error: message\nmethod@file:1:2')
  assert.equal(error.stack, 'method@file:1:2')
  error.message = 'method'
  assert.equal(errorArgument(error), 'Error: method\nmethod@file:1:2')
  Object.defineProperty(error, 'message', {
    get() { throw new Error('getter') },
  })
  assert.equal(errorArgument(error), error)
})

test('Console build changes only the two owned module bodies and is deterministic', async () => {
  const source = fs.readFileSync('refactor/baselines/site-vendor/console-original.js', 'utf8')
  assert.equal(createHash('sha256').update(source).digest('hex'), upstreamSha256)
  const mask = (text) => {
    for (const [id, range] of [...moduleRanges(text)].sort((a, b) => b[1].start - a[1].start))
      text = text.slice(0, range.start) + id + text.slice(range.end)
    return text
  }
  const candidate = await generateConsole(process.cwd())
  const range = moduleRanges(source).get('W5CS')
  const view = ts.createSourceFile('view.js', source.slice(range.start, range.end), ts.ScriptTarget.Latest, true)
  const styles = []
  function visit(node) {
    if (ts.isStringLiteral(node) && node.text.includes('position: relative;'))
      styles.push(node.text)
    ts.forEachChild(node, visit)
  }
  visit(view)
  assert.deepEqual(styles, [css])
  assert.equal(mask(candidate), mask(source).slice(0, -obsoleteMap.length))
  assert.equal(candidate, await generateConsole(process.cwd()))
  assert.notEqual(candidate, source)
  assert.throws(() => moduleRanges('var unrelated = 1'), /Missing owned/)
})

test('Console provenance rejects altered archive bytes and non-SHA512 integrity', () => {
  const bytes = Buffer.from('verified archive')
  const archive = { name: 'fixture', sha256: hash(bytes), integrity: `sha512-${createHash('sha512').update(bytes).digest('base64')}` }
  verifyArchive(bytes, archive)
  assert.throws(() => verifyArchive(Buffer.from('changed archive'), archive), /integrity changed/)
  assert.throws(() => verifyArchive(bytes, { ...archive, sha256: 'wrong' }), /bytes changed/)
  assert.throws(() => verifyArchive(bytes, { ...archive, integrity: 'sha1-weak' }), /Expected SHA-512/)
})

test('Console provenance extracts the frozen 102 modules without executing vendor code', () => {
  const source = fs.readFileSync('refactor/baselines/site-vendor/console-original.js', 'utf8')
  const modules = parcelModules(source)
  assert.equal(modules.size, 102)
  assert.equal(modules.get('m6b6').dependencies['./Hook'], 'pYO5')
  assert.throws(() => parcelModules('const unrelated = 1'), /Missing Parcel/)
  assert.throws(() => parcelModules('({"Focm":[function(){},{}],"Focm":[function(){},{}]})'), /Duplicate Parcel module/)
})

test('Console provenance requires exact source, compiler output, dependency mapping and complete reachability', () => {
  const root = { id: 'm6b6', body: 'exports.value=1;', dependencies: { './child': 'child', 'react': 'react' } }
  const child = { id: 'child', body: 'exports.child=2;', dependencies: {} }
  const modules = new Map([root, child, { id: 'react', body: '', dependencies: {} }].map(module => [module.id, module]))
  const sources = [root, child].map(module => ({ id: module.id, member: `package/lib/${module.id === 'm6b6' ? 'index' : module.id}.js`, sourceSha256: hash(module.body), generatedSha256: hash(module.body), bodySha256: hash(module.body) }))
  const external = [{ from: 'm6b6', dependency: 'react', id: 'react' }]
  const read = member => member.endsWith('index.js') ? root.body : child.body
  assert.equal(verifyModules(modules, sources, external, read, source => source), 2)
  assert.throws(() => verifyModules(modules, sources, external, () => 'changed', source => source), /Source changed/)
  assert.throws(() => verifyModules(modules, sources, external, read, () => 'changed'), /Compiler output changed/)
  assert.throws(() => verifyModules(modules, [sources[0]], external, read, source => source), /Source dependency mapping changed/)
  assert.throws(() => verifyModules(modules, [...sources, sources[0]], external, read, source => source), /Duplicate source/)
  assert.throws(() => verifyModules(modules, [...sources, { ...sources[0], id: 'unused' }], external, read, source => source), /Unreachable/)
  assert.throws(() => verifyModules(modules, sources, [], read, source => source), /External dependency boundary/)
  const bad = [{ ...sources[0], member: 'package/lib/../escape.js' }, sources[1]]
  assert.throws(() => verifyModules(modules, bad, external, read, source => source), /Invalid source member/)
  modules.set('child', { ...child, body: 'changed' })
  assert.throws(() => verifyModules(modules, sources, external, read, source => source), /Frozen module changed/)
})

test('Console provenance verifies multiple archive roots without merging their relative module ownership', () => {
  const modules = new Map([
    ['m6b6', { id: 'm6b6', body: 'exports.a=1;', dependencies: { react: 'react' } }],
    ['react', { id: 'react', body: 'exports.b=2;', dependencies: {} }],
  ])
  const sources = [...modules.values()].map(module => ({ id: module.id, archive: module.id, member: 'package/index.js', sourceSha256: hash(module.body), generatedSha256: hash(module.body), bodySha256: hash(module.body) }))
  const external = [{ from: 'm6b6', dependency: 'react', id: 'react' }]
  const read = (member, source) => {
    assert.equal(member, 'package/index.js')
    assert.equal(source.archive, source.id)
    return modules.get(source.id).body
  }
  const options = { roots: ['m6b6', 'react'], sourcePrefix: 'package/' }
  assert.equal(verifyModules(modules, sources, external, read, code => code, options), 2)
  assert.throws(() => verifyModules(modules, sources, external, read, code => code, { ...options, roots: ['m6b6'] }), /Unreachable/)
  assert.throws(() => verifyModules(modules, sources, external, read, code => code, { ...options, roots: ['m6b6', 'm6b6'] }), /Invalid source roots/)
  modules.get('m6b6').dependencies = { './index': 'react' }
  assert.throws(() => verifyModules(modules, sources, [], read, code => code, options), /Relative dependency changed archives/)
})

test('Console reconstruction retains separate Babel stages and explicit environment and global boundaries', () => {
  const calls = []
  const babel = { transform(source, { plugins }) {
    calls.push({ source, plugins })
    return { code: `${source}|${plugins.join(',')}` }
  } }
  const item = { stages: [['transform-typeof-symbol'], ['transform-modules-commonjs']], environment: { NODE_ENV: 'production', SC_ATTR: null }, prefix: 'var define;\n' }
  const source = 'process.env.NODE_ENV;process.env.SC_ATTR'
  const result = reconstructModule(source, item, babel, value => `minified(${value})`)
  assert.equal(calls.length, 2)
  assert.equal(calls[1].source, `${source}|transform-typeof-symbol`)
  assert.equal(result, 'var define;\nminified(var define;\n"production";undefined|transform-typeof-symbol|transform-modules-commonjs)')
  assert.throws(() => reconstructModule(source, { ...item, stages: [['unreviewed-plugin']] }, babel, String), /Unexpected historical transform/)
  assert.throws(() => reconstructModule(source, { ...item, environment: { UNREVIEWED: 'value' } }, babel, String), /Unexpected historical environment/)
  assert.throws(() => reconstructModule(source, { ...item, prefix: 'unreviewed-global' }, babel, String), /Unexpected Parcel global/)
})

test('Console provenance verifies exact Parcel prelude and invocation instead of accepting any wrapper', () => {
  const prelude = 'loader=function(){};\n'
  const bundle = 'loader=function(){}({modules},{},["Focm"], null)'
  verifyPrelude(bundle, prelude, '},{},["Focm"], null)')
  assert.throws(() => verifyPrelude(bundle.replace('function()', 'function(changed)'), prelude, '},{},["Focm"], null)'), /prelude differs/)
  assert.throws(() => verifyPrelude(bundle.replace('Focm', 'other'), prelude, '},{},["Focm"], null)'), /invocation/)
})

test('Console provenance verifies named and scoped subpath imports against the identified package', () => {
  const modules = new Map([
    ['parent', { id: 'parent', dependencies: { '@babel/runtime/helpers/esm/extends': 'helper', 'react': 'react' } }],
    ['helper', { id: 'helper', dependencies: {} }],
    ['react', { id: 'react', dependencies: {} }],
  ])
  const owners = [{ id: 'parent', packageName: 'consumer' }, { id: 'helper', packageName: '@babel/runtime' }, { id: 'react', packageName: 'react' }]
  verifyPackageEdges(modules, owners)
  assert.throws(() => verifyPackageEdges(modules, owners.slice(0, 2)), /Wrong package/)
  assert.throws(() => verifyPackageEdges(modules, [...owners, owners[0]]), /Duplicate package ownership/)
  assert.throws(() => verifyPackageEdges(modules, owners.map(owner => ({ ...owner, packageName: owner.id }))), /Wrong package/)
})
