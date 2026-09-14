import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Native console subscription and frozen build boundaries.
import test from 'node:test'
import ts from 'typescript'
import { generateConsole, moduleRanges, obsoleteMap, upstreamSha256 } from '../scripts/site-vendor/console/build.ts'
import { hash, parcelModules, verifyArchive, verifyModules } from '../scripts/site-vendor/console/provenance.ts'
import { errorArgument } from '../scripts/site-vendor/console/runtime/errors.ts'
import { css } from '../scripts/site-vendor/console/runtime/style.ts'
import { createSubscriptions } from '../scripts/site-vendor/console/runtime/subscriptions.ts'

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
