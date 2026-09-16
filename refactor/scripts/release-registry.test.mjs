import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Release boundary tests use the existing Node baseline runner.
import test from 'node:test'
import { prepareReleaseBundle } from '../../scripts/release/bundle.ts'
import { checkReleaseRegistry } from '../../scripts/release/registry-check.ts'
import { assessRegistry, observeRegistry, registry } from '../../scripts/release/registry.ts'

const hash = (bytes, algorithm = 'sha256', encoding = 'hex') => createHash(algorithm).update(bytes).digest(encoding)
const candidate = { name: 'artplayer', version: '6.0.0', integrity: `sha512-${hash('candidate', 'sha512', 'base64')}` }
const metadata = (item = candidate, tag = item.version) => ({ 'name': item.name, 'versions': { [item.version]: { name: item.name, version: item.version, dist: { integrity: item.integrity } } }, 'dist-tags': tag ? { next: tag } : {} })
const observation = (document, status = 200, name = candidate.name) => ({ url: `${registry}${name}`, status, observedAt: '2026-09-16T00:00:00.000Z', sha256: hash(JSON.stringify(document)), metadata: document })
const assess = (document, status = 200) => assessRegistry(candidate, 'next', observation(document, status))

test('Partial publication decisions distinguish absent, matching, tag-only and conflicting versions', () => {
  assert.equal(assess({ ...metadata(candidate, '5.4.0'), versions: {} }).state, 'not-observed')
  assert.equal(assess({ error: 'Not found' }, 404).state, 'not-observed')
  assert.equal(assess(metadata()).state, 'already-present')
  for (const tag of ['5.4.0', '7.0.0', null]) {
    const result = assess(metadata(candidate, tag))
    assert.equal(result.state, 'tag-change-required')
    assert.equal(result.currentTag, tag)
  }
  for (const integrity of [undefined, 'sha1-old', `sha512-${hash('different', 'sha512', 'base64')}`]) {
    const doc = metadata()
    doc.versions['6.0.0'].dist = { integrity }
    assert.equal(assess(doc).state, 'conflict')
  }
})

test('Unpublish history never becomes an available-version claim', () => {
  assert.equal(assess({ name: 'artplayer', time: { unpublished: { time: '2026-01-01' } } }).state, 'conflict')
  assert.equal(assess({ ...metadata(candidate, '5.4.0'), versions: {}, time: { '6.0.0': '2026-01-01' } }).state, 'conflict')
  assert.match(assess({ error: 'Not found' }, 404).reason, /unknown/)
})

test('Malformed or mismatched registry data never silently indicates an absent version', () => {
  const cases = [null, [], {}, { ...metadata(), name: 'other' }, { ...metadata(), versions: null }, { ...metadata(), 'dist-tags': [] }, { ...metadata(), 'dist-tags': { next: 6 } }, { ...metadata(), time: [] }]
  for (const document of cases)
    assert.throws(() => assess(document))
  for (const change of [p => p.name = 'other', p => p.version = '7.0.0', p => p.dist = null]) {
    const doc = metadata()
    change(doc.versions['6.0.0'])
    assert.throws(() => assess(doc))
  }
  assert.throws(() => assess({ error: 'unauthorized' }, 404))
  assert.throws(() => assess(metadata(), 500))
  assert.throws(() => assessRegistry(candidate, 'next', observation(metadata(), 200, 'artplayer-plugin-chapter')))
  assert.throws(() => assess({ ...metadata(), versions: {} }), /missing candidate/)
  const inherited = Object.create({ '6.0.0': metadata().versions['6.0.0'] })
  assert.equal(assess({ ...metadata(candidate, '5.4.0'), versions: inherited }).state, 'not-observed')
})

test('Invalid names, candidate integrity, tag and prerelease latest are rejected', () => {
  for (const item of [{ ...candidate, name: '../escape' }, { ...candidate, version: 'latest' }, { ...candidate, integrity: 'sha512-invalid' }])
    assert.throws(() => assessRegistry(item, 'next', observation(metadata())))
  assert.throws(() => assessRegistry(candidate, 'other', observation(metadata())))
  assert.throws(() => assessRegistry({ ...candidate, version: '6.0.0-rc.1' }, 'latest', observation(metadata())))
})

test('Transport requests only the official public GET endpoint with deadline and no redirects', async () => {
  const document = metadata()
  const result = await observeRegistry('artplayer', async (url, options) => {
    assert.equal(url, 'https://registry.npmjs.org/artplayer')
    assert.equal(options.method, 'GET')
    assert.equal(options.redirect, 'error')
    assert(options.signal instanceof AbortSignal)
    assert.deepEqual(options.headers, { 'accept': 'application/json', 'cache-control': 'no-cache' })
    assert.equal(options.body, undefined)
    return new Response(JSON.stringify(document))
  })
  assert.deepEqual(result.metadata, document)
  assert.equal(result.sha256, hash(JSON.stringify(document)))
  assert(Number.isFinite(Date.parse(result.observedAt)))
  await assert.rejects(observeRegistry('../escape', () => assert.fail('must not fetch')))
})

test('HTTP failures, malformed JSON, oversized and interrupted bodies reject instead of reporting availability', async () => {
  for (const status of [301, 401, 403, 429, 500])
    await assert.rejects(observeRegistry('artplayer', async () => new Response('{}', { status })), /registry HTTP/)
  await assert.rejects(observeRegistry('artplayer', async () => new Response('<html>gateway</html>')))
  await assert.rejects(observeRegistry('artplayer', async () => new Response('x'.repeat(10 * 1024 * 1024 + 1))), /exceeds/)
  await assert.rejects(observeRegistry('artplayer', async () => {
    throw new Error('connection reset')
  }), /connection reset/)
  await assert.rejects(observeRegistry('artplayer', async () => new Response(new ReadableStream({
    start(controller) {
      controller.error(new Error('body interrupted'))
    },
  }))), /body interrupted/)
  const missing = await observeRegistry('artplayer', async () => new Response('{"error":"Not found"}', { status: 404 }))
  assert.equal(assessRegistry(candidate, 'next', missing).state, 'not-observed')
})

// Synthetic complete gates and arbitrary bytes test orchestration, not real package admission.
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-registry-test-'))
  fs.mkdirSync(path.join(directory, 'refactor/.cache'), { recursive: true })
  t.after(() => {
    const resolved = fs.realpathSync(directory)
    assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()))
    assert(path.basename(resolved).startsWith('artplayer-registry-test-'))
    fs.rmSync(resolved, { recursive: true })
  })
  const names = ['artplayer', 'artplayer-plugin-chapter', 'artplayer-plugin-ads', 'artplayer-plugin-chromecast']
  const packages = names.map((name) => {
    const bytes = Buffer.from(name)
    const file = `refactor/.cache/${name}.tgz`
    fs.writeFileSync(path.join(directory, file), bytes)
    return { name, version: '6.0.0', distribution: 'npm', fingerprint: name, status: 'evidence-complete', blockers: [], candidate: { path: file, version: '6.0.0', sourceCommit: 'a'.repeat(40), inputFingerprint: name, integrity: `sha512-${hash(bytes, 'sha512', 'base64')}`, errors: [] } }
  })
  const report = { schemaVersion: 1, sourceCommit: 'b'.repeat(40), evidenceComplete: true, publicationAuthorized: false, toolchain: { node: 'v24.21.0', canonicalNode: '24.21.0', packageManager: 'yarn@1.22.22', lock: { sha256: 'c'.repeat(64) } }, packages }
  const inspect = () => structuredClone(report)
  const bundle = prepareReleaseBundle(directory, names, 'next', inspect)
  const expected = { names, tag: 'next', sourceCommit: report.sourceCommit, manifestSha256: hash(fs.readFileSync(path.join(bundle.directory, 'manifest.json'))) }
  const run = fetcher => checkReleaseRegistry(directory, bundle.directory, expected, inspect, fetcher)
  return { directory, bundle, expected, report, run }
}

test('A partially published batch retains all four decisions and never authorizes mutations', async (t) => {
  const f = fixture(t)
  let calls = 0
  const result = await f.run(async (url) => {
    const index = calls++
    const row = f.report.packages[index]
    assert.equal(url, `${registry}${row.name}`)
    const doc = metadata({ ...row, integrity: row.candidate.integrity }, index === 0 || index === 2 ? '5.0.0' : row.version)
    if (index === 0)
      doc.versions = {}
    if (index === 3)
      doc.versions[row.version].dist.integrity = candidate.integrity
    return new Response(JSON.stringify(doc))
  })
  assert.equal(calls, 4)
  assert.deepEqual(result.packages.map(p => p.state), ['not-observed', 'already-present', 'tag-change-required', 'conflict'])
  assert.deepEqual(result.conflicts, ['artplayer-plugin-chromecast'])
  assert.equal(result.publicationAuthorized, false)
  assert.equal(result.workflowProvenanceVerified, false)
  assert.equal(result.manifestSha256, f.expected.manifestSha256)
})

test('Blocked local evidence prevents even the first network request', async (t) => {
  const f = fixture(t)
  f.report.evidenceComplete = false
  await assert.rejects(f.run(() => assert.fail('must not fetch')), /preflight is blocked/)
})

test('Changes to gates or bundle during registry lookup invalidate the whole result', async (t) => {
  for (const mutate of [f => f.report.evidenceComplete = false, f => fs.appendFileSync(path.join(f.bundle.directory, 'artplayer-6.0.0.tgz'), 'changed')]) {
    const f = fixture(t)
    let calls = 0
    await assert.rejects(f.run(async () => {
      if (!calls++)
        mutate(f)
      return new Response('{"error":"Not found"}', { status: 404 })
    }))
    assert.equal(calls, 4)
  }
})

test('An interrupted batch does not return a successful partial plan', async (t) => {
  const f = fixture(t)
  let calls = 0
  await assert.rejects(f.run(async () => {
    if (++calls === 2)
      throw new Error('transport unavailable')
    return new Response('{"error":"Not found"}', { status: 404 })
  }), /transport unavailable/)
  assert.equal(calls, 2)
})

test('Registry CLI rejects omitted inputs, unknown options and an unsupported package manager', (t) => {
  const f = fixture(t)
  const script = path.resolve('scripts/check-release-registry.mjs')
  const full = ['--directory', f.bundle.directory, '--packages', f.expected.names.join(','), '--tag', 'next', '--source-commit', f.expected.sourceCommit, '--manifest-sha256', f.expected.manifestSha256]
  for (const [args, message] of [[[], /are required/], [['--unknown'], /Unknown option/], [full, /Use yarn release:registry/]]) {
    assert.throws(() => execFileSync(process.execPath, [script, ...args], { stdio: 'pipe', env: { ...process.env, npm_config_user_agent: 'npm/11.5.1' } }), (error) => {
      assert.equal(error.status, 1)
      assert.match(error.stderr.toString(), message)
      return true
    })
  }
})
