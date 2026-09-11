import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => {
    const maps = [
      ['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenchange'],
      ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitfullscreenchange'],
      ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitfullscreenchange'],
      ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozfullscreenchange'],
      ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'MSFullscreenChange'],
    ]
    window.fullscreenAPI = maps.find(([, exit]) => exit in document)
    window.createPlayer('/test/pattern.mp4')
    window.art.template.$container.id = 'native-fullscreen-main'
    const container = document.createElement('div')
    Object.assign(container.style, { width: '320px', height: '180px' })
    document.body.append(container)
    window.other = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true })
    window.fullscreenEvents = [[], []]
    window.art.on('fullscreen', value => window.fullscreenEvents[0].push(value))
    window.other.on('fullscreen', value => window.fullscreenEvents[1].push(value))
    document.querySelector('#play').onclick = () => {
      window.art.fullscreen = true
    }
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady && window.other.isReady)).toBe(true)
  expect(await page.evaluate(() => Boolean(window.fullscreenAPI))).toBe(true)
}

test('candidate: void exit waits for the owned video to leave and accepts another owner as completion', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(async () => {
    const art = window.art
    const [, exitName, elementName, eventName] = window.fullscreenAPI
    const elementDescriptor = Object.getOwnPropertyDescriptor(document, elementName)
    const originalExit = document[exitName]
    let element = art.template.$video
    Object.defineProperty(document, elementName, { configurable: true, get: () => element })
    document.dispatchEvent(new Event(eventName))
    document[exitName] = () => undefined
    let settled = false
    const result = Object.getOwnPropertyDescriptor(art, 'fullscreen').set(false).then(() => settled = true)
    await new Promise(resolve => setTimeout(resolve, 0))
    const early = settled
    element = window.other.template.$player
    document.dispatchEvent(new Event(eventName))
    await result
    const completed = settled && !art.fullscreen && window.other.fullscreen
    element = null
    document.dispatchEvent(new Event(eventName))
    if (elementDescriptor)
      Object.defineProperty(document, elementName, elementDescriptor)
    else
      delete document[elementName]
    document[exitName] = originalExit
    art.destroy()
    window.other.destroy()
    return { early, completed }
  })).toEqual({ early: false, completed: true })
})

for (const core of ['published', 'candidate']) {
  test(`${core}: native fullscreen belongs to its player and other players cannot exit it`, async ({ page }) => {
    await setup(page, core)
    await page.click('#play')
    await expect.poll(() => page.evaluate(() => document[window.fullscreenAPI[2]] === window.art.template.$player)).toBe(true)
    await expect.poll(() => page.evaluate(() => window.fullscreenEvents[0])).toEqual([true])
    expect(await page.evaluate(() => ({ own: window.art.fullscreen, other: window.other.fullscreen, className: window.other.template.$player.classList.contains('art-fullscreen'), otherEvents: window.fullscreenEvents[1] }))).toEqual({ own: true, other: core === 'published', className: core === 'published', otherEvents: core === 'published' ? [true] : [] })
    await page.evaluate(async () => {
      await Object.getOwnPropertyDescriptor(window.other, 'fullscreen').set.call(window.other, false)
    })
    await expect.poll(() => page.evaluate(() => Boolean(document[window.fullscreenAPI[2]]))).toBe(core === 'candidate')
    await page.evaluate(async () => {
      if (document[window.fullscreenAPI[2]])
        await document[window.fullscreenAPI[1]]()
      window.art.destroy()
      window.other.destroy()
    })
  })

  test(`${core}: destroyed players stop receiving later native fullscreen events`, async ({ page }) => {
    await setup(page, core)
    await page.evaluate(() => window.other.destroy(false))
    await page.click('#play')
    await expect.poll(() => page.evaluate(() => window.fullscreenEvents[0])).toEqual([true])
    expect(await page.evaluate(() => ({ events: window.fullscreenEvents[1], className: window.other.template.$player.classList.contains('art-fullscreen') }))).toEqual({ events: core === 'published' ? [true] : [], className: core === 'published' })
    await page.evaluate(async () => {
      await document[window.fullscreenAPI[1]]()
      window.art.destroy()
    })
  })

  test(`${core}: rejected native fullscreen request removes its temporary change listener`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(async () => {
      const art = window.art
      const [request, , , change] = window.fullscreenAPI
      const add = document.addEventListener
      const remove = document.removeEventListener
      const active = new Set()
      document.addEventListener = function (name, callback, options) {
        if (name === change)
          active.add(callback)
        return add.call(this, name, callback, options)
      }
      document.removeEventListener = function (name, callback, options) {
        if (name === change)
          active.delete(callback)
        return remove.call(this, name, callback, options)
      }
      const failure = new Error('controlled fullscreen rejection')
      art.template.$player[request] = () => Promise.reject(failure)
      const rejected = await Object.getOwnPropertyDescriptor(art, 'fullscreen').set.call(art, true).then(() => false, error => error === failure)
      const result = { rejected, leaked: active.size }
      document.addEventListener = add
      document.removeEventListener = remove
      art.destroy()
      window.other.destroy()
      return result
    })).toEqual({ rejected: true, leaked: core === 'published' ? 1 : 0 })
  })
}

test('candidate: fullscreen assignment rejection shows notice without an unhandled rejection', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(() => {
    const [request] = window.fullscreenAPI
    window.art.template.$player[request] = () => Promise.reject(new Error('controlled assignment denial'))
    window.art.fullscreen = true
  })
  await expect(page.locator('#native-fullscreen-main .art-notice')).toContainText('controlled assignment denial')
  await page.evaluate(() => {
    window.art.destroy()
    window.other.destroy()
  })
})

test('candidate: reentrant entry preserves real fullscreen UI and event order', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(() => {
    window.fullscreenOrder = []
    window.art.on('fullscreen', (value) => {
      if (value) {
        window.fullscreenOrder.push(['fullscreen', window.art.template.$player.classList.contains('art-fullscreen')])
        window.art.fullscreen = true
      }
    })
    window.art.on('resize', () => {
      if (window.art.fullscreen)
        window.fullscreenOrder.push(['resize', window.art.template.$player.classList.contains('art-fullscreen')])
    })
  })
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.art.fullscreen && window.art.template.$player.classList.contains('art-fullscreen'))).toBe(true)
  expect(await page.evaluate(() => window.fullscreenOrder.slice(0, 2))).toEqual([['fullscreen', false], ['resize', true]])
  await page.evaluate(async () => {
    await document[window.fullscreenAPI[1]]()
    window.art.destroy()
    window.other.destroy()
  })
})

for (const mode of ['promise-exit', 'promise-destroy', 'void-exit', 'void-destroy']) {
  test(`candidate: pending native entry ${mode} releases a late own entry`, async ({ page }) => {
    await setup(page, 'candidate')
    expect(await page.evaluate(async (mode) => {
      const art = window.art
      const [request, exit, element, change] = window.fullscreenAPI
      const originalExit = document[exit]
      const originalElement = Object.getOwnPropertyDescriptor(document, element)
      let current = null
      let complete
      let exits = 0
      Object.defineProperty(document, element, { configurable: true, get: () => current })
      art.template.$player[request] = () => {
        if (mode.startsWith('promise'))
          return new Promise(resolve => complete = resolve)
        complete = () => document.dispatchEvent(new Event(change))
      }
      document[exit] = () => {
        exits++
        current = null
        document.dispatchEvent(new Event(change))
        return Promise.resolve()
      }
      const setter = Object.getOwnPropertyDescriptor(art, 'fullscreen').set
      const pending = setter.call(art, true)
      if (mode.endsWith('destroy'))
        art.destroy(false)
      else
        await setter.call(art, false)
      await pending
      current = art.template.$player
      complete()
      // Flush the request's native Promise observer and setter settlement chain.
      await new Promise(resolve => setTimeout(resolve, 0))
      const result = { exits, fullscreen: art.fullscreen, className: art.template.$player.classList.contains('art-fullscreen'), events: window.fullscreenEvents[0] }
      art.destroy()
      window.other.destroy()
      document[exit] = originalExit
      if (originalElement)
        Object.defineProperty(document, element, originalElement)
      else
        delete document[element]
      return result
    }, mode)).toEqual({ exits: 1, fullscreen: false, className: false, events: [] })
  })
}

test('candidate: cancelling an actual native request in the initiating click releases fullscreen', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(() => {
    window.entrySettled = false
    document.querySelector('#play').onclick = () => {
      const setter = Object.getOwnPropertyDescriptor(window.art, 'fullscreen').set
      const entering = setter.call(window.art, true)
      window.art.fullscreen = false
      void entering.then(() => window.entrySettled = true)
    }
  })
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.entrySettled && !document[window.fullscreenAPI[2]])).toBe(true)
  await page.evaluate(() => {
    window.art.destroy()
    window.other.destroy()
  })
})

test('candidate: rejected exit retains actual fullscreen state and can be retried', async ({ page }) => {
  await setup(page, 'candidate')
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.art.template.$player.classList.contains('art-fullscreen'))).toBe(true)
  expect(await page.evaluate(async () => {
    const [, exit] = window.fullscreenAPI
    const originalExit = document[exit]
    const failure = new Error('controlled exit denial')
    document[exit] = () => Promise.reject(failure)
    const setter = Object.getOwnPropertyDescriptor(window.art, 'fullscreen').set
    const rejected = await setter.call(window.art, false).then(() => false, error => error === failure)
    const result = { rejected, fullscreen: window.art.fullscreen, className: window.art.template.$player.classList.contains('art-fullscreen') }
    document[exit] = originalExit
    await setter.call(window.art, false)
    return result
  })).toEqual({ rejected: true, fullscreen: true, className: true })
  await expect.poll(() => page.evaluate(() => window.art.fullscreen || window.art.template.$player.classList.contains('art-fullscreen'))).toBe(false)
  await page.evaluate(() => {
    window.art.destroy()
    window.other.destroy()
  })
})
