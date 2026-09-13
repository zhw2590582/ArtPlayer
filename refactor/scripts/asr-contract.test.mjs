import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Frozen published package evidence uses the repository runner.
import test from 'node:test'
import { verifyAsrContract } from './asr-contract.mjs'
import { readMember } from './releases.mjs'

const { baseline, archives, sources } = await verifyAsrContract()
const releases = [baseline.release, ...baseline.previous]
test('ASR verifies both releases, twelve archive members, nine Git inputs and historical core references', () => {
  assert.deepEqual(releases.map(r => r.version), ['2.1.0', '2.0.0'])
  assert.equal(releases.reduce((n, r) => n + Object.keys(r.files).length, 0), 12)
  assert.equal(sources.size, 9)
  assert.deepEqual(releases.map(r => r.historicalCore.version), ['5.3.1', '5.3.1-beta.1'])
  for (const release of releases) {
    assert.equal(release.manifest.peerDependencies, undefined)
    assert.equal(release.manifest.engines, undefined)
  }
})
test('ASR old declarations describe void callback/stop despite runtime consuming returned text and returning a Promise', () => {
  for (const release of releases) {
    const types = readMember(archives.get(release.version), 'package/types/artplayer-plugin-asr.d.ts').toString()
    assert.match(types, /onAudioChunk\?: \(chunk: AudioChunk\) => void \| Promise<void>/)
    assert.match(types, /stop: \(\) => void/)
    assert.match(types, /export default artplayerPluginAsr/)
    assert.match(types, /option\?: AsrPluginOption/)
  }
})
test('ASR actual published ESM exposes a lazy default factory without requiring a browser', async () => {
  for (const release of releases) {
    const source = readMember(archives.get(release.version), 'package/dist/artplayer-plugin-asr.mjs')
    const module = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
    assert.deepEqual(Object.keys(module), ['default'])
    assert.equal(typeof module.default(), 'function')
  }
})
test('ASR source ships an inline Worklet; network transcription is caller-owned example behavior', () => {
  const source = sources.get('packages/artplayer-plugin-asr/src/index.js')
  assert.match(source, /registerProcessor\('recorder-processor'/)
  assert.doesNotMatch(source, /\bfetch\(|new WebSocket\(/)
  const demo = sources.get('docs/assets/example/asr.js')
  assert.match(demo, /await fetch\(api\)/)
  assert.match(demo, /new WebSocket\(url\)/)
  for (const release of releases)
    assert(!Object.keys(release.files).some(file => /worklet|worker|\.wasm/.test(file)))
})
