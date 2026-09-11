import { useAudioFixture } from './audio-fixture.js'
import { expect, test } from './fixtures.js'

const { openAudio } = useAudioFixture()

for (const core of ['published', 'candidate']) {
  for (const plugin of ['published', 'source']) {
    test(`${core} core + ${plugin} audio: rapid main/audio switches settle on the last pair`, async ({ page }, testInfo) => {
      await openAudio(page, core, plugin, testInfo)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(0.3)
      await page.evaluate(async () => {
        const { art, audioPlugin } = window
        window.originalAudio = audioPlugin.audio
        const pending = []
        for (const source of ['first', 'second', 'last']) {
          pending.push(art.switchUrl(`/test/pattern.mp4?pair=${source}`))
          audioPlugin.update({ url: `/test/audio-tone.m4a?pair=${source}` })
        }
        await Promise.all(pending)
      })
      await expect.poll(() => page.evaluate(() => window.art.video.currentSrc)).toContain('pair=last')
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentSrc)).toContain('pair=last')
      await expect.poll(() => page.evaluate(() => !window.art.video.paused && !window.audioPlugin.audio.paused && window.art.currentTime > 0.3)).toBe(true)
      await expect.poll(() => page.evaluate(() => Math.abs(window.art.currentTime - window.audioPlugin.audio.currentTime))).toBeLessThan(0.5)
      expect(await page.evaluate(() => window.originalAudio === window.audioPlugin.audio)).toBe(true)
      await page.evaluate(async () => {
        window.art.pause()
        await window.art.switchUrl('/test/pattern.mp4?pair=paused')
        window.audioPlugin.update({ url: '/test/audio-tone.m4a?pair=paused' })
      })
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.readyState)).toBeGreaterThanOrEqual(2)
      expect(await page.evaluate(() => window.art.video.paused && window.audioPlugin.audio.paused)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(0.3)
      expect(await page.evaluate(() => [window.art.video.error, window.audioPlugin.audio.error])).toEqual([null, null])
      await page.evaluate(() => window.art.destroy())
    })

    test(`${core} core + ${plugin} audio: two active players keep clocks and ownership independent`, async ({ page }, testInfo) => {
      await openAudio(page, core, plugin, testInfo)
      await page.evaluate(() => {
        window.art.option.mutex = false
        const container = document.createElement('div')
        container.style.cssText = 'width:320px;height:180px'
        document.body.append(container)
        window.otherArt = new window.Artplayer({ container, url: '/test/pattern.mp4?instance=other', mutex: false, muted: true, plugins: [window.artplayerPluginAudioTrack({ url: '/test/audio-tone.m4a?instance=other', offset: 0.5, sync: 0.1 })] })
        window.otherAudio = window.otherArt.plugins.artplayerPluginAudioTrack.audio
        const play = document.querySelector('#play')
        play.onclick = () => Promise.all([window.art.play(), window.otherArt.play()])
      })
      await expect.poll(() => page.evaluate(() => window.otherArt.isReady && window.otherAudio.readyState >= 2)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => !window.audioPlugin.audio.paused && !window.otherAudio.paused && window.art.currentTime > 0.2 && window.otherArt.currentTime > 0.2)).toBe(true)
      await page.evaluate(() => {
        window.art.pause()
        window.art.seek = 3
        window.art.volume = 0.2
        window.art.playbackRate = 1.5
        window.otherArt.volume = 0.7
      })
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeCloseTo(3, 1)
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.playbackRate)).toBe(1.5)
      await expect.poll(() => page.evaluate(() => window.otherAudio.volume)).toBeCloseTo(0.7)
      expect(await page.evaluate(() => window.otherAudio.playbackRate)).toBe(1)
      expect(await page.evaluate(() => window.otherAudio !== window.audioPlugin.audio)).toBe(true)
      await expect.poll(() => page.evaluate(() => Math.abs(window.otherAudio.currentTime - window.otherArt.currentTime - 0.5))).toBeLessThan(0.5)
      const before = await page.evaluate(() => {
        window.art.destroy()
        return window.otherAudio.currentTime
      })
      await expect.poll(() => page.evaluate(() => window.otherAudio.currentTime)).toBeGreaterThan(before + 0.3)
      expect(await page.evaluate(() => window.audioPlugin.audio.paused && !window.otherAudio.paused)).toBe(true)
      expect(await page.evaluate(() => window.otherAudio.currentSrc)).toContain('instance=other')
      expect(await page.evaluate(() => window.otherAudio.error)).toBeNull()
      await testInfo.attach('independent-audio', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ left: { time: window.audioPlugin.audio.currentTime, paused: window.audioPlugin.audio.paused, rate: window.audioPlugin.audio.playbackRate }, right: { time: window.otherAudio.currentTime, videoTime: window.otherArt.currentTime, rate: window.otherAudio.playbackRate, paused: window.otherAudio.paused } }))) })
      await page.evaluate(() => window.otherArt.destroy())
      expect(await page.evaluate(() => window.otherAudio.paused)).toBe(true)
    })

    test(`${core} core + ${plugin} audio: native offset bounds recover to an in-range seek`, async ({ page }, testInfo) => {
      await openAudio(page, core, plugin, testInfo)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(0.2)
      await page.evaluate(() => {
        window.art.pause()
        window.audioPlugin.update({ offset: -2 })
        window.art.seek = 0.5
      })
      await expect.poll(() => page.evaluate(() => !window.art.video.seeking && !window.audioPlugin.audio.seeking)).toBe(true)
      const negative = await page.evaluate(() => ({ time: window.audioPlugin.audio.currentTime, error: window.audioPlugin.audio.error?.code || null }))
      expect(negative).toEqual({ time: 0, error: null })
      await page.evaluate(() => {
        window.audioPlugin.update({ offset: 20 })
        window.art.seek = 1
      })
      await expect.poll(() => page.evaluate(() => !window.art.video.seeking && !window.audioPlugin.audio.seeking)).toBe(true)
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBe(16)
      expect(await page.evaluate(() => window.audioPlugin.audio.paused)).toBe(true)
      await page.evaluate(() => {
        window.audioPlugin.update({ offset: -0.5 })
        window.art.seek = 3
      })
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeCloseTo(2.5, 1)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(2.8)
      await expect.poll(() => page.evaluate(() => Math.abs(window.audioPlugin.audio.currentTime - window.art.currentTime + 0.5))).toBeLessThan(0.5)
      await testInfo.attach('offset-boundary', { contentType: 'application/json', body: JSON.stringify({ negative, overflow: 16, recovered: true }) })
      await page.evaluate(() => window.art.destroy())
    })
  }
}
