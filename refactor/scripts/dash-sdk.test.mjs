import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Verify frozen real SDK and media inputs.
import test from 'node:test'
import { ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

test('DASH real SDK releases retain exact versions, executable members, declarations and license provenance', async () => {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/dash-sdk.json')))
  assert.equal(baseline.task, 'PKG-DASH-05')
  assert.deepEqual(baseline.sdks.map(sdk => sdk.release.version), ['4.5.2', '5.2.1'])
  for (const sdk of baseline.sdks) {
    const archive = await ensureArchive(sdk.release)
    assert.equal(sdk.release.name, 'dashjs')
    assert.equal(sdk.metadataUrl, `https://registry.npmjs.org/dashjs/${sdk.release.version}`)
    assert(sdk.release.files[sdk.codeMember])
    assert(sdk.release.files['package/index.d.ts'])
    assert(sdk.release.files['package/LICENSE.md'])
    for (const [member, expected] of Object.entries(sdk.release.files))
      assert.equal(hash(readMember(archive, member)), expected, member)
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    assert.equal(manifest.version, sdk.release.version)
    assert.equal(manifest.name, 'dashjs')
    assert.equal(manifest.license, 'BSD-3-Clause')
  }
})

test('DASH media bytes and topology remain reproducible inputs rather than remote stream assumptions', () => {
  const directory = path.join(refactorDir, '../test/browser/media/dash')
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json')))
  assert.equal(manifest.kind, 'generated-dash-media')
  assert.equal(manifest.duration, 12)
  assert.deepEqual(manifest.videoHeights, [90, 180])
  assert.deepEqual(manifest.audio, [{ lang: 'en', frequency: 440 }, { lang: 'fr', frequency: 880 }])
  assert.deepEqual(fs.readdirSync(directory).filter(name => name !== 'manifest.json').sort(), Object.keys(manifest.files).sort())
  for (const [name, expected] of Object.entries(manifest.files)) {
    assert(/^[\w.-]+$/.test(name))
    const bytes = fs.readFileSync(path.join(directory, name))
    assert.equal(hash(bytes), expected.sha256, name)
    assert.equal(bytes.length, expected.bytes, name)
  }
  const read = name => fs.readFileSync(path.join(directory, name), 'utf8')
  assert.equal([...read('master.mpd').matchAll(/contentType="audio"/g)].length, 2)
  assert.equal([...read('master.mpd').matchAll(/<Representation\b/g)].length, 4)
  assert.equal([...read('video-only.mpd').matchAll(/<Representation\b/g)].length, 2)
  assert(!read('video-only.mpd').includes('contentType="audio"'))
  assert.equal([...read('single.mpd').matchAll(/<Representation\b/g)].length, 1)
  assert(!read('single.mpd').includes('height="180"'))
  assert(manifest.commands[0].includes('init-$RepresentationID$.m4s'))
  assert(manifest.commands[0].includes('chunk-$RepresentationID$-$Number%05d$.m4s'))
})
