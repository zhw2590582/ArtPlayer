import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { archiveFiles, ensureArchive, hash, readMember } from './releases.mjs'

test('Ads historical core archive and selected implementation members remain verified', async () => {
  const baseline = JSON.parse(fs.readFileSync(new URL('../baselines/ads-core.json', import.meta.url)))
  const ads = JSON.parse(fs.readFileSync(new URL('../baselines/ads-release.json', import.meta.url)))
  assert.equal(baseline.release.name, 'artplayer')
  assert.equal(baseline.release.version, ads.historicalCore.version)
  const archive = await ensureArchive(baseline.release)
  assert.deepEqual(archiveFiles(archive), baseline.archiveMembers)
  for (const [member, expected] of Object.entries(baseline.release.files))
    assert.equal(hash(readMember(archive, member)), expected)
  assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), baseline.release.manifest)
  assert(Object.hasOwn(baseline.release.files, `package/${baseline.release.manifest.main}`))
})
