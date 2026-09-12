import assert from 'node:assert/strict'
import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { mbHistorical } from '../helpers/mediabunny.js'
import { tracklessMp4 } from '../helpers/trackless-mp4.js'
import { expect, test } from './fixtures.js'

const implementations = (await mbHistorical()).filter(item => item.name.startsWith('published'))
const manifest = JSON.parse(fs.readFileSync(new URL('./media/hls/manifest.json', import.meta.url)))
const hls = new Map(Object.entries(manifest.files).map(([name, expected]) => {
  const bytes = fs.readFileSync(new URL(`./media/hls/${name}`, import.meta.url))
  assert.equal(hash(bytes), expected.sha256)
  return [name, bytes]
}))
const pattern = fs.readFileSync(new URL('./media/pattern.mp4', import.meta.url))
const trackless = tracklessMp4(pattern)

for (const implementation of implementations) {
  for (const input of ['webm', 'blob', 'stream', 'audio', 'hls', 'trackless']) {
    test(`MediaBunny ${implementation.name}: native ${input} input and seek baseline`, async ({ page, browserName }, testInfo) => {
      await page.route('**/mb-hls/**', async (route) => {
        const name = new URL(route.request().url()).pathname.split('/').at(-1)
        const body = hls.get(name)
        await route.fulfill({ status: body ? 200 : 404, body: body || 'Missing fixture', contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t' })
      })
      await page.route('**/mb-trackless.mp4', route => route.fulfill({ status: 200, body: trackless, contentType: 'video/mp4' }))
      await page.goto('/test/player.html?core=published')
      await page.addScriptTag({ content: `(() => {
        const pendingFrames = new Set();
        const requestAnimationFrame = callback => {
          const id = window.requestAnimationFrame(time => { pendingFrames.delete(id); callback(time); });
          pendingFrames.add(id); return id;
        };
        const cancelAnimationFrame = id => { pendingFrames.delete(id); window.cancelAnimationFrame(id); };
        window.mbPendingFrames = pendingFrames;
        const module = { exports: {} }; const exports = module.exports;
        ${implementation.code}; window.mbFactory = module.exports.default || module.exports;
      })();` })
      const capabilities = await page.evaluate(() => ({ VideoDecoder: typeof VideoDecoder, AudioDecoder: typeof AudioDecoder, AudioContext: typeof AudioContext, webkitAudioContext: typeof window.webkitAudioContext }))
      let outcome = 'unverified'
      try {
        await page.evaluate(async (input) => {
          const listeners = new Map()
          window.mbEvents = []
          window.mbActions = []
          window.mbHost = {
            constructor: window.Artplayer,
            option: { url: '', autoSize: false },
            template: { $player: document.querySelector('.player') },
            on(name, fn) {
              const list = listeners.get(name) || []
              list.push(fn)
              listeners.set(name, list)
            },
            emit(name, ...args) {
              window.mbEvents.push({ name, currentTime: window.mbCanvas?.currentTime, readyState: window.mbCanvas?.readyState })
              for (const fn of listeners.get(name) || []) fn(...args)
            },
          }
          const canvas = window.mbFactory({ muted: true })(window.mbHost)
          window.mbCanvas = canvas
          document.querySelector('.player').appendChild(canvas)
          let source = input === 'webm' ? '/test/pattern.webm' : input === 'audio' ? '/test/audio-tone.m4a' : input === 'hls' ? '/mb-hls/master.m3u8' : input === 'trackless' ? '/mb-trackless.mp4' : '/test/pattern.mp4'
          if (input === 'blob' || input === 'stream') {
            const bytes = new Uint8Array(await (await fetch(source)).arrayBuffer())
            window.mbInputBytes = bytes.length
            source = input === 'blob'
              ? new Blob([bytes], { type: 'video/mp4' })
              : new ReadableStream({
                  start(controller) {
                    for (let offset = 0; offset < bytes.length; offset += 4096) controller.enqueue(bytes.slice(offset, offset + 4096))
                    controller.close()
                  },
                  cancel() { window.mbStreamCancelled = true },
                })
          }
          const load = canvas.engine.load.bind(canvas.engine)
          canvas.engine.load = (source) => {
            window.mbLoad = load(source)
            return window.mbLoad
          }
          canvas.src = source
          await window.mbLoad
          document.querySelector('#play').onclick = () => canvas.play().catch(error => window.mbActions.push({ name: error.name, message: error.message }))
        }, input)
        const loaded = await page.evaluate(() => ({ error: window.mbCanvas.error, readyState: window.mbCanvas.readyState, dimensions: [window.mbCanvas.videoWidth, window.mbCanvas.videoHeight] }))
        if (implementation.name === 'published-1.0.0' && ['stream', 'hls'].includes(input)) {
          const messages = {
            chromium: 'Failed to execute \'getReader\' on \'ReadableStream\': ReadableStreamDefaultReader constructor can only accept readable streams that are not yet locked to a reader',
            firefox: 'ReadableStream.getReader: Cannot get a new reader for a readable stream already locked by another reader.',
            webkit: 'ReadableStream is locked',
          }
          expect(loaded.error).toEqual({ code: 4, message: input === 'hls' ? 'Input has an unsupported or unrecognizable format.' : messages[browserName] })
          expect(loaded.readyState).toBe(0)
          expect(loaded.dimensions).toEqual([0, 0])
          outcome = input === 'hls' ? 'historical-unsupported-hls-control' : 'historical-stream-lock-control'
        }
        else if (capabilities.AudioContext === 'undefined' && capabilities.webkitAudioContext === 'undefined') {
          expect(browserName).toBe('webkit')
          expect(capabilities).toEqual({ VideoDecoder: 'undefined', AudioDecoder: 'undefined', AudioContext: 'undefined', webkitAudioContext: 'undefined' })
          expect(loaded.error).toEqual({ code: 4, message: 'undefined is not a constructor (evaluating \'new t\')' })
          expect(loaded.readyState).toBeLessThan(4)
          outcome = 'unsupported-capability-control'
        }
        else {
          expect(loaded.error).toBeNull()
          expect(loaded.readyState).toBe(4)
          if (input === 'trackless') {
            expect(loaded.dimensions).toEqual([0, 0])
            expect(await page.evaluate(() => window.mbEvents.filter(item => item.name === 'video:loadedmetadata').length)).toBe(implementation.name === 'published-1.2.0' ? 2 : 1)
            expect(await page.evaluate(() => window.mbEvents.filter(item => item.name === 'video:canplay').length)).toBe(1)
            outcome = 'historical-trackless-readiness-control'
            return
          }
          const readiness = await page.evaluate(() => window.mbEvents.map(item => item.name).filter(name => ['video:loadedmetadata', 'video:loadeddata', 'video:canplay', 'video:canplaythrough'].includes(name)))
          const repeatedData = implementation.name === 'published-1.0.0' && input !== 'audio'
          expect(readiness).toEqual(['video:loadedmetadata', 'video:loadeddata', ...(repeatedData ? ['video:loadeddata'] : []), 'video:canplay', 'video:canplaythrough'])
          if (input === 'audio')
            expect(loaded.dimensions).toEqual([0, 0])
          else expect(loaded.dimensions[0]).toBeGreaterThan(0)
          await page.click('#play')
          await expect.poll(() => page.evaluate(() => window.mbCanvas.currentTime)).toBeGreaterThan(0.15)
          if (['audio', 'hls'].includes(input)) {
            expect(await page.evaluate(() => Boolean(window.mbCanvas.engine.audio.audioSink))).toBe(true)
            expect(await page.evaluate(() => window.mbCanvas.engine.audio.queuedNodes.size)).toBeGreaterThan(0)
          }
          await page.evaluate(() => window.mbCanvas.pause())
          await page.evaluate(async () => {
            const canvas = window.mbCanvas
            window.mbSeekEventsStart = window.mbEvents.length
            window.mbFrameClockSamples = []
            const video = canvas.engine.video
            if (video.videoSink) {
              const times = new WeakMap()
              const canvases = video.videoSink.canvases.bind(video.videoSink)
              video.videoSink.canvases = (...args) => {
                const iterator = canvases(...args)
                const next = iterator.next.bind(iterator)
                iterator.next = async (...values) => {
                  const result = await next(...values)
                  if (!result.done && result.value)
                    times.set(result.value.canvas, result.value.timestamp)
                  return result
                }
                return iterator
              }
              const draw = video.ctx.drawImage.bind(video.ctx)
              video.ctx.drawImage = (...args) => {
                const result = draw(...args)
                if (times.has(args[0]))
                  window.mbFrameClockSamples.push({ frame: times.get(args[0]), audioClock: canvas.engine.audio.currentTime, paused: canvas.paused })
                return result
              }
            }
            const seek = canvas.engine.seek.bind(canvas.engine)
            canvas.engine.seek = (time) => {
              window.mbSeek = seek(time)
              return window.mbSeek
            }
            window.mbSeekTarget = Math.min(0.5, canvas.duration / 2)
            canvas.currentTime = window.mbSeekTarget
            await window.mbSeek
          })
          expect(await page.evaluate(() => window.mbCanvas.seeking)).toBe(false)
          expect(await page.evaluate(() => window.mbCanvas.paused)).toBe(true)
          expect(await page.evaluate(() => window.mbCanvas.currentTime)).toBeGreaterThan(0.2)
          expect(await page.evaluate(() => window.mbCanvas.currentTime === window.mbSeekTarget)).toBe(true)
          expect(await page.evaluate(() => window.mbEvents.slice(window.mbSeekEventsStart).map(item => item.name))).toEqual(['video:seeking', 'video:waiting', ...(repeatedData ? ['video:loadeddata'] : []), 'video:seeked'])
          if (input !== 'audio') {
            await page.click('#play')
            await expect.poll(() => page.evaluate(() => window.mbFrameClockSamples.filter(sample => !sample.paused).length)).toBeGreaterThan(2)
            await page.evaluate(() => window.mbCanvas.pause())
          }
          if (input === 'hls') {
            const tracks = await page.evaluate(async () => {
              const canvas = window.mbCanvas
              const initial = await canvas.getM3u8State()
              const low = initial.levels.find(level => level.height === 90)
              await canvas.switchM3u8Quality(low.id)
              const quality = await canvas.getM3u8State()
              const french = quality.audios.find(track => track.lang === 'fr')
              await canvas.switchM3u8Audio(french.id)
              const audio = await canvas.getM3u8State()
              window.mbTrackTransitions = { initial: initial.currentLevel.height, quality: quality.currentLevel.height, videoMode: quality.videoMode, language: audio.currentAudio.lang, audioMode: audio.audioMode }
              canvas.src = '/test/pattern.mp4'
              await window.mbLoad
              window.mbTrackTransitions.afterSourceSwitch = await canvas.getM3u8State()
              return window.mbTrackTransitions
            })
            expect(tracks).toEqual({ initial: 180, quality: 90, videoMode: 'manual', language: 'fr', audioMode: 'manual', afterSourceSwitch: null })
          }
          expect(await page.evaluate(() => window.mbActions)).toEqual([])
          outcome = 'native-input-playback-and-seek'
        }
      }
      finally {
        const state = await page.evaluate(async () => {
          const canvas = window.mbCanvas
          if (!canvas)
            return null
          const hls = canvas.getM3u8State ? await canvas.getM3u8State().catch(error => ({ error: error.message })) : null
          return { events: window.mbEvents, actions: window.mbActions, dimensions: [canvas.width, canvas.height, canvas.videoWidth, canvas.videoHeight], currentTime: canvas.currentTime, duration: canvas.duration, error: canvas.error, readyState: canvas.readyState, audioState: canvas.engine.audio.audioContext?.state, frameClockSamples: window.mbFrameClockSamples, tracks: window.mbTrackTransitions, hls: hls && { levels: hls.levels?.map(({ id, height }) => ({ id, height })), audios: hls.audios?.map(({ id, lang }) => ({ id, lang })), error: hls.error }, inputBytes: window.mbInputBytes }
        }).catch(error => ({ error: error.message }))
        await page.evaluate(() => {
          window.mbContext = window.mbCanvas?.engine.audio.audioContext
          window.mbHost?.emit('destroy')
        })
        await expect.poll(() => page.evaluate(() => window.mbContext?.state || 'not-created')).toMatch(/^(?:closed|not-created)$/)
        expect(await page.evaluate(() => window.mbPendingFrames.size)).toBe(0)
        const cleanup = await page.evaluate(() => ({ audioContext: window.mbContext?.state || 'not-created', pendingFrames: window.mbPendingFrames.size, streamCancelled: window.mbStreamCancelled || false }))
        await testInfo.attach('mediabunny-native-input', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), input, capabilities, outcome, state, cleanup, hlsManifest: input === 'hls' ? manifest : null, tracklessFixture: input === 'trackless' ? { parentSha256: hash(pattern), sha256: hash(trackless) } : null, scope: 'Actual published proxy with native browser media and controlled ArtPlayer host using actual core utilities/config; frame timestamps sampled against the SDK audio clock, not acoustic/long-run AV-sync acceptance. Cleanup checks settled playback, not pending-operation races.' }) })
      }
    })
  }
}
