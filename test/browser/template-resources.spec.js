import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: native fullscreen uses a real gesture when the engine supports it`, async ({ page }, testInfo) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const capability = await page.evaluate(() => ({
      native: Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled),
      video: Boolean(window.art.video.webkitSupportsFullscreen),
    }))
    await testInfo.attach('native-fullscreen-capability', { contentType: 'application/json', body: JSON.stringify(capability) })
    if (!capability.native) {
      expect(await page.evaluate(() => Boolean(document.fullscreenElement || document.webkitFullscreenElement))).toBe(false)
      return
    }
    await page.evaluate(() => {
      window.fullscreenEvents = []
      window.art.on('fullscreen', value => window.fullscreenEvents.push(value))
      document.querySelector('#play').onclick = () => {
        window.art.fullscreen = true
      }
    })
    await page.click('#play')
    await expect.poll(() => page.evaluate(() => {
      const art = window.art
      return art.fullscreen && (document.fullscreenElement || document.webkitFullscreenElement) === art.template.$player && art.template.$player.classList.contains('art-fullscreen')
    })).toBe(true)
    await page.evaluate(() => {
      window.art.fullscreen = false
    })
    await expect.poll(() => page.evaluate(() => !window.art.fullscreen && !window.art.template.$player.classList.contains('art-fullscreen'))).toBe(true)
    expect(await page.evaluate(() => window.fullscreenEvents)).toEqual([true, false])
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: SSR mounting preserves nodes, listeners, selectors and style ownership`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const container = document.querySelector('.player')
      container.innerHTML = window.Artplayer.html
      const original = Array.from(container.querySelectorAll('*'))
      const video = container.querySelector('video')
      const player = container.firstElementChild
      let clicks = 0
      player.addEventListener('contract', () => clicks++)
      const style = document.getElementById('artplayer-style')
      const art = new window.Artplayer({ container, url: '', useSSR: true, backdrop: true })
      const { query } = art.template
      player.dispatchEvent(new Event('contract'))
      const mounted = {
        retained: original.every(node => container.contains(node)),
        media: art.video === video,
        query: query('.art-video') === video && query('.absent') === null,
        backdrop: player.classList.contains('art-backdrop'),
        track: art.template.$track === video.querySelector('track'),
        clicks,
        style: style.textContent === window.Artplayer.STYLE,
      }
      art.destroy(false)
      return { ...mounted, retainedOnDestroy: container.contains(player), destroyed: player.classList.contains('art-destroy'), styleRetained: document.getElementById('artplayer-style') === style }
    })
    expect(result).toEqual({ retained: true, media: true, query: true, backdrop: true, track: true, clicks: 1, style: true, retainedOnDestroy: true, destroyed: true, styleRetained: true })
  })

  test(`${core}: proxy replacement preserves callback and node identity`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const container = document.querySelector('.player')
      container.innerHTML = window.Artplayer.html
      const track = container.querySelector('track')
      const originalVideo = container.querySelector('video')
      const video = document.createElement('video')
      video.className = 'before'
      let callback
      let context
      let count
      const art = new window.Artplayer({ container, url: '', useSSR: true, proxy(art) {
        callback = art
        context = this
        count = arguments.length
        return video
      } })
      const result = { callback: callback === art && context === art, count, media: art.video === video, className: video.className, retainedTrack: art.template.$track === track, detachedTrack: !container.contains(track), detachedVideo: !container.contains(originalVideo) }
      art.destroy()
      return { ...result, empty: container.innerHTML === '' }
    })
    expect(result).toEqual({ callback: true, count: 1, media: true, className: 'art-video', retainedTrack: true, detachedTrack: true, detachedVideo: true, empty: true })
  })

  test(`${core}: icon access preserves descriptors and moves custom DOM into fresh wrappers`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const node = document.createElement('b')
      node.textContent = 'custom'
      const art = new window.Artplayer({ container: '.player', url: '', icons: { custom: node, markup: '<em>markup</em>' } })
      const first = art.icons.custom
      const second = art.icons.custom
      const builtin = art.icons.play
      const descriptor = Object.getOwnPropertyDescriptor(art.icons, 'custom')
      const result = { tag: second.tagName, fresh: first !== second, moved: first.childNodes.length === 0 && second.firstChild === node, classes: second.className, markup: art.icons.markup.innerHTML, builtins: builtin !== art.icons.play, flags: [descriptor.enumerable, descriptor.configurable, descriptor.set === undefined], alias: window['artplayer-i18n-zh-cn'].Play }
      art.destroy()
      return result
    })
    expect(result).toEqual({ tag: 'I', fresh: true, moved: true, classes: 'art-icon art-icon-custom', markup: '<em>markup</em>', builtins: true, flags: [false, false, true], alias: '播放' })
  })

  test(`${core}: i18n prototype fallback difference and custom keys are explicit`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '', lang: 'en' })
      const inherited = typeof art.i18n.get('constructor')
      art.i18n.update({ en: { constructor: 'custom', Play: '' } })
      const result = { inherited, custom: art.i18n.get('constructor'), empty: art.i18n.get('Play'), missing: art.i18n.get('Not translated') }
      art.destroy()
      return result
    })
    expect(result).toEqual({ inherited: core === 'candidate' ? 'string' : 'function', custom: 'custom', empty: 'Play', missing: 'Not translated' })
  })

  test(`${core}: fullscreen web retains DOM and CSS hooks through entry and exit`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      const player = art.template.$player
      const parent = player.parentNode
      const events = []
      art.on('fullscreenWeb', value => events.push(value))
      art.fullscreenWeb = true
      const entered = art.fullscreenWeb && player.classList.contains('art-fullscreen-web')
      art.fullscreenWeb = false
      const exited = !art.fullscreenWeb && !player.classList.contains('art-fullscreen-web')
      const identity = art.template.$player === player && player.parentNode === parent
      art.destroy()
      return { entered, exited, identity, events }
    })
    expect(result).toEqual({ entered: true, exited: true, identity: true, events: [true, false] })
  })
}
