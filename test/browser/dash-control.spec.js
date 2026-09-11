import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

let publishedCode
let sourceCode
let evidence
test.beforeAll(async () => {
  const { release } = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/dash-control-release.json', import.meta.url)))
  const member = 'package/dist/artplayer-plugin-dash-control.js'
  const bytes = readMember(await ensureArchive(release), member)
  assert.equal(hash(bytes), release.files[member])
  publishedCode = bytes.toString()
  assert(!process.env.ARTPLAYER_BROWSER_ARTIFACTS, 'Controlled DASH source tests do not represent installed SDK/package acceptance')
  sourceCode = process.env.ARTPLAYER_DASH_ARTIFACT ? fs.readFileSync(process.env.ARTPLAYER_DASH_ARTIFACT, 'utf8') : await compilePackage(release.name, 'umd')
  evidence = { published: release, sourceSHA256: hash(sourceCode), candidate: process.env.ARTPLAYER_DASH_ARTIFACT || 'workspace source build', scope: 'Real ArtPlayer DOM and native MP4 with controlled SDK methods. No dash.js instance, MPD, ABR or adaptive media validation.' }
})
test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => ({
    calls: window.dashCalls,
    ready: window.art?.isReady,
    time: window.art?.currentTime,
    videoError: window.art?.video.error?.code || null,
    quality: window.art?.controls['dash-quality']?.textContent,
    audio: window.art?.controls['dash-audio']?.textContent,
    settingRows: [...document.querySelectorAll('.art-setting-panel.art-current .art-setting-item')].map(row => ({ text: row.textContent, label: row.querySelector('.art-setting-item-left-text')?.textContent })),
  })).catch(error => ({ error: error.message }))
  await testInfo.attach('controlled-dash-state', { contentType: 'application/json', body: JSON.stringify(state) })
  if (!page.isClosed()) {
    await page.evaluate(() => {
      if (window.art && !window.art.isDestroy)
        window.art.destroy()
    })
  }
})
async function openDash(page, core, plugin, sdk, testInfo) {
  await testInfo.attach('controlled-dash-inputs', { contentType: 'application/json', body: JSON.stringify(evidence) })
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: plugin === 'published' ? publishedCode : sourceCode })
  await page.evaluate((sdk) => {
    window.dashCalls = []
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      setting: true,
      plugins: [(art) => {
        const levels = sdk === 4
          ? [{ qualityIndex: 0, height: 360 }, { qualityIndex: 1, height: 720 }]
          : [{ id: 'low', height: 360 }, { id: 'high', height: 720 }]
        const tracks = [{ id: 'en', lang: 'en' }, { id: 'fr', lang: 'fr' }]
        window.dashState = { levels, tracks, track: tracks[0], current: levels[0], quality: 0, settings: { streaming: { abr: { autoSwitchBitrate: { video: true } } } } }
        const state = window.dashState
        art.dash = {
          getVideoElement: () => art.template.$video,
          getSettings: () => state.settings,
          updateSettings(update) {
            state.settings.streaming.abr.autoSwitchBitrate.video = update.streaming.abr.autoSwitchBitrate.video
            window.dashCalls.push(['auto', state.settings.streaming.abr.autoSwitchBitrate.video])
          },
          getTracksFor: () => state.tracks,
          getCurrentTrackFor: () => state.track,
          setCurrentTrack(track) {
            state.track = track
            window.dashCalls.push(['track', track.id, tracks.includes(track)])
          },
        }
        if (sdk === 4) {
          Object.assign(art.dash, {
            getBitrateInfoListFor: () => levels,
            getQualityFor: () => state.quality,
            setQualityFor(type, index) {
              state.quality = index
              window.dashCalls.push(['qualityIndex', type, index])
            },
          })
        }
        else {
          Object.assign(art.dash, {
            getRepresentationsByType: () => levels,
            getCurrentRepresentationForType: () => state.current,
            setRepresentationForTypeById(type, id) {
              state.current = levels.find(level => level.id === id)
              window.dashCalls.push(['representationId', type, id])
            },
          })
        }
        return window.artplayerPluginDashControl({ quality: { control: true, setting: true }, audio: { control: true, setting: true } })(art)
      }],
    })
    document.querySelector('#play').onclick = () => window.art.play()
    document.querySelector('#pause').onclick = () => window.art.pause()
  }, sdk)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await expect(page.locator('.art-control-dash-quality .art-selector-value')).toHaveText('Auto')
  await expect(page.locator('.art-control-dash-audio .art-selector-value')).toHaveText('en')
}
for (const core of ['published', 'candidate']) {
  for (const [plugin, sdk] of [['published', 4], ['candidate', 4], ['candidate', 5]]) {
    for (const surface of ['control', 'setting']) {
      for (const type of ['quality', 'audio']) {
        test(`${core} core + ${plugin} DASH SDK ${sdk}: controlled SDK ${type} selection through real ${surface} DOM`, async ({ page }, testInfo) => {
          await openDash(page, core, plugin, sdk, testInfo)
          const text = type === 'quality' ? '720p' : 'fr'
          if (surface === 'control') {
            const control = page.locator(`.art-control-dash-${type}`)
            await control.hover()
            await expect(control.locator('.art-selector-list')).toHaveCSS('opacity', '1')
            await control.locator('.art-selector-item').filter({ hasText: new RegExp(`^${text}$`) }).click()
          }
          else {
            await page.locator('.art-control-setting').click()
            await page.locator(`[data-name="dash-${type}"]`).click()
            await page.locator('.art-setting-panel.art-current .art-setting-item-left-text').filter({ hasText: new RegExp(`^${text}$`) }).click()
          }
          const expected = type === 'quality'
            ? [['auto', false], sdk === 4 ? ['qualityIndex', 'video', 1] : ['representationId', 'video', 'high']]
            : [['track', 'fr', true]]
          await expect.poll(() => page.evaluate(() => window.dashCalls)).toEqual(expected)
          await expect(page.locator(`.art-control-dash-${type} .art-selector-value`)).toHaveText(text)
          expect(await page.evaluate(type => window.art.setting.find(`dash-${type}`).tooltip, type)).toBe(text)
          await testInfo.attach('controlled-dash-selection', { contentType: 'image/png', body: await page.screenshot() })
          await page.locator('#play').click()
          await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.2)
          expect(await page.evaluate(() => window.art.video.error)).toBeNull()
        })
      }
    }
  }
}
for (const core of ['published', 'candidate']) {
  for (const sdk of [4, 5]) {
    test(`${core} core + candidate DASH SDK ${sdk}: empty topology and destroy clear real menus and retained callbacks`, async ({ page }, testInfo) => {
      await openDash(page, core, 'candidate', sdk, testInfo)
      const result = await page.evaluate((sdk) => {
        const art = window.art
        const plugin = art.plugins.artplayerPluginDashControl
        const quality = art.controls.cache.get('dash-quality').option
        const audio = art.setting.find('dash-audio')
        const state = window.dashState
        const levels = state.levels
        const tracks = state.tracks
        state.levels.splice(0)
        state.tracks = []
        plugin.update()
        const cleared = !document.querySelector('.art-control-dash-quality, .art-control-dash-audio') && !art.setting.find('dash-quality') && !art.setting.find('dash-audio')
        window.dashCalls.length = 0
        quality.onSelect(quality.selector[0])
        audio.onSelect(audio.selector[1])
        const staleWrites = window.dashCalls.length
        // Replace the lists after the empty-topology observation.
        state.levels.push(...(sdk === 4 ? [{ qualityIndex: 0, height: 360 }, { qualityIndex: 1, height: 720 }] : [{ id: 'low', height: 360 }, { id: 'high', height: 720 }]))
        state.tracks = tracks
        plugin.update()
        const restored = Boolean(art.controls['dash-quality'] && art.controls['dash-audio'])
        const retained = art.controls.cache.get('dash-quality').option
        art.destroy(false)
        window.dashCalls.length = 0
        retained.onSelect(retained.selector[0])
        plugin.update()
        return { cleared, staleWrites, restored, afterDestroyWrites: window.dashCalls.length, sameList: state.levels === levels }
      }, sdk)
      expect(result).toEqual({ cleared: true, staleWrites: 0, restored: true, afterDestroyWrites: 0, sameList: true })
      await testInfo.attach('controlled-dash-cleanup', { contentType: 'application/json', body: JSON.stringify(result) })
    })
  }
}
