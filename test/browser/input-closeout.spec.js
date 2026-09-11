import { expect, test } from './fixtures.js'

async function setup(page, mobile = false) {
  if (mobile)
    await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'ArtPlayer Android closeout fixture' }))
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => {
    window.Artplayer.SCROLL_TIME = 0
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, gesture: true })
    window.touch = (target, name, x, y) => {
      const event = new Event(name, { bubbles: true })
      Object.defineProperty(event, 'touches', { value: [{ identifier: 1, pageX: x, pageY: y, clientX: x, clientY: y }] })
      target.dispatchEvent(event)
    }
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

test('candidate closeout: restoring a removed default hotkey keeps identity and real playback', async ({ page }) => {
  await setup(page)
  expect(await page.evaluate(() => {
    const art = window.art
    const original = art.hotkey.keys.Space[0]
    art.hotkey.remove('Space', original)
    const absent = !art.hotkey.keys.Space
    art.hotkey.init()
    art.hotkey.init()
    art.isFocus = true
    return { absent, count: art.hotkey.keys.Space.length, identity: art.hotkey.keys.Space[0] === original }
  })).toEqual({ absent: true, count: 1, identity: true })
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
  await page.evaluate(() => window.art.destroy())
})

test('candidate closeout: a failed native removal remains retryable and releases its record', async ({ page }) => {
  await setup(page)
  expect(await page.evaluate(() => {
    const art = window.art
    const target = document.createElement('div')
    const remove = target.removeEventListener
    const warning = console.warn
    const error = new Error('temporary removal failure')
    let deny = true
    let warnings = 0
    let hits = 0
    console.warn = (message, actual) => {
      if (actual === error)
        warnings++
    }
    target.removeEventListener = function (...args) {
      if (deny)
        throw error
      return remove.apply(this, args)
    }
    try {
      const dispose = art.events.proxy(target, 'example', () => hits++)
      art.events.remove(dispose)
      const retained = art.events.destroyEvents.has(dispose)
      target.dispatchEvent(new Event('example'))
      deny = false
      art.events.remove(dispose)
      target.dispatchEvent(new Event('example'))
      const released = !art.events.destroyEvents.has(dispose)
      art.destroy()
      return { retained, released, warnings, hits }
    }
    finally {
      console.warn = warning
      target.removeEventListener = remove
    }
  })).toEqual({ retained: true, released: true, warnings: 1, hits: 1 })
})

test('candidate closeout: destruction before native add returns cannot leave a late listener', async ({ page }) => {
  await setup(page)
  expect(await page.evaluate(() => {
    const art = window.art
    const target = document.createElement('div')
    const add = target.addEventListener
    let hits = 0
    target.addEventListener = function (...args) {
      art.destroy()
      return add.apply(this, args)
    }
    art.events.proxy(target, 'example', () => hits++)
    target.dispatchEvent(new Event('example'))
    return { hits, remaining: art.events.destroyEvents.size, destroyed: art.isDestroy }
  })).toEqual({ hits: 0, remaining: 0, destroyed: true })
})

test('candidate closeout: window registration failure restores the previous global binding', async ({ page }) => {
  await setup(page)
  expect(await page.evaluate(() => {
    const art = window.art
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const next = frame.contentWindow
    const add = next.addEventListener
    const failure = new Error('window registration failed after add')
    next.addEventListener = function (name, ...args) {
      add.call(this, name, ...args)
      if (name === 'scroll')
        throw failure
    }
    const received = []
    art.on('document:mouseup', event => received.push(event.target === document ? 'old-document' : 'new-document'))
    art.on('window:scroll', event => received.push(event.target === window ? 'old-window' : 'new-window'))
    let sameError = false
    try {
      art.events.bindGlobalEvents({ document: next.document, window: next })
    }
    catch (error) {
      sameError = error === failure
    }
    next.addEventListener = add
    next.document.dispatchEvent(new next.Event('mouseup'))
    next.dispatchEvent(new next.Event('scroll'))
    document.dispatchEvent(new Event('mouseup'))
    window.dispatchEvent(new Event('scroll'))
    art.destroy()
    frame.remove()
    return { sameError, received }
  })).toEqual({ sameError: true, received: ['old-document', 'old-window'] })
})

for (const cause of ['source', 'rotation', 'geometry']) {
  test(`candidate closeout: ${cause} changes cancel the old gesture in the installed player`, async ({ page }) => {
    await setup(page, true)
    expect(await page.evaluate((cause) => {
      const art = window.art
      const video = art.template.$video
      let seeks = 0
      art.on('seek', () => seeks++)
      window.touch(video, 'touchstart', 100, 100)
      if (cause === 'source')
        art.url = '/test/pattern.mp4?closeout=source'
      if (cause === 'rotation')
        art.isRotate = true
      if (cause === 'geometry') {
        art.template.$player.style.setProperty('width', '0px', 'important')
        art.template.$player.style.setProperty('min-width', '0px', 'important')
      }
      const before = seeks
      const width = art.width
      window.touch(video, 'touchmove', cause === 'rotation' ? 100 : 140, cause === 'rotation' ? 140 : 100)
      art.destroy()
      return { newSeeks: seeks - before, zeroWidth: cause !== 'geometry' || width === 0 }
    }, cause)).toEqual({ newSeeks: 0, zeroWidth: true })
  })
}

test('candidate closeout: adopted viewport retains exact gap boundaries', async ({ page }) => {
  await setup(page)
  expect(await page.evaluate(async () => {
    const art = window.art
    const frame = document.createElement('iframe')
    frame.style.cssText = 'height:100px;width:200px'
    document.body.append(frame)
    const container = art.template.$container
    container.style.cssText = 'position:absolute;top:150px;left:0;height:20px;width:20px'
    frame.contentDocument.body.append(container)
    art.events.bindGlobalEvents()
    art.constructor.SCROLL_GAP = 50
    const states = []
    art.on('view', value => states.push(value))
    frame.contentWindow.dispatchEvent(new Event('scroll'))
    await new Promise(resolve => setTimeout(resolve, 0))
    container.style.top = '151px'
    frame.contentWindow.dispatchEvent(new Event('scroll'))
    art.destroy()
    frame.remove()
    return states
  })).toEqual([true, false])
})
