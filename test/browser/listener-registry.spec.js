import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: null options preserve the native default and callbacks can be removed directly`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const target = document.createElement('div')
      let hits = 0
      let failed = false
      const callback = () => hits++
      try {
        const remove = art.events.proxy(target, 'example', callback, null)
        target.dispatchEvent(new Event('example'))
        remove()
        target.dispatchEvent(new Event('example'))
      }
      catch {
        failed = true
      }
      art.destroy()
      return { hits, failed }
    })).toEqual({ hits: 1, failed: false })
  })

  test(`${core}: once and abort use native event identity and permit subsequent registration`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const target = document.createElement('div')
      const seen = []
      const event = new Event('example')
      const callback = function (received) {
        seen.push(this === target && received === event)
      }
      const once = art.events.proxy(target, 'example', callback, { once: true })
      target.dispatchEvent(event)
      target.dispatchEvent(event)
      once()
      const controller = new AbortController()
      const aborted = art.events.proxy(target, 'example', callback, { signal: controller.signal })
      target.dispatchEvent(event)
      controller.abort()
      target.dispatchEvent(event)
      aborted()
      const skipped = art.events.proxy(target, 'example', callback, { signal: controller.signal })
      target.dispatchEvent(event)
      skipped()
      art.events.proxy(target, 'example', callback)
      target.dispatchEvent(event)
      art.destroy()
      target.dispatchEvent(event)
      return seen
    })).toEqual([true, true, true])
  })

  test(`${core}: direct event disposer preserves native callback identity and releases bookkeeping`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const target = document.createElement('div')
      let hits = 0
      const callback = () => hits++
      const before = art.events.destroyEvents.size
      const remove = art.events.proxy(target, 'example', callback)
      target.removeEventListener('example', callback)
      target.dispatchEvent(new Event('example'))
      const returned = remove()
      const result = { hits, returned: typeof returned, remaining: art.events.destroyEvents.size - before }
      art.destroy()
      return result
    })).toEqual({ hits: 0, returned: 'undefined', remaining: core === 'candidate' ? 0 : 1 })
  })

  test(`${core}: changing capture options after registration cannot prevent cleanup`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const target = document.createElement('div')
      let hits = 0
      const options = { capture: true }
      const remove = art.events.proxy(target, 'example', () => hits++, options)
      options.capture = false
      remove()
      target.dispatchEvent(new Event('example'))
      art.destroy()
      return hits
    })).toBe(core === 'candidate' ? 0 : 1)
  })

  test(`${core}: partially failing array registration rolls back the listeners it created`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const target = document.createElement('div')
      const original = target.addEventListener
      const failure = new Error('second registration denied')
      target.addEventListener = function (name, ...args) {
        if (name === 'second')
          throw failure
        return original.call(this, name, ...args)
      }
      let hits = 0
      let sameError = false
      const before = art.events.destroyEvents.size
      try {
        art.events.proxy(target, ['first', 'second'], () => hits++)
      }
      catch (error) {
        sameError = error === failure
      }
      target.addEventListener = original
      target.dispatchEvent(new Event('first'))
      const result = { hits, sameError, remaining: art.events.destroyEvents.size - before }
      art.destroy()
      return result
    })).toEqual({ hits: core === 'candidate' ? 0 : 1, sameError: true, remaining: core === 'candidate' ? 0 : 1 })
  })

  test(`${core}: registration throwing after native add does not leave an untracked listener`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const target = document.createElement('div')
      const original = target.addEventListener
      const failure = new Error('after native add')
      target.addEventListener = function (...args) {
        original.apply(this, args)
        throw failure
      }
      let hits = 0
      let sameError = false
      try {
        art.events.proxy(target, 'example', () => hits++)
      }
      catch (error) {
        sameError = error === failure
      }
      target.addEventListener = original
      target.dispatchEvent(new Event('example'))
      art.destroy()
      return { hits, sameError }
    })).toEqual({ hits: core === 'candidate' ? 0 : 1, sameError: true })
  })
}
