import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

let asrCode
let audioCode
let inputs
test.beforeAll(async () => {
  const asr = await browserCandidate('artplayer-plugin-asr', process.env.ARTPLAYER_ASR_ARTIFACT)
  asrCode = asr.code
  const audio = await browserCandidate('artplayer-plugin-audio-track', process.env.ARTPLAYER_AUDIO_ARTIFACT)
  audioCode = audio.code
  const media = fs.readFileSync(new URL('./media/audio-tone.m4a', import.meta.url))
  const manifest = JSON.parse(fs.readFileSync(new URL('./media/audio-tone.json', import.meta.url)))
  expect(hash(media)).toBe(manifest.sha256)
  inputs = {
    asr: { provenance: asr.provenance, sha256: hash(asrCode) },
    audioTrack: { provenance: audio.provenance, sha256: hash(audioCode) },
    media: { file: 'test/browser/media/audio-tone.m4a', sha256: hash(media), bytes: media.length },
    recognitionService: false,
    scope: 'Native media/WebAudio composition; not physical speaker or device acceptance',
  }
})

async function openCombination(page, core, audioFirst, testInfo) {
  await testInfo.attach('asr-audio-track-inputs', { contentType: 'application/json', body: JSON.stringify({ ...inputs, core, audioFirst }) })
  await page.goto(`/test/player.html?core=${core}`)
  const capabilities = await page.evaluate(() => ({ audioContext: typeof (window.AudioContext || window.webkitAudioContext), audioWorklet: typeof window.AudioWorkletNode }))
  await testInfo.attach('native-audio-capabilities', { contentType: 'application/json', body: JSON.stringify(capabilities) })
  if (capabilities.audioContext === 'undefined') {
    expect(process.platform).toBe('win32')
    expect(testInfo.project.name).toBe('webkit')
    expect(capabilities.audioWorklet).toBe('undefined')
    test.skip(true, 'Windows WebKit lacks native AudioContext/AudioWorklet; Safari and physical-device composition remain unverified')
  }
  expect(capabilities.audioWorklet).toBe('function')
  await page.addScriptTag({ content: audioCode })
  await page.addScriptTag({ content: asrCode })
  await page.evaluate((audioFirst) => {
    window.NativeAudioContext = window.AudioContext || window.webkitAudioContext
    window.asrContexts = []
    window.sourceElements = []
    window.AudioContext = class extends window.NativeAudioContext {
      constructor(options) {
        super(options)
        window.asrContexts.push(this)
      }

      createMediaElementSource(element) {
        const source = super.createMediaElementSource(element)
        window.sourceElements.push(element)
        return source
      }
    }
    window.asrChunks = []
    const asr = window.artplayerPluginAsr({
      onAudioChunk({ pcm, wav }) {
        let peak = 0
        for (const sample of new Int16Array(pcm))
          peak = Math.max(peak, Math.abs(sample))
        window.asrChunks.push({ peak, pcmBytes: pcm.byteLength, wavBytes: wav.byteLength, sampleRate: new DataView(wav).getUint32(24, true), source: window.art.video.currentSrc })
        return 'Local main-media transcript.'
      },
    })
    const audio = window.artplayerPluginAudioTrack({ url: '/test/audio-tone.m4a?track=first', sync: 0.1 })
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/audio-tone.m4a?main=first',
      volume: 0.4,
      muted: false,
      plugins: audioFirst ? [audio, asr] : [asr, audio],
    })
    window.audioPlugin = window.art.plugins.artplayerPluginAudioTrack
    window.asrPlugin = window.art.plugins.artplayerPluginAsr
    document.querySelector('#play').onclick = () => window.art.play()
    document.querySelector('#pause').onclick = () => window.art.pause()
  }, audioFirst)
  await expect.poll(() => page.evaluate(() => window.art.isReady && window.audioPlugin.audio.readyState >= 2)).toBe(true)
  expect(await page.evaluate(() => ({ mainMuted: window.art.video.muted, audioMuted: window.audioPlugin.audio.muted, separateElements: window.art.video !== window.audioPlugin.audio }))).toEqual({ mainMuted: false, audioMuted: false, separateElements: true })
  await page.locator('#play').click()
  await expect.poll(() => page.evaluate(() => window.asrChunks.filter(chunk => chunk.peak > 0).length)).toBeGreaterThanOrEqual(3)
  await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(0.2)
  expect(await page.evaluate(() => window.sourceElements.length === 1 && window.sourceElements[0] === window.art.video)).toBe(true)
  expect(await page.evaluate(() => window.asrChunks.every(chunk => chunk.pcmBytes === 3200 && chunk.wavBytes === 3244 && chunk.sampleRate === 16000 && chunk.source.includes('main=first')))).toBe(true)
}

test.afterEach(async ({ page }, testInfo) => {
  const evidence = await page.evaluate(() => ({
    chunks: window.asrChunks,
    contexts: window.asrContexts?.map(context => context.state),
    audio: window.audioPlugin && { source: window.audioPlugin.audio.currentSrc, attribute: window.audioPlugin.audio.getAttribute('src'), time: window.audioPlugin.audio.currentTime, paused: window.audioPlugin.audio.paused, muted: window.audioPlugin.audio.muted, error: window.audioPlugin.audio.error?.code },
  })).catch(error => ({ error: error.message }))
  await testInfo.attach('asr-audio-track-state', { contentType: 'application/json', body: JSON.stringify(evidence) })
  await page.evaluate(async () => {
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
    if (window.probeContext && window.probeContext.state !== 'closed')
      await window.probeContext.close()
  })
})

for (const core of ['published', 'candidate']) {
  test(`${core} core + ASR/audio-track: pause, update, ASR stop and destroy preserve separate ownership`, async ({ page }, testInfo) => {
    await openCombination(page, core, true, testInfo)
    await expect(page.locator('.art-layer-asr')).toContainText('Local main-media transcript.')
    await page.locator('#pause').click()
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.paused && window.art.video.paused)).toBe(true)
    const pausedChunks = await page.evaluate(() => window.asrChunks.length)
    await page.waitForTimeout(350)
    expect(await page.evaluate(() => window.asrChunks.length)).toBe(pausedChunks)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.asrChunks.length)).toBeGreaterThan(pausedChunks + 2)
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.paused)).toBe(false)
    expect(await page.evaluate(() => window.asrContexts.length)).toBe(1)

    const beforeUpdate = await page.evaluate(() => {
      window.originalAudio = window.audioPlugin.audio
      const count = window.asrChunks.length
      window.audioPlugin.update({ url: '/test/audio-tone.m4a?track=second' })
      return count
    })
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentSrc)).toContain('track=second')
    await expect.poll(() => page.evaluate(() => !window.audioPlugin.audio.paused && window.audioPlugin.audio.currentTime > 0.1)).toBe(true)
    await expect.poll(() => page.evaluate(() => window.asrChunks.length)).toBeGreaterThan(beforeUpdate + 2)
    expect(await page.evaluate(() => window.originalAudio === window.audioPlugin.audio && window.art.video.currentSrc.includes('main=first'))).toBe(true)
    expect(await page.evaluate(() => window.asrContexts.length)).toBe(1)

    await page.evaluate(() => window.asrPlugin.stop())
    const stopped = await page.evaluate(() => ({ chunks: window.asrChunks.length, time: window.audioPlugin.audio.currentTime }))
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(stopped.time + 0.4)
    expect(await page.evaluate(() => window.asrChunks.length)).toBe(stopped.chunks)
    expect(await page.evaluate(() => window.art.video.paused || window.audioPlugin.audio.paused)).toBe(false)
    await page.locator('#pause').click()
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.asrChunks.length)).toBeGreaterThan(stopped.chunks + 2)
    await page.evaluate(() => window.art.destroy())
    await expect.poll(() => page.evaluate(() => window.asrContexts.every(context => context.state === 'closed'))).toBe(true)
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.networkState)).toBe(0)
    const destroyedCount = await page.evaluate(() => window.asrChunks.length)
    await page.evaluate(() => {
      window.audioPlugin.update({ url: '/test/audio-tone.m4a?track=revived' })
      window.asrPlugin.append('Late transcript must not revive the player')
    })
    expect(await page.evaluate(() => ({ src: window.audioPlugin.audio.getAttribute('src'), paused: window.audioPlugin.audio.paused, readyState: window.audioPlugin.audio.readyState }))).toEqual({ src: null, paused: true, readyState: 0 })
    await expect(page.locator('.art-video-player')).toHaveCount(0)
    await page.waitForTimeout(250)
    expect(await page.evaluate(() => window.asrChunks.length)).toBe(destroyedCount)
  })

  test(`${core} core + ASR/audio-track: capture follows main media, not the independent audible track`, async ({ page }, testInfo) => {
    await openCombination(page, core, false, testInfo)
    await page.evaluate(async () => {
      // Real native probe of the independently exposed Audio element, with its own owner.
      window.probeContext = new window.NativeAudioContext()
      const source = window.probeContext.createMediaElementSource(window.audioPlugin.audio)
      window.trackAnalyser = window.probeContext.createAnalyser()
      source.connect(window.trackAnalyser)
      window.trackAnalyser.connect(window.probeContext.destination)
      await window.probeContext.resume()
      window.art.muted = true
    })
    await expect.poll(() => page.evaluate(() => window.art.video.muted && window.audioPlugin.audio.muted)).toBe(true)
    await page.evaluate(() => {
      // Consumers may override the public external element; the plugin never mutes main media itself.
      window.audioPlugin.audio.muted = false
    })
    const peak = () => page.evaluate(() => {
      const samples = new Float32Array(window.trackAnalyser.fftSize)
      window.trackAnalyser.getFloatTimeDomainData(samples)
      return Math.max(...samples.map(Math.abs))
    })
    await expect.poll(peak).toBeGreaterThan(0.001)
    await expect.poll(() => page.evaluate(() => window.asrChunks.slice(-5).length === 5 && window.asrChunks.slice(-5).every(chunk => chunk.peak === 0))).toBe(true)
    expect(await page.evaluate(() => window.audioPlugin.audio.paused)).toBe(false)
    expect(await page.evaluate(() => window.sourceElements.length === 1 && window.sourceElements[0] === window.art.video)).toBe(true)
    await testInfo.attach('separate-audio-routing', { contentType: 'application/json', body: JSON.stringify({ independentTrackPeak: await peak(), silentMainChunks: await page.evaluate(() => window.asrChunks.slice(-5)) }) })
    const beforeUnmute = await page.evaluate(() => {
      window.art.muted = false
      return window.asrChunks.length
    })
    await expect.poll(() => page.evaluate(start => window.asrChunks.slice(start).filter(chunk => chunk.peak > 0).length, beforeUnmute)).toBeGreaterThanOrEqual(3)
    await page.evaluate(() => window.art.destroy())
    await expect.poll(() => page.evaluate(() => window.asrContexts.every(context => context.state === 'closed'))).toBe(true)
    // The test owns the probe; neither plugin may close a context created by another owner.
    expect(await page.evaluate(() => window.probeContext.state)).toBe('running')
    await page.evaluate(() => window.probeContext.close())
    await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.networkState)).toBe(0)
  })
}
