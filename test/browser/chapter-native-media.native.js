import process from 'node:process'
import { installChapterTiming, readChapterTiming } from './chapter-timing.js'
import { expect, test } from './fixtures.js'

test('native paused video restores position after quality URL replacement without ArtPlayer', async ({ page }, testInfo) => {
  await page.route('**/chapter-native.html', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><video id="media" muted playsinline style="width:640px;height:300px"></video><button id="play">Play</button><button id="pause">Pause</button><button id="quality">Quality A</button>' }))
  await page.goto('/chapter-native.html')
  await installChapterTiming(page, '#media')
  await page.evaluate((correctionMode) => {
    const video = document.querySelector('#media')
    video.muted = true
    window.nativeRestarts = []
    document.querySelector('#play').onclick = () => video.play()
    document.querySelector('#pause').onclick = () => video.pause()
    document.querySelector('#quality').onclick = () => {
      const time = video.currentTime
      window.nativeRestoreTarget = time
      window.nativeCorrections = 0
      window.nativeCorrectionMode = correctionMode
      if (correctionMode !== 'none') {
        video.addEventListener('seeked', () => {
          if (!window.nativeCorrections && Math.abs(video.currentTime - time) > 0.05) {
            window.nativeCorrections++
            if (correctionMode === 'deferred') {
              setTimeout(() => {
                video.currentTime = time
              }, 0)
            }
            else {
              video.currentTime = time
            }
          }
        })
      }
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = time
      }, { once: true })
      video.addEventListener('loadeddata', () => {
        window.nativeRestarts.push(video.currentSrc)
      }, { once: true })
      video.src = '/test/pattern.mp4?quality=A'
    }
    video.src = '/test/pattern.mp4?quality=B'
  }, process.env.ARTPLAYER_NATIVE_QUALITY_CORRECTION === 'deferred' ? 'deferred' : process.env.ARTPLAYER_NATIVE_QUALITY_CORRECTION === '1' ? 'direct' : 'none')
  try {
    await expect.poll(() => page.evaluate(() => document.querySelector('#media').readyState >= 2)).toBe(true)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => document.querySelector('#media').currentTime)).toBeGreaterThan(0.2)
    await page.locator('#pause').click()
    await page.evaluate(() => {
      document.querySelector('#media').currentTime = 3.008
    })
    await expect.poll(() => page.evaluate(() => !document.querySelector('#media').seeking)).toBe(true)
    await page.locator('#quality').click()
    await expect.poll(() => page.evaluate(() => window.nativeRestarts.length)).toBe(1)
    await expect.poll(() => page.evaluate(() => {
      const video = document.querySelector('#media')
      return !video.seeking && video.readyState >= 2
    })).toBe(true)
    const state = await page.evaluate(() => {
      const video = document.querySelector('#media')
      return { time: video.currentTime, target: window.nativeRestoreTarget, corrections: window.nativeCorrections, correctionMode: window.nativeCorrectionMode, paused: video.paused, error: video.error?.code || null, artplayerLoaded: typeof window.Artplayer !== 'undefined' }
    })
    await testInfo.attach('native-quality-position', { contentType: 'application/json', body: JSON.stringify(state) })
    expect(state.artplayerLoaded).toBe(false)
    expect(state.time).toBeCloseTo(state.target, 1)
    expect(state.paused).toBe(true)
    expect(state.error).toBeNull()
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => document.querySelector('#media').currentTime)).toBeGreaterThan(state.time + 0.2)
  }
  finally {
    await readChapterTiming(page, testInfo)
    await page.evaluate(() => {
      const video = document.querySelector('#media')
      video.pause()
      video.removeAttribute('src')
      video.load()
    })
  }
})
