import assert from 'node:assert/strict'
import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { mbCandidate } from '../helpers/mediabunny.js'
import { expect, test } from './fixtures.js'

const implementation = await mbCandidate()
const manifest = JSON.parse(fs.readFileSync(new URL('./media/hls/manifest.json', import.meta.url)))
const media = new Map(Object.entries(manifest.files).map(([name, expected]) => {
  const bytes = fs.readFileSync(new URL(`./media/hls/${name}`, import.meta.url))
  assert.equal(hash(bytes), expected.sha256)
  return [name, bytes]
}))

for (const core of ['published', 'candidate']) {
  for (const scenario of ['menus', 'topology', 'stale-source', 'stale-destroy', 'latest']) {
    test(`MediaBunny ${implementation.name}: ${core} core native HLS ${scenario}`, async ({ page, browserName }, testInfo) => {
      await page.route('**/mb-ui-hls/**', async (route) => {
        const name = new URL(route.request().url()).pathname.split('/').at(-1)
        const body = media.get(name)
        await route.fulfill({ status: body ? 200 : 404, body: body || 'Missing fixture', contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t' })
      })
      await page.goto(`/test/player.html?core=${core}`)
      await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports;
        ${implementation.code}; window.mbFactory = module.exports.default || module.exports; })();` })
      await page.evaluate(() => {
        window.mbEvents = []
        window.mbErrors = []
        window.mbWrites = []
        window.mbOption = { m3u8: { quality: { control: true, setting: true }, audio: { control: true, setting: true } } }
        window.mbFlush = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        window.art = new window.Artplayer({ container: '.player', url: '/mb-ui-hls/master.m3u8', muted: true, setting: true, proxy: window.mbFactory(window.mbOption) })
        window.mbCanvas = window.art.video
        for (const event of ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'seeked', 'error'])
          window.art.on(`video:${event}`, () => window.mbEvents.push(event))
        document.querySelector('#play').onclick = () => window.art.play().catch(error => window.mbErrors.push(error.message))
      })
      const capabilities = await page.evaluate(() => ({ AudioContext: typeof AudioContext, webkitAudioContext: typeof window.webkitAudioContext, AudioDecoder: typeof AudioDecoder, VideoDecoder: typeof VideoDecoder, coreVersion: window.Artplayer.version }))
      let outcome = 'unverified'
      let result
      try {
        if (capabilities.AudioContext === 'undefined' && capabilities.webkitAudioContext === 'undefined') {
          expect(browserName).toBe('webkit')
          await expect.poll(() => page.evaluate(() => window.mbCanvas.error?.code)).toBe(4)
          expect(await page.evaluate(() => window.art.isReady)).toBe(false)
          expect(await page.locator('.art-control-mediabunny-quality').count()).toBe(0)
          outcome = 'unsupported-capability-control'
          return
        }
        await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
        await expect(page.locator('.art-control-mediabunny-quality .art-selector-value')).toHaveText('180P')
        await expect(page.locator('.art-control-mediabunny-audio .art-selector-value')).toHaveText('English')
        await page.evaluate(() => {
          for (const name of ['controls', 'setting']) {
            const registry = window.art[name]
            const update = registry.update.bind(registry)
            registry.update = (option) => {
              if (option.name?.startsWith('mediabunny-'))
                window.mbWrites.push({ surface: name, name: option.name })
              return update(option)
            }
          }
        })
        if (scenario === 'menus') {
          await page.click('#play')
          await expect.poll(() => page.evaluate(() => window.mbCanvas.currentTime)).toBeGreaterThan(0.2)
          await page.evaluate(() => {
            window.art.pause()
            window.mbEvents.length = 0
          })
          const quality = page.locator('.art-control-mediabunny-quality')
          await quality.hover()
          await quality.locator('.art-selector-item').filter({ hasText: /^90P$/ }).click()
          await expect.poll(() => page.evaluate(() => window.mbCanvas.getM3u8State().then(state => state?.currentLevel?.height))).toBe(90)
          await expect(page.locator('.art-control-mediabunny-quality .art-selector-value')).toHaveText('90P')
          await expect.poll(() => page.evaluate(() => Object.fromEntries(['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'seeked'].map(name => [name, window.mbEvents.filter(event => event === name).length])))).toEqual({ loadedmetadata: 1, loadeddata: 1, canplay: 1, canplaythrough: 1, seeked: 1 })
          await page.evaluate(() => {
            const menu = window.art.setting.find('mediabunny-audio')
            window.art.setting.show = true
            window.art.setting.render(menu.selector)
            menu.selector.find(item => item.html === 'French').$item.click()
          })
          await expect.poll(() => page.evaluate(() => window.mbCanvas.getM3u8State().then(state => state?.currentAudio?.lang))).toBe('fr')
          await expect(page.locator('.art-control-mediabunny-audio .art-selector-value')).toHaveText('French')
          await expect.poll(() => page.evaluate(() => window.mbEvents.filter(event => event === 'seeked').length)).toBe(2)
          await page.evaluate(() => {
            window.art.setting.show = false
          })
          await quality.hover()
          await quality.locator('.art-selector-item').filter({ hasText: /^Auto$/ }).click()
          await expect.poll(() => page.evaluate(() => window.mbCanvas.getM3u8State().then(state => state?.videoMode))).toBe('auto')
          await expect(page.locator('.art-control-mediabunny-quality .art-selector-value')).toHaveText('180P')
          await expect.poll(() => page.evaluate(() => Object.fromEntries(['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'seeked'].map(name => [name, window.mbEvents.filter(event => event === name).length])))).toEqual({ loadedmetadata: 3, loadeddata: 3, canplay: 3, canplaythrough: 3, seeked: 3 })
          result = await page.evaluate(async () => {
            const state = await window.mbCanvas.getM3u8State()
            const quality = window.art.controls.cache.get('mediabunny-quality').option
            const audio = window.art.setting.find('mediabunny-audio')
            return { currentLevel: state.currentLevel.id, qualitySelected: quality.selector.filter(item => item.default).map(item => item.value), currentAudio: state.currentAudio.id, audioSelected: audio.selector.filter(item => item.default).map(item => item.value), paired: state.currentLevel.track.canBePairedWith(state.currentAudio.track), errors: window.mbErrors }
          })
          expect(result.qualitySelected).toEqual([result.currentLevel])
          expect(result.audioSelected).toEqual([result.currentAudio])
          expect(result.paired).toBe(true)
          expect(result.errors).toEqual([])
        }
        else if (scenario === 'topology') {
          await page.evaluate(() => {
            window.mbOption.m3u8.quality.control = false
            window.mbOption.m3u8.audio.control = false
            window.art.emit('restart')
          })
          await expect(page.locator('.art-control-mediabunny-quality')).toHaveCount(0)
          await expect(page.locator('.art-control-mediabunny-audio')).toHaveCount(0)
          expect(await page.evaluate(() => Boolean(window.art.setting.find('mediabunny-quality') && window.art.setting.find('mediabunny-audio')))).toBe(true)
          await page.evaluate(async () => {
            window.mbOption.m3u8.quality.control = true
            window.mbOption.m3u8.audio.control = true
            await window.mbCanvas.engine.load('/mb-ui-hls/video-only.m3u8')
          })
          await expect(page.locator('.art-control-mediabunny-quality')).toHaveCount(1)
          await expect(page.locator('.art-control-mediabunny-audio')).toHaveCount(0)
          expect(await page.evaluate(() => Boolean(window.art.setting.find('mediabunny-audio')))).toBe(false)
          await page.evaluate(() => window.mbCanvas.engine.load('/test/pattern.mp4'))
          await expect(page.locator('[class*="art-control-mediabunny-"]')).toHaveCount(0)
          expect(await page.evaluate(() => Boolean(window.art.setting.find('mediabunny-quality') || window.art.setting.find('mediabunny-audio')))).toBe(false)
          result = { settingsSurviveControlDisable: true, audioRemovedForVideoOnly: true, allRemovedForMp4: true }
        }
        else if (scenario.startsWith('stale-')) {
          await page.evaluate(() => {
            const engine = window.mbCanvas.engine
            const getState = engine.getHlsState.bind(engine)
            let first = true
            engine.getHlsState = async () => {
              const state = await getState()
              if (first) {
                first = false
                return new Promise((resolve) => {
                  window.mbRelease = () => resolve(state)
                })
              }
              return state
            }
            window.art.emit('restart')
          })
          await expect.poll(() => page.evaluate(() => typeof window.mbRelease)).toBe('function')
          result = await page.evaluate(async (scenario) => {
            if (scenario === 'stale-source')
              await window.mbCanvas.engine.load('/test/pattern.mp4')
            else window.art.destroy(false)
            const before = window.mbWrites.length
            window.mbRelease()
            await window.mbFlush()
            return { before, after: window.mbWrites.length, menus: document.querySelectorAll('[class*="art-control-mediabunny-"]').length }
          }, scenario)
          expect(result.after).toBe(result.before)
          expect(result.menus).toBe(0)
        }
        else {
          await page.evaluate(async () => {
            const engine = window.mbCanvas.engine
            const input = engine.input
            const getTracks = input.getVideoTracks.bind(input)
            const tracks = await getTracks()
            window.mbDesired = tracks.find(track => track.id !== engine.media.videoTrack.id).id
            let calls = 0
            input.getVideoTracks = () => {
              calls++
              if (calls === 1)
                return new Promise((resolve) => { window.mbReleaseOlder = () => resolve(tracks) })
              if (calls === 2)
                return new Promise((resolve) => { window.mbReleaseNewer = () => resolve(tracks) })
              return getTracks()
            }
            window.mbOlder = window.mbCanvas.switchM3u8Quality(engine.media.videoTrack.id)
            window.mbNewer = window.mbCanvas.switchM3u8Quality(window.mbDesired)
            window.mbReleaseOlder()
            await window.mbOlder
            window.mbReleaseNewer()
            await window.mbNewer
          })
          result = await page.evaluate(async () => {
            const state = await window.mbCanvas.getM3u8State()
            return { desired: window.mbDesired, selected: state.currentLevel.id, ready: window.mbCanvas.readyState, events: window.mbEvents }
          })
          expect(result.selected).toBe(result.desired)
          expect(result.ready).toBe(4)
        }
        outcome = 'native-hls-ui-and-selection-observed'
      }
      finally {
        const state = await page.evaluate(() => {
          window.mbRelease?.()
          window.mbReleaseOlder?.()
          window.mbReleaseNewer?.()
          window.mbContext = window.mbCanvas.engine.audio.audioContext
          window.art.destroy(false)
          return { events: window.mbEvents, errors: window.mbErrors, writes: window.mbWrites, error: window.mbCanvas.error, destroyed: window.mbCanvas.engine.destroyed }
        })
        await expect.poll(() => page.evaluate(() => window.mbContext?.state || 'not-created')).toMatch(/^(?:closed|not-created)$/)
        await testInfo.attach('mediabunny-hls-ui', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), core, scenario, capabilities, outcome, result, state, scope: 'Actual old/candidate core, SDK HLS parsing and native decoding; rendered control/settings clicks, topology and controlled state/query delays. Not installed-package or long-run/device acceptance.' }) })
      }
    })
  }
}
