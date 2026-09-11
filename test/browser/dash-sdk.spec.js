import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { observeDashBuffers } from './dash-buffer-observer.js'
import { expect, test } from './fixtures.js'

const sdks = new Map()
const media = new Map()
let candidate
let published
let mediaManifest
let pluginRelease
const diagnosticSDK = process.env.ARTPLAYER_DASH_DIAGNOSTIC_SDK || 'none'
assert(['none', 'upstream4', 'bufferlevel4'].includes(diagnosticSDK), 'Unknown diagnostic SDK mode')

test.beforeAll(async () => {
  const baseline = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/dash-sdk.json', import.meta.url)))
  for (const sdk of baseline.sdks) {
    const archive = await ensureArchive(sdk.release)
    const bytes = readMember(archive, sdk.codeMember)
    assert.equal(hash(bytes), sdk.release.files[sdk.codeMember])
    let code = bytes.toString()
    let diagnostic
    if (sdk.release.version === '4.5.2' && diagnosticSDK !== 'none') {
      const member = 'package/dist/dash.all.debug.js'
      code = readMember(archive, member).toString()
      const upstreamSHA256 = hash(code)
      if (diagnosticSDK === 'bufferlevel4') {
        const before = 'function clearBuffers(ranges) {\n    return new Promise(function (resolve, reject) {\n      if (!ranges || !sourceBufferSink || ranges.length === 0) {\n        resolve();'
        assert.equal(code.split(before).length, 2, 'Diagnostic patch must match exactly one upstream branch')
        code = code.replace(before, before.replace('        resolve();', '        _updateBufferLevel();\n        resolve();'))
      }
      diagnostic = { mode: diagnosticSDK, member, upstreamSHA256, effectiveSHA256: hash(code), acceptance: false }
    }
    sdks.set(sdk.release.version, { ...sdk, code, diagnostic })
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
    return { errors: window.sdkErrors, events: window.sdkEvents, mediaEvents: window.mediaEvents, nativePlay: window.nativePlay, tracks, levels, buffered, paused: video?.paused, seeking: video?.seeking, time: video?.currentTime, ready: art?.isReady, width: video?.videoWidth, height: video?.videoHeight, error: video?.error?.code, readyState: video?.readyState, destroyed: window.sdkDestroyed, bufferState: window.dashBuffers?.snapshot(), bufferEvents: window.dashBuffers?.events }
  }).catch(error => ({ error: error.message }))
  await testInfo.attach('dash-sdk-state', { contentType: 'application/json', body: JSON.stringify(state) })
  // Opt-in counterfactual after a failed assertion; it never turns a failure green.
  if (process.env.ARTPLAYER_DASH_DIAGNOSE_STALL === '1' && testInfo.status !== testInfo.expectedStatus && state.seeking && state.time === 6) {
    const recovery = await page.evaluate(() => {
      const before = window.dashBuffers.snapshot()
      const video = window.art?.video || window.nativeVideo
      video.dispatchEvent(new Event('timeupdate'))
      return { before, afterDispatch: window.dashBuffers.snapshot() }
    })
    recovery.advanced = await page.waitForFunction(() => (window.art?.video || window.nativeVideo).currentTime > 6.2, null, { timeout: 3000 }).then(() => true, () => false)
    recovery.final = await page.evaluate(() => window.dashBuffers.snapshot())
    await testInfo.attach('diagnostic-synthetic-timeupdate', { contentType: 'application/json', body: JSON.stringify(recovery) })
  }
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
  await page.evaluate(observeDashBuffers)
  await page.addScriptTag({ content: sdk.code })
  const capability = await page.evaluate(() => ({ sdk: window.dashjs.supportsMediaSource(), mse: typeof window.MediaSource, managed: typeof window.ManagedMediaSource, avc: Boolean(window.MediaSource?.isTypeSupported('video/mp4; codecs="avc1.42c01e"')), aac: Boolean(window.MediaSource?.isTypeSupported('audio/mp4; codecs="mp4a.40.2"')) }))
  await testInfo.attach('dash-sdk-inputs', { contentType: 'application/json', body: JSON.stringify({ sdk: sdk.release, codeMember: sdk.diagnostic?.member || sdk.codeMember, diagnostic: sdk.diagnostic, pluginRelease, candidateSHA256: hash(candidate), candidate: process.env.ARTPLAYER_DASH_ARTIFACT || 'workspace source build', media: mediaManifest, capability }) })
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
    window.dashOption = { quality: { control: true, setting: true }, audio: { control: true, setting: true } }
    window.art = new window.Artplayer({
      container: '.player',
      url: '/dash-fixture/master.mpd',
      muted: true,
      setting: true,
      plugins: [window.artplayerPluginDashControl(window.dashOption)],
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
        for (const name of ['STREAM_INITIALIZED', 'QUALITY_CHANGE_REQUESTED', 'QUALITY_CHANGE_RENDERED', 'TRACK_CHANGE_RENDERED', 'STREAM_TEARDOWN_COMPLETE', 'BUFFER_LEVEL_STATE_CHANGED', 'BUFFER_LEVEL_UPDATED', 'FRAGMENT_LOADING_COMPLETED', 'PLAYBACK_SEEKING', 'PLAYBACK_SEEKED']) {
          if (events[name])
            dash.on(events[name], event => window.sdkEvents.push({ name, at: performance.now(), mediaType: event.mediaType, oldQuality: event.oldQuality, newQuality: event.newQuality, state: event.state, bufferLevel: event.bufferLevel, url: event.request?.url, time: video.currentTime, seekTime: event.seekTime }))
        }
        dash.initialize(video, url, false)
      } },
    })
    const art = window.art
    for (const name of ['play', 'playing', 'pause', 'seeking', 'seeked', 'waiting', 'timeupdate', 'emptied', 'loadedmetadata', 'loadeddata', 'canplay', 'error']) {
      art.video.addEventListener(name, () => {
        window.mediaEvents.push({ name, at: performance.now(), time: art.video.currentTime, paused: art.video.paused, readyState: art.video.readyState, buffered: Array.from({ length: art.video.buffered.length }, (_, index) => [art.video.buffered.start(index), art.video.buffered.end(index)]) })
        window.dashBuffers.mark(`media:${name}`)
      })
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
        window.dashBuffers.mark('before-seek')
        window.art.seek = 6
        window.dashBuffers.mark('assigned-seek')
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
      for (const name of ['FRAGMENT_LOADING_COMPLETED', 'TRACK_CHANGE_RENDERED', 'QUALITY_CHANGE_RENDERED', 'BUFFER_LEVEL_STATE_CHANGED', 'BUFFER_LEVEL_UPDATED', 'PLAYBACK_SEEKING', 'PLAYBACK_SEEKED']) {
        dash.on(events[name], event => window.sdkEvents.push({ name, at: performance.now(), mediaType: event.mediaType, state: event.state, bufferLevel: event.bufferLevel, url: event.request?.url, time: video.currentTime, seekTime: event.seekTime }))
      }
      for (const name of ['play', 'playing', 'pause', 'seeking', 'seeked', 'waiting', 'timeupdate']) {
        video.addEventListener(name, () => {
          window.mediaEvents.push({ name, at: performance.now(), time: video.currentTime, paused: video.paused, readyState: video.readyState, buffered: Array.from({ length: video.buffered.length }, (_, index) => [video.buffered.start(index), video.buffered.end(index)]) })
          window.dashBuffers.mark(`media:${name}`)
        })
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
        dash.setQualityFor('video', 1)
      else
        dash.setRepresentationForTypeById('video', '1')
    })
    await expect.poll(() => page.evaluate(() => window.nativeVideo.videoHeight)).toBe(180)
    // Match the failed integrated run: video data ends at the next seek target.
    await expect.poll(() => page.evaluate(() => {
      const video = window.nativeVideo
      return video.currentTime >= 2.8 && Math.abs(video.buffered.end(video.buffered.length - 1) - 6) < 0.0001
    })).toBe(true)
    await page.evaluate(() => {
      const dash = window.nativeDash
      dash.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } })
      dash.setCurrentTrack(dash.getTracksFor('audio').find(track => track.lang === 'fr'))
    })
    await expect.poll(() => page.evaluate(() => window.nativeDash.getCurrentTrackFor('audio').lang)).toBe('fr')
    // The recorded integrated stall happened after the audio switch was rendered.
    await expect.poll(() => page.evaluate(() => window.sdkEvents.some(event => event.name === 'TRACK_CHANGE_RENDERED' && event.mediaType === 'audio'))).toBe(true)
    await page.locator('#pause').click()
    // Observe a genuinely held pause: no clock/append events for half a second.
    // This separates the seek from progress events still queued by the track switch.
    await page.waitForFunction(() => window.nativeVideo.paused && performance.now() - window.dashBuffers.events.at(-1).at >= 500)
    expect(await page.evaluate(() => window.nativeVideo.paused)).toBe(true)
    await page.evaluate(() => {
      window.dashBuffers.mark('before-seek')
      window.nativeVideo.currentTime = 6
      window.dashBuffers.mark('assigned-seek')
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
    for (const type of ['quality', 'audio']) {
      test(`${core} core / DASH ${version}: actual settings ${type} selection survives SDK refresh`, async ({ page }, testInfo) => {
        await openDash(page, version, core, 'candidate', testInfo)
        await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
        const label = type === 'quality' ? '180p' : 'fr'
        await page.locator('.art-control-setting').click()
        await page.locator(`[data-name="dash-${type}"]`).click()
        await page.locator('.art-setting-panel.art-current .art-setting-item-left-text').filter({ hasText: new RegExp(`^${label}$`) }).click()
        if (type === 'quality') {
          await expect.poll(() => page.evaluate(() => ({ height: window.art.video.videoHeight, auto: window.art.dash.getSettings().streaming.abr.autoSwitchBitrate.video }))).toEqual({ height: 180, auto: false })
        }
        else {
          await expect.poll(() => page.evaluate(() => window.art.dash.getCurrentTrackFor('audio').lang)).toBe('fr')
        }
        await expect(page.locator(`.art-control-dash-${type} .art-selector-value`)).toHaveText(label)
        expect(await page.evaluate(type => window.art.setting.find(`dash-${type}`).tooltip, type)).toBe(label)
        expect(await page.evaluate(() => window.sdkErrors)).toEqual([])
        await testInfo.attach('dash-sdk-settings', { contentType: 'image/png', body: await page.screenshot() })
      })
    }

    test(`${core} core / DASH ${version}: same SDK source replacement refreshes topology without plugin update`, async ({ page }, testInfo) => {
      await openDash(page, version, core, 'candidate', testInfo)
      await expect(page.locator('.art-control-dash-audio .art-selector-value')).toHaveText('en')
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      await page.evaluate(() => window.art.dash.attachSource('/dash-fixture/single.mpd'))
      await expect(page.locator('.art-control-dash-audio')).toHaveCount(0)
      await expect(page.locator('.art-control-dash-quality .art-selector-item')).toHaveText(['90p', 'Auto'])
      await expect.poll(() => page.evaluate(() => window.art.video.readyState)).toBeGreaterThanOrEqual(2)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      await page.evaluate(() => window.art.dash.attachSource('/dash-fixture/master.mpd'))
      await expect(page.locator('.art-control-dash-audio .art-selector-value')).toHaveText('en')
      await expect(page.locator('.art-control-dash-quality .art-selector-item')).toHaveText(['180p', '90p', 'Auto'])
      expect(await page.evaluate(() => window.sdkDestroyed)).toBe(0)
      expect(await page.evaluate(() => window.sdkErrors)).toEqual([])
    })

    test(`${core} core / DASH ${version}: asynchronous formatter error clears menus and explicit update recovers`, async ({ page }, testInfo) => {
      const warnings = []
      page.on('console', (message) => {
        if (message.type() === 'warning')
          warnings.push({ text: message.text(), detail: message.text().includes('ArtPlayer DASH refresh failed:') ? message.args()[1].evaluate(error => ({ message: error.message, original: error === window.dashFormatterError })) : Promise.resolve(null) })
      })
      await openDash(page, version, core, 'candidate', testInfo)
      await expect(page.locator('.art-control-dash-audio .art-selector-value')).toHaveText('en')
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      await page.evaluate(() => {
        window.dashFormatterError = new Error('Intentional DASH formatter failure')
        window.dashOption.audio.getName = () => {
          throw window.dashFormatterError
        }
        const dash = window.art.dash
        dash.setCurrentTrack(dash.getTracksFor('audio').find(track => track.lang === 'fr'))
      })
      await expect(page.locator('.art-control-dash-quality, .art-control-dash-audio')).toHaveCount(0)
      const failures = warnings.filter(message => message.text.includes('ArtPlayer DASH refresh failed:'))
      expect(failures).toHaveLength(1)
      expect(await Promise.all(failures.map(message => message.detail))).toEqual([{ message: 'Intentional DASH formatter failure', original: true }])
      await page.evaluate(() => {
        window.dashOption.audio.getName = track => track.lang || String(track.id)
        window.art.plugins.artplayerPluginDashControl.update()
      })
      await expect(page.locator('.art-control-dash-audio .art-selector-value')).toHaveText('fr')
      await expect(page.locator('.art-control-dash-quality .art-selector-item')).toHaveCount(3)
      expect(await page.evaluate(() => window.sdkErrors)).toEqual([])
    })

    test(`${core} core / DASH ${version}: SDK events refresh external selections without explicit update`, async ({ page }, testInfo) => {
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
      await expect(page.locator('.art-control-dash-quality .art-selector-value')).toHaveText('180p')
      await expect(page.locator('.art-control-dash-audio .art-selector-value')).toHaveText('fr')
      expect(await page.evaluate(() => ({ quality: window.art.setting.find('dash-quality').tooltip, audio: window.art.setting.find('dash-audio').tooltip }))).toEqual({ quality: '180p', audio: 'fr' })
      await page.evaluate(() => window.art.dash.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } }))
      await expect(page.locator('.art-control-dash-quality .art-selector-value')).toHaveText('Auto')
      expect(await page.evaluate(() => window.sdkErrors)).toEqual([])
    })

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
