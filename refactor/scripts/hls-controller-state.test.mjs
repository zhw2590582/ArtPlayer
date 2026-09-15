import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- The baseline runner verifies page-serialized diagnostics in an isolated Node VM.
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import { snapshotHlsControllers } from '../../test/helpers/hls-controller-state.js'

test('fixed SDK controller observer serializes in a fresh realm and avoids cyclic loaded data', () => {
  const snapshot = runInNewContext(`(${snapshotHlsControllers.toString()})`)
  const source = { buffered: { length: 1, start: () => 0, end: () => 12 }, updating: false }
  const body = { sn: 5, level: 1, type: 'main', start: 10, duration: 2 }
  const loaded = { frag: body }
  body.loader = { loaded }
  const entity = { body, loaded, buffered: true }
  const fragmentTracker = Object.freeze({ endListFragments: { main: entity }, fragments: { main_1_5: entity } })
  const hls = Object.freeze({
    streamController: Object.freeze({ state: 'ENDED', level: 1, nextLoadPosition: 12, altAudio: 2, mediaBuffer: source, videoBuffer: source, fragPrevious: body, fragmentTracker }),
    bufferController: Object.freeze({ sourceBuffers: [['video', source]], mediaSource: { readyState: 'open' } }),
  })
  const result = JSON.parse(JSON.stringify(snapshot(hls)))
  assert.equal(result.main.state, 'ENDED')
  assert.equal(result.main.mediaBuffer, 'video')
  assert.deepEqual(result.main.buffered, [[0, 12]])
  assert.deepEqual(result.endList.main, { fragment: { sn: 5, level: 1, type: 'main', start: 10, duration: 2 }, buffered: true, loaded: true })
  assert.deepEqual(result.tracked, [{ key: 'main_1_5', buffered: true, loaded: true }])
  assert.equal(entity.loaded, loaded)
  assert.equal(source.buffered.length, 1)
})

test('detached and destroyed SDK snapshots do not invoke invalid public level getters', () => {
  const hls = {
    streamController: null,
    bufferController: null,
    fragmentTracker: null,
    get currentLevel() {
      throw new Error('destroyed getter')
    },
  }
  assert.equal(snapshotHlsControllers(hls).diagnosticError, undefined)
  assert.equal(snapshotHlsControllers(undefined).diagnosticError, undefined)
  assert.equal(snapshotHlsControllers({ streamController: { state: 'STOPPED' } }).main.state, 'STOPPED')
})

test('SDK 1.5 buffer dictionary and audio controller tracker remain readable', () => {
  const source = { updating: false, buffered: { length: 0 } }
  const result = snapshotHlsControllers({ bufferController: { sourceBuffer: { audio: source } }, networkControllers: [{ playlistType: 'main' }, { playlistType: 'audio', state: 'IDLE', fragmentTracker: { fragments: {}, endListFragments: {} } }] })
  assert.deepEqual(result.buffers, [{ type: 'audio', updating: false, buffered: [] }])
  assert.deepEqual(result.endList, {})
  assert.deepEqual(result.tracked, [])
  assert.equal(result.audio.state, 'IDLE')
})

test('native range getter failure is recorded without replacing the player failure', () => {
  const hls = { streamController: {
    get mediaBuffer() {
      throw new Error('released buffer')
    },
  } }
  assert.equal(snapshotHlsControllers(hls).diagnosticError, 'Error: released buffer')
})
