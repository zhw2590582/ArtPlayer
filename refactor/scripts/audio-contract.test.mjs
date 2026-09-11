import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Frozen baseline checks run in Node.
import test from 'node:test'
import { audioFunctionHash, verifyAudioContract } from './audio-contract.mjs'

test('Audio Track 1.1.0 archive and historical contract remain immutable', verifyAudioContract)

test('audio factory comparison ignores formatting but detects changed behavior', async () => {
  const original = 'export default function artplayerPluginAudioTrack(option) { return option.offset + 1 }'
  const formatted = 'function artplayerPluginAudioTrack(option) {\n return option.offset + 1;\n }'
  assert.equal(await audioFunctionHash(original), await audioFunctionHash(formatted))
  assert.notEqual(await audioFunctionHash(original), await audioFunctionHash(original.replace('+ 1', '+ 2')))
  await assert.rejects(audioFunctionHash('function unrelated() {}'), /exactly one audio factory/)
})
