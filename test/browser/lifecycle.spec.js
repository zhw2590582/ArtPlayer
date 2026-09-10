import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: repeated destroy preserves other live instances`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const { Artplayer } = window
      const create = () => {
        const container = document.createElement('div')
        document.body.append(container)
        return new Artplayer({ container, url: '/test/pattern.mp4', muted: true })
      }
      const first = create()
      const second = create()
      let destroys = 0
      first.on('destroy', () => destroys++)
      first.destroy(false)
      first.destroy(true)
      const result = {
        secondRegistered: Artplayer.instances.includes(second),
        retained: !!first.template.$container.querySelector('.art-destroy'),
        destroys,
        firstRemoved: !Artplayer.instances.includes(first),
      }
      second.destroy()
      return result
    })
    expect(result).toEqual({ secondRegistered: core === 'candidate', retained: core === 'candidate', destroys: core === 'candidate' ? 1 : 2, firstRemoved: true })
  })
}

test('candidate: constructor plugin failure restores original DOM and clears resources', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(async () => {
    const { Artplayer } = window
    const container = document.createElement('div')
    container.dataset.artId = 'original'
    container.innerHTML = '<button>original</button>'
    document.body.append(container)
    const original = container.firstChild
    let originalClicks = 0
    original.addEventListener('click', () => originalClicks++)
    const error = new Error('plugin init failure')
    let failed
    let observed
    let destroys = 0
    let mounted = 0
    let customTypes = 0
    let reservedDuringRollback = false
    try {
      void new Artplayer({
        container,
        url: '/test/pattern.mp4',
        customType: { mp4() { customTypes++ } },
        settings: [{ name: 'delayed', html: 'Delayed', mounted() { mounted++ } }],
        plugins: [(art) => {
          failed = art
          art.notice.show = 'temporary'
          art.on('destroy', () => {
            destroys++
            try {
              void new Artplayer({ container, url: '/test/pattern.mp4' })
            }
            catch (error) { reservedDuringRollback = error.message === 'Cannot mount multiple instances on the same dom element' }
            throw new Error('controlled plugin cleanup failure')
          })
          throw error
        }],
      })
    }
    catch (actual) { observed = actual === error }
    // A timer turn exposes cancelled mount/custom-type continuations.
    await new Promise(resolve => setTimeout(resolve, 0))
    original.click()
    const result = {
      observed,
      sameNode: container.firstChild === original,
      html: container.innerHTML,
      artId: container.dataset.artId,
      originalClicks,
      destroyed: failed.isDestroy,
      registered: Artplayer.instances.includes(failed),
      listeners: failed.events.destroyEvents.size,
      timer: failed.notice.timer,
      destroys,
      mounted,
      customTypes,
      reservedDuringRollback,
    }
    const replacement = new Artplayer({ container, url: '/test/pattern.mp4' })
    replacement.destroy()
    return result
  })
  expect(result).toEqual({ observed: true, sameNode: true, html: '<button>original</button>', artId: 'original', originalClicks: 1, destroyed: true, registered: false, listeners: 0, timer: null, destroys: 1, mounted: 0, customTypes: 0, reservedDuringRollback: true })
})

test('candidate: early proxy failure restores SSR nodes, attributes and text', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(() => {
    const container = document.createElement('div')
    container.innerHTML = window.Artplayer.html
    container.setAttribute('data-test', 'SSR')
    document.body.append(container)
    const original = container.innerHTML
    const video = container.querySelector('video')
    const player = container.querySelector('.art-video-player')
    const error = new Error('proxy failure')
    let sameError = false
    try {
      void new window.Artplayer({ container, useSSR: true, url: '/test/pattern.mp4', proxy() {
        player.setAttribute('data-modified', 'yes')
        player.append(document.createTextNode('changed'))
        throw error
      } })
    }
    catch (actual) { sameError = actual === error }
    return {
      sameError,
      sameHTML: original === container.innerHTML,
      sameVideo: video === container.querySelector('video'),
      artId: container.getAttribute('data-art-id'),
      data: container.getAttribute('data-test'),
      count: window.Artplayer.instances.length,
    }
  })
  expect(result).toEqual({ sameError: true, sameHTML: true, sameVideo: true, artId: null, data: 'SSR', count: 0 })
})

test('candidate: reentrant destroy keeps sequence and does not repeat callbacks', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(() => {
    const container = document.createElement('div')
    document.body.append(container)
    const art = new window.Artplayer({ container, url: '/test/pattern.mp4' })
    const calls = []
    let replacement
    const reset = art.reset.bind(art)
    art.reset = () => {
      calls.push(['reset', art.isDestroy])
      art.destroy(true)
      reset()
    }
    art.on('destroy', () => {
      calls.push(['destroy', art.isDestroy, window.Artplayer.instances.includes(art), art.events.destroyEvents.size, !!container.querySelector('.art-destroy')])
      art.destroy(true)
      replacement = new window.Artplayer({ container, url: '/test/pattern.mp4' })
    })
    art.destroy(false)
    art.destroy(true)
    const result = { calls, replacementRegistered: window.Artplayer.instances.includes(replacement), players: container.querySelectorAll('.art-video-player').length }
    replacement.destroy()
    return result
  })
  expect(result).toEqual({ calls: [['reset', false], ['destroy', true, false, 0, true]], replacementRegistered: true, players: 1 })
})

test('candidate: destroying cancels queued resize, notice, RAF, reconnect and mounted work', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(async () => {
    const { Artplayer } = window
    Artplayer.USE_RAF = true
    Artplayer.RESIZE_TIME = 0
    Artplayer.RECONNECT_SLEEP_TIME = 0
    const container = document.createElement('div')
    document.body.append(container)
    let mounted = 0
    const art = new Artplayer({ container, url: '/test/pattern.mp4', settings: [{ html: 'Delayed', mounted() {
      mounted++
    } }] })
    let resize = 0
    let reconnect = 0
    let raf = 0
    art.on('resize', () => resize++)
    art.on('error', () => reconnect++)
    art.on('raf', () => raf++)
    art.notice.show = 'before'
    art.emit('window:resize')
    art.emit('video:error', new Error('controlled retry'))
    art.destroy(false)
    const html = container.innerHTML
    await new Promise(resolve => requestAnimationFrame(resolve))
    await new Promise(resolve => setTimeout(resolve, 0))
    return {
      resize,
      reconnect,
      raf,
      mounted,
      timer: art.notice.timer,
      sameHTML: container.innerHTML === html,
      src: art.video.getAttribute('src'),
      listeners: art.events.destroyEvents.size,
    }
  })
  expect(result).toEqual({ resize: 0, reconnect: 0, raf: 0, mounted: 0, timer: null, sameHTML: true, src: null, listeners: 0 })
})

test('candidate: constructor can synchronously destroy without entering the registry', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(() => {
    const container = document.createElement('div')
    document.body.append(container)
    const art = new window.Artplayer({ container, url: '/test/pattern.mp4', plugins: [(art) => {
      art.destroy()
      return { name: 'closed' }
    }] })
    return { destroyed: art.isDestroy, count: window.Artplayer.instances.length, children: container.children.length }
  })
  expect(result).toEqual({ destroyed: true, count: 0, children: 0 })
})

test('candidate: partial Events initialization releases listeners before its property is assigned', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(() => {
    const container = document.createElement('div')
    container.innerHTML = '<span>before</span>'
    document.body.append(container)
    const add = EventTarget.prototype.addEventListener
    const remove = EventTarget.prototype.removeEventListener
    const active = []
    const error = new Error('controlled global listener failure')
    let failed
    let sameError = false
    EventTarget.prototype.addEventListener = function (name, callback, options) {
      if (this === window && name === 'orientationchange')
        throw error
      const result = add.call(this, name, callback, options)
      if (this === window || this === document)
        active.push({ target: this, name, callback })
      return result
    }
    EventTarget.prototype.removeEventListener = function (name, callback, options) {
      const result = remove.call(this, name, callback, options)
      const index = active.findIndex(item => item.target === this && item.name === name && item.callback === callback)
      if (index !== -1)
        active.splice(index, 1)
      return result
    }
    try {
      void new window.Artplayer({ container, url: '/test/pattern.mp4', proxy(art) {
        failed = art
        return document.createElement('video')
      } })
    }
    catch (actual) { sameError = actual === error }
    finally {
      EventTarget.prototype.addEventListener = add
      EventTarget.prototype.removeEventListener = remove
    }
    return { sameError, assigned: Object.hasOwn(failed, 'events'), active: active.length, destroyed: failed.isDestroy, html: container.innerHTML, count: window.Artplayer.instances.length }
  })
  expect(result).toEqual({ sameError: true, assigned: false, active: 0, destroyed: true, html: '<span>before</span>', count: 0 })
})

test('candidate: live resize still coalesces and destroy cancels the next burst', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => {
    const container = document.createElement('div')
    document.body.append(container)
    window.Artplayer.RESIZE_TIME = 0
    window.art = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true })
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  const result = await page.evaluate(async () => {
    const art = window.art
    let resized = 0
    art.on('resize', () => resized++)
    const first = new Promise(resolve => art.once('resize', resolve))
    window.dispatchEvent(new Event('resize'))
    window.dispatchEvent(new Event('resize'))
    await first
    const beforeDestroy = resized
    window.dispatchEvent(new Event('resize'))
    art.destroy()
    await new Promise(resolve => setTimeout(resolve, 0))
    return { beforeDestroy, resized, timer: art.notice.timer }
  })
  expect(result).toEqual({ beforeDestroy: 1, resized: 1, timer: null })
})

test('candidate: a container is reserved during reentrant initialization', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(() => {
    const container = document.createElement('div')
    document.body.append(container)
    let message
    const art = new window.Artplayer({ container, url: '/test/pattern.mp4', proxy() {
      try {
        void new window.Artplayer({ container, url: '/test/pattern.mp4' })
      }
      catch (error) { message = error.message }
      return document.createElement('video')
    } })
    const result = { message, registered: window.Artplayer.instances.includes(art), players: container.querySelectorAll('.art-video-player').length, count: window.Artplayer.instances.length }
    art.destroy()
    return result
  })
  expect(result).toEqual({ message: 'Cannot mount multiple instances on the same dom element', registered: true, players: 1, count: 1 })
})
