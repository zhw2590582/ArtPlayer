import { expect, test } from './fixtures.js'

for (const action of ['failure', 'navigate', 'remove', 'destroy']) {
  test(`candidate: cached panel failure preserves navigation after ${action}`, async ({ page }) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const result = await page.evaluate((action) => {
      const first = { name: 'first', html: 'First', selector: [{ name: 'one', html: 'One' }] }
      const second = { name: 'second', html: 'Second', selector: [{ name: 'two', html: 'Two' }] }
      const art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [first, second] })
      const setting = art.setting
      setting.show = true
      setting.render(second.selector)
      setting.render(first.selector)
      const panel = setting.cache.get(first.selector)
      const callbacks = [...first.$events, ...first.selector[0].$events]
      const resize = setting.resize.bind(setting)
      const layout = setting.$parent.style.cssText
      const failure = new Error('cached layout failed')
      setting.resize = () => {
        setting.resize = resize
        resize()
        if (action === 'navigate')
          setting.render()
        if (action === 'remove')
          setting.remove('second')
        if (action === 'destroy')
          art.destroy()
        throw failure
      }
      let originalError = false
      try {
        setting.render(second.selector)
      }
      catch (error) {
        originalError = error === failure
      }
      const result = {
        originalError,
        active: setting.active === first.selector ? 'first' : setting.active === setting.option ? 'root' : 'second',
        panels: setting.cache.size,
        firstVisible: panel.classList.contains('art-current'),
        connected: panel.isConnected,
        layoutRestored: setting.$parent.style.cssText === layout,
        listeners: callbacks.every(callback => art.events.destroyEvents.has(callback)),
      }
      if (action !== 'destroy')
        art.destroy()
      return result
    }, action)
    expect(result).toEqual({
      originalError: true,
      active: action === 'failure' ? 'first' : action === 'destroy' ? 'second' : 'root',
      panels: action === 'remove' ? 2 : action === 'destroy' ? 0 : 3,
      firstVisible: action === 'failure',
      connected: action !== 'destroy',
      layoutRestored: action !== 'remove',
      listeners: action !== 'destroy',
    })
  })
}

for (const core of ['published', 'candidate']) {
  test(`${core}: sharing an active setting has an explicit ownership baseline`, async ({ page }, testInfo) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(async () => {
      const container = document.createElement('div')
      document.body.append(container)
      const calls = []
      const item = { name: 'shared', html: 'Shared', onClick() {
        calls.push(this.id)
      } }
      const first = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [item] })
      const row = item.$item
      const firstOption = item.$option
      let second
      let error
      try {
        second = new window.Artplayer({ container, url: '', setting: true, settings: [item] })
      }
      catch (failure) {
        error = failure.message
      }
      row.click()
      item.$item.click()
      await Promise.resolve()
      const result = { error: error || null, firstOption: item.$option === firstOption, firstHandle: item.$item === row, firstCalls: calls.filter(id => id === first.id).length, secondCalls: calls.filter(id => id === second?.id).length, firstRows: first.setting.$parent.querySelectorAll('.art-setting-item').length, secondRows: second?.setting.$parent.querySelectorAll('.art-setting-item').length ?? null }
      second?.destroy()
      first.destroy()
      container.remove()
      return result
    })
    await testInfo.attach('setting-ownership', { contentType: 'application/json', body: JSON.stringify(result) })
    expect(result).toEqual(core === 'published'
      ? { error: null, firstOption: true, firstHandle: true, firstCalls: 2, secondCalls: 0, firstRows: 1, secondRows: 0 }
      : { error: 'Setting item [shared] already belongs to another active player', firstOption: true, firstHandle: true, firstCalls: 2, secondCalls: 0, firstRows: 1, secondRows: null })
  })
}

for (const action of ['remove', 'destroy']) {
  test(`candidate: a setting subtree can move to another instance after ${action}`, async ({ page }) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    const result = await page.evaluate(async (action) => {
      const container = document.createElement('div')
      document.body.append(container)
      const calls = []
      const child = { name: 'child', html: 'Child', onClick() {
        calls.push(this.id)
      } }
      const parent = { name: 'parent', html: 'Parent', selector: [child] }
      const first = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [parent] })
      first.setting.render(parent.selector)
      const oldRow = child.$item
      const events = child.$events
      const getter = Object.getOwnPropertyDescriptor(child, '$parents').get
      const second = new window.Artplayer({ container, url: '', setting: true })
      let rejected = false
      try {
        second.setting.add(parent)
      }
      catch (error) {
        rejected = error.name === 'ArtPlayerError'
      }
      oldRow.click()
      await Promise.resolve()
      const protectedOwner = calls.length === 1 && calls[0] === first.id && second.setting.option.length === 0
      calls.length = 0
      if (action === 'remove')
        first.setting.remove('parent')
      else
        first.destroy()
      const returned = second.setting.add(parent) === parent
      second.setting.render(parent.selector)
      first.destroy()
      oldRow.click()
      child.$item.click()
      await Promise.resolve()
      const result = {
        rejected,
        protectedOwner,
        returned,
        getter: Object.getOwnPropertyDescriptor(child, '$parents').get === getter,
        eventArray: child.$events === events,
        parent: child.$parent === parent,
        root: child.$parents === second.setting.option,
        oldConnected: oldRow.isConnected,
        newConnected: child.$item.isConnected,
        newOwnerOnly: calls.length === 1 && calls[0] === second.id,
      }
      second.destroy()
      container.remove()
      return result
    }, action)
    expect(result).toEqual({ rejected: true, protectedOwner: true, returned: true, getter: true, eventArray: true, parent: true, root: true, oldConnected: false, newConnected: true, newOwnerOnly: true })
  })
}
