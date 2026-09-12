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

for (const core of ['published', 'candidate']) {
  for (const scenario of ['video-unsupported', 'audio-unsupported', 'mixed-video-unsupported', 'mixed-audio-unsupported', 'replacement']) {
    test(`MediaBunny ${implementation.name}: ${core} core decoder capability ${scenario}`, async ({ page, browserName }, testInfo) => {
      await page.route('**/mb-cap-hls/**', async (route) => {
        const name = new URL(route.request().url()).pathname.split('/').at(-1)
        const body = hls.get(name)
        await route.fulfill({ status: body ? 200 : 404, body: body || 'Missing fixture', contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t' })
      })
      await page.goto(`/test/player.html?core=${core}`)
      await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports;
        ${implementation.code}; window.mbFactory = module.exports.default || module.exports; })();` })
      const capabilities = await page.evaluate(() => ({ AudioContext: typeof AudioContext, webkitAudioContext: typeof window.webkitAudioContext, AudioDecoder: typeof AudioDecoder, VideoDecoder: typeof VideoDecoder }))
      let outcome = 'unverified'
      let result
      try {
        await page.evaluate((scenario) => {
          window.mbEvents = []
          window.mbQueries = { video: 0, audio: 0 }
          window.mbBlock = scenario === 'replacement' ? [] : [scenario.includes('video-') ? 'video' : 'audio']
          window.art = new window.Artplayer({
            container: '.player',
            url: '',
            muted: true,
            setting: true,
            proxy: window.mbFactory({ m3u8: { quality: { control: true, setting: true }, audio: { control: true, setting: true } } }),
          })
          window.mbCanvas = window.art.video
          const engine = window.mbCanvas.engine
          for (const kind of ['video', 'audio']) {
            const load = engine[kind].load.bind(engine[kind])
            engine[kind].load = (media, ...args) => {
              const track = media[`${kind}Track`]
              if (track && window.mbBlock.includes(kind)) {
                track.canDecode = async () => {
                  window.mbQueries[kind]++
                  return false
                }
              }
              return load(media, ...args)
            }
          }
          for (const name of ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'seeked', 'error'])
            window.mbCanvas.events.addEventListener(name, () => window.mbEvents.push(name))
          const source = scenario === 'video-unsupported' ? '/test/pattern.mp4' : scenario === 'audio-unsupported' ? '/test/audio-tone.m4a' : '/mb-cap-hls/master.m3u8'
          window.mbLoading = engine.load(source)
          document.querySelector('#play').onclick = () => window.art.play()
        }, scenario)
        await page.evaluate(() => window.mbLoading)
        if (capabilities.AudioContext === 'undefined' && capabilities.webkitAudioContext === 'undefined') {
          expect(browserName).toBe('webkit')
          expect(await page.evaluate(() => window.mbCanvas.error?.code)).toBe(4)
          expect(await page.evaluate(() => window.art.isReady)).toBe(false)
          outcome = 'unsupported-capability-control'
          return
        }
        if (scenario === 'replacement') {
          expect(await page.evaluate(() => window.art.isReady)).toBe(true)
          await expect(page.locator('.art-control-mediabunny-quality')).toHaveCount(1)
          const error = await page.evaluate(async () => {
            window.mbEvents.length = 0
            window.mbBlock = ['video', 'audio']
            try {
              await window.mbCanvas.switchM3u8Quality('auto')
              return null
            }
            catch (error) { return error.message }
          })
          expect(error).toBe('Input has no decodable audio or video tracks.')
          await expect(page.locator('.art-control-mediabunny-quality')).toHaveCount(0)
          await expect(page.locator('.art-control-mediabunny-audio')).toHaveCount(0)
        }
        if (scenario.startsWith('mixed-')) {
          expect(await page.evaluate(() => window.art.isReady)).toBe(true)
          await page.click('#play')
          await expect.poll(() => page.evaluate(() => window.mbCanvas.currentTime)).toBeGreaterThan(0.2)
          result = await page.evaluate(() => ({ video: Boolean(window.mbCanvas.engine.video.videoSink), audio: Boolean(window.mbCanvas.engine.audio.audioSink), nodes: window.mbCanvas.engine.audio.queuedNodes.size, width: window.mbCanvas.videoWidth, events: window.mbEvents, error: window.mbCanvas.error, queries: window.mbQueries }))
          expect(result.error).toBe(null)
          expect(result.events).toEqual(['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'])
          expect(result.video).toBe(scenario === 'mixed-audio-unsupported')
          expect(result.audio).toBe(scenario === 'mixed-video-unsupported')
          if (result.audio)
            expect(result.nodes).toBeGreaterThan(0)
          if (result.video)
            expect(result.width).toBeGreaterThan(0)
          outcome = 'native-partial-decoder-playback-with-controlled-unsupported-track'
        }
        else {
          result = await page.evaluate(() => ({ readyState: window.mbCanvas.readyState, networkState: window.mbCanvas.networkState, error: window.mbCanvas.error, events: window.mbEvents, queries: window.mbQueries }))
          expect(result.readyState).toBe(0)
          expect(result.networkState).toBe(3)
          expect(result.error).toEqual({ code: 4, message: 'Input has no decodable audio or video tracks.' })
          expect(result.events).toEqual(['error'])
          outcome = 'controlled-unsupported-track-rejected-before-readiness'
        }
        const kind = scenario.includes('video-') ? 'video' : 'audio'
        expect(result.queries).toEqual(scenario === 'replacement' ? { video: 1, audio: 1 } : { video: kind === 'video' ? 1 : 0, audio: kind === 'audio' ? 1 : 0 })
      }
      finally {
        await page.evaluate(() => window.art?.destroy(false))
        await testInfo.attach('mediabunny-capability', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), core, scenario, capabilities, outcome, result, scope: 'Actual SDK parsing, Canvas, Web Audio and two cores. canDecode=false is deliberately controlled for selected tracks; partial cases play the remaining native decoder. Windows WebKit missing APIs is a separate control, not playback.' }) })
      }
    })
  }
}
