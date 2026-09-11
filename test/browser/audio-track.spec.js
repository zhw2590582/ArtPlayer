import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

let publishedCode
let sourceCode
let evidence
const samples = 16000 * 16
const tone = fs.readFileSync(new URL('./media/audio-tone.m4a', import.meta.url))
const toneManifest = JSON.parse(fs.readFileSync(new URL('./media/audio-tone.json', import.meta.url)))
const wav = Buffer.alloc(44 + samples * 2)
wav.write('RIFF', 0)
wav.writeUInt32LE(wav.length - 8, 4)
wav.write('WAVEfmt ', 8)
wav.writeUInt32LE(16, 16)
wav.writeUInt16LE(1, 20)
wav.writeUInt16LE(1, 22)
wav.writeUInt32LE(16000, 24)
wav.writeUInt32LE(32000, 28)
wav.writeUInt16LE(2, 32)
wav.writeUInt16LE(16, 34)
wav.write('data', 36)
wav.writeUInt32LE(samples * 2, 40)
for (let index = 0; index < samples; index++)
  wav.writeInt16LE(index % 80 < 40 ? 2000 : -2000, 44 + index * 2)

test.beforeAll(async () => {
  assert.equal(hash(tone), toneManifest.sha256)
  assert.equal(tone.length, toneManifest.bytes)
  assert(!process.env.ARTPLAYER_BROWSER_ARTIFACTS, 'Audio source tests cannot represent installed artifacts')
  const { release } = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/audio-track-release.json', import.meta.url)))
  const member = 'package/dist/artplayer-plugin-audio-track.js'
  const bytes = readMember(await ensureArchive(release), member)
  assert.equal(hash(bytes), release.files[member])
  publishedCode = bytes.toString()
  sourceCode = process.env.ARTPLAYER_AUDIO_ARTIFACT ? fs.readFileSync(process.env.ARTPLAYER_AUDIO_ARTIFACT, 'utf8') : await compilePackage(release.name, 'umd')
  evidence = { release, sourceSHA256: hash(sourceCode), candidate: process.env.ARTPLAYER_AUDIO_ARTIFACT || 'workspace source build', audio: { sha256: hash(tone), bytes: tone.length, format: 'AAC mono 48000 Hz, 16 seconds, 440 Hz tone in MP4' }, wav: { sha256: hash(wav), bytes: wav.length, format: 'PCM16LE mono 16000 Hz, 16 seconds, integer square wave 200 Hz' }, scope: 'Source or explicit artifact browser checks; no physical device or installed package acceptance' }
})

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => {
    const audio = window.audioPlugin?.audio
    const video = window.art?.video
    const media = element => element && ({ src: element.currentSrc, attribute: element.getAttribute('src'), time: element.currentTime, paused: element.paused, readyState: element.readyState, networkState: element.networkState, error: element.error?.code, rate: element.playbackRate, seekable: Array.from({ length: element.seekable.length }, (_, index) => [element.seekable.start(index), element.seekable.end(index)]) })
    return { audio: media(audio), video: media(video), events: window.audioEvents, warnings: window.audioWarnings }
  }).catch(error => ({ error: error.message }))
  await testInfo.attach('audio-state', { contentType: 'application/json', body: JSON.stringify(state) })
})

async function openAudio(page, core, plugin, testInfo, url = '/test/audio-tone.m4a?source=first') {
  await testInfo.attach('audio-inputs', { contentType: 'application/json', body: JSON.stringify(evidence) })
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: plugin === 'published' ? publishedCode : sourceCode })
  await page.evaluate((url) => {
    window.audioEvents = []
    window.audioWarnings = []
    const warn = console.warn.bind(console)
    console.warn = (...args) => {
      window.audioWarnings.push(args.map(String))
      warn(...args)
    }
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      plugins: [window.artplayerPluginAudioTrack({ url, sync: 0.1 })],
    })
    window.audioPlugin = window.art.plugins.artplayerPluginAudioTrack
    for (const event of ['loadedmetadata', 'playing', 'pause', 'seeked', 'error', 'emptied'])
      window.audioPlugin.audio.addEventListener(event, () => window.audioEvents.push({ event, time: window.audioPlugin.audio.currentTime, src: window.audioPlugin.audio.currentSrc }))
    document.querySelector('#play').onclick = () => window.art.play()
  }, url)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  if (url)
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.readyState)).toBeGreaterThanOrEqual(2)
}

test('native WAV diagnostic isolates sample decoding from ArtPlayer and plugin', async ({ page }, testInfo) => {
  await page.route('**/native-wave.wav', route => route.fulfill({ contentType: 'audio/wav', body: wav }))
  await page.goto('/test/player.html')
  await page.evaluate(() => {
    window.nativeAudio = new Audio()
    window.nativeAudio.muted = true
    window.nativeAudio.src = '/native-wave.wav'
  })
  await expect.poll(() => page.evaluate(() => window.nativeAudio.readyState >= 2 || Boolean(window.nativeAudio.error))).toBe(true)
  const state = await page.evaluate(() => ({ canPlay: window.nativeAudio.canPlayType('audio/wav'), readyState: window.nativeAudio.readyState, error: window.nativeAudio.error?.code || null, playerCreated: Boolean(window.art) }))
  expect(state.playerCreated).toBe(false)
  await testInfo.attach('native-wav-capability', { contentType: 'application/json', body: JSON.stringify(state) })
  if (!state.error) {
    await page.evaluate(() => window.nativeAudio.play())
    await expect.poll(() => page.evaluate(() => window.nativeAudio.currentTime)).toBeGreaterThan(0.2)
  }
  else {
    expect(state.error).toBe(4)
  }
  await page.evaluate(() => {
    window.nativeAudio.pause()
    window.nativeAudio.removeAttribute('src')
    window.nativeAudio.load()
  })
})

test('published AUDIO-LIFE-01: empty src cleanup produces a native media error', async ({ page }, testInfo) => {
  await openAudio(page, 'published', 'published', testInfo)
  await page.locator('#play').click()
  await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(0.2)
  await page.evaluate(() => window.art.destroy())
  await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.error?.code)).toBe(4)
  expect(await page.evaluate(() => window.audioPlugin.audio.getAttribute('src'))).toBe('')
  expect(await page.evaluate(() => window.audioPlugin.audio.readyState)).toBe(0)
})

for (const core of ['published', 'candidate']) {
  test(`${core} core + source audio: native pause/end stop audio and closed references stay inert`, async ({ page }, testInfo) => {
    await openAudio(page, core, 'source', testInfo)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(0.2)
    await page.evaluate(() => window.art.video.pause())
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.paused)).toBe(true)
    await page.evaluate(() => {
      window.art.video.currentTime = 4
    })
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeCloseTo(4, 1)
    await page.evaluate(() => {
      window.art.seek = 7.8
      window.art.play()
    })
    await expect.poll(() => page.evaluate(() => window.art.video.ended)).toBe(true)
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.paused)).toBe(true)
    await page.evaluate(() => window.art.destroy())
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.networkState)).toBe(0)
    expect(await page.evaluate(() => window.audioPlugin.audio.readyState)).toBe(0)
    expect(await page.evaluate(() => window.audioPlugin.audio.error)).toBeNull()
    await page.evaluate(() => window.audioPlugin.update({ url: '/test/audio-tone.m4a?source=revived' }))
    expect(await page.evaluate(() => window.audioPlugin.audio.getAttribute('src'))).toBeNull()
    expect(await page.evaluate(() => window.audioPlugin.audio.networkState)).toBe(0)
  })

  test(`${core} core + published audio: native pause and end leave external audio playing`, async ({ page }, testInfo) => {
    await openAudio(page, core, 'published', testInfo)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(0.2)
    await page.evaluate(() => window.art.video.pause())
    expect(await page.evaluate(() => window.art.video.paused)).toBe(true)
    expect(await page.evaluate(() => window.audioPlugin.audio.paused)).toBe(false)
    await page.evaluate(() => {
      window.art.seek = 7.8
      window.art.play()
    })
    await expect.poll(() => page.evaluate(() => window.art.video.ended)).toBe(true)
    expect(await page.evaluate(() => window.audioPlugin.audio.paused)).toBe(false)
    await testInfo.attach('published-native-pause-end', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ videoEnded: window.art.video.ended, videoPaused: window.art.video.paused, audioPaused: window.audioPlugin.audio.paused, audioTime: window.audioPlugin.audio.currentTime }))) })
    await page.evaluate(() => window.art.destroy())
  })

  for (const plugin of ['published', 'source']) {
    test(`${core} core + ${plugin} audio: decoded play, offset seek, rate, source and cleanup`, async ({ page }, testInfo) => {
      await openAudio(page, core, plugin, testInfo)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(0.3)
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      expect(await page.evaluate(() => window.audioPlugin.audio.duration)).toBe(16)
      // Windows WebKit may expose layout size; decoded pixels are the playback evidence.
      const pixel = await page.evaluate(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 80
        canvas.height = 45
        const context = canvas.getContext('2d')
        context.drawImage(window.art.video, 0, 0, 80, 45)
        return [...context.getImageData(30, 2, 1, 1).data]
      })
      expect(pixel[0]).toBeGreaterThan(180)
      expect(pixel[1]).toBeGreaterThan(180)
      expect(pixel[2]).toBeLessThan(80)
      await testInfo.attach('decoded-frame-pixel', { contentType: 'application/json', body: JSON.stringify(pixel) })
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.seekable.length && window.audioPlugin.audio.seekable.end(0))).toBeGreaterThan(2.25)
      await page.evaluate(() => {
        window.art.pause()
        window.audioPlugin.update({ offset: 0.25 })
        window.art.seek = 2
      })
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.paused)).toBe(true)
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeCloseTo(2.25, 1)
      await page.evaluate(() => {
        window.art.playbackRate = 1.5
        window.art.volume = 0.4
      })
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.playbackRate)).toBe(1.5)
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.volume)).toBeCloseTo(0.4)
      await page.locator('#play').click()
      await page.evaluate(() => {
        window.originalAudio = window.audioPlugin.audio
        window.audioPlugin.update({ url: '/test/audio-tone.m4a?source=second' })
      })
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentSrc)).toContain('source=second')
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.paused)).toBe(false)
      await expect.poll(() => page.evaluate(() => Math.abs(window.audioPlugin.audio.currentTime - window.art.currentTime - 0.25))).toBeLessThan(0.5)
      expect(await page.evaluate(() => window.originalAudio === window.audioPlugin.audio)).toBe(true)
      await page.evaluate(() => {
        window.art.pause()
        window.art.destroy()
      })
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.readyState)).toBe(0)
      expect(await page.evaluate(() => window.audioPlugin.audio.getAttribute('src'))).toBe(plugin === 'published' ? '' : null)
      expect(await page.evaluate(() => window.audioPlugin.audio.paused)).toBe(true)
      expect(await page.locator('.art-video-player').count()).toBe(0)
    })

    test(`${core} core + ${plugin} audio: real load error can recover with a new source`, async ({ page }, testInfo) => {
      await openAudio(page, core, plugin, testInfo, '')
      await page.route('**/audio-fixture/broken.m4a', route => route.fulfill({ status: 503, body: 'Intentional media failure' }))
      await page.evaluate(() => window.audioPlugin.update({ url: '/audio-fixture/broken.m4a' }))
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.error?.code)).toBe(4)
      expect(await page.evaluate(() => window.art.video.error)).toBeNull()
      await page.evaluate(() => window.audioPlugin.update({ url: '/test/audio-tone.m4a?source=recovered' }))
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.readyState)).toBeGreaterThanOrEqual(2)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(0.3)
      expect(await page.evaluate(() => window.audioPlugin.audio.error)).toBeNull()
      await page.evaluate(() => window.art.destroy())
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.readyState)).toBe(0)
      expect(await page.evaluate(() => window.audioPlugin.audio.paused)).toBe(true)
      expect(await page.evaluate(() => window.audioPlugin.audio.getAttribute('src'))).toBe(plugin === 'published' ? '' : null)
    })
  }
}
