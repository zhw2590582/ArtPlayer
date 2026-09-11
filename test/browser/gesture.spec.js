import { expect, test } from './fixtures.js'

async function setup(page, core, primeMedia = true) {
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'ArtPlayer Android gesture fixture' }))
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => {
    window.events = []
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, gesture: true })
    window.touch = (target, type, points) => {
      const event = new Event(type, { bubbles: true, cancelable: true })
      Object.defineProperty(event, 'touches', { value: points.map(([pageX, pageY, identifier = 1]) => ({ pageX, pageY, clientX: pageX, clientY: pageY, identifier })) })
      target.dispatchEvent(event)
      return event
    }
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  if (!primeMedia)
    return
  await page.evaluate(() => window.art.play())
  await expect.poll(() => page.evaluate(() => window.art.currentTime > 0.1)).toBe(true)
  await page.evaluate(() => window.art.pause())
  await expect.poll(() => page.evaluate(() => window.art.template.$video.paused && !window.art.template.$video.seeking)).toBe(true)
  await page.evaluate(() => {
    window.art.currentTime = 2
  })
  await expect.poll(() => page.evaluate(() => !window.art.template.$video.seeking && Math.abs(window.art.currentTime - 2) < 0.1)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: a gesture before first play still issues the requested seek`, async ({ page }) => {
    await setup(page, core, false)
    expect(await page.evaluate(() => {
      const art = window.art
      const start = art.currentTime
      const expected = start + art.duration * 0.1 * art.constructor.TOUCH_MOVE_RATIO
      const requests = []
      art.on('seek', (time, requested) => requests.push(requested))
      window.touch(art.template.$video, 'touchstart', [[100, 100]])
      window.touch(art.template.$video, 'touchmove', [[100 + art.width * 0.1, 100]])
      art.destroy()
      return { count: requests.length, valid: Math.abs(requests[0] - expected) < 0.000001 }
    })).toEqual({ count: 1, valid: true })
  })

  test(`${core}: progress touch keeps absolute position and bar-before-seek ordering`, async ({ page }) => {
    await setup(page, core)
    const result = await page.evaluate(() => {
      const art = window.art
      const progress = art.template.$progress
      const rect = progress.getBoundingClientRect()
      const calls = []
      art.on('setBar', (kind, value, event) => {
        if (event?.type === 'touchstart')
          calls.push(['bar', value, event])
      })
      art.on('seek', (time, requested) => calls.push(['seek', requested]))
      const event = window.touch(progress, 'touchstart', [[rect.left + progress.clientWidth / 2, rect.top]])
      window.touch(document, 'touchend', [])
      return { order: calls.map(item => item[0]), percentage: calls[0][1], identity: calls[0][2] === event, requested: calls[1][1], expected: art.duration / 2 }
    })
    expect(result.order).toEqual(['bar', 'seek'])
    expect(result.percentage).toBeCloseTo(0.5, 6)
    expect(result.identity).toBe(true)
    expect(result.requested).toBeCloseTo(result.expected, 6)
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeCloseTo(result.expected, 1)
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: destroy during absolute progress touch stops the following seek`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const progress = art.template.$progress
      const rect = progress.getBoundingClientRect()
      let seeks = 0
      art.on('seek', () => seeks++)
      art.on('setBar', (kind, value, event) => {
        if (event?.type === 'touchstart')
          art.destroy()
      })
      window.touch(progress, 'touchstart', [[rect.left + progress.clientWidth / 2, rect.top]])
      return { seeks, destroyed: art.isDestroy }
    })).toEqual({ seeks: core === 'candidate' ? 0 : 1, destroyed: true })
  })

  test(`${core}: normal touch drag keeps seek/bar ordering and original touch identity`, async ({ page }) => {
    await setup(page, core)
    const result = await page.evaluate(() => {
      const art = window.art
      const video = art.template.$video
      const calls = []
      const start = art.currentTime
      const expected = start + art.duration * 0.2 * art.constructor.TOUCH_MOVE_RATIO
      art.on('seek', (time, requested) => calls.push(['seek', requested]))
      art.on('setBar', (kind, percentage, event) => {
        if (event?.type === 'touchmove')
          calls.push(['bar', kind, percentage, event])
      })
      window.touch(video, 'touchstart', [[100, 100]])
      const event = window.touch(video, 'touchmove', [[100 + art.width * 0.2, 100]])
      window.touch(document, 'touchend', [])
      return { expected, order: calls.map(item => item[0]), requested: calls[0][1], percentage: calls[1][2], identity: calls[1][3] === event }
    })
    expect(result.order).toEqual(['seek', 'bar'])
    expect(result.identity).toBe(true)
    expect(result.requested).toBeCloseTo(result.expected, 6)
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeCloseTo(result.expected, 1)
    await page.evaluate(() => window.art.destroy())
  })

  for (const cause of ['cancel', 'lock', 'multitouch', 'identifier']) {
    test(`${core}: ${cause} invalidates an in-progress gesture`, async ({ page }) => {
      await setup(page, core)
      expect(await page.evaluate((cause) => {
        const art = window.art
        const video = art.template.$video
        const seeks = []
        art.on('seek', (time, requested) => seeks.push(requested))
        window.touch(video, 'touchstart', [[100, 100]])
        window.touch(video, 'touchmove', [[100 + art.width * 0.1, 100]])
        if (cause === 'cancel')
          window.touch(video, 'touchcancel', [])
        if (cause === 'lock')
          art.isLock = true
        if (cause === 'multitouch')
          window.touch(video, 'touchmove', [[150, 100], [200, 100, 2]])
        window.touch(video, 'touchmove', [[100 + art.width * 0.3, 100, cause === 'identifier' ? 2 : 1]])
        art.destroy()
        return seeks.length
      }, cause)).toBe(core === 'candidate' ? 1 : 2)
    })
  }

  test(`${core}: destroy from a touch seek callback prevents the later progress notification`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const video = art.template.$video
      let bars = 0
      art.on('seek', () => art.destroy())
      art.on('setBar', (kind, value, event) => {
        if (event?.type === 'touchmove')
          bars++
      })
      window.touch(video, 'touchstart', [[100, 100]])
      window.touch(video, 'touchmove', [[100 + art.width * 0.1, 100]])
      return { bars, destroyed: art.isDestroy }
    })).toEqual({ bars: core === 'candidate' ? 0 : 1, destroyed: true })
  })
}
