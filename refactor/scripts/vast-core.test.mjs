import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Archive verification uses the repository Node baseline runner.
import test from 'node:test'
import { archiveFiles, ensureArchive, hash, readMember } from './releases.mjs'

test('VAST historical core 5.1.7 archive matches the release association and all frozen members', async () => {
  const baseline = JSON.parse(fs.readFileSync(new URL('../baselines/vast-core.json', import.meta.url)))
  const vast = JSON.parse(fs.readFileSync(new URL('../baselines/vast-release.json', import.meta.url)))
  assert.equal(baseline.release.name, 'artplayer')
  assert.equal(baseline.release.version, vast.historicalCore.version)
  const archive = await ensureArchive(baseline.release)
  assert.deepEqual(archiveFiles(archive), baseline.archiveMembers)
  assert.deepEqual(baseline.archiveMembers, Object.keys(baseline.release.files).sort())
  for (const [member, expected] of Object.entries(baseline.release.files))
    assert.equal(hash(readMember(archive, member)), expected)
  assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), baseline.release.manifest)
})
