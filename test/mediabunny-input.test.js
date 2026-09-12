import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Use actual SDK input parsing and explicit track selection contracts.
import test from 'node:test'
import { loadModules } from './helpers/load.js'

const base = 'packages/artplayer-proxy-mediabunny/src/'
const { isHlsSource, normalizeSource, createInput, resolveDuration, selectPlaybackTracks, getHlsState } = await loadModules({
  isHlsSource: { file: `${base}input`, name: 'isHlsSource' },
  normalizeSource: { file: `${base}input`, name: 'normalizeSource' },
  createInput: { file: `${base}input`, name: 'createInput' },
  resolveDuration: { file: `${base}tracks`, name: 'resolveDuration' },
  selectPlaybackTracks: { file: `${base}tracks`, name: 'selectPlaybackTracks' },
  getHlsState: { file: `${base}hls-state`, name: 'getHlsState' },
})

test('MediaBunny input detection preserves URL suffix, query/hash, casing and non-string boundaries', () => {
  for (const source of ['live.m3u8', 'LIVE.M3U8?token=x', 'live.m3u8#segment']) assert.equal(isHlsSource(source), true)
  for (const source of ['live.m3u8.mp4', 'file.mp4?name=live.m3u8&x=1', new URL('https://example.com/live.m3u8'), null, new Blob()]) assert.equal(isHlsSource(source), false)
})

test('MediaBunny inputs preserve falsy source handling and SDK validation ownership', () => {
  for (const source of [null, undefined, false, 0]) assert.equal(createInput(source), null)
  for (const source of [{ invalid: true }, 42, true]) {
    assert.equal(normalizeSource(source), source)
    assert.throws(() => createInput(source), { message: 'options.source must be a Source or SourceRef.' })
  }
  const source = normalizeSource('https://example.com/movie.mp4')
  assert.equal(normalizeSource(source), source)
  const input = createInput(source)
  input.dispose()
})

for (const sourceType of ['blob', 'stream']) {
  test(`MediaBunny ${sourceType} uses one actual SDK input for metadata, duration and track selection`, async () => {
    const bytes = fs.readFileSync(new URL('./browser/media/pattern.mp4', import.meta.url))
    const source = sourceType === 'blob'
      ? new Blob([bytes])
      : new ReadableStream({ start(controller) {
          for (let offset = 0; offset < bytes.length; offset += 1024) controller.enqueue(bytes.subarray(offset, offset + 1024))
          controller.close()
        } })
    const input = createInput(source)
    try {
      const media = await selectPlaybackTracks(input, source)
      assert.equal(media.input, input)
      assert.equal(media.videoTrack.displayWidth, 320)
      assert.equal(media.videoTrack.displayHeight, 180)
      assert.equal(media.audioTrack, null)
      assert.equal(media.duration, 8)
      assert.equal(media.isLive, false)
      assert.equal(media.videoMode, 'manual')
      assert.equal(media.audioMode, 'manual')
      assert.equal(await getHlsState(media), null)
    }
    finally { input.dispose() }
  })
}

for (const scenario of ['metadata', 'computed', 'live', 'unknown', 'trackless']) {
  test(`MediaBunny duration preserves ${scenario} handling without scanning live or trackless inputs`, async () => {
    const calls = []
    const track = scenario === 'trackless' ? null : { isLive: async () => scenario === 'live' }
    const duration = await resolveDuration({
      input: {
        getDurationFromMetadata: async (tracks, option) => {
          assert.deepEqual(tracks, [track])
          assert.deepEqual(option, { skipLiveWait: true })
          calls.push('metadata')
          return scenario === 'metadata' ? 12 : null
        },
        computeDuration: async (tracks, option) => {
          assert.deepEqual(tracks, [track])
          assert.deepEqual(option, { skipLiveWait: true })
          calls.push('compute')
          return scenario === 'unknown' ? null : 18
        },
      },
      videoTrack: track,
      audioTrack: null,
    })
    assert.equal(duration, scenario === 'metadata' ? 12 : scenario === 'computed' ? 18 : scenario === 'live' ? Infinity : Number.NaN)
    assert.deepEqual(calls, scenario === 'trackless' ? [] : ['computed', 'unknown'].includes(scenario) ? ['metadata', 'compute'] : ['metadata'])
  })
}

test('MediaBunny chooses pairable audio from primary video instead of an unrelated primary audio track', async () => {
  const paired = { id: 2 }
  const videoTrack = { isLive: async () => false, getPrimaryPairableAudioTrack: async () => paired }
  const input = {
    getPrimaryVideoTrack: async () => videoTrack,
    getPrimaryAudioTrack: async () => { throw new Error('Unrelated audio must not be selected') },
    getDurationFromMetadata: async (tracks) => {
      assert.deepEqual(tracks, [videoTrack, paired])
      return 5
    },
  }
  const media = await selectPlaybackTracks(input, 'live.m3u8')
  assert.equal(media.audioTrack, paired)
  assert.equal(media.videoMode, 'auto')
  assert.equal(media.audioMode, 'auto')
  assert.equal(media.isHls, true)
})

test('MediaBunny audio-only input selects primary audio and retains live detection', async () => {
  const audioTrack = { isLive: async () => true }
  const media = await selectPlaybackTracks({ getPrimaryVideoTrack: async () => null, getPrimaryAudioTrack: async () => audioTrack, getDurationFromMetadata: async () => null }, 'live.m3u8')
  assert.equal(media.videoTrack, null)
  assert.equal(media.audioTrack, audioTrack)
  assert.equal(media.duration, Infinity)
  assert.equal(media.isLive, true)
})

test('MediaBunny HLS state keeps actual track identity, pairability, bitrate fallback and language aliases', async () => {
  const audio = { id: 7, getName: async () => null, getLanguageCode: async () => 'fr', getAverageBitrate: async () => null, getBitrate: async () => 128000 }
  const video = {
    id: 3,
    getName: async () => 'Main',
    getDisplayHeight: async () => 180,
    getAverageBitrate: async () => 0,
    getBitrate: async () => {
      throw new Error('Zero is a valid average bitrate')
    },
    getPairableAudioTracks: async () => [audio],
  }
  const media = { input: { getVideoTracks: async () => [video] }, isHls: true, videoTrack: video, audioTrack: audio, videoMode: 'manual', audioMode: 'auto' }
  const state = await getHlsState(media)
  assert.equal(state.currentLevel, state.levels[0])
  assert.equal(state.currentAudio, state.audios[0])
  assert.equal(state.currentLevel.track, video)
  assert.equal(state.currentLevel.bitrate, 0)
  assert.equal(state.currentAudio.track, audio)
  assert.equal(state.currentAudio.name, null)
  assert.equal(state.currentAudio.lang, 'fr')
  assert.equal(state.currentAudio.language, 'fr')
  assert.equal(state.currentAudio.bitrate, 128000)
  assert.equal(state.videoMode, 'manual')
  assert.equal(state.audioMode, 'auto')
  assert.equal(await getHlsState(null), null)
})
