import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: builtin setting subscriptions are replaced and removed with their row`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(async () => {
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, playbackRate: true })
      await new Promise(resolve => setTimeout(resolve, 0))
      art.setting.update({ name: 'playback-rate', html: 'Speed' })
      await new Promise(resolve => setTimeout(resolve, 0))
      let calls = 0
      const check = art.setting.check.bind(art.setting)
      art.setting.check = (target) => {
        calls++
        check(target)
      }
      art.emit('video:ratechange')
      const afterUpdate = calls
      calls = 0
      art.setting.remove('playback-rate')
      art.emit('video:ratechange')
      const result = { afterUpdate, afterRemove: calls }
      art.destroy()
      return result
    })
    expect(result).toEqual(core === 'candidate' ? { afterUpdate: 1, afterRemove: 0 } : { afterUpdate: 2, afterRemove: 2 })
  })

  test(`${core}: deferred setting mounts belong to the rendered item generation`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(async () => {
      const art = new window.Artplayer({ container: '.player', url: '', setting: true })
      const calls = []
      art.setting.add({ name: 'removed', html: 'Removed', onClick() {}, mounted() {
        calls.push('removed')
      } })
      art.setting.remove('removed')
      art.setting.add({ name: 'updated', html: 'Before', onClick() {}, mounted() {
        calls.push('before')
      } })
      art.setting.update({ name: 'updated', html: 'After', mounted(element, item) {
        calls.push(`${element.textContent}:${this === art}:${item === art.setting.find('updated')}`)
      } })
      // Barrier after the previously scheduled zero-delay mounted callbacks.
      await new Promise(resolve => setTimeout(resolve, 0))
      art.destroy()
      return calls
    })
    expect(result).toEqual(core === 'candidate' ? ['After:true:true'] : ['removed', 'After:true:true', 'After:true:true'])
  })

  test(`${core}: removed setting subtrees release child listeners and cached panels`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      let calls = 0
      const child = { name: 'child', html: 'Child', onClick() {
        calls++
      } }
      const parent = { name: 'group', html: 'Group', selector: [child] }
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [parent] })
      art.setting.render(parent.selector)
      const node = child.$item
      art.setting.remove('group')
      node.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      const result = { calls, cached: art.setting.cache.has(parent.selector), childListeners: child.$events.length, attached: node.isConnected }
      art.destroy()
      return result
    })
    expect(result).toEqual(core === 'candidate' ? { calls: 0, cached: false, childListeners: 0, attached: false } : { calls: 1, cached: true, childListeners: 1, attached: true })
  })

  test(`${core}: setting button results cannot overwrite an updated or newer item`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(async () => {
      const pending = []
      const item = { name: 'async', html: 'Async', tooltip: 'initial', onClick() {
        return new Promise(resolve => pending.push(resolve))
      } }
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [item] })
      item.$item.dispatchEvent(new MouseEvent('click'))
      art.setting.update({ name: 'async', tooltip: 'updated' })
      pending[0]('obsolete')
      await Promise.resolve()
      const afterUpdate = item.tooltip
      item.$item.dispatchEvent(new MouseEvent('click'))
      item.$item.dispatchEvent(new MouseEvent('click'))
      pending[2]('latest')
      await Promise.resolve()
      pending[1]('earlier')
      await Promise.resolve()
      const result = { afterUpdate, afterReorder: item.tooltip }
      art.destroy()
      return result
    })
    expect(result).toEqual(core === 'candidate' ? { afterUpdate: 'updated', afterReorder: 'latest' } : { afterUpdate: 'obsolete', afterReorder: 'earlier' })
  })

  test(`${core}: sibling setting selections share the parent result generation`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(async () => {
      const pending = []
      const calls = []
      let art
      const items = [{ name: 'a', html: 'A' }, { name: 'b', html: 'B' }]
      const parent = { name: 'group', html: 'Group', selector: items, onSelect(item, node, event) {
        calls.push({ name: item.name, sameThis: this === art, sameNode: node === item.$item, event: event.type })
        return new Promise(resolve => pending.push(resolve))
      } }
      art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [parent] })
      art.setting.render(items)
      items[0].$item.dispatchEvent(new MouseEvent('click'))
      items[1].$item.dispatchEvent(new MouseEvent('click'))
      pending[1]('B result')
      await Promise.resolve()
      pending[0]('A result')
      await Promise.resolve()
      const result = { tooltip: parent.tooltip, defaults: items.map(item => item.default), calls }
      art.destroy()
      return result
    })
    expect(result).toEqual({ tooltip: core === 'candidate' ? 'B result' : 'A result', defaults: [false, true], calls: [{ name: 'a', sameThis: true, sameNode: true, event: 'click' }, { name: 'b', sameThis: true, sameNode: true, event: 'click' }] })
  })

  test(`${core}: setting callback rejection retains its original failure identity`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => {
      const failure = new Error('setting failure')
      window.settingErrors = { warnings: [], rejections: [] }
      window.addEventListener('unhandledrejection', (event) => {
        event.preventDefault()
        window.settingErrors.rejections.push(event.reason === failure)
      })
      const warn = console.warn
      console.warn = (message, error) => {
        window.settingErrors.warnings.push({ message, same: error === failure })
        warn.call(console, message, error)
      }
      window.art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [{ name: 'failure', html: 'Fail', tooltip: 'keep', onClick() {
        return Promise.reject(failure)
      } }] })
      window.art.setting.find('failure').$item.dispatchEvent(new MouseEvent('click'))
    })
    await expect.poll(() => page.evaluate(() => window.settingErrors.rejections.length + window.settingErrors.warnings.length)).toBe(1)
    expect(await page.evaluate(() => window.settingErrors)).toEqual(core === 'candidate' ? { warnings: [{ message: 'ArtPlayer setting callback failed:', same: true }], rejections: [] } : { warnings: [], rejections: [true] })
    expect(await page.evaluate(() => window.art.setting.find('failure').tooltip)).toBe('keep')
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: a wide nested setting panel fits the narrow player and remains selectable`, async ({ page }, testInfo) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => {
      const container = document.querySelector('.player')
      container.style.width = '320px'
      container.style.height = '180px'
      window.art = new window.Artplayer({ container, url: '', setting: true, settings: [{ name: 'wide', html: 'Wide choices', width: 420, selector: Array.from({ length: 12 }, (_, value) => ({ name: `choice-${value}`, html: `Choice ${value}`, value })), onSelect(item) {
        window.settingSelected = item.value
        return item.html
      } }] })
      window.art.controls.show = true
    })
    await page.locator('.art-control-setting').click()
    await page.locator('.art-setting-panel.art-current [data-name="wide"]').click()
    await expect.poll(() => page.locator('.art-settings').evaluate(element => Math.round(element.getBoundingClientRect().width))).toBe(core === 'candidate' ? 300 : 420)
    await expect.poll(() => page.evaluate(() => {
      const player = window.art.template.$player.getBoundingClientRect()
      const panel = window.art.template.$setting.getBoundingClientRect()
      return panel.left >= player.left - 1 && panel.right <= player.right + 1 && panel.top >= player.top - 1 && panel.bottom <= player.bottom + 1
    })).toBe(core === 'candidate')
    await page.locator('.player').screenshot({ path: testInfo.outputPath('narrow-setting.png') })
    if (core === 'candidate') {
      await page.locator('.art-setting-panel.art-current [data-name="choice-11"]').click()
      await expect.poll(() => page.evaluate(() => window.settingSelected)).toBe(11)
      await expect.poll(() => page.evaluate(() => window.art.setting.find('wide').tooltip)).toBe('Choice 11')
      expect(await page.evaluate(() => window.art.setting.active === window.art.setting.option)).toBe(true)
    }
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: setting registry retains item returns and hidden tree bindings`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '', setting: true })
      const { add, update, remove } = art.setting
      const item = { name: 'custom', html: 'Original', onClick() {} }
      const added = add(item)
      const originalNode = item.$item
      const descriptor = Object.getOwnPropertyDescriptor(item, '$option')
      const updated = update({ name: 'custom', html: 'Updated' })
      const result = {
        sameAdd: added === item,
        sharedBase: Object.getPrototypeOf(Object.getPrototypeOf(art.setting)) === Object.getPrototypeOf(Object.getPrototypeOf(art.controls)),
        sameUpdate: updated === item,
        replaced: originalNode !== item.$item,
        found: art.setting.find('custom') === item,
        missing: art.setting.find('missing'),
        html: item.html,
        root: item.$option === art.setting.option,
        parentAbsent: item.$parent === undefined && item.$parents === undefined,
        descriptor: { enumerable: descriptor.enumerable, configurable: descriptor.configurable, getter: typeof descriptor.get, setter: descriptor.set === undefined },
        removeUndefined: remove('custom') === undefined,
        removed: art.setting.find('custom') === null,
      }
      art.destroy()
      return result
    })
    expect(result).toEqual({ sameAdd: true, sharedBase: true, sameUpdate: true, replaced: true, found: true, missing: null, html: 'Updated', root: true, parentAbsent: true, descriptor: { enumerable: false, configurable: false, getter: 'function', setter: true }, removeUndefined: true, removed: true })
  })

  test(`${core}: moved setting items bind to their current parent and panel`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => {
      const child = { name: 'child', html: 'Child' }
      const first = { name: 'first', html: 'First', selector: [child] }
      const second = { name: 'second', html: 'Second', selector: [] }
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [first, second] })
      window.art = art
      window.settingMoved = { child, first, second, getter: Object.getOwnPropertyDescriptor(child, '$parent').get, events: child.$events }
      art.setting.remove('child')
      second.selector.push(child)
      art.setting.format()
      art.setting.show = true
      art.setting.resize()
    })
    await page.locator('.art-setting-panel.art-current [data-name="second"]').click()
    const result = await page.evaluate(() => {
      const { child, first, second, getter, events } = window.settingMoved
      const setting = window.art.setting
      return { parent: child.$parent === second ? 'second' : child.$parent === first ? 'first' : 'other', option: child.$option === second.selector, sameGetter: getter === Object.getOwnPropertyDescriptor(child, '$parent').get, sameEvents: events === child.$events, active: setting.active === second.selector, rendered: Boolean(setting.cache.get(second.selector).querySelector('[data-name="child"]')) }
    })
    expect(result).toEqual({ parent: core === 'candidate' ? 'second' : 'first', option: core === 'candidate', sameGetter: true, sameEvents: true, active: true, rendered: core === 'candidate' })
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: automatic setting names and explicit nested names have an explicit baseline`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const first = { html: 'Auto', onClick() {} }
      const explicit = { name: 'setting-0', html: 'Explicit' }
      const nested = { html: 'Nested' }
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [first, { name: 'group', html: 'Group', selector: [explicit, nested] }] })
      const names = []
      art.setting.traverse(item => names.push(item.name))
      const result = { names, unique: new Set(names).size, id: art.setting.id, explicitFound: art.setting.find('setting-0') === explicit }
      art.destroy()
      return result
    })
    expect(result).toEqual(core === 'candidate'
      ? { names: ['setting-1', 'group', 'setting-0', 'setting-2'], unique: 4, id: 3, explicitFound: true }
      : { names: ['setting-0', 'group', 'setting-0', 'setting-1'], unique: 3, id: 2, explicitFound: true })
  })
}

for (const fallback of [false, true]) {
  test(`candidate: open settings follow container and control height changes with fallback=${fallback}`, async ({ page }) => {
    if (fallback) {
      await page.addInitScript(() => {
        window.ResizeObserver = undefined
      })
    }
    await page.goto('/test/player.html?core=candidate&chapter=published')
    await page.evaluate(() => {
      const choices = Array.from({ length: 12 }, (_, value) => ({ name: `choice-${value}`, html: `Choice ${value}` }))
      window.art = new window.Artplayer({ container: '.player', url: '', setting: true, controls: [{ name: 'probe', position: 'right', html: 'Probe control' }], settings: [{ name: 'group', html: 'Group', width: 420, selector: choices }] })
      window.art.setting.show = true
      window.art.setting.render(choices)
    })
    await expect.poll(() => page.locator('.art-settings').evaluate(element => Math.round(element.getBoundingClientRect().width))).toBe(420)
    await page.evaluate((fallback) => {
      const container = document.querySelector('.player')
      container.style.width = '320px'
      container.style.height = '180px'
      if (fallback)
        window.dispatchEvent(new Event('resize'))
    }, fallback)
    await expect.poll(() => page.evaluate(() => {
      const { $player, $setting, $controls } = window.art.template
      const player = $player.getBoundingClientRect()
      const panel = $setting.getBoundingClientRect()
      return { width: Math.round(panel.width), height: Math.round(panel.height), controls: $controls.offsetHeight, inside: panel.top >= player.top - 1 && panel.left >= player.left - 1 && panel.right <= player.right + 1 && panel.bottom <= player.bottom + 1 }
    })).toEqual({ width: 300, height: 78, controls: 92, inside: true })
    const late = await page.evaluate(async () => {
      const art = window.art
      art.destroy(false)
      let calls = 0
      art.setting.resize = () => calls++
      art.emit('resize')
      art.template.$player.style.width = '200px'
      await new Promise(resolve => setTimeout(resolve, 0))
      return calls
    })
    expect(late).toBe(0)
  })
}

test('candidate: failed setting additions leave existing rows usable and allow retry', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(async () => {
    let clicks = 0
    let mounts = 0
    const original = { name: 'original', html: 'Original', onClick() {
      clicks++
    } }
    const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [original] })
    const element = original.$item
    const events = original.$events
    const errors = []
    for (const item of [original, { name: 'original', html: 'Duplicate' }, { name: 'shared', selector: [original] }, Object.preventExtensions({ name: 'sealed' })]) {
      try {
        art.setting.add(item)
      }
      catch (error) {
        errors.push(error.name)
      }
    }
    const failure = new Error('html getter failed')
    const invalid = { name: 'retry', get html() {
      throw failure
    } }
    let sameError = false
    try {
      art.setting.add(invalid)
    }
    catch (error) {
      sameError = error === failure
    }
    const render = art.setting.render.bind(art.setting)
    const renderFailure = new Error('render failed')
    art.setting.render = () => {
      throw renderFailure
    }
    let sameRenderError = false
    const mounted = { name: 'mounted', html: 'Mounted', mounted() {
      mounts++
    } }
    try {
      art.setting.add(mounted)
    }
    catch (error) {
      sameRenderError = error === renderFailure
    }
    art.setting.render = render
    const afterFailures = {
      names: art.setting.option.map(item => item.name),
      rows: art.setting.$parent.querySelectorAll('.art-setting-item').length,
      originalNode: original.$item === element,
      originalEvents: original.$events === events,
      failedMountRemoved: !mounted.$item.isConnected,
    }
    element.click()
    const retry = { name: 'retry', html: 'Retry', onClick() {
      clicks++
    } }
    const returned = art.setting.add(retry) === retry
    retry.$item.click()
    await new Promise(resolve => setTimeout(resolve, 0))
    const result = { errors, sameError, sameRenderError, afterFailures, returned, clicks, mounts, retryFound: art.setting.find('retry') === retry }
    art.destroy()
    return result
  })
  expect(result).toEqual({ errors: ['Error', 'ArtPlayerError', 'Error', 'TypeError'], sameError: true, sameRenderError: true, afterFailures: { names: ['original'], rows: 1, originalNode: true, originalEvents: true, failedMountRemoved: true }, returned: true, clicks: 2, mounts: 0, retryFound: true })
})

test('candidate: setting removal finishes DOM cleanup when the event-removal hook throws', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(async () => {
    let clicks = 0
    let laterCleanup = 0
    const item = { name: 'removed', html: 'Remove', onClick() {
      clicks++
    } }
    const sibling = { name: 'sibling', html: 'Sibling', onClick() {
      clicks++
    } }
    const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [item, sibling] })
    const element = item.$item
    const failure = new Error('cleanup failed')
    const first = art.proxy(element, 'probe-first', () => {})
    const last = art.proxy(element, 'probe-last', () => {})
    item.$events.push(first, last)
    const remove = art.events.remove.bind(art.events)
    art.events.remove = (cleanup) => {
      remove(cleanup)
      if (cleanup === first)
        throw failure
      if (cleanup === last)
        laterCleanup++
    }
    let sameError = false
    try {
      art.setting.remove('removed')
    }
    catch (error) {
      sameError = error.name === 'ResourceCleanupError' && error.errors.length === 1 && error.errors[0] === failure
    }
    element.click()
    sibling.$item.click()
    await Promise.resolve()
    const result = { sameError, laterCleanup, clicks, events: item.$events.length, found: art.setting.find('removed'), connected: element.isConnected, rows: art.setting.$parent.querySelectorAll('.art-setting-item').length }
    art.destroy()
    return result
  })
  expect(result).toEqual({ sameError: true, laterCleanup: 1, clicks: 1, events: 0, found: null, connected: false, rows: 1 })
})

for (const phase of ['header', 'item', 'layout']) {
  test(`candidate: failed ${phase} rendering releases its panel and restores reusable inputs`, async ({ page }, testInfo) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const result = await page.evaluate(async (phase) => {
      const placeholder = document.createElement('div')
      const label = document.createElement('span')
      label.textContent = 'First'
      placeholder.append(label)
      document.body.append(placeholder)
      let mounts = 0
      let clicks = 0
      const first = { name: 'first', html: label, mounted() {
        mounts++
      }, onClick() {
        clicks++
      } }
      const second = { name: 'second', html: 'Second' }
      const children = [first, second]
      const parent = { name: 'parent', html: 'Parent', selector: children }
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [parent] })
      art.setting.show = true
      const setting = art.setting
      const beforeEvents = art.events.destroyEvents.size
      const beforeParentEvents = parent.$events.length
      const beforeStyle = setting.$parent.style.cssText
      const failure = new Error(`failed ${phase}`)
      const createHeader = setting.createHeader.bind(setting)
      const resize = setting.resize.bind(setting)
      if (phase === 'header') {
        setting.createHeader = (item) => {
          createHeader(item)
          throw failure
        }
      }
      if (phase === 'item') {
        Object.defineProperty(second, 'html', { configurable: true, get() {
          throw failure
        } })
      }
      if (phase === 'layout') {
        setting.resize = () => {
          resize()
          throw failure
        }
      }
      let sameError = false
      try {
        setting.render(children)
      }
      catch (error) {
        sameError = error === failure
      }
      const afterRollback = setting.$parent.style.cssText
      setting.createHeader = createHeader
      setting.resize = resize
      await new Promise(resolve => setTimeout(resolve, 0))
      const afterTick = setting.$parent.style.cssText
      const failed = {
        sameError,
        mounts,
        rootActive: setting.active === setting.option,
        cache: setting.cache.size,
        panels: setting.$parent.querySelectorAll('.art-setting-panel').length,
        rootVisible: setting.cache.get(setting.option).classList.contains('art-current'),
        rowRestored: first.$item === undefined,
        inputRestored: first.html === label,
        originalParent: label.parentNode === placeholder,
        listeners: art.events.destroyEvents.size - beforeEvents,
        parentEvents: parent.$events.length - beforeParentEvents,
        layoutRestored: afterRollback === beforeStyle,
      }
      if (phase === 'item')
        Object.defineProperty(second, 'html', { configurable: true, enumerable: true, writable: true, value: 'Second' })
      setting.render(children)
      await new Promise(resolve => setTimeout(resolve, 0))
      first.$item.click()
      const panel = setting.cache.get(children)
      const header = panel.querySelector('.art-setting-item-back')
      header.click()
      const returned = setting.active === setting.option
      setting.remove('parent')
      let late = 0
      setting.render = () => late++
      header.click()
      first.$item.click()
      const result = { layout: { beforeStyle, afterRollback, afterTick }, failed, mounts, clicks, returned, late, headerConnected: header.isConnected, cached: setting.cache.has(children), parentEvents: parent.$events.length }
      art.destroy()
      placeholder.remove()
      return result
    }, phase)
    const { layout, ...state } = result
    await testInfo.attach('setting-panel-layout', { contentType: 'application/json', body: JSON.stringify(layout) })
    expect(state).toEqual({
      failed: { sameError: true, mounts: 0, rootActive: true, cache: 1, panels: 1, rootVisible: true, rowRestored: true, inputRestored: true, originalParent: true, listeners: 0, parentEvents: 0, layoutRestored: true },
      mounts: 1,
      clicks: 1,
      returned: true,
      late: 0,
      headerConnected: false,
      cached: false,
      parentEvents: 0,
    })
  })
}

for (const action of ['remove', 'destroy']) {
  test(`candidate: panel creation stops after reentrant ${action}`, async ({ page }) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const result = await page.evaluate((action) => {
      const children = [{ name: 'child', html: 'Child' }]
      const parent = { name: 'parent', html: 'Parent', selector: children }
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [parent] })
      const setting = art.setting
      const createHeader = setting.createHeader.bind(setting)
      const createItem = setting.createItem.bind(setting)
      let rows = 0
      let header
      setting.createItem = (...args) => {
        rows++
        createItem(...args)
      }
      setting.createHeader = (item) => {
        createHeader(item)
        header = setting.cache.get(children).querySelector('.art-setting-item-back')
        if (action === 'remove')
          setting.remove('parent')
        else
          art.destroy()
      }
      setting.render(children)
      let late = 0
      setting.render = () => late++
      header.click()
      const result = { rows, late, childCached: setting.cache.has(children), headerConnected: header.isConnected, events: parent.$events.length, childRendered: Boolean(children[0].$item), remainingPanels: setting.cache.size }
      if (action === 'remove')
        art.destroy()
      return result
    }, action)
    expect(result).toEqual({ rows: 0, late: 0, childCached: false, headerConnected: false, events: 0, childRendered: false, remainingPanels: action === 'remove' ? 1 : 0 })
  })
}
