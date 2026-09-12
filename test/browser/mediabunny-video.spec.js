import { hash } from '../../refactor/scripts/releases.mjs'
import { mbCandidate } from '../helpers/mediabunny.js'
import { expect, test } from './fixtures.js'

const implementation = await mbCandidate()
for (const scenario of ['pause-frame', 'seek-source', 'seek-newer', 'timeupdate-pause', 'seek-pool']) {
  test(`MediaBunny ${implementation.name}: native video ownership ${scenario}`, async ({ page, browserName }, testInfo) => {
    await page.goto('/test/player.html?core=published')
    await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports;
      ${implementation.code}; window.mbFactory = module.exports.default || module.exports; })();` })
    let outcome = 'unverified'
    let result
    await page.evaluate(async () => {
      const listeners = new Map()
      window.mbEvents = []
      window.mbDraws = []
      window.mbFrames = new Set()
      const raf = requestAnimationFrame.bind(window)
      const cancel = cancelAnimationFrame.bind(window)
      window.mbFlush = () => new Promise(resolve => raf(() => raf(resolve)))
      window.requestAnimationFrame = (callback) => {
        const id = raf((time) => {
          window.mbFrames.delete(id)
          callback(time)
        })
        window.mbFrames.add(id)
        return id
      }
      window.cancelAnimationFrame = (id) => {
        window.mbFrames.delete(id)
        cancel(id)
      }
      window.mbHost = {
        constructor: window.Artplayer,
        option: { url: '', autoSize: false },
        template: { $player: document.querySelector('.player') },
        on(name, callback) {
          const list = listeners.get(name) || []
          list.push(callback)
          listeners.set(name, list)
        },
        emit(name, ...args) {
          window.mbEvents.push(name)
          for (const callback of listeners.get(name) || []) callback(...args)
        },
      }
      window.mbCanvas = window.mbFactory()(window.mbHost)
      const context = window.mbCanvas.engine.video.ctx
      const draw = context.drawImage.bind(context)
      context.drawImage = (...args) => {
        window.mbDraws.push({ time: window.mbCanvas.currentTime, paused: window.mbCanvas.paused })
        return draw(...args)
      }
      await window.mbCanvas.engine.load('/test/pattern.mp4')
      const button = document.createElement('button')
      button.id = 'mb-play'
      button.textContent = 'Play'
      button.onclick = () => {
        window.mbPlay = window.mbCanvas.play()
      }
      document.body.append(button)
      window.mbHold = (iterator) => {
        const next = iterator.next.bind(iterator)
        let first = true
        iterator.next = async (...args) => {
          const value = await next(...args)
          if (first) {
            first = false
            window.mbHeldTimestamp = value.value?.timestamp
            window.mbHeldReads = 1
            return new Promise((resolve) => {
              window.mbRelease = () => resolve(value)
            })
          }
          window.mbHeldReads++
          return value
        }
        return iterator
      }
    })
    try {
      const capabilities = await page.evaluate(() => ({ VideoDecoder: typeof VideoDecoder, AudioContext: typeof AudioContext, webkitAudioContext: typeof window.webkitAudioContext }))
      if (capabilities.AudioContext === 'undefined' && capabilities.webkitAudioContext === 'undefined') {
        expect(browserName).toBe('webkit')
        expect(capabilities.VideoDecoder).toBe('undefined')
        expect(await page.evaluate(() => window.mbCanvas.error?.code)).toBe(4)
        expect(await page.evaluate(() => window.mbCanvas.readyState)).toBeLessThan(4)
        outcome = 'unsupported-capability-control'
        return
      }
      expect(await page.evaluate(() => window.mbCanvas.error)).toBeNull()
      expect(await page.evaluate(() => window.mbCanvas.readyState)).toBe(4)
      expect(await page.evaluate(() => [window.mbCanvas.videoWidth, window.mbCanvas.videoHeight])).toEqual([320, 180])
      if (scenario === 'pause-frame') {
        await page.evaluate(() => window.mbHold(window.mbCanvas.engine.video.videoIterator))
        await page.click('#mb-play')
        await expect.poll(() => page.evaluate(() => typeof window.mbRelease)).toBe('function')
        await expect.poll(() => page.evaluate(() => window.mbCanvas.currentTime > window.mbHeldTimestamp + 0.1)).toBe(true)
        result = await page.evaluate(async () => {
          window.mbCanvas.pause()
          const before = window.mbDraws.length
          window.mbRelease()
          await window.mbPlay
          await window.mbFlush()
          return { before, after: window.mbDraws.length, paused: window.mbCanvas.paused, frames: window.mbFrames.size }
        })
        expect(result.after).toBe(result.before)
        expect(result.paused).toBe(true)
        expect(result.frames).toBe(0)
      }
      else if (scenario === 'seek-pool') {
        await page.evaluate(() => {
          const prototype = Object.getPrototypeOf(window.mbCanvas.engine.video.videoSink._videoSampleSink)
          const samples = prototype.samples
          window.mbSampleReleases = {}
          prototype.samples = function (...args) {
            const iterator = samples.apply(this, args)
            const next = iterator.next.bind(iterator)
            let first = true
            iterator.next = async (...values) => {
              const result = await next(...values)
              if (first && [1, 3].includes(args[0]) && !result.done) {
                first = false
                return new Promise((resolve) => {
                  window.mbSampleReleases[args[0]] = () => resolve(result)
                })
              }
              return result
            }
            return iterator
          }
          window.mbOldFirst = window.mbCanvas.engine.seek(1)
        })
        await expect.poll(() => page.evaluate(() => typeof window.mbSampleReleases[1])).toBe('function')
        await page.evaluate(() => {
          window.mbOldSecond = window.mbCanvas.engine.seek(3)
        })
        await expect.poll(() => page.evaluate(() => typeof window.mbSampleReleases[3])).toBe('function')
        result = await page.evaluate(async () => {
          await window.mbCanvas.engine.seek(5)
          const frame = window.mbCanvas.engine.video.nextFrame
          const fingerprint = () => {
            let hash = 2166136261
            for (const value of frame.canvas.getContext('2d').getImageData(0, 0, frame.canvas.width, frame.canvas.height).data)
              hash = Math.imul(hash ^ value, 16777619) >>> 0
            return hash
          }
          const before = fingerprint()
          window.mbSampleReleases[1]()
          window.mbSampleReleases[3]()
          await Promise.all([window.mbOldFirst, window.mbOldSecond])
          await window.mbFlush()
          return { before, after: fingerprint(), timestamp: frame.timestamp, currentFrameUnchanged: frame === window.mbCanvas.engine.video.nextFrame, time: window.mbCanvas.currentTime }
        })
        expect(result.after).toBe(result.before)
        expect(result.currentFrameUnchanged).toBe(true)
        expect(result.timestamp).toBeGreaterThan(5)
        expect(result.time).toBe(5)
      }
      else if (scenario.startsWith('seek-')) {
        await page.evaluate(() => {
          const prototype = Object.getPrototypeOf(window.mbCanvas.engine.video.videoSink)
          const canvases = prototype.canvases
          prototype.canvases = function (...args) {
            const iterator = canvases.apply(this, args)
            return args[0] === 3 ? window.mbHold(iterator) : iterator
          }
          window.mbSeek = window.mbCanvas.engine.seek(3)
        })
        await expect.poll(() => page.evaluate(() => typeof window.mbRelease)).toBe('function')
        result = await page.evaluate(async (scenario) => {
          if (scenario === 'seek-source')
            await window.mbCanvas.engine.load('/test/pattern.mp4?replacement=1')
          else await window.mbCanvas.engine.seek(5)
          const iterator = window.mbCanvas.engine.video.videoIterator
          const before = window.mbDraws.length
          window.mbRelease()
          await window.mbSeek
          await window.mbFlush()
          return { before, after: window.mbDraws.length, heldReads: window.mbHeldReads, currentIteratorKept: Boolean(iterator) && iterator === window.mbCanvas.engine.video.videoIterator, frames: window.mbFrames.size, time: window.mbCanvas.currentTime, error: window.mbCanvas.error }
        }, scenario)
        expect(result.after).toBe(result.before)
        expect(result.heldReads).toBe(1)
        expect(result.currentIteratorKept).toBe(true)
        expect(result.frames).toBe(0)
        expect(result.error).toBeNull()
        expect(result.time).toBe(scenario === 'seek-source' ? 0 : 5)
      }
      else {
        await page.evaluate(() => window.mbCanvas.events.addEventListener('timeupdate', () => window.mbCanvas.pause()))
        await page.click('#mb-play')
        await expect.poll(() => page.evaluate(() => window.mbEvents.includes('video:timeupdate'))).toBe(true)
        result = await page.evaluate(async () => {
          await window.mbFlush()
          return { paused: window.mbCanvas.paused, frames: window.mbFrames.size }
        })
        expect(result).toEqual({ paused: true, frames: 0 })
      }
      outcome = 'native-decoded-video-race'
    }
    finally {
      const state = await page.evaluate(async () => {
        const canvas = window.mbCanvas
        window.mbRelease?.()
        for (const release of Object.values(window.mbSampleReleases || {})) release()
        const context = canvas.engine.audio.audioContext
        window.mbCleanupContext = context
        window.mbHost.emit('destroy')
        await window.mbFlush()
        return { events: window.mbEvents, draws: window.mbDraws.length, error: canvas.error, audioContext: context?.state || 'not-created', frames: window.mbFrames.size }
      })
      expect(state.frames).toBe(0)
      await expect.poll(() => page.evaluate(() => window.mbCleanupContext?.state || 'not-created')).toMatch(/^(?:closed|not-created)$/)
      state.audioContext = await page.evaluate(() => window.mbCleanupContext?.state || 'not-created')
      await testInfo.attach('mediabunny-video-ownership', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), scenario, outcome, result, state, scope: 'Actual SDK MP4 decoding and browser clock/RAF; frame delivery or two raw VideoSample deliveries before CanvasSink conversion control interleaving. Source/seek ownership, pause and timeupdate reentry verified; not long-run AV sync or a mock codec.' }) })
    }
  })
}
