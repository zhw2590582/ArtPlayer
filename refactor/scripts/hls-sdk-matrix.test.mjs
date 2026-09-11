import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Verify immutable integration inputs in the baseline runner.
import test from 'node:test'
import { ensureArchive, hash, readMember } from './releases.mjs'

test('HLS SDK integration matrix keeps historical provenance and verified standalone worker builds', async () => {
  const matrix = JSON.parse(fs.readFileSync(new URL('../baselines/hls-sdk-matrix.json', import.meta.url)))
  const historical = JSON.parse(fs.readFileSync(new URL('../baselines/hls-sdk.json', import.meta.url)))
  assert.deepEqual(matrix.releases.map(release => release.version), ['1.5.17', '1.7.2'])
  assert.deepEqual(matrix.releases[0], historical.release, 'Do not rewrite the historical SDK baseline')
  for (const release of matrix.releases) {
    const archive = await ensureArchive(release)
    for (const [member, expected] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, member)), expected, `${release.version} ${member}`)
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    assert.equal(manifest.name, 'hls.js')
    assert.equal(manifest.version, release.version)
    assert.equal(manifest.license, 'Apache-2.0')
    assert(release.files['package/dist/hls.min.js'])
    assert(release.files['package/LICENSE'])
  }
  const plugin = JSON.parse(fs.readFileSync(new URL('../../packages/artplayer-plugin-hls-control/package.json', import.meta.url)))
  assert(!plugin.dependencies?.['hls.js'], 'Integration testing must not impose a new runtime SDK dependency')
})
