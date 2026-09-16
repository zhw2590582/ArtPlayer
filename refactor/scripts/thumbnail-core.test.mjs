import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Node frozen release-contract runner.
import test from 'node:test'
import { archiveFiles, ensureArchive, hash, readMember } from './releases.mjs'

test('Thumbnail associated core 3.5.31 is a complete verified npm archive', async () => {
  const baseline = JSON.parse(fs.readFileSync(new URL('../baselines/thumbnail-core.json', import.meta.url)))
  const tool = JSON.parse(fs.readFileSync(new URL('../baselines/thumbnail-release.json', import.meta.url)))
  assert.deepEqual(baseline.association, tool.coreAssociations.historical)
  assert.equal(baseline.release.name, 'artplayer')
  assert.equal(baseline.release.version, baseline.association.version)
  const archive = await ensureArchive(baseline.release)
  assert.deepEqual(archiveFiles(archive), baseline.archiveMembers)
  assert.deepEqual(Object.keys(baseline.release.files).sort(), baseline.archiveMembers)
  for (const [member, expected] of Object.entries(baseline.release.files))
    assert.equal(hash(readMember(archive, member)), expected, member)
  assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), baseline.release.manifest)
})
