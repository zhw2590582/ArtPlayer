import { expect, test } from './fixtures.js'

for (const fallback of [false, true]) {
  test(`candidate: initial control measurement uses the browser layout phase with fallback=${fallback}`, async ({ page }, testInfo) => {
    if (fallback)
      await page.addInitScript(() => { window.ResizeObserver = undefined })
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const reads = await page.evaluate(() => {
      document.querySelector('.player').style.width = '320px'
      const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
      let reads = 0
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        ...descriptor,
        get() {
          if (this.classList.contains('art-controls'))
            reads++
          return descriptor.get.call(this)
        },
      })
      try {
        window.art = new window.Artplayer({ container: '.player', url: '', setting: true, fullscreenWeb: true, controls: [{ name: 'probe', position: 'right', html: 'Probe control' }] })
      }
      finally {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', descriptor)
      }
      return reads
    })
    await testInfo.attach('constructor-control-layout-reads', { contentType: 'application/json', body: JSON.stringify({ fallback, reads }) })
    expect(reads).toBe(fallback ? 1 : 0)
    const measured = await page.evaluate(async () => {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const { $controls, $player } = window.art.template
      return { height: $controls.offsetHeight, recorded: Number.parseFloat($player.style.getPropertyValue('--art-controls-height')) }
    })
    expect(measured.height).toBe(92)
    expect(measured.recorded).toBe(measured.height)
    await expect.poll(() => page.evaluate(() => Number.parseFloat(getComputedStyle(window.art.template.$subtitle).bottom))).toBeGreaterThanOrEqual(measured.height)
  })
}

test('candidate: destroying before initial control observation leaves no late layout write', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const state = await page.evaluate(async () => {
    const art = new window.Artplayer({ container: '.player', url: '' })
    const player = art.template.$player
    art.destroy(false)
    const before = player.getAttribute('style')
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    return { before, after: player.getAttribute('style'), instances: window.Artplayer.instances.length }
  })
  expect(state.after).toBe(state.before)
  expect(state.instances).toBe(0)
})

for (const fallback of [false, true]) {
  test(`candidate: control layout follows resize and removal with observer fallback=${fallback}`, async ({ page }) => {
    if (fallback) {
      await page.addInitScript(() => {
        window.ResizeObserver = undefined
      })
    }
    await page.goto('/test/player.html?core=candidate&chapter=published')
    await page.evaluate(() => {
      window.art = new window.Artplayer({ container: '.player', url: '', setting: true, fullscreenWeb: true, controls: [{ name: 'probe', position: 'right', html: 'Probe control' }] })
    })
    const heights = () => page.evaluate(() => ({ actual: window.art.template.$controls.offsetHeight, recorded: Number.parseFloat(window.art.template.$player.style.getPropertyValue('--art-controls-height')) }))
    await expect.poll(heights).toEqual({ actual: 46, recorded: 46 })
    await page.evaluate(() => {
      window.art.template.$container.style.width = '320px'
      window.dispatchEvent(new Event('resize'))
    })
    await expect.poll(heights).toEqual({ actual: 92, recorded: 92 })
    await expect.poll(() => page.evaluate(() => Number.parseFloat(getComputedStyle(window.art.template.$subtitle).bottom))).toBeGreaterThanOrEqual(92)
    await page.evaluate(() => window.art.controls.remove('probe'))
    await expect.poll(heights).toEqual({ actual: 46, recorded: 46 })
    await page.evaluate(() => {
      window.art.destroy(false)
      window.art.template.$controls.style.display = 'none'
      window.art.emit('resize')
    })
    await expect.poll(heights).toEqual({ actual: 0, recorded: 46 })
  })
}

for (const core of ['published', 'candidate']) {
  test(`${core}: selector background clicks and rejection ownership are explicit`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => {
      const failure = new Error('selection failure')
      window.selectionReports = { warnings: [], rejections: [] }
      window.addEventListener('unhandledrejection', (event) => {
        event.preventDefault()
        window.selectionReports.rejections.push({ name: event.reason.name, same: event.reason === failure })
      })
      const original = console.warn
      console.warn = (message, error) => {
        window.selectionReports.warnings.push({ message, same: error === failure })
        original.call(console, message, error)
      }
      const art = new window.Artplayer({ container: '.player', url: '' })
      window.art = art
      art.controls.add({ name: 'selector', position: 'right', html: 'initial', selector: [{ html: 'A' }], onSelect() {
        return Promise.reject(failure)
      } })
      art.controls.selector.querySelector('.art-selector-list').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    if (core === 'published')
      await expect.poll(() => page.evaluate(() => window.selectionReports.rejections.length)).toBe(1)
    await page.evaluate(() => window.art.controls.selector.querySelector('.art-selector-item').dispatchEvent(new MouseEvent('click', { bubbles: true })))
    await expect.poll(() => page.evaluate(() => window.selectionReports.warnings.length + window.selectionReports.rejections.length)).toBe(core === 'published' ? 2 : 1)
    const reports = await page.evaluate(() => window.selectionReports)
    expect(reports).toEqual(core === 'published'
      ? { warnings: [], rejections: [{ name: 'TypeError', same: false }, { name: 'Error', same: true }] }
      : { warnings: [{ message: 'ArtPlayer selector failed:', same: true }], rejections: [] })
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: beforeUnmount errors remain retryable and detached nodes can be removed`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      const failure = new Error('before unmount')
      const option = { name: 'entry', html: 'entry', beforeUnmount() {
        throw failure
      } }
      const element = art.layers.add(option)
      let same = false
      try {
        art.layers.remove('entry')
      }
      catch (error) { same = error === failure }
      const retained = art.layers.cache.has('entry') && element.isConnected
      option.beforeUnmount = () => {}
      element.remove()
      let error = null
      try {
        art.layers.remove('entry')
      }
      catch (caught) { error = caught.name }
      const result = { same, retained, error, removed: !art.layers.cache.has('entry') }
      art.destroy()
      return result
    })
    expect(result).toEqual({ same: true, retained: true, error: core === 'published' ? 'TypeError' : null, removed: true })
  })

  test(`${core}: failed mounted reentry preserves its successful replacement`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      const failure = new Error('outer failure')
      let same = false
      try {
        art.layers.add({ name: 'entry', html: 'outer', mounted() {
          art.layers.remove('entry')
          art.layers.add({ name: 'entry', html: 'replacement' })
          throw failure
        } })
      }
      catch (error) { same = error === failure }
      const result = { same, value: art.layers.entry.textContent, attached: art.layers.entry.isConnected, entries: art.layers.cache.size }
      art.destroy()
      return result
    })
    expect(result).toEqual({ same: true, value: 'replacement', attached: true, entries: 1 })
  })

  test(`${core}: context menu builtin selection and owned updates preserve state`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => {
      window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', playbackRate: true, aspectRatio: true, flip: true })
    })
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    for (const [name, value] of [['playbackRate', '1.5'], ['aspectRatio', '4:3'], ['flip', 'horizontal']]) {
      await page.locator('.art-video-player').click({ button: 'right', position: { x: 100, y: 80 } })
      await page.locator(`.art-contextmenu-${name} [data-value="${value}"]`).click()
      await expect.poll(() => page.evaluate(name => window.art.contextmenu[name].querySelector('.art-current')?.dataset.value, name)).toBe(value)
      expect(await page.evaluate(() => window.art.contextmenu.show)).toBe(false)
    }
    const result = await page.evaluate(() => {
      const { art } = window
      const menu = art.contextmenu.flip
      art.contextmenu.remove('flip')
      art.flip = 'normal'
      const result = { rate: art.playbackRate, aspect: art.aspectRatio, changedAfterRemove: menu.querySelector('[data-value="normal"]').classList.contains('art-current') }
      art.destroy()
      return result
    })
    expect(result).toEqual({ rate: 1.5, aspect: '4:3', changedAfterRemove: core === 'published' })
  })

  test(`${core}: a prototype-named component keeps the registry prototype intact`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      const prototype = Object.getPrototypeOf(art.layers)
      const element = art.layers.add({ name: '__proto__', html: 'named' })
      const alias = Reflect.get(art.layers, '__proto__') === element
      art.layers.remove('__proto__')
      const result = { alias, preserved: Object.getPrototypeOf(art.layers) === prototype }
      art.destroy()
      return result
    })
    expect(result).toEqual({ alias: true, preserved: core === 'candidate' })
  })

  test(`${core}: component factories, ordering, bound methods and update hooks retain contracts`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      const { add, update, remove } = art.layers
      const calls = []
      const first = { name: 'first', index: 10, html: 'first', mounted(element) {
        calls.push(['mount', this === art, element.textContent])
      } }
      add(first)
      add({ name: 'equal', index: 10, html: 'equal' })
      let factory
      add((owner) => {
        factory = owner === art
        return { name: 'zero', index: 0, html: 42 }
      })
      const disabled = { html: 0, disable: true }
      const before = art.layers.id
      const disabledResult = add(disabled)
      const order = Array.from(art.template.$layer.children, node => node.textContent)
      const updated = update({ name: 'first', html: 'changed', beforeUnmount(element) {
        calls.push(['unmount', this === art, element.textContent, first.html])
      } })
      const controlResult = art.controls.add({ name: 'probe', position: 'right', html: 'probe', click(component, event) {
        calls.push(['click', this === art, component === art.controls, event.defaultPrevented])
      } })
      art.controls.probe.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      const controlUpdate = art.controls.update({ name: 'probe', html: 'updated' })
      const result = { factory, order, disabled: disabledResult === undefined && art.layers.id === before + 1 && disabled.html === '', updated: updated === art.layers.first, controlReturns: [controlResult === undefined, controlUpdate === undefined], calls }
      remove('first')
      art.destroy()
      return result
    })
    expect(result.factory).toBe(true)
    expect(result.order).toEqual(['42', 'equal', 'first'])
    expect(result.disabled).toBe(true)
    expect(result.updated).toBe(true)
    expect(result.controlReturns).toEqual([true, true])
    expect(result.calls.slice(0, 4)).toEqual([['mount', true, 'first'], ['unmount', true, 'first', 'changed'], ['mount', true, 'changed'], ['click', true, true, true]])
  })

  test(`${core}: removed builtin time and volume controls stop owned effects`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      const time = art.controls.time
      const before = time.textContent
      const icon = art.controls.volume.querySelector('.art-icon-volume')
      art.controls.remove('time')
      art.controls.remove('volume')
      art.video.currentTime = 12
      art.emit('video:timeupdate', new Event('timeupdate'))
      art.muted = false
      icon.dispatchEvent(new MouseEvent('click'))
      const result = { changed: time.textContent !== before, muted: art.muted }
      art.destroy()
      return result
    })
    expect(result).toEqual({ changed: core === 'published', muted: core === 'published' })
  })

  test(`${core}: selector items can be reused by an update without changing getter flags`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      const selector = [{ html: 'A', value: 'a', default: true }, { html: 'B', value: 'b' }]
      art.controls.add({ name: 'selector', position: 'right', html: 'A', selector })
      const oldNode = selector[0].$control_item
      let error = null
      try {
        art.controls.update({ name: 'selector', html: 'updated' })
      }
      catch (caught) { error = caught.name }
      const descriptor = Object.getOwnPropertyDescriptor(selector[0], '$control_item')
      const result = { error, changed: selector[0].$control_item !== oldNode, flags: [descriptor.enumerable, descriptor.configurable, typeof descriptor.get], options: selector[0].$control_option === selector }
      art.destroy()
      return result
    })
    expect(result).toEqual({ error: core === 'candidate' ? null : 'TypeError', changed: core === 'candidate', flags: [false, false, 'function'], options: true })
  })

  test(`${core}: async selector results cannot overwrite a newer choice or removed entry`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(async () => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      const selector = [{ html: 'A', value: 'a' }, { html: 'B', value: 'b' }]
      const pending = []
      const calls = []
      art.controls.add({ name: 'selector', position: 'right', html: 'initial', selector, onSelect(item, node, event) {
        calls.push([this === art, selector.includes(item), item.$control_item === node, event.type])
        return new Promise(resolve => pending.push(resolve))
      } })
      const click = item => item.$control_item.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      click(selector[0])
      click(selector[1])
      pending[1]('new')
      await Promise.resolve()
      pending[0]('old')
      await Promise.resolve()
      const value = selector[0].$control_value
      const raced = value.innerHTML
      click(selector[0])
      const beforeRemove = value.innerHTML
      art.controls.remove('selector')
      pending[2]('removed')
      await Promise.resolve()
      const result = { raced, changedAfterRemove: value.innerHTML !== beforeRemove, flags: selector.map(item => item.default), calls }
      art.destroy()
      return result
    })
    expect(result.raced).toBe(core === 'candidate' ? 'new' : 'old')
    expect(result.changedAfterRemove).toBe(core === 'published')
    expect(result.flags).toEqual([true, false])
    expect(result.calls).toEqual(Array.from({ length: 3 }, () => [true, true, true, 'click']))
  })

  test(`${core}: a failed mounted hook rolls back its DOM alias and listeners`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      const failure = new Error('mounted failure')
      let element
      let sameError = false
      let clicks = 0
      try {
        art.layers.add({ name: 'failed', html: 'failed', click() {
          clicks++
        }, mounted(node) {
          element = node
          throw failure
        } })
      }
      catch (error) { sameError = error === failure }
      element.dispatchEvent(new MouseEvent('click'))
      const result = { sameError, clicks, cached: art.layers.cache.has('failed'), alias: art.layers.failed === element, attached: art.template.$layer.contains(element) }
      art.destroy()
      return result
    })
    expect(result).toEqual({ sameError: true, clicks: core === 'candidate' ? 0 : 1, cached: core === 'published', alias: core === 'published', attached: core === 'published' })
  })

  test(`${core}: reentrant beforeUnmount removes only once`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      let calls = 0
      art.layers.add({ name: 'reentrant', html: 'reentrant', beforeUnmount() {
        calls++
        if (calls === 1)
          art.layers.remove('reentrant')
      } })
      let error = null
      try {
        art.layers.remove('reentrant')
      }
      catch (caught) { error = caught.name }
      const result = { calls, error, cached: art.layers.cache.has('reentrant') }
      art.destroy()
      return result
    })
    expect(result).toEqual({ calls: core === 'candidate' ? 1 : 2, error: core === 'candidate' ? null : 'TypeError', cached: false })
  })

  test(`${core}: narrow controls stay inside the player without hiding buttons`, async ({ page }, testInfo) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, fullscreenWeb: true, controls: [{ name: 'probe', position: 'right', html: 'Probe control' }] })
      const container = art.template.$container
      const measure = (width) => {
        container.style.width = `${width}px`
        container.style.height = `${width * 9 / 16}px`
        const bounds = container.getBoundingClientRect()
        const controls = Array.from(container.querySelectorAll('.art-controls .art-control'))
        return { count: controls.length, hidden: controls.filter(node => node.getClientRects().length === 0).length, overflow: controls.filter((node) => {
          const box = node.getBoundingClientRect()
          return box.left < bounds.left - 0.75 || box.right > bounds.right + 0.75 || box.top < bounds.top - 0.75 || box.bottom > bounds.bottom + 0.75
        }).length }
      }
      const wide = measure(640)
      const narrow = measure(320)
      const smaller = measure(240)
      measure(320)
      window.layoutArt = art
      return { wide, narrow, smaller }
    })
    await page.locator('.player').screenshot({ path: testInfo.outputPath('narrow-controls.png') })
    await page.evaluate(() => window.layoutArt.destroy())
    expect(result.wide.overflow).toBe(0)
    expect(result.narrow.count).toBe(result.wide.count)
    expect(result.narrow.hidden).toBe(0)
    expect(result.smaller.hidden).toBe(0)
    if (core === 'candidate') {
      expect(result.narrow.overflow).toBe(0)
      expect(result.smaller.overflow).toBe(0)
    }
    else {
      expect(result.narrow.overflow).toBeGreaterThan(0)
      expect(result.smaller.overflow).toBeGreaterThan(0)
    }
  })

  test(`${core}: progress markers treat text as data and removed drags cannot seek`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => {
      window.createPlayer('/test/pattern.mp4')
      window.art.option.highlight = [{ time: 1, text: 'label" data-injected="yes' }]
    })
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const result = await page.evaluate(() => {
      const art = window.art
      const marker = art.controls.progress.querySelector('.art-progress-highlight span')
      const text = marker.dataset.text
      const injected = marker.hasAttribute('data-injected')
      let seeks = 0
      art.on('seek', () => seeks++)
      art.template.$progress.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
      art.controls.remove('progress')
      art.emit('document:mousemove', new MouseEvent('mousemove', { clientX: 100 }))
      art.destroy()
      return { text, injected, seeks }
    })
    expect(result).toEqual({ text: core === 'candidate' ? 'label" data-injected="yes' : 'label', injected: core === 'published', seeks: core === 'candidate' ? 0 : 1 })
  })
}
