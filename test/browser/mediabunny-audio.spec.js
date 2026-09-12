import assert from 'node:assert/strict'
import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { mbCandidate } from '../helpers/mediabunny.js'
import { expect, test } from './fixtures.js'

const implementation = await mbCandidate()
const manifest = JSON.parse(fs.readFileSync(new URL('./media/hls/manifest.json', import.meta.url)))
const hls = new Map(Object.entries(manifest.files).map(([name, expected]) => {
  const bytes = fs.readFileSync(new URL(`./media/hls/${name}`, import.meta.url))
  assert.equal(hash(bytes), expected.sha256)
  return [name, bytes]
}))

for (const scenario of ['playback', 'buffer-pause', 'buffer-rate', 'resume-pause', 'resume-source', 'resume-destroy', 'av-clock', 'no-track']) {
  test(`MediaBunny ${implementation.name}: native audio ownership ${scenario}`, async ({ page, browserName }, testInfo) => {
    await page.route('**/mb-audio-hls/**', async (route) => {
      const name = new URL(route.request().url()).pathname.split('/').at(-1)
      const body = hls.get(name)
      await route.fulfill({ status: body ? 200 : 404, body: body || 'Missing fixture', contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t' })
    })
    await page.goto('/test/player.html?core=published')
    await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports;
      ${implementation.code}; window.mbFactory = module.exports.default || module.exports; })();` })
    const capabilities = await page.evaluate(() => ({ AudioContext: typeof AudioContext, webkitAudioContext: typeof window.webkitAudioContext, AudioDecoder: typeof AudioDecoder, VideoDecoder: typeof VideoDecoder }))
    let outcome = 'unverified'
    let result
    await page.evaluate(async (scenario) => {
      const listeners = new Map()
      window.mbEvents = []
      window.mbNodes = []
      window.mbClockSamples = []
      window.mbFlush = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
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
          window.mbEvents.push(name)
          for (const fn of listeners.get(name) || []) fn(...args)
        },
      }
      const canvas = window.mbFactory()(window.mbHost)
      window.mbCanvas = canvas
      document.querySelector('.player').append(canvas)
      await canvas.engine.load(scenario === 'av-clock' ? '/mb-audio-hls/master.m3u8' : scenario === 'no-track' ? '/test/pattern.mp4' : '/test/audio-tone.m4a')
      const audio = canvas.engine.audio
      const context = audio.audioContext
      window.mbContext = context
      if (context) {
        const create = context.createBufferSource.bind(context)
        context.createBufferSource = () => {
          const node = create()
          const record = { node, stops: 0, disconnects: 0, starts: [] }
          const stop = node.stop.bind(node)
          const disconnect = node.disconnect.bind(node)
          const start = node.start.bind(node)
          node.stop = (...args) => {
            record.stops++
            return stop(...args)
          }
          node.disconnect = (...args) => {
            record.disconnects++
            return disconnect(...args)
          }
          node.start = (...args) => {
            record.starts.push({ args, rate: node.playbackRate.value, at: context.currentTime })
            return start(...args)
          }
          window.mbNodes.push(record)
          return node
        }
      }
      canvas.muted = true
      document.querySelector('#play').onclick = () => {
        window.mbPlay = canvas.play()
      }
    }, scenario)
    try {
      if (capabilities.AudioContext === 'undefined' && capabilities.webkitAudioContext === 'undefined') {
        expect(browserName).toBe('webkit')
        expect(capabilities.AudioDecoder).toBe('undefined')
        expect(await page.evaluate(() => window.mbCanvas.error?.code)).toBe(4)
        expect(await page.evaluate(() => window.mbCanvas.readyState)).toBeLessThan(4)
        outcome = 'unsupported-capability-control'
        return
      }
      expect(await page.evaluate(() => window.mbCanvas.error)).toBeNull()
      expect(await page.evaluate(() => window.mbCanvas.readyState)).toBe(4)
      if (scenario.startsWith('resume-')) {
        await page.evaluate(async () => {
          const context = window.mbContext
          await context.suspend()
          const resume = context.resume.bind(context)
          context.resume = () => {
            const native = resume()
            window.mbResumeCalled = true
            return native.then(() => new Promise((resolve) => {
              window.mbReleaseResume = resolve
            }))
          }
        })
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => typeof window.mbReleaseResume)).toBe('function')
        result = await page.evaluate(async (scenario) => {
          if (scenario === 'resume-pause')
            window.mbCanvas.pause()
          else if (scenario === 'resume-source')
            await window.mbCanvas.engine.load('/test/pattern.mp4')
          else window.mbHost.emit('destroy')
          window.mbReleaseResume()
          await window.mbPlay
          await window.mbFlush()
          const audio = window.mbCanvas.engine.audio
          return { paused: audio.paused, queued: audio.queuedNodes.size, created: window.mbNodes.length, iterator: Boolean(audio.audioIterator), audioSink: Boolean(audio.audioSink) }
        }, scenario)
        expect(result).toMatchObject({ paused: true, queued: 0, created: 0, iterator: false })
        if (scenario !== 'resume-pause')
          expect(result.audioSink).toBe(false)
      }
      else if (scenario.startsWith('buffer-')) {
        await page.evaluate(() => {
          const sink = window.mbCanvas.engine.audio.audioSink
          const buffers = sink.buffers.bind(sink)
          let first = true
          sink.buffers = (...args) => {
            const iterator = buffers(...args)
            const next = iterator.next.bind(iterator)
            iterator.next = async (...args) => {
              const value = await next(...args)
              if (first && !value.done) {
                first = false
                window.mbHeldBuffer = value.value.buffer
                return new Promise((resolve) => {
                  window.mbReleaseBuffer = () => resolve(value)
                })
              }
              return value
            }
            return iterator
          }
        })
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => typeof window.mbReleaseBuffer)).toBe('function')
        await page.evaluate((scenario) => {
          if (scenario === 'buffer-pause')
            window.mbCanvas.pause()
          else window.mbCanvas.playbackRate = 2
          window.mbReleaseBuffer()
        }, scenario)
        if (scenario === 'buffer-rate')
          await expect.poll(() => page.evaluate(() => window.mbNodes.length)).toBeGreaterThan(0)
        result = await page.evaluate(async () => {
          await window.mbFlush()
          const audio = window.mbCanvas.engine.audio
          return { obsoleteScheduled: window.mbNodes.some(record => record.node.buffer === window.mbHeldBuffer), rates: window.mbNodes.flatMap(record => record.starts.map(start => start.rate)), queued: audio.queuedNodes.size, paused: audio.paused }
        })
        expect(result.obsoleteScheduled).toBe(false)
        if (scenario === 'buffer-pause')
          expect(result).toMatchObject({ queued: 0, paused: true })
        else expect(result.rates.every(rate => rate === 2)).toBe(true)
      }
      else {
        if (scenario === 'av-clock') {
          await page.evaluate(async () => {
            const video = window.mbCanvas.engine.video
            const times = new WeakMap()
            const prototype = Object.getPrototypeOf(video.videoSink)
            const canvases = prototype.canvases
            prototype.canvases = function (...args) {
              const iterator = canvases.apply(this, args)
              const next = iterator.next.bind(iterator)
              iterator.next = async (...values) => {
                const result = await next(...values)
                if (!result.done)
                  times.set(result.value.canvas, result.value.timestamp)
                return result
              }
              return iterator
            }
            const draw = video.ctx.drawImage.bind(video.ctx)
            video.ctx.drawImage = (...args) => {
              if (times.has(args[0]))
                window.mbClockSamples.push({ frame: times.get(args[0]), audio: window.mbCanvas.engine.audio.currentTime, rate: window.mbCanvas.playbackRate, paused: window.mbCanvas.paused })
              return draw(...args)
            }
            await window.mbCanvas.engine.seek(1)
          })
        }
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.mbCanvas.currentTime)).toBeGreaterThan(scenario === 'av-clock' ? 1.3 : 0.3)
        if (scenario !== 'no-track')
          await expect.poll(() => page.evaluate(() => window.mbCanvas.engine.audio.queuedNodes.size)).toBeGreaterThan(0)
        const pause = await page.evaluate(async () => {
          window.mbCanvas.pause()
          const time = window.mbCanvas.currentTime
          await window.mbFlush()
          return { time, after: window.mbCanvas.currentTime, queued: window.mbCanvas.engine.audio.queuedNodes.size, retained: window.mbNodes.filter(record => !record.disconnects || record.node.onended !== null).length }
        })
        expect(pause.after).toBe(pause.time)
        expect(pause).toMatchObject({ queued: 0, retained: 0 })
        await page.evaluate(() => {
          window.mbCanvas.volume = 0.5
          window.mbCanvas.muted = false
        })
        expect(await page.evaluate(() => window.mbCanvas.engine.audio.gainNode.gain.value)).toBeCloseTo(0.25, 6)
        await page.evaluate(() => {
          window.mbCanvas.muted = true
          window.mbCanvas.playbackRate = 2
        })
        expect(await page.evaluate(() => window.mbCanvas.engine.audio.gainNode.gain.value)).toBe(0)
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.mbCanvas.currentTime)).toBeGreaterThan(pause.time + 0.35)
        result = await page.evaluate(() => {
          const audio = window.mbCanvas.engine.audio
          const clock = audio.currentTime
          const elapsed = audio.audioContext.currentTime - audio.audioContextStartTime
          const nodes = [...audio.queuedNodes]
          return { clock, rate: audio.playbackRate, anchor: audio.playbackTimeAtStart, elapsed, nodeRates: nodes.map(node => node.playbackRate.value), hasSink: Boolean(audio.audioSink), samples: window.mbClockSamples, pause: window.mbCanvas.paused }
        })
        expect(Math.abs(result.clock - (result.anchor + result.elapsed * 2))).toBeLessThan(0.03)
        expect(result).toMatchObject({ rate: 2, pause: false, hasSink: scenario !== 'no-track' })
        if (scenario === 'no-track') {
          expect(result.nodeRates).toEqual([])
        }
        else {
          expect(result.nodeRates.length).toBeGreaterThan(0)
          expect(result.nodeRates.every(rate => rate === 2)).toBe(true)
        }
        if (scenario === 'av-clock') {
          const playing = result.samples.filter(sample => !sample.paused)
          expect(playing.filter(sample => sample.rate === 1).length).toBeGreaterThan(2)
          expect(playing.filter(sample => sample.rate === 2).length).toBeGreaterThan(2)
          expect(Math.max(...playing.map(sample => Math.abs(sample.frame - sample.audio)))).toBeLessThan(0.25)
        }
      }
      outcome = 'native-audio-ownership-observed'
    }
    finally {
      await page.evaluate(() => window.mbHost.emit('destroy'))
      if (capabilities.AudioContext !== 'undefined' || capabilities.webkitAudioContext !== 'undefined') {
        await expect.poll(() => page.evaluate(() => window.mbContext.state)).toBe('closed')
        expect(await page.evaluate(() => window.mbCanvas.engine.audio.queuedNodes.size)).toBe(0)
      }
      const state = await page.evaluate(() => ({ context: window.mbContext?.state, nodes: window.mbNodes.map(record => ({ stops: record.stops, disconnects: record.disconnects, starts: record.starts })), error: window.mbCanvas.error, events: window.mbEvents }))
      await testInfo.attach('mediabunny-audio', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), scenario, capabilities, outcome, result, state, scope: 'Native AudioContext, BufferSourceNodes and SDK decode. Delayed resume/buffer delivery is controlled. AV samples compare decoded canvas timestamps to the audio clock over short 1x/2x playback; acoustic output, long-run drift and physical devices remain MB-09.' }) })
    }
  })
}
