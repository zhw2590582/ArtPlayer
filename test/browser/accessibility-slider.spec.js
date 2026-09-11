import { expect, test } from './fixtures.js'

async function setup(page, options = {}) {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate((options) => {
    const before = document.createElement('button')
    before.id = 'before-player'
    before.textContent = 'Before player'
    document.body.prepend(before)
    window.Artplayer.SEEK_STEP = 0.5
    window.Artplayer.VOLUME_STEP = 0.05
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, hotkey: true, ...options })
    window.sliderEvents = []
    window.art.on('hotkey', event => window.sliderEvents.push(['hotkey', event.code]))
    window.art.on('seek', (actual, value) => window.sliderEvents.push(['seek', value]))
    window.art.on('setBar', (kind, ratio, event) => {
      if (kind === 'played')
        window.sliderEvents.push(['setBar', ratio, event?.type ?? null])
    })
  }, options)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.locator('#before-player').focus()
  await page.keyboard.press('Tab')
  if (await page.locator('.art-video').evaluate(element => element.ownerDocument.activeElement === element))
    await page.keyboard.press('Tab')
  await expect(page.locator('.art-control-progress')).toBeFocused()
}

test('candidate: progress is the first control, seeks with owned keys and follows actual media time', async ({ page }) => {
  await setup(page)
  const slider = page.locator('.art-control-progress')
  await expect(slider).toHaveAttribute('role', 'slider')
  await expect(slider).toHaveAttribute('aria-label', 'Progress')
  await expect(slider).toHaveAttribute('aria-disabled', 'false')
  await page.evaluate(() => {
    window.art.currentTime = 1
  })
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeCloseTo(1, 1)
  await expect.poll(() => page.evaluate(() => window.art.video.seeking)).toBe(false)
  await expect.poll(() => page.evaluate(() => Math.abs(Number(document.querySelector('.art-control-progress').getAttribute('aria-valuenow')) - window.art.currentTime))).toBeLessThan(0.001)
  const start = await page.evaluate(() => window.art.currentTime)
  await page.evaluate(() => {
    window.sliderEvents.length = 0
  })
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeCloseTo(start + 0.5, 1)
  await expect.poll(() => page.evaluate(() => Math.abs(Number(document.querySelector('.art-control-progress').getAttribute('aria-valuenow')) - window.art.currentTime))).toBeLessThan(0.001)
  const events = await page.evaluate(() => window.sliderEvents)
  expect(events.slice(0, 2)).toEqual([['setBar', (start + 0.5) / await page.evaluate(() => window.art.duration), null], ['seek', start + 0.5]])
  await page.keyboard.press('ArrowUp')
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeCloseTo(2, 1)
  expect(await page.evaluate(() => window.art.volume)).toBe(0.7)
  await page.keyboard.press('Home')
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeCloseTo(0, 1)
  await page.keyboard.press('End')
  await expect.poll(() => page.evaluate(() => Math.abs(window.art.currentTime - window.art.duration))).toBeLessThan(0.1)
  await page.keyboard.press('PageDown')
  try {
    await expect.poll(() => page.evaluate(() => Math.abs(window.art.currentTime - Math.max(0, window.art.duration - 5)))).toBeLessThan(0.1)
  }
  finally {
    await test.info().attach('slider-after-pagedown', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({
      events: window.sliderEvents,
      focus: document.activeElement?.className,
      currentTime: window.art.currentTime,
      duration: window.art.duration,
      seeking: window.art.video.seeking,
      ended: window.art.video.ended,
      paused: window.art.video.paused,
    }))) })
  }
  expect(await page.evaluate(() => window.sliderEvents.filter(event => event[0] === 'hotkey'))).toEqual([])
  await expect(slider).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.art-control-playAndPause')).toBeFocused()
})

test('candidate: volume panel opens from keyboard focus and the slider unmutes without seeking', async ({ page }) => {
  await setup(page)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.locator('.art-icon-volumeClose')).toBeFocused()
  const slider = page.locator('.art-volume-slider')
  await expect(slider).toBeVisible()
  await expect.poll(() => page.locator('.art-volume-panel').evaluate(element => getComputedStyle(element).opacity)).toBe('1')
  await page.keyboard.press('Tab')
  await expect(slider).toBeFocused()
  await expect(slider).toHaveAttribute('aria-label', 'Volume')
  await expect(slider).toHaveAttribute('aria-orientation', 'vertical')
  await expect(slider).toHaveAttribute('aria-valuenow', '0')
  await page.keyboard.press('ArrowUp')
  await expect.poll(() => page.evaluate(() => window.art.volume)).toBeCloseTo(0.05, 5)
  expect(await page.evaluate(() => window.art.muted)).toBe(false)
  await expect(slider).toHaveAttribute('aria-valuetext', '5%')
  await page.keyboard.press('PageUp')
  await expect.poll(() => page.evaluate(() => window.art.volume)).toBeCloseTo(0.55, 5)
  await page.keyboard.press('End')
  await expect.poll(() => page.evaluate(() => window.art.volume)).toBe(1)
  await page.keyboard.press('Home')
  await expect.poll(() => page.evaluate(() => window.art.volume)).toBe(0)
  expect(await page.evaluate(() => window.art.currentTime)).toBe(0)
  expect(await page.evaluate(() => window.sliderEvents.filter(event => ['seek', 'hotkey'].includes(event[0])))).toEqual([])
  await expect(slider).toBeFocused()
  await page.locator('#before-player').focus()
  await expect.poll(() => page.locator('.art-volume-panel').evaluate(element => getComputedStyle(element).visibility)).toBe('hidden')
})

test('candidate: unknown duration disables progress until metadata returns and labels use i18n', async ({ page }) => {
  await setup(page, { lang: 'zh-cn' })
  const slider = page.locator('.art-control-progress')
  await expect(slider).toHaveAttribute('aria-label', '播放进度')
  await page.evaluate(() => {
    Object.defineProperty(window.art.video, 'duration', { configurable: true, value: Infinity })
    window.art.video.dispatchEvent(new Event('durationchange'))
    window.sliderEvents.length = 0
  })
  await expect(slider).toHaveAttribute('aria-disabled', 'true')
  await expect(slider).toHaveAttribute('aria-valuemax', '0')
  await page.keyboard.press('End')
  await page.keyboard.press('ArrowRight')
  expect(await page.evaluate(() => window.sliderEvents)).toEqual([])
  await page.evaluate(() => {
    delete window.art.video.duration
    window.art.video.dispatchEvent(new Event('durationchange'))
  })
  await expect(slider).toHaveAttribute('aria-disabled', 'false')
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeCloseTo(0.5, 1)
})

test('candidate: progress removal and volume destruction inside callbacks cancel pending writes', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    const remove = (kind, ratio) => {
      if (kind === 'played' && ratio > 0) {
        window.art.off('setBar', remove)
        window.art.controls.remove('progress')
      }
    }
    window.art.on('setBar', remove)
    window.sliderEvents.length = 0
  })
  await page.keyboard.press('ArrowRight')
  expect(await page.evaluate(() => window.art.currentTime)).toBe(0)
  expect(await page.evaluate(() => window.sliderEvents.filter(event => event[0] === 'seek'))).toEqual([])
  await page.locator('.art-icon-volumeClose').focus()
  await page.keyboard.press('Tab')
  await expect(page.locator('.art-volume-slider')).toBeFocused()
  await page.evaluate(() => {
    window.savedVideo = window.art.video
    window.art.once('muted', () => window.art.destroy(false))
  })
  await page.keyboard.press('ArrowUp')
  expect(await page.evaluate(() => window.savedVideo.volume)).toBe(0.7)
})
