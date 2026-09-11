import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { observeWorkers } from '../helpers/worker-observer.js'
import { expect, test } from './fixtures.js'

const matrix = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/hls-sdk-matrix.json', import.meta.url)))
const grouped = fs.readFileSync(new URL('./fixtures/hls-grouped.m3u8', import.meta.url), 'utf8')
let candidate
let published
const sdks = new Map()
const media = new Map()

test.beforeAll(async () => {
  assert(!process.env.ARTPLAYER_BROWSER_ARTIFACTS, 'HLS installed artifact map remains a separate HLS-06 gate')
  candidate = process.env.ARTPLAYER_HLS_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_HLS_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-hls-control', 'umd')
  const baseline = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/hls-control-release.json', import.meta.url)))
  const bytes = readMember(await ensureArchive(baseline.release), 'package/dist/artplayer-plugin-hls-control.js')
  assert.equal(hash(bytes), baseline.release.files['package/dist/artplayer-plugin-hls-control.js'])
  published = bytes.toString()
  for (const release of matrix.releases) {
    const archive = await ensureArchive(release)
    for (const [member, digest] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, member)), digest)
    sdks.set(release.version, readMember(archive, 'package/dist/hls.min.js').toString())
  }
  const manifest = JSON.parse(fs.readFileSync(new URL('./media/hls/manifest.json', import.meta.url)))
  for (const [name, expected] of Object.entries(manifest.files)) {
    const bytes = fs.readFileSync(new URL(`./media/hls/${name}`, import.meta.url))
    assert.equal(hash(bytes), expected.sha256)
    media.set(name, bytes)
  }
  media.set('grouped.m3u8', Buffer.from(grouped))
})

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => {
    const video = window.art?.video
    return {
      workers: window.workerEvidence,
      errors: window.sdkErrors,
      events: window.sdkEvents,
      supported: window.Hls?.isSupported(),
      destroyed: window.destroyedEngines,
      tracks: window.art?.hls?.audioTracks?.map(track => ({ id: track.id, name: track.name, groupId: track.groupId })),
      media: video && { time: video.currentTime, paused: video.paused, ended: video.ended, readyState: video.readyState, height: video.videoHeight, buffered: Array.from({ length: video.buffered.length }, (_, index) => [video.buffered.start(index), video.buffered.end(index)]) },
    }
  }).catch(error => ({ diagnosticError: error.message }))
  await testInfo.attach('hls-sdk-state', { contentType: 'application/json', body: JSON.stringify(state) })
})

async function open(page, testInfo, release, core, plugin = 'candidate', manifest = 'master.m3u8') {
  await testInfo.attach('hls-sdk-inputs', { contentType: 'application/json', body: JSON.stringify({ sdk: release, core, plugin, pluginSHA256: hash(plugin === 'candidate' ? candidate : published), candidate: process.env.ARTPLAYER_HLS_ARTIFACT || 'workspace source build', media: Object.fromEntries([...media].map(([name, bytes]) => [name, hash(bytes)])), enableWorker: true }) })
  await page.route('**/hls-sdk-fixture/**', async (route) => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1)
    const bytes = media.get(name)
    await route.fulfill({ status: bytes ? 200 : 404, body: bytes || 'Missing test fixture', contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t' })
  })
  await page.goto(`/test/player.html?core=${core}`)
  await page.evaluate(observeWorkers)
  await page.addScriptTag({ content: sdks.get(release.version) })
  await page.addScriptTag({ content: plugin === 'candidate' ? candidate : published })
  await page.evaluate((manifest) => {
    window.sdkErrors = []
    window.sdkEvents = []
    window.destroyedEngines = 0
    window.art = new window.Artplayer({
      container: '.player',
      url: `/hls-sdk-fixture/${manifest}`,
      muted: true,
      setting: true,
      plugins: [window.artplayerPluginHlsControl({ quality: { control: true, setting: true }, audio: { control: true, setting: true } })],
      customType: { m3u8(video, url, art) {
        art.hls?.destroy()
        const hls = new window.Hls({ enableWorker: true, startLevel: 0 })
        art.hls = hls
        const mediaState = () => ({ time: video.currentTime, paused: video.paused, readyState: video.readyState, height: video.videoHeight, buffered: Array.from({ length: video.buffered.length }, (_, index) => [video.buffered.start(index), video.buffered.end(index)]) })
        hls.on(window.Hls.Events.ERROR, (_, data) => window.sdkErrors.push({ type: data.type, details: data.details, fatal: data.fatal, media: mediaState() }))
        for (const key of ['AUDIO_TRACKS_UPDATED', 'AUDIO_TRACK_SWITCHED', 'LEVEL_SWITCHED', 'MEDIA_ATTACHED', 'MEDIA_DETACHED'])
          hls.on(window.Hls.Events[key], (_, data) => window.sdkEvents.push({ key, id: data.id, level: data.level, tracks: data.audioTracks?.map(track => ({ id: track.id, name: track.name, groupId: track.groupId })), media: mediaState() }))
        hls.on(window.Hls.Events.DESTROYING, () => window.destroyedEngines++)
        hls.loadSource(url)
        hls.attachMedia(video)
      } },
    })
    window.art.on('destroy', () => window.art.hls.destroy())
    document.querySelector('#play').onclick = () => window.art.play()
    document.querySelector('#pause').onclick = () => window.art.pause()
  }, manifest)
}

async function playing(page) {
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(0.3)
  await expect.poll(() => page.evaluate(() => window.workerEvidence.some(worker => worker.messages.includes('transmuxComplete')))).toBe(true)
  expect(await page.evaluate(() => window.art.video.getVideoPlaybackQuality().totalVideoFrames)).toBeGreaterThan(0)
  expect(await page.evaluate(() => window.art.hls.config.enableWorker)).toBe(true)
  expect(await page.evaluate(() => window.workerEvidence.flatMap(worker => worker.errors))).toEqual([])
}

async function destroyed(page) {
  expect(await page.evaluate(() => window.art.hls.config.enableWorker)).toBe(true)
  await page.evaluate(() => window.art.destroy())
  await expect.poll(() => page.evaluate(() => window.workerEvidence.filter(worker => worker.terminated !== 1).length)).toBe(0)
  expect(await page.evaluate(() => window.workerEvidence.flatMap(worker => worker.errors))).toEqual([])
  expect(await page.evaluate(() => ({ media: window.art.hls.media, children: document.querySelector('.player').childElementCount, errors: window.sdkErrors.filter(error => error.fatal) }))).toEqual({ media: null, children: 0, errors: [] })
}

for (const release of matrix.releases) {
  test(`SDK ${release.version}: MSE capability and unsupported cleanup`, async ({ page, browserName }, testInfo) => {
    await open(page, testInfo, release, 'candidate')
    if (process.platform === 'win32' && browserName === 'webkit') {
      expect(await page.evaluate(() => ({ supported: window.Hls.isSupported(), mse: typeof window.MediaSource, managed: typeof window.ManagedMediaSource }))).toEqual({ supported: false, mse: 'undefined', managed: 'undefined' })
      await expect.poll(() => page.evaluate(() => window.sdkErrors.some(error => error.fatal))).toBe(true)
      await page.evaluate(() => window.art.destroy())
      expect(await page.evaluate(() => ({ media: window.art.hls.media, workers: window.workerEvidence.length, destroyed: window.destroyedEngines }))).toEqual({ media: null, workers: 0, destroyed: 1 })
    }
    else {
      await playing(page)
      await destroyed(page)
    }
  })
  test.describe(`SDK ${release.version} worker integration`, () => {
    test.skip(({ browserName }) => process.platform === 'win32' && browserName === 'webkit', 'Windows WebKit has no MSE; explicit capability/error cleanup is tested separately')
    for (const core of ['published', 'candidate']) {
      for (const plugin of ['published', 'candidate']) {
        test(`${core} core / ${plugin} plugin: actual worker playback, source replacement and cleanup`, async ({ page }, testInfo) => {
          await open(page, testInfo, release, core, plugin)
          await playing(page)
          expect(await page.evaluate(() => window.Hls.version)).toBe(release.version)
          await page.click('#pause')
          await page.evaluate(() => {
            window.art.seek = 4
          })
          await page.click('#play')
          await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(4.2)
          await page.evaluate(() => window.art.switchUrl('/hls-sdk-fixture/video-only.m3u8'))
          await expect.poll(() => page.evaluate(() => ({ height: window.art.video.videoHeight, tracks: window.art.hls.audioTracks.length }))).toEqual({ height: 90, tracks: 0 })
          await playing(page)
          expect(await page.evaluate(() => window.destroyedEngines)).toBe(1)
          await destroyed(page)
          expect(await page.evaluate(() => window.destroyedEngines)).toBe(2)
        })
      }
      test(`${core} core: group changes reindex actual audio tracks and UI`, async ({ page }, testInfo) => {
        await open(page, testInfo, release, core, 'candidate', 'grouped.m3u8')
        await playing(page)
        await page.evaluate(() => {
          window.art.hls.currentLevel = 0
        })
        await expect.poll(() => page.evaluate(() => window.art.hls.audioTracks.map(track => track.groupId))).toEqual(['low', 'low'])
        await page.evaluate(() => {
          window.art.hls.audioTrack = 1
        })
        await expect(page.locator('.art-control-hls-audio .art-selector-value')).toHaveText('French')
        await page.evaluate(() => {
          window.art.hls.currentLevel = 1
        })
        await expect.poll(() => page.evaluate(() => window.art.hls.audioTracks.map(track => ({ id: track.id, name: track.name, group: track.groupId })))).toEqual([{ id: 0, name: 'French', group: 'high' }, { id: 1, name: 'English', group: 'high' }, { id: 2, name: 'Commentary', group: 'high' }])
        await expect.poll(() => page.evaluate(() => ({ index: window.art.hls.audioTrack, height: window.art.video.videoHeight }))).toEqual({ index: 0, height: 180 })
        await expect(page.locator('.art-control-hls-audio .art-selector-value')).toHaveText('French')
        await page.evaluate(() => {
          window.art.controls.show = true
        })
        const control = page.locator('.art-control-hls-audio')
        await control.hover()
        await control.locator('.art-selector-item').filter({ hasText: /^Commentary$/ }).click()
        await expect.poll(() => page.evaluate(() => window.art.hls.audioTrack)).toBe(2)
        await expect.poll(() => page.evaluate(() => window.sdkEvents.some(event => event.key === 'AUDIO_TRACK_SWITCHED' && event.id === 2))).toBe(true)
        await expect(control.locator('.art-selector-value')).toHaveText('Commentary')
        await page.evaluate(() => {
          window.art.hls.currentLevel = 0
        })
        await expect.poll(() => page.evaluate(() => window.art.hls.audioTracks.length)).toBe(2)
        await expect(control.locator('.art-selector-item')).toHaveCount(2)
        await destroyed(page)
      })
      test(`${core} core: actual SDK detaches and reattaches to the same media`, async ({ page }, testInfo) => {
        await open(page, testInfo, release, core)
        await playing(page)
        await page.evaluate(() => {
          window.art.pause()
          window.art.hls.detachMedia()
          window.art.hls.attachMedia(window.art.video)
          window.art.plugins.artplayerPluginHlsControl.update()
        })
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(0.3)
        await expect(page.locator('.art-control-hls-quality')).toHaveCount(1)
        await expect(page.locator('.art-control-hls-audio')).toHaveCount(1)
        expect(await page.evaluate(() => window.sdkEvents.filter(event => event.key === 'MEDIA_ATTACHED').length)).toBe(2)
        await destroyed(page)
      })
    }
  })
}
