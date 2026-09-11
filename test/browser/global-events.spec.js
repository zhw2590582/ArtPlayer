import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const action of ['rebind', 'destroy']) {
  test(`candidate: ${action} during native global registration cancels the interrupted binding`, async ({ page }) => {
    await setup(page, 'candidate')
    expect(await page.evaluate((action) => {
      const art = window.art
      const frames = [document.createElement('iframe'), document.createElement('iframe')]
      frames.forEach(frame => document.body.append(frame))
      const [interrupted, newest] = frames
      const target = interrupted.contentDocument
      const original = target.addEventListener
      target.addEventListener = function (name, ...args) {
        if (name === 'click') {
          if (action === 'destroy')
            art.destroy()
          else
            art.events.bindGlobalEvents({ document: newest.contentDocument, window: newest.contentWindow })
        }
        return original.call(this, name, ...args)
      }
      const received = []
      art.on('document:mouseup', event => received.push(event.target === newest.contentDocument ? 'newest' : 'stale'))
      art.events.bindGlobalEvents({ document: target, window: interrupted.contentWindow })
      document.dispatchEvent(new Event('mouseup'))
      for (const frame of frames)
        frame.contentDocument.dispatchEvent(new frame.contentWindow.Event('mouseup'))
      if (!art.isDestroy)
        art.destroy()
      target.addEventListener = original
      for (const frame of frames)
        frame.remove()
      return { received, remaining: art.events.destroyEvents.size }
    }, action)).toEqual({ received: action === 'rebind' ? ['newest'] : [], remaining: 0 })
  })
}

for (const core of ['published', 'candidate']) {
  test(`${core}: global rebinding forwards original events once and releases the previous document`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const frame = document.createElement('iframe')
      document.body.append(frame)
      const next = frame.contentDocument
      const events = []
      art.on('document:mouseup', event => events.push(event))
      const first = new Event('mouseup')
      document.dispatchEvent(first)
      const returned = art.events.bindGlobalEvents({ document: next, window: frame.contentWindow })
      art.events.bindGlobalEvents({ document: next, window: frame.contentWindow })
      document.dispatchEvent(new Event('mouseup'))
      const second = new frame.contentWindow.Event('mouseup')
      next.dispatchEvent(second)
      art.destroy()
      next.dispatchEvent(new frame.contentWindow.Event('mouseup'))
      frame.remove()
      return { count: events.length, identity: events[0] === first && events[1] === second, returned: typeof returned }
    })).toEqual({ count: 2, identity: true, returned: 'undefined' })
  })

  test(`${core}: failed global rebinding keeps the previous document and removes partial new listeners`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const frame = document.createElement('iframe')
      document.body.append(frame)
      const next = frame.contentDocument
      const original = next.addEventListener
      const failure = new Error('document listener denied')
      next.addEventListener = function (name, ...args) {
        if (name === 'keydown')
          throw failure
        return original.call(this, name, ...args)
      }
      const received = []
      art.on('document:mouseup', event => received.push(event.target === document ? 'old' : 'new'))
      let sameError = false
      try {
        art.events.bindGlobalEvents({ document: next, window: frame.contentWindow })
      }
      catch (error) {
        sameError = error === failure
      }
      next.addEventListener = original
      document.dispatchEvent(new Event('mouseup'))
      next.dispatchEvent(new frame.contentWindow.Event('mouseup'))
      art.destroy()
      frame.remove()
      return { received, sameError }
    })).toEqual({ received: core === 'candidate' ? ['old'] : ['new'], sameError: true })
  })
}
