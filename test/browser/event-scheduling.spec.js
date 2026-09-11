import { expect, test } from './fixtures.js'

async function setup(page, core, raf = false) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate((raf) => {
    window.Artplayer.SCROLL_TIME = 24731
    window.Artplayer.RESIZE_TIME = 0
    window.Artplayer.USE_RAF = raf
    const orientation = new EventTarget()
    orientation.onchange = null
    Object.defineProperty(window.screen, 'orientation', { configurable: true, value: orientation })
    window.createPlayer('/test/pattern.mp4')
  }, raf)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: actual animation frames follow playback and stop after destruction inside raf`, async ({ page }) => {
    await setup(page, core, true)
    await page.evaluate(() => {
      window.frameCount = 0
      window.art.on('raf', () => window.frameCount++)
      return window.art.play()
    })
    await expect.poll(() => page.evaluate(() => window.frameCount)).toBeGreaterThan(2)
    await page.evaluate(() => window.art.pause())
    const paused = await page.evaluate(() => window.frameCount)
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    expect(await page.evaluate(() => window.frameCount)).toBe(paused)
    await page.evaluate(() => {
      window.art.once('raf', () => window.art.destroy())
      return window.art.play()
    })
    await expect.poll(() => page.evaluate(() => window.art.isDestroy)).toBe(true)
    const destroyed = await page.evaluate(() => window.frameCount)
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    expect(await page.evaluate(() => window.frameCount)).toBe(destroyed)
  })

  test(`${core}: Events keeps its public fields, prototype and detached native methods`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const events = art.events
      const target = document.createElement('div')
      let hits = 0
      const { proxy, hover } = events
      const dispose = proxy(target, 'example', () => hits++)
      hover(target, () => hits++, () => hits++)
      target.dispatchEvent(new Event('example'))
      target.dispatchEvent(new Event('mouseenter'))
      target.dispatchEvent(new Event('mouseleave'))
      events.remove(dispose)
      target.dispatchEvent(new Event('example'))
      const result = { fields: Object.keys(events).sort(), prototype: Object.getOwnPropertyNames(Object.getPrototypeOf(events)).sort(), hits }
      art.destroy()
      return result
    })).toEqual({ fields: ['bindGlobalEvents', 'destroyEvents', 'hover', 'proxy'], prototype: ['constructor', 'destroy', 'hover', 'proxy', 'remove'], hits: 3 })
  })

  test(`${core}: screen orientation dispatch works when onchange has no assigned handler`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(async () => {
      const art = window.art
      let resized = 0
      art.on('resize', () => resized++)
      window.screen.orientation.dispatchEvent(new Event('change'))
      await new Promise(resolve => setTimeout(resolve, 30))
      art.destroy()
      return resized
    })).toBe(core === 'candidate' ? 1 : 0)
  })

  test(`${core}: destruction releases the scroll throttle reset timer`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const set = window.setTimeout
      const clear = window.clearTimeout
      const pending = new Set()
      window.setTimeout = function (callback, delay, ...args) {
        const timer = set.call(this, callback, delay, ...args)
        if (delay === 24731)
          pending.add(timer)
        return timer
      }
      window.clearTimeout = function (timer) {
        pending.delete(timer)
        return clear.call(this, timer)
      }
      try {
        art.emit('window:scroll', new Event('scroll'))
        const before = pending.size
        art.destroy()
        return { before, after: pending.size }
      }
      finally {
        for (const timer of pending)
          clear.call(window, timer)
        window.setTimeout = set
        window.clearTimeout = clear
      }
    })).toEqual({ before: 1, after: core === 'candidate' ? 0 : 1 })
  })

  test(`${core}: view visibility uses the container's current iframe viewport`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const frame = document.createElement('iframe')
      frame.style.cssText = 'width:200px;height:100px'
      document.body.append(frame)
      const container = art.template.$container
      container.style.cssText = 'position:absolute;top:250px;left:0;width:200px;height:100px'
      frame.contentDocument.body.append(container)
      art.events.bindGlobalEvents()
      const seen = []
      art.on('view', visible => seen.push(visible))
      frame.contentWindow.dispatchEvent(new Event('scroll'))
      art.destroy()
      frame.remove()
      return seen
    })).toEqual([core === 'published'])
  })
}
