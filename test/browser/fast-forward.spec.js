import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'ArtPlayer Android long-press fixture' }))
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => {
    window.Artplayer.FAST_FORWARD_TIME = 20
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, fastForward: true })
    window.touch = (type, count = 1) => {
      const event = new Event(type, { bubbles: true, cancelable: true })
      Object.defineProperty(event, 'touches', { value: Array.from({ length: count }, (_, identifier) => ({ identifier, pageX: 50, pageY: 50, clientX: 50, clientY: 50 })) })
      window.art.template.$video.dispatchEvent(event)
    }
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.evaluate(() => window.art.play())
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
  await page.evaluate(() => {
    window.art.playbackRate = 1.5
  })
}

for (const core of ['published', 'candidate']) {
  test(`${core}: native source reset retains its default playback rate behavior`, async ({ page }) => {
    await setup(page, core)
    await page.evaluate(() => {
      window.art.url = '/test/pattern.mp4?reset=1'
    })
    await expect.poll(() => page.evaluate(() => window.art.playbackRate)).toBe(1)
    expect(await page.evaluate(() => window.art.template.$video.defaultPlaybackRate)).toBe(1)
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: long press accelerates real playback and restores its prior rate`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => Object.keys(window.art.plugins.fastForward))).toEqual(['name', 'state'])
    await page.evaluate(() => window.touch('touchstart'))
    await expect.poll(() => page.evaluate(() => window.art.plugins.fastForward.state)).toBe(true)
    expect(await page.evaluate(() => window.art.playbackRate)).toBe(3)
    await page.evaluate(() => window.touch('touchend', 0))
    expect(await page.evaluate(() => ({ state: window.art.plugins.fastForward.state, rate: window.art.playbackRate }))).toEqual({ state: false, rate: 1.5 })
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: touchcancel releases an active long press`, async ({ page }) => {
    await setup(page, core)
    await page.evaluate(() => window.touch('touchstart'))
    await expect.poll(() => page.evaluate(() => window.art.plugins.fastForward.state)).toBe(true)
    await page.evaluate(() => window.touch('touchcancel', 0))
    expect(await page.evaluate(() => ({ state: window.art.plugins.fastForward.state, rate: window.art.playbackRate }))).toEqual({ state: core === 'published', rate: core === 'published' ? 3 : 1.5 })
    await page.evaluate(() => {
      window.touch('touchend', 0)
      window.art.destroy()
    })
  })
}

for (const action of ['lock', 'pause', 'source', 'destroy']) {
  test(`candidate: ${action} restores the active long-press rate`, async ({ page }) => {
    await setup(page, 'candidate')
    await page.evaluate(() => window.touch('touchstart'))
    await expect.poll(() => page.evaluate(() => window.art.plugins.fastForward.state)).toBe(true)
    await page.evaluate((action) => {
      const art = window.art
      if (action === 'lock') {
        art.isLock = true
        art.emit('lock', true)
      }
      else if (action === 'pause') {
        art.pause()
      }
      else if (action === 'source') {
        const video = art.template.$video
        const rate = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate')
        window.restoredRates = []
        Object.defineProperty(video, 'playbackRate', {
          configurable: true,
          get() {
            return rate.get.call(this)
          },
          set(value) {
            window.restoredRates.push(value)
            rate.set.call(this, value)
          },
        })
        art.url = '/test/pattern.mp4?replacement=1'
      }
      else {
        art.destroy(false)
      }
    }, action)
    await expect.poll(() => page.evaluate(() => ({ state: window.art.plugins.fastForward.state, rate: window.art.playbackRate }))).toEqual({ state: false, rate: action === 'source' ? 1 : 1.5 })
    if (action === 'source')
      expect(await page.evaluate(() => window.restoredRates)).toEqual([1.5])
    await page.evaluate(() => window.art.destroy())
  })
}

test('candidate: repeated pending touches own a single timer which destruction cancels', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    art.constructor.FAST_FORWARD_TIME = 24734
    const set = window.setTimeout
    const clear = window.clearTimeout
    const pending = new Set()
    const callbacks = []
    window.setTimeout = function (callback, delay, ...args) {
      const timer = set.call(this, callback, delay, ...args)
      if (delay === 24734) {
        pending.add(timer)
        callbacks.push(callback)
      }
      return timer
    }
    window.clearTimeout = function (timer) {
      pending.delete(timer)
      return clear.call(this, timer)
    }
    window.touch('touchstart')
    window.touch('touchstart')
    const scheduled = pending.size
    art.destroy(false)
    const resetRate = art.playbackRate
    for (const callback of callbacks)
      callback()
    const result = { scheduled, remaining: pending.size, state: art.plugins.fastForward.state, resetRate, rate: art.playbackRate }
    window.setTimeout = set
    window.clearTimeout = clear
    return result
  })).toEqual({ scheduled: 1, remaining: 0, state: false, resetRate: 1, rate: 1 })
})
