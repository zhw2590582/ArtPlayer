import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

const sdks = new Map()
const media = new Map()
let candidate
let published
let mediaManifest
let pluginRelease

test.beforeAll(async () => {
  const baseline = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/dash-sdk.json', import.meta.url)))
  for (const sdk of baseline.sdks) {
    const archive = await ensureArchive(sdk.release)
    const bytes = readMember(archive, sdk.codeMember)
    assert.equal(hash(bytes), sdk.release.files[sdk.codeMember])
    sdks.set(sdk.release.version, { ...sdk, code: bytes.toString() })
  }
  pluginRelease = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/dash-control-release.json', import.meta.url))).release
  const bytes = readMember(await ensureArchive(pluginRelease), 'package/dist/artplayer-plugin-dash-control.js')
  assert.equal(hash(bytes), pluginRelease.files['package/dist/artplayer-plugin-dash-control.js'])
  published = bytes.toString()
  candidate = process.env.ARTPLAYER_DASH_ARTIFACT ? fs.readFileSync(process.env.ARTPLAYER_DASH_ARTIFACT, 'utf8') : await compilePackage('artplayer-plugin-dash-control', 'umd')
  mediaManifest = JSON.parse(fs.readFileSync(new URL('./media/dash/manifest.json', import.meta.url)))
  for (const [name, expected] of Object.entries(mediaManifest.files)) {
    assert(/^[\w.-]+$/.test(name))
    const bytes = fs.readFileSync(new URL(`./media/dash/${name}`, import.meta.url))
    assert.equal(hash(bytes), expected.sha256)
    assert.equal(bytes.length, expected.bytes)
    media.set(name, bytes)
  }
})

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => {
    const art = window.art
    const dash = art?.dash || window.nativeDash
    let tracks
    let levels
    try {
      tracks = dash?.getTracksFor('audio').map(track => ({ id: track.id, index: track.index, lang: track.lang }))
      levels = (dash?.getRepresentationsByType?.('video') || dash?.getBitrateInfoListFor?.('video'))?.map(level => ({ id: level.id, qualityIndex: level.qualityIndex, height: level.height }))
    }
    catch (error) {
      levels = { error: error.message }
    }
    const video = art?.video || window.nativeVideo
    const buffered = video ? Array.from({ length: video.buffered.length }, (_, index) => [video.buffered.start(index), video.buffered.end(index)]) : []
    return { errors: window.sdkErrors, events: window.sdkEvents, mediaEvents: window.mediaEvents, nativePlay: window.nativePlay, tracks, levels, buffered, paused: video?.paused, seeking: video?.seeking, time: video?.currentTime, ready: art?.isReady, width: video?.videoWidth, height: video?.videoHeight, error: video?.error?.code, readyState: video?.readyState, destroyed: window.sdkDestroyed }
  }).catch(error => ({ error: error.message }))
  await testInfo.attach('dash-sdk-state', { contentType: 'application/json', body: JSON.stringify(state) })
  if (!page.isClosed()) {
    await page.evaluate(() => {
      if (window.art && !window.art.isDestroy)
        window.art.destroy()
      window.nativeDash?.destroy()
    })
  }
})

async function loadSDK(page, version, core, testInfo) {
  const sdk = sdks.get(version)
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: sdk.code })
  const capability = await page.evaluate(() => ({ sdk: window.dashjs.supportsMediaSource(), mse: typeof window.MediaSource, managed: typeof window.ManagedMediaSource, avc: Boolean(window.MediaSource?.isTypeSupported('video/mp4; codecs="avc1.42c01e"')), aac: Boolean(window.MediaSource?.isTypeSupported('audio/mp4; codecs="mp4a.40.2"')) }))
  await testInfo.attach('dash-sdk-inputs', { contentType: 'application/json', body: JSON.stringify({ sdk: sdk.release, codeMember: sdk.codeMember, pluginRelease, candidateSHA256: hash(candidate), candidate: process.env.ARTPLAYER_DASH_ARTIFACT || 'workspace source build', media: mediaManifest, capability }) })
  return capability
}

async function openDash(page, version, core, plugin, testInfo) {
  const capability = await loadSDK(page, version, core, testInfo)
  test.skip(!capability.sdk, 'Actual SDK reports no MediaSource support; this engine has no DASH playback acceptance')
  await routeMedia(page)
  await page.addScriptTag({ content: plugin === 'published' ? published : candidate })
  await page.evaluate(() => {
    window.sdkErrors = []
    window.sdkEvents = []
    window.mediaEvents = []
    window.sdkDestroyed = 0
    window.art = new window.Artplayer({
      container: '.player',
      url: '/dash-fixture/master.mpd',
      muted: true,
      setting: true,
      plugins: [window.artplayerPluginDashControl({ quality: { control: true, setting: true }, audio: { control: true, setting: true } })],
      customType: { mpd(video, url, art) {
        if (art.dash) {
          art.dash.destroy()
          window.sdkDestroyed++
        }
        const dash = window.dashjs.MediaPlayer().create()
        art.dash = dash
        dash.updateSettings({ debug: { logLevel: 0 }, streaming: { abr: { initialBitrate: { video: 150 } }, buffer: { fastSwitchEnabled: true, bufferTimeDefault: 2, bufferTimeAtTopQuality: 2 } } })
        const events = window.dashjs.MediaPlayer.events
        dash.on(events.ERROR, event => window.sdkErrors.push({ code: event.error?.code, message: event.error?.message, event: event.type }))
        for (const name of ['STREAM_INITIALIZED', 'QUALITY_CHANGE_REQUESTED', 'QUALITY_CHANGE_RENDERED', 'TRACK_CHANGE_RENDERED', 'STREAM_TEARDOWN_COMPLETE', 'BUFFER_LEVEL_STATE_CHANGED', 'FRAGMENT_LOADING_COMPLETED', 'PLAYBACK_SEEKING', 'PLAYBACK_SEEKED']) {
          if (events[name])
            dash.on(events[name], event => window.sdkEvents.push({ name, at: performance.now(), mediaType: event.mediaType, oldQuality: event.oldQuality, newQuality: event.newQuality, state: event.state, url: event.request?.url, time: video.currentTime }))
        }
        dash.initialize(video, url, false)
      } },
    })
    const art = window.art
    for (const name of ['play', 'playing', 'pause', 'seeking', 'seeked', 'waiting', 'emptied', 'loadedmetadata', 'loadeddata', 'canplay', 'error']) {
      art.video.addEventListener(name, () => window.mediaEvents.push({ name, at: performance.now(), time: art.video.currentTime, paused: art.video.paused, readyState: art.video.readyState, buffered: Array.from({ length: art.video.buffered.length }, (_, index) => [art.video.buffered.start(index), art.video.buffered.end(index)]) }))
    }
    art.on('destroy', () => {
      art.dash.destroy()
      window.sdkDestroyed++
    })
    document.querySelector('#play').onclick = () => art.play()
    document.querySelector('#pause').onclick = () => art.pause()
  })
}

async function routeMedia(page) {
  await page.route('**/dash-fixture/**', async (route) => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1)
    const bytes = media.get(name)
    await route.fulfill({ status: bytes ? 200 : 503, body: bytes || 'Intentional DASH fixture failure', contentType: name.endsWith('.mpd') ? 'application/dash+xml' : 'video/mp4' })
  })
}

for (const version of ['4.5.2', '5.2.1']) {
  test(`dash.js ${version}: actual SDK reports MSE capabilities and version`, async ({ page }, testInfo) => {
    const capability = await loadSDK(page, version, 'candidate', testInfo)
    // This capability probe creates no media resources; destroy requires initialize.
    const actual = await page.evaluate(() => window.dashjs.MediaPlayer().create().getVersion())
    expect(actual).toBe(version)
    if (capability.mse === 'undefined' && capability.managed === 'undefined')
      expect(capability.sdk).toBe(false)
    else
      expect(capability.sdk).toBe(true)
  })
}

for (const core of ['published', 'candidate']) {
  for (const [plugin, version] of [['published', '4.5.2'], ['candidate', '4.5.2'], ['candidate', '5.2.1']]) {
    test(`${core} core / ${plugin} DASH / ${version}: real MPD decoding and UI selection`, async ({ page }, testInfo) => {
      await openDash(page, version, core, plugin, testInfo)
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      expect(await page.evaluate(() => window.art.dash.getTracksFor('audio').map(track => track.lang))).toEqual(['en', 'fr'])
      expect(await page.evaluate(() => window.art.video.getVideoPlaybackQuality().totalVideoFrames)).toBeGreaterThan(0)
      const control = page.locator('.art-control-dash-quality')
      await control.hover()
      await control.locator('.art-selector-item').filter({ hasText: /^180p$/ }).click()
      await expect.poll(() => page.evaluate(() => ({ auto: window.art.dash.getSettings().streaming.abr.autoSwitchBitrate.video, height: window.art.video.videoHeight }))).toEqual({ auto: false, height: 180 })
      await control.hover()
      await control.locator('.art-selector-item').filter({ hasText: /^Auto$/ }).click()
      expect(await page.evaluate(() => window.art.dash.getSettings().streaming.abr.autoSwitchBitrate.video)).toBe(true)
      const audio = page.locator('.art-control-dash-audio')
      await audio.hover()
      await audio.locator('.art-selector-item').filter({ hasText: /^fr$/ }).click()
      await expect.poll(() => page.evaluate(() => window.art.dash.getCurrentTrackFor('audio').lang)).toBe('fr')
      await expect(audio.locator('.art-selector-value')).toHaveText('fr')
      expect(await page.evaluate(() => window.art.setting.find('dash-audio').tooltip)).toBe('fr')
      await page.locator('#pause').click()
      expect(await page.evaluate(() => window.art.video.paused)).toBe(true)
      await page.evaluate(() => {
        window.art.seek = 6
      })
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(6.2)
      expect(await page.evaluate(() => window.sdkErrors)).toEqual([])
      await testInfo.attach('dash-sdk-playing', { contentType: 'image/png', body: await page.screenshot() })
    })
  }
}

for (const version of ['4.5.2', '5.2.1']) {
  test(`dash.js ${version}: native SDK track switch and paused seek without ArtPlayer`, async ({ page }, testInfo) => {
    const capability = await loadSDK(page, version, 'candidate', testInfo)
    test.skip(!capability.sdk, 'Actual SDK reports no MediaSource support; no native DASH playback acceptance')
    await routeMedia(page)
    await page.evaluate(() => {
      const video = document.createElement('video')
      window.nativeVideo = video
      video.muted = true
      document.querySelector('.player').append(video)
      const dash = window.dashjs.MediaPlayer().create()
      window.nativeDash = dash
      window.sdkEvents = []
      window.sdkErrors = []
      window.mediaEvents = []
      dash.updateSettings({ debug: { logLevel: 0 }, streaming: { abr: { initialBitrate: { video: 150 } }, buffer: { fastSwitchEnabled: true, bufferTimeDefault: 2, bufferTimeAtTopQuality: 2 } } })
      const events = window.dashjs.MediaPlayer.events
      dash.on(events.ERROR, event => window.sdkErrors.push({ code: event.error?.code, message: event.error?.message }))
      for (const name of ['FRAGMENT_LOADING_COMPLETED', 'TRACK_CHANGE_RENDERED', 'QUALITY_CHANGE_RENDERED', 'BUFFER_LEVEL_STATE_CHANGED', 'PLAYBACK_SEEKING', 'PLAYBACK_SEEKED']) {
        dash.on(events[name], event => window.sdkEvents.push({ name, at: performance.now(), mediaType: event.mediaType, state: event.state, url: event.request?.url, time: video.currentTime }))
      }
      for (const name of ['play', 'playing', 'pause', 'seeking', 'seeked', 'waiting']) {
        video.addEventListener(name, () => window.mediaEvents.push({ name, at: performance.now(), time: video.currentTime, paused: video.paused, readyState: video.readyState, buffered: Array.from({ length: video.buffered.length }, (_, index) => [video.buffered.start(index), video.buffered.end(index)]) }))
      }
      dash.initialize(video, '/dash-fixture/master.mpd', false)
      document.querySelector('#play').onclick = () => {
        window.nativePlay = 'pending'
        video.play().then(() => {
          window.nativePlay = 'fulfilled'
        }, (error) => {
          window.nativePlay = `${error.name}: ${error.message}`
        })
      }
      document.querySelector('#pause').onclick = () => video.pause()
    })
    await expect.poll(() => page.evaluate(() => window.nativeVideo.readyState)).toBeGreaterThanOrEqual(2)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.nativeVideo.currentTime)).toBeGreaterThan(0.3)
    await page.evaluate(() => {
      const dash = window.nativeDash
      dash.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } })
      if (dash.setQualityFor)
        dash.setQualityFor('video', 1, true)
      else
        dash.setRepresentationForTypeById('video', '1', true)
    })
    await expect.poll(() => page.evaluate(() => window.nativeVideo.videoHeight)).toBe(180)
    // Match the failed integrated run: video data ends at the next seek target.
    await expect.poll(() => page.evaluate(() => window.nativeVideo.buffered.end(window.nativeVideo.buffered.length - 1))).toBeCloseTo(6, 4)
    await page.evaluate(() => {
      const dash = window.nativeDash
      dash.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } })
      dash.setCurrentTrack(dash.getTracksFor('audio').find(track => track.lang === 'fr'))
    })
    await expect.poll(() => page.evaluate(() => window.nativeDash.getCurrentTrackFor('audio').lang)).toBe('fr')
    await page.locator('#pause').click()
    await page.evaluate(() => {
      window.nativeVideo.currentTime = 6
    })
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.nativeVideo.currentTime)).toBeGreaterThan(6.2)
    expect(await page.evaluate(() => window.nativePlay)).toBe('fulfilled')
    expect(await page.evaluate(() => window.sdkErrors)).toEqual([])
    expect(await page.evaluate(() => window.Artplayer.instances.length)).toBe(0)
  })
}

for (const core of ['published', 'candidate']) {
  for (const version of ['4.5.2', '5.2.1']) {
    test(`${core} core / DASH ${version}: explicit update reflects external SDK selection`, async ({ page }, testInfo) => {
      await openDash(page, version, core, 'candidate', testInfo)
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      await page.evaluate(() => {
        const dash = window.art.dash
        dash.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } })
        if (dash.setQualityFor)
          dash.setQualityFor('video', 1)
        else
          dash.setRepresentationForTypeById('video', '1')
        dash.setCurrentTrack(dash.getTracksFor('audio').find(track => track.lang === 'fr'))
      })
      await expect.poll(() => page.evaluate(() => window.art.video.videoHeight)).toBe(180)
      await page.evaluate(() => window.art.plugins.artplayerPluginDashControl.update())
      await expect(page.locator('.art-control-dash-quality .art-selector-value')).toHaveText('180p')
      await expect(page.locator('.art-control-dash-audio .art-selector-value')).toHaveText('fr')
      expect(await page.evaluate(() => ({ quality: window.art.setting.find('dash-quality').tooltip, audio: window.art.setting.find('dash-audio').tooltip }))).toEqual({ quality: '180p', audio: 'fr' })
      await page.evaluate(() => {
        window.art.dash.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } })
        window.art.plugins.artplayerPluginDashControl.update()
      })
      await expect(page.locator('.art-control-dash-quality .art-selector-value')).toHaveText('Auto')
      expect(await page.evaluate(() => window.sdkErrors)).toEqual([])
    })

    test(`${core} core / DASH ${version}: actual source topology replacement and owned cleanup`, async ({ page }, testInfo) => {
      await openDash(page, version, core, 'candidate', testInfo)
      await expect(page.locator('.art-control-dash-audio .art-selector-value')).toHaveText('en')
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      await page.evaluate(() => {
        const quality = window.art.controls.cache.get('dash-quality').option
        const audio = window.art.setting.find('dash-audio')
        // Registry update mutates the option object; retain the actual old callback.
        window.retainedQuality = { onSelect: quality.onSelect, item: quality.selector[0] }
        window.retainedAudio = { onSelect: audio.onSelect, item: audio.selector[1] }
      })
      await page.evaluate(() => window.art.switchUrl('/dash-fixture/video-only.mpd'))
      await expect(page.locator('.art-control-dash-audio')).toHaveCount(0)
      expect(await page.evaluate(() => Boolean(window.art.setting.find('dash-audio')))).toBe(false)
      expect(await page.evaluate(() => window.art.dash.getTracksFor('audio'))).toEqual([])
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      await page.evaluate(() => {
        window.retainedQuality.onSelect(window.retainedQuality.item)
        window.retainedAudio.onSelect(window.retainedAudio.item)
      })
      expect(await page.evaluate(() => window.art.dash.getSettings().streaming.abr.autoSwitchBitrate.video)).toBe(true)
      await page.evaluate(() => window.art.switchUrl('/dash-fixture/single.mpd'))
      await expect(page.locator('.art-control-dash-quality .art-selector-item')).toHaveText(['90p', 'Auto'])
      await expect.poll(() => page.evaluate(() => window.art.video.videoHeight)).toBe(90)
      await page.evaluate(() => window.art.switchUrl('/dash-fixture/master.mpd'))
      await expect(page.locator('.art-control-dash-audio .art-selector-value')).toHaveText('en')
      await expect(page.locator('.art-control-dash-quality .art-selector-item')).toHaveText(['180p', '90p', 'Auto'])
      expect(await page.evaluate(() => window.sdkDestroyed)).toBe(3)
      expect(await page.evaluate(() => window.sdkErrors)).toEqual([])
      await page.evaluate(() => window.art.destroy(false))
      expect(await page.evaluate(() => window.sdkDestroyed)).toBe(4)
      await expect(page.locator('.art-control-dash-quality, .art-control-dash-audio')).toHaveCount(0)
    })
  }
}
