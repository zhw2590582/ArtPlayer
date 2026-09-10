import { expect, test } from './fixtures.js'

for (const phase of ['assign', 'format', 'item', 'render']) {
  test(`candidate: setting update restores the original range row after ${phase} failure`, async ({ page }) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const result = await page.evaluate(async (phase) => {
      const label = document.createElement('span')
      label.textContent = 'Original'
      let mounts = 0
      const calls = []
      let art
      const item = { name: 'target', html: label, tooltip: 'Original tooltip', range: [7, 0, 10, 1], mounted() {
        mounts++
      }, onRange(owner, element, event) {
        calls.push({ value: owner.range[0], owner: owner === item, receiver: this === art, element: element === owner.$item, event: event.target === owner.$range })
        return 'Range result'
      } }
      art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [item, { name: 'existing', html: 'Existing' }] })
      await new Promise(resolve => setTimeout(resolve, 0))
      const row = item.$item
      const input = item.$range
      const range = item.range
      const events = item.$events
      const callbacks = [...events]
      const listeners = art.events.destroyEvents.size
      const failure = new Error(`failed ${phase}`)
      const target = { name: 'target', html: 'Replacement', tooltip: 'Pending', range: [0, 0, 1, 1], extra: 'new' }
      const createItem = art.setting.createItem.bind(art.setting)
      const render = art.setting.render.bind(art.setting)
      if (phase === 'assign') {
        Object.defineProperty(target, 'extra', { enumerable: true, get() {
          throw failure
        } })
      }
      if (phase === 'format')
        target.selector = [{ name: 'existing', html: 'Duplicate' }]
      if (phase === 'item') {
        art.setting.createItem = (...args) => {
          createItem(...args)
          throw failure
        }
      }
      if (phase === 'render') {
        art.setting.render = (...args) => {
          render(...args)
          throw failure
        }
      }
      let originalError = false
      try {
        art.setting.update(target)
      }
      catch (error) {
        originalError = phase === 'format' ? error.name === 'ArtPlayerError' && error.message === 'The [existing] already exists in [setting]' : error === failure
      }
      art.setting.createItem = createItem
      art.setting.render = render
      await new Promise(resolve => setTimeout(resolve, 0))
      const restored = {
        originalError,
        row: item.$item === row && row.isConnected,
        input: item.$range === input,
        label: item.$html.firstChild === label,
        range: item.range === range,
        values: [...item.range],
        native: [input.value, input.min, input.max, input.step],
        tooltip: item.tooltip,
        events: item.$events === events && events.length === callbacks.length && events.every((callback, index) => callback === callbacks[index]),
        listeners: art.events.destroyEvents.size - listeners,
        mounts,
        extra: Object.hasOwn(item, 'extra'),
        selector: Object.hasOwn(item, 'selector'),
      }
      input.dispatchEvent(new Event('change'))
      await Promise.resolve()
      const returned = art.setting.update({ name: 'target', html: 'Success', range: [8, 0, 20, 2] }) === item
      await new Promise(resolve => setTimeout(resolve, 0))
      input.dispatchEvent(new Event('change'))
      item.$range.dispatchEvent(new Event('change'))
      await Promise.resolve()
      const result = { restored, returned, replaced: item.$item !== row && !row.isConnected, calls, mounts }
      art.destroy()
      return result
    }, phase)
    expect(result).toEqual({
      restored: { originalError: true, row: true, input: true, label: true, range: true, values: [7, 0, 10, 1], native: ['7', '0', '10', '1'], tooltip: 'Original tooltip', events: true, listeners: 0, mounts: 1, extra: false, selector: false },
      returned: true,
      replaced: true,
      calls: [
        { value: 7, owner: true, receiver: true, element: true, event: true },
        { value: 8, owner: true, receiver: true, element: true, event: true },
      ],
      mounts: 2,
    })
  })
}

test('candidate: failed switch updates restore the original closure and displayed icon', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(async () => {
    const item = { name: 'switch', html: 'Original', switch: false, onSwitch(owner) {
      return !owner.switch
    } }
    const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [item] })
    const row = item.$item
    const before = item.$switch.innerHTML
    const failure = new Error('switch assign')
    let originalError = false
    try {
      art.setting.update({ name: 'switch', switch: true, get html() {
        throw failure
      } })
    }
    catch (error) {
      originalError = error === failure
    }
    const restored = { originalError, sameRow: item.$item === row, value: item.switch, icon: item.$switch.innerHTML === before }
    row.click()
    await Promise.resolve()
    const result = { restored, clicked: item.switch }
    art.destroy()
    return result
  })
  expect(result).toEqual({ restored: { originalError: true, sameRow: true, value: false, icon: true }, clicked: true })
})

for (const action of ['update', 'remove', 'destroy', 'child-update']) {
  test(`candidate: reentrant ${action} supersedes an unfinished setting update`, async ({ page }) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const result = await page.evaluate(async (action) => {
      let calls = 0
      const child = { name: 'child', html: 'Child', onClick() {
        calls++
      } }
      const item = { name: 'parent', html: 'Parent', tooltip: 'Original', selector: [child] }
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [item] })
      art.setting.render(item.selector)
      const oldRow = item.$item
      const oldChild = child.$item
      const target = { name: 'parent', html: 'Outer', get extra() {
        oldChild.click()
        if (action === 'update')
          art.setting.update({ name: 'parent', html: 'Winner' })
        else if (action === 'remove')
          art.setting.remove('parent')
        else if (action === 'destroy')
          art.destroy()
        else
          art.setting.update({ name: 'child', html: 'Child winner' })
        return 'obsolete'
      }, tooltip: 'Obsolete' }
      const returned = art.setting.update(target) === item
      await new Promise(resolve => setTimeout(resolve, 0))
      const result = {
        returned,
        calls,
        extra: Object.hasOwn(item, 'extra'),
        tooltip: item.tooltip,
        html: item.html,
        childHtml: child.html,
        rowConnected: item.$item.isConnected,
        oldRowConnected: oldRow.isConnected,
        oldChildConnected: oldChild.isConnected,
        childCached: art.setting.cache.has(item.selector),
      }
      if (action !== 'destroy')
        art.destroy()
      return result
    }, action)
    expect(result).toEqual({
      returned: true,
      calls: 0,
      extra: false,
      tooltip: 'Original',
      html: action === 'update' ? 'Winner' : action === 'destroy' ? 'Outer' : 'Parent',
      childHtml: action === 'child-update' ? 'Child winner' : 'Child',
      rowConnected: action === 'update' || action === 'child-update',
      oldRowConnected: action === 'child-update',
      oldChildConnected: false,
      childCached: action === 'child-update',
    })
  })
}

for (const throwing of [false, true]) {
  test(`candidate: reentry inside a render getter retains the winning row with throwing=${throwing}`, async ({ page }) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const result = await page.evaluate(async (throwing) => {
      let calls = 0
      const item = { name: 'target', html: 'Original', onClick() {
        calls++
      } }
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [item] })
      let triggered = false
      const failure = new Error('outer getter failed after winner')
      Object.defineProperty(item, 'icon', { configurable: true, enumerable: true, get() {
        if (!triggered) {
          triggered = true
          art.setting.update({ name: 'target', html: 'Winner' })
          if (throwing)
            throw failure
        }
        return '<span>Icon</span>'
      } })
      let originalError = false
      try {
        art.setting.update({ name: 'target', html: 'Outer' })
      }
      catch (error) {
        originalError = error === failure
      }
      item.$item.click()
      await Promise.resolve()
      const result = { originalError, triggered, calls, html: item.html, connected: item.$item.isConnected, rows: art.setting.$parent.querySelectorAll('.art-setting-item').length, events: item.$events.length }
      art.destroy()
      return result
    }, throwing)
    expect(result).toEqual({ originalError: throwing, triggered: true, calls: 1, html: 'Winner', connected: true, rows: 1, events: 1 })
  })
}

test('candidate: removing an ancestor cancels its pending descendant update', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(() => {
    const child = { name: 'child', html: 'Child' }
    const parent = { name: 'parent', html: 'Parent', selector: [child] }
    const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [parent] })
    art.setting.render(parent.selector)
    art.setting.update({ name: 'child', html: 'Outer', get extra() {
      art.setting.remove('parent')
      return 'obsolete'
    } })
    const result = { html: child.html, extra: Object.hasOwn(child, 'extra'), connected: child.$item.isConnected, found: art.setting.find('child'), cached: art.setting.cache.has(parent.selector), events: child.$events.length }
    art.destroy()
    return result
  })
  expect(result).toEqual({ html: 'Child', extra: false, connected: false, found: null, cached: false, events: 0 })
})

for (const kind of ['switch', 'range']) {
  test(`candidate: a reentrant ${kind} getter cannot replace the winning control handles`, async ({ page }) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const result = await page.evaluate((kind) => {
      const value = kind === 'switch' ? false : [7, 0, 10, 1]
      const item = { name: 'target', html: 'Original', [kind]: value }
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [item] })
      let triggered = false
      Object.defineProperty(item, kind, { configurable: true, enumerable: true, get() {
        if (!triggered) {
          triggered = true
          art.setting.update({ name: 'target', html: 'Winner' })
        }
        return value
      } })
      art.setting.update({ name: 'target', html: 'Outer' })
      const control = item[kind === 'switch' ? '$switch' : '$range']
      const result = { triggered, html: item.html, connected: control.isConnected, owner: control.closest('.art-setting-item') === item.$item, value: item[kind], rows: art.setting.$parent.querySelectorAll('.art-setting-item').length }
      art.destroy()
      return result
    }, kind)
    expect(result).toEqual({ triggered: true, html: 'Winner', connected: true, owner: true, value: kind === 'switch' ? false : [7, 0, 10, 1], rows: 1 })
  })
}

for (const action of ['add', 'update']) {
  test(`candidate: a failed outer add preserves a reentrant ${action} of the same object`, async ({ page }) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const result = await page.evaluate(async (action) => {
      const art = new window.Artplayer({ container: '.player', url: '', setting: true })
      const failure = new Error('obsolete outer add')
      let triggered = false
      let html = 'Winner'
      let clicks = 0
      const item = { name: 'target', get html() {
        if (!triggered) {
          triggered = true
          if (action === 'add') {
            art.setting.remove('target')
            art.setting.add(item)
          }
          else {
            art.setting.update({ name: 'target', html: 'Winner' })
          }
          throw failure
        }
        return html
      }, set html(value) {
        html = value
      }, onClick() {
        clicks++
      } }
      let originalError = false
      try {
        art.setting.add(item)
      }
      catch (error) {
        originalError = error === failure
      }
      item.$item.click()
      await Promise.resolve()
      const result = { originalError, found: art.setting.find('target') === item, html: item.html, connected: item.$item.isConnected, clicks, events: item.$events.length, rows: art.setting.$parent.querySelectorAll('.art-setting-item').length }
      art.destroy()
      return result
    }, action)
    expect(result).toEqual({ originalError: true, found: true, html: 'Winner', connected: true, clicks: 1, events: 1, rows: 1 })
  })
}
