import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { archiveFiles, ensureArchive, hash, readMember } from './releases.mjs'

test('Iframe historical core matches its release association and every frozen archive member', async () => {
  const baseline = JSON.parse(fs.readFileSync(new URL('../baselines/iframe-core.json', import.meta.url)))
  const iframe = JSON.parse(fs.readFileSync(new URL('../baselines/iframe-release.json', import.meta.url)))
  assert.deepEqual(baseline.association, iframe.release.historicalCore)
  assert.equal(baseline.release.name, 'artplayer')
  assert.equal(baseline.release.version, baseline.association.version)
  const archive = await ensureArchive(baseline.release)
  assert.deepEqual(archiveFiles(archive), baseline.archiveMembers)
  assert.deepEqual(Object.keys(baseline.release.files).sort(), baseline.archiveMembers)
  for (const [member, expected] of Object.entries(baseline.release.files))
    assert.equal(hash(readMember(archive, member)), expected, member)
  assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), baseline.release.manifest)
  assert(Object.hasOwn(baseline.release.files, `package/${baseline.release.manifest.main}`))
})
