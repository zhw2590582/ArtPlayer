import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

let sdkCode
let publishedCode
let sourceCode
let evidence
let media
test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => {
    const art = window.art
    return {
      supported: window.Hls?.isSupported(),
      mediaSource: typeof window.MediaSource,
      managedMediaSource: typeof window.ManagedMediaSource,
      video: art?.video.outerHTML,
      readyState: art?.video.readyState,
      networkState: art?.video.networkState,
      sdkErrors: window.sdkErrors,
      sdkEvents: window.sdkEvents,
      levels: art?.hls.levels.map(level => ({ height: level.height, codec: level.videoCodec })),
      tracks: art?.hls.audioTracks.map(track => ({ id: track.id, name: track.name })),
    }
  }).catch(error => ({ diagnosticError: error.message }))
  await testInfo.attach('hls-state', { contentType: 'application/json', body: JSON.stringify(state, null, 2) })
})
test.beforeAll(async () => {
  const sdk = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/hls-sdk.json', import.meta.url)))
  const plugin = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/hls-control-release.json', import.meta.url)))
  async function code(release, member) {
    const bytes = readMember(await ensureArchive(release), member)
    assert.equal(hash(bytes), release.files[member])
    return bytes.toString()
  }
  sdkCode = await code(sdk.release, 'package/dist/hls.min.js')
  publishedCode = await code(plugin.release, 'package/dist/artplayer-plugin-hls-control.js')
  // This task exercises source builds. Installed artifacts are a separate HLS-06 gate.
  assert(!process.env.ARTPLAYER_BROWSER_ARTIFACTS, 'HLS source fixture cannot masquerade as an installed plugin')
  sourceCode = await compilePackage('artplayer-plugin-hls-control', 'umd')
  const manifest = JSON.parse(fs.readFileSync(new URL('./media/hls/manifest.json', import.meta.url)))
  media = new Map()
  for (const [name, expected] of Object.entries(manifest.files)) {
    assert(/^[\w.-]+$/.test(name))
    const bytes = fs.readFileSync(new URL(`./media/hls/${name}`, import.meta.url))
    assert.equal(hash(bytes), expected.sha256)
    assert.equal(bytes.length, expected.bytes)
    media.set(name, bytes)
  }
  evidence = { sdk: sdk.release, plugin: plugin.release, sourceSHA256: hash(sourceCode), media: manifest, limitations: ['SDK worker disabled', 'local deterministic media', 'source candidate, not installed package', 'no physical device certification'] }
})

async function openHls(page, core, plugin, testInfo, manifest = 'master.m3u8') {
  await testInfo.attach('hls-inputs', { contentType: 'application/json', body: JSON.stringify(evidence) })
  await page.route('**/hls-fixture/**', async (route) => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1)
    const bytes = media.get(name)
    await route.fulfill({ status: bytes ? 200 : 503, body: bytes || 'Intentional HLS failure', contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t' })
  })
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: sdkCode })
  await page.addScriptTag({ content: plugin === 'published' ? publishedCode : sourceCode })
  await page.evaluate((manifest) => {
    window.sdkErrors = []
    window.sdkEvents = []
    window.destroyedEngines = 0
    window.art = new window.Artplayer({
      container: '.player',
      url: `/hls-fixture/${manifest}`,
      muted: true,
      setting: true,
      plugins: [window.artplayerPluginHlsControl({ quality: { control: true, setting: true }, audio: { control: true, setting: true } })],
      customType: { m3u8(video, url, art) {
        if (art.hls)
          art.hls.destroy()
        const hls = new window.Hls({ enableWorker: false, manifestLoadingMaxRetry: 0 })
        art.hls = hls
        hls.on(window.Hls.Events.ERROR, (_, data) => window.sdkErrors.push({ type: data.type, details: data.details, fatal: data.fatal }))
        for (const name of ['LEVEL_SWITCHED', 'AUDIO_TRACK_SWITCHED', 'MANIFEST_PARSED'])
          hls.on(window.Hls.Events[name], (_, data) => window.sdkEvents.push({ name, level: data.level, id: data.id }))
        hls.on(window.Hls.Events.DESTROYING, () => window.destroyedEngines++)
        hls.loadSource(url)
        hls.attachMedia(video)
      } },
    })
    const art = window.art
    art.on('destroy', () => art.hls.destroy())
    document.querySelector('#play').onclick = () => art.play()
    document.querySelector('#pause').onclick = () => art.pause()
  }, manifest)
}

test('SDK MSE availability is explicit; unavailable hosts report failure and clean up', async ({ page, browserName }, testInfo) => {
  await openHls(page, 'candidate', 'published', testInfo)
  const capability = await page.evaluate(() => ({ supported: window.Hls.isSupported(), mse: typeof window.MediaSource, managed: typeof window.ManagedMediaSource }))
  if (process.platform === 'win32' && browserName === 'webkit') {
    expect(capability).toEqual({ supported: false, mse: 'undefined', managed: 'undefined' })
    await expect.poll(() => page.evaluate(() => window.sdkErrors.filter(error => error.fatal))).toEqual([{ type: 'mediaError', details: 'manifestIncompatibleCodecsError', fatal: true }])
    expect(await page.evaluate(() => window.art.isReady)).toBe(false)
  }
  else {
    expect(capability.supported).toBe(true)
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  }
  expect(await page.evaluate(() => {
    const sdk = window.art.hls
    window.art.destroy()
    return { media: sdk.media, destroyed: window.destroyedEngines }
  })).toEqual({ media: null, destroyed: 1 })
})

test.describe('MSE playback matrix', () => {
  // Verified by the separate capability test above. Safari/MSE coverage remains HLS-05 work.
  test.skip(({ browserName }) => process.platform === 'win32' && browserName === 'webkit', 'Bundled Windows WebKit exposes neither MediaSource nor ManagedMediaSource; this is an unverified playback environment, not compatibility approval')
  for (const core of ['published', 'candidate']) {
    for (const plugin of ['published', 'candidate']) {
      test(`${core} core / ${plugin} HLS: real decoding, manual quality, Auto and audio`, async ({ page }, testInfo) => {
        await openHls(page, core, plugin, testInfo)
        await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(0.3)
        const initial = await page.evaluate(() => ({
          supported: window.Hls.isSupported(),
          version: window.Hls.version,
          levels: window.art.hls.levels.map(level => level.height),
          tracks: window.art.hls.audioTracks.map(track => ({ id: track.id, name: track.name })),
          frames: window.art.video.getVideoPlaybackQuality().totalVideoFrames,
        }))
        expect(initial).toMatchObject({ supported: true, version: '1.5.17', levels: [90, 180], tracks: [{ id: 0, name: 'English' }, { id: 1, name: 'French' }] })
        expect(initial.frames).toBeGreaterThan(0)
        await page.evaluate(() => {
          window.art.controls.show = true
        })
        const quality = page.locator('.art-control-hls-quality')
        await quality.hover()
        await quality.locator('.art-selector-item').filter({ hasText: /^90P$/ }).click()
        await expect.poll(() => page.evaluate(() => ({ automatic: window.art.hls.autoLevelEnabled, level: window.art.hls.currentLevel, height: window.art.video.videoHeight }))).toEqual({ automatic: false, level: 0, height: 90 })
        await quality.hover()
        await quality.locator('.art-selector-item').filter({ hasText: /^180P$/ }).click()
        await expect.poll(() => page.evaluate(() => ({ manual: window.art.hls.autoLevelEnabled, level: window.art.hls.currentLevel, height: window.art.video.videoHeight }))).toEqual({ manual: false, level: 1, height: 180 })
        await quality.hover()
        await quality.locator('.art-selector-item').filter({ hasText: /^Auto$/ }).click()
        await expect.poll(() => page.evaluate(() => window.art.hls.autoLevelEnabled)).toBe(true)
        await expect.poll(() => page.evaluate(() => window.art.hls.currentLevel)).toBeGreaterThanOrEqual(0)
        await page.evaluate(() => {
          window.art.controls.show = true
        })
        const audio = page.locator('.art-control-hls-audio')
        await audio.hover()
        await audio.locator('.art-selector-item').filter({ hasText: /^French$/ }).click()
        await expect.poll(() => page.evaluate(() => window.sdkEvents.some(event => event.name === 'AUDIO_TRACK_SWITCHED' && event.id === 1))).toBe(true)
        expect(await page.evaluate(() => window.art.hls.audioTrack)).toBe(1)
        await page.click('#pause')
        await expect.poll(() => page.evaluate(() => window.art.video.paused)).toBe(true)
        await page.evaluate(() => {
          window.art.seek = 5
        })
        await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeCloseTo(5, 1)
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(5.2)
        expect(await page.evaluate(() => window.sdkErrors.filter(error => error.fatal))).toEqual([])
        const result = await page.evaluate(() => {
          const video = window.art.video
          const canvas = document.createElement('canvas')
          canvas.width = 16
          canvas.height = 16
          const ctx = canvas.getContext('2d')
          ctx.drawImage(video, 0, 0, 16, 16)
          const pixels = ctx.getImageData(0, 0, 16, 16).data
          const colors = new Set()
          for (let index = 0; index < pixels.length; index += 4)
            colors.add(`${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`)
          const sdk = window.art.hls
          window.art.destroy()
          return { colors: colors.size, media: sdk.media, destroyed: window.destroyedEngines, children: document.querySelector('.player').childElementCount }
        })
        expect(result.colors).toBeGreaterThan(8)
        expect(result).toMatchObject({ media: null, destroyed: 1, children: 0 })
      })

      test(`${core} core / ${plugin} HLS: failed manifest and actual SDK teardown`, async ({ page }, testInfo) => {
        await openHls(page, core, plugin, testInfo, 'missing.m3u8')
        await expect.poll(() => page.evaluate(() => window.sdkErrors.filter(error => error.fatal))).toEqual([{ type: 'networkError', details: 'manifestLoadError', fatal: true }])
        expect(await page.locator('.art-control-hls-quality').count()).toBe(0)
        await page.evaluate(() => window.art.switchUrl('/hls-fixture/master.m3u8'))
        await expect.poll(() => page.evaluate(() => window.art.hls.levels.length)).toBe(2)
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(0.2)
        expect(await page.evaluate(() => {
          const sdk = window.art.hls
          window.art.destroy()
          return { destroyed: window.destroyedEngines, media: sdk.media }
        })).toEqual({ destroyed: 2, media: null })
      })

      test(`${core} core / ${plugin} HLS: source switch drops SDK audio topology`, async ({ page }, testInfo) => {
        await openHls(page, core, plugin, testInfo)
        await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(0.2)
        await page.evaluate(() => {
          window.previousHls = window.art.hls
          return window.art.switchUrl('/hls-fixture/video-only.m3u8')
        })
        await expect.poll(() => page.evaluate(() => ({ levels: window.art.hls.levels.length, tracks: window.art.hls.audioTracks.length, height: window.art.video.videoHeight }))).toEqual({ levels: 1, tracks: 0, height: 90 })
        expect(await page.evaluate(() => ({ oldMedia: window.previousHls.media, replaced: window.previousHls !== window.art.hls, destroyed: window.destroyedEngines }))).toEqual({ oldMedia: null, replaced: true, destroyed: 1 })
        if (plugin === 'published') {
        // Real SDK corroboration of the frozen historical empty-topology defect.
          await expect(page.locator('.art-control-hls-audio')).toHaveCount(1)
        }
        expect(await page.evaluate(() => window.sdkErrors.filter(error => error.fatal))).toEqual([])
        await page.evaluate(() => window.art.destroy())
        expect(await page.evaluate(() => window.destroyedEngines)).toBe(2)
      })
    }

    test(`${core} core / published HLS: real Auto playback loses Auto label on update`, async ({ page }, testInfo) => {
      await openHls(page, core, 'published', testInfo)
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(0.2)
      expect(await page.evaluate(() => window.art.hls.autoLevelEnabled)).toBe(true)
      const height = await page.evaluate(() => {
        const art = window.art
        art.plugins.artplayerPluginHlsControl.update()
        return art.hls.levels[art.hls.currentLevel].height
      })
      await expect(page.locator('.art-control-hls-quality .art-selector-value')).toHaveText(`${height}P`)
      expect(await page.evaluate(() => window.art.hls.autoLevelEnabled)).toBe(true)
      await page.evaluate(() => window.art.destroy())
    })
  }
})
