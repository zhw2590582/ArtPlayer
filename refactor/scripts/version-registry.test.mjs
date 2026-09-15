import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Release version reuse and registry failure boundaries.
import test from 'node:test'
import { observePackage, versionObservation } from './version-registry.mjs'

test('Registry version planning rejects active and unpublished version reuse', () => {
  assert.equal(versionObservation(200, { name: 'test', versions: { '2.0.0': {} } }, '2.0.0').targetState, 'published')
  const unpublished = versionObservation(200, { name: 'test', time: { unpublished: { versions: ['2.0.0'] } } }, '2.0.0')
  assert.equal(unpublished.targetState, 'previously-used')
  assert.deepEqual(unpublished.majorConflicts, ['2.0.0'])
  assert.equal(versionObservation(200, { name: 'test', versions: {}, time: { '2.0.0': '2025-01-01' } }, '2.0.0').targetState, 'previously-used')
})

test('A different stable release in the target major prevents silently using an older major plan', () => {
  const value = versionObservation(200, { name: 'test', versions: { '2.1.0': {}, '3.0.0': {}, '2.0.0-rc.1': {} } }, '2.0.0')
  assert.equal(value.targetState, 'not-observed')
  assert.deepEqual(value.majorConflicts, ['2.1.0', '3.0.0'])
  assert.deepEqual(value.prereleasesInTargetMajor, ['2.0.0-rc.1'])
})

test('Missing names and empty version histories never establish ownership or reservation', () => {
  const missing = versionObservation(404, { error: 'Not found' }, '2.0.0')
  assert.equal(missing.nameState, 'not-found')
  assert.equal(missing.targetState, 'not-observed')
  assert.equal(missing.ownershipVerified, false)
  assert.equal(versionObservation(200, { name: 'test', versions: {} }, '2.0.0').ownershipVerified, false)
})

test('Registry authentication, throttling, server failures and malformed responses are not availability evidence', () => {
  for (const status of [401, 403, 429, 500])
    assert.throws(() => versionObservation(status, { error: 'Not found' }, '2.0.0'), /not an absence/)
  for (const data of [null, [], {}, { name: 'test' }])
    assert.throws(() => versionObservation(200, data, '2.0.0'))
  assert.throws(() => versionObservation(404, { error: 'Forbidden' }, '2.0.0'))
})

test('Live probe uses only the public registry and verifies response identity', async () => {
  const urls = []
  const fetcher = async (url, options) => {
    urls.push(url)
    assert.equal(options.redirect, 'error')
    assert.equal(options.headers.authorization, undefined)
    return new Response(JSON.stringify({ name: 'artplayer', versions: { '5.4.0': {} } }), { status: 200 })
  }
  const result = await observePackage('artplayer', '6.0.0', fetcher)
  assert.deepEqual(urls, ['https://registry.npmjs.org/artplayer'])
  assert.equal(result.targetState, 'not-observed')
  assert.match(result.responseSha256, /^[a-f0-9]{64}$/)
  await assert.rejects(observePackage('../private', '6.0.0', fetcher), /Unexpected package/)
  await assert.rejects(observePackage('other', '6.0.0', fetcher), /different package/)
})
