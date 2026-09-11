import { useAudioFixture } from './audio-fixture.js'
import { expect, test } from './fixtures.js'

const { openAudio, wav } = useAudioFixture()

async function playToEnd(page) {
  await page.evaluate(() => {
    window.art.pause()
    window.art.seek = 7
  })
  await expect.poll(() => page.evaluate(() => !window.art.video.seeking && !window.audioPlugin.audio.seeking && window.art.video.readyState >= 3 && window.audioPlugin.audio.readyState >= 3)).toBe(true)
  await page.locator('#play').click()
  await expect.poll(() => page.evaluate(() => !window.audioPlugin.audio.paused && window.audioPlugin.audio.currentTime > 7.05)).toBe(true)
  await expect.poll(() => page.evaluate(() => window.art.video.ended)).toBe(true)
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
    await playToEnd(page)
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
    await playToEnd(page)
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
