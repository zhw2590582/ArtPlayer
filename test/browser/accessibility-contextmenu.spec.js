import { expect, test } from './fixtures.js'

async function setup(page, options = {}) {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate((options) => {
    window.menuCalls = []
    window.menuEvents = []
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, fullscreenWeb: true, ...options })
    window.art.on('contextmenu', value => window.menuEvents.push(value))
  }, options)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.locator('.art-control-playAndPause').focus()
}

test('candidate: Shift F10 opens the default info action and closing info returns to the original control', async ({ page }) => {
  await setup(page)
  await page.keyboard.press('Shift+F10')
  await expect(page.locator('.art-contextmenu-info')).toBeFocused()
  expect(await page.evaluate(() => window.menuEvents)).toEqual([true])
  await page.keyboard.press('Enter')
  await expect(page.locator('.art-info-close')).toBeFocused()
  await expect(page.locator('.art-contextmenus')).toBeHidden()
  await page.keyboard.press('Escape')
  await expect(page.locator('.art-control-playAndPause')).toBeFocused()
  expect(await page.evaluate(() => window.art.playing)).toBe(false)
})

test('candidate: context menu Escape closes before fullscreen and Tab continues from its origin', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    window.art.fullscreenWeb = true
  })
  await page.keyboard.press('ContextMenu')
  await expect(page.locator('.art-contextmenu-info')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('.art-control-playAndPause')).toBeFocused()
  expect(await page.evaluate(() => window.art.fullscreenWeb)).toBe(true)
  await page.keyboard.press('Shift+F10')
  await page.keyboard.press('Tab')
  await expect(page.locator('.art-contextmenus')).toBeHidden()
  await expect(page.locator('.art-icon-volumeClose')).toBeFocused()
})

test('candidate: keyboard choice navigation waits for activation and retains existing selection events', async ({ page }) => {
  await setup(page, { playbackRate: true, aspectRatio: true, flip: true })
  await page.keyboard.press('Shift+F10')
  const choices = page.locator('.art-contextmenu-playbackRate [data-value]')
  await expect(choices.first()).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(choices.nth(1)).toBeFocused()
  expect(await page.evaluate(() => window.art.playbackRate)).toBe(1)
  const value = Number(await choices.nth(1).getAttribute('data-value'))
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.art.playbackRate)).toBe(value)
  await expect(page.locator('.art-control-playAndPause')).toBeFocused()
  await page.keyboard.press('Shift+F10')
  await expect(choices.nth(1)).toHaveAttribute('aria-pressed', 'true')
})

test('candidate: custom context actions retain callbacks, typeahead and focus across replacement', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    for (const name of ['Alpha', 'Beta']) {
      window.art.contextmenu.add({ name, html: name, click(menu, event) {
        window.menuCalls.push([name, this === window.art, menu === window.art.contextmenu, event.type, menu.show])
      } })
    }
  })
  await page.keyboard.press('Shift+F10')
  await page.keyboard.press('b')
  await expect(page.locator('.art-contextmenu-Beta')).toBeFocused()
  await page.keyboard.press('Enter')
  expect(await page.evaluate(() => window.menuCalls)).toEqual([['Beta', true, true, 'click', true]])
  await expect(page.locator('.art-contextmenus')).toBeVisible()
  expect(await page.evaluate(() => window.art.contextmenu.update({ name: 'Beta', html: 'Updated Beta' }) === window.art.contextmenu.Beta)).toBe(true)
  await expect(page.locator('.art-contextmenu-Beta')).toBeFocused()
  expect(await page.locator('.art-contextmenu-Beta').evaluate(element => element.nextElementSibling.className)).toBe('art-contextmenu art-contextmenu-info')
  await page.evaluate(() => window.art.contextmenu.remove('Beta'))
  await expect(page.locator('.art-contextmenu-info')).toBeFocused()
})

test('candidate: native context content retains input editing and button activation without nested roles', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => window.art.contextmenu.add({ name: 'native', html: '<button id="menu-native">Native</button><input id="menu-input">', click(menu, event) {
    if (event.target.id === 'menu-native')
      window.menuCalls.push(['native'])
  } }))
  await page.keyboard.press('Shift+F10')
  await page.locator('#menu-input').focus()
  await page.keyboard.type('typed text')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('#menu-input')).toHaveValue('typed text')
  expect(await page.evaluate(() => window.art.currentTime)).toBe(0)
  await page.locator('#menu-native').focus()
  await expect(page.locator('.art-contextmenu-native')).not.toHaveAttribute('role', 'button')
  await page.keyboard.press('Space')
  expect(await page.evaluate(() => window.menuCalls)).toEqual([['native']])
})

test('candidate: disabled context menus do not claim the keyboard opening gesture', async ({ page }) => {
  await setup(page)
  expect(await page.evaluate(() => {
    window.Artplayer.CONTEXTMENU = false
    const event = new KeyboardEvent('keydown', { key: 'F10', shiftKey: true, bubbles: true, cancelable: true })
    window.art.controls.playAndPause.dispatchEvent(event)
    return { prevented: event.defaultPrevented, shown: window.art.contextmenu.show }
  })).toEqual({ prevented: false, shown: false })
})

test('candidate: a hidden or disabled origin falls back to the player and outside focus is preserved', async ({ page }) => {
  await setup(page)
  for (const unavailable of ['hidden', 'disabled', 'removed']) {
    await page.evaluate(() => window.art.controls.add({ name: 'origin', position: 'left', html: 'Origin', click() {} }))
    await page.locator('.art-control-origin').focus()
    await page.keyboard.press('Shift+F10')
    await page.evaluate((unavailable) => {
      const origin = window.art.controls.origin
      if (unavailable === 'hidden')
        origin.style.visibility = 'hidden'
      else if (unavailable === 'disabled')
        origin.setAttribute('aria-disabled', 'true')
      else
        origin.remove()
    }, unavailable)
    await page.keyboard.press('Escape')
    await expect(page.locator('.art-video-player')).toBeFocused()
    await page.evaluate(() => window.art.controls.remove('origin'))
  }
  await page.locator('.art-control-playAndPause').focus()
  await page.keyboard.press('Shift+F10')
  await page.locator('#play').focus()
  await expect(page.locator('.art-contextmenus')).toBeHidden()
  await expect(page.locator('#play')).toBeFocused()
})

test('candidate: menu reinitialization replaces listeners and a rejected duplicate initialization keeps them', async ({ page }) => {
  await setup(page)
  expect(await page.evaluate(() => {
    const menu = window.art.contextmenu
    try {
      menu.init()
    }
    catch (error) {
      return error.message.includes('existing [info]')
    }
    return false
  })).toBe(true)
  await page.keyboard.press('Shift+F10')
  await expect(page.locator('.art-contextmenu-info')).toBeFocused()
  await page.keyboard.press('Escape')
  await page.evaluate(() => {
    const menu = window.art.contextmenu
    for (const name of [...menu.cache.keys()])
      menu.remove(name)
    menu.init()
    window.menuEvents = []
  })
  await page.keyboard.press('Shift+F10')
  await expect(page.locator('.art-contextmenu-info')).toBeFocused()
  expect(await page.evaluate(() => window.menuEvents)).toEqual([true])
  await page.keyboard.press('Escape')
  expect(await page.evaluate(() => window.menuEvents)).toEqual([true, false])
  await expect(page.locator('.art-control-playAndPause')).toBeFocused()
})

test('candidate: menu activation preserves callback focus transfers and destruction leaves detached controls inert', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => window.art.contextmenu.add({ name: 'outside', html: 'Outside', click(menu) {
    document.querySelector('#play').focus()
    menu.show = false
  } }))
  await page.keyboard.press('Shift+F10')
  await page.keyboard.press('Enter')
  await expect(page.locator('#play')).toBeFocused()
  await expect(page.locator('.art-contextmenus')).toBeHidden()
  await page.evaluate(() => {
    window.art.contextmenu.update({ name: 'outside', click() {
      window.menuCalls.push('destroy')
      this.destroy()
    } })
    window.detachedMenu = window.art.contextmenu.outside
  })
  await page.locator('.art-control-playAndPause').focus()
  await page.keyboard.press('Shift+F10')
  await page.keyboard.press('Space')
  expect(await page.evaluate(() => {
    window.detachedMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    window.detachedMenu.click()
    return { calls: window.menuCalls, instances: window.Artplayer.instances.length, focused: document.activeElement.tagName }
  })).toEqual({ calls: ['destroy'], instances: 0, focused: 'BODY' })
})

test('candidate: native editable context gestures remain native while pointer opening preserves external focus', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => window.art.controls.add({ name: 'input', position: 'left', html: '<input id="context-input">' }))
  await page.locator('#context-input').focus()
  expect(await page.evaluate(() => {
    const input = document.querySelector('#context-input')
    const key = new KeyboardEvent('keydown', { key: 'F10', shiftKey: true, bubbles: true, cancelable: true })
    const pointer = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
    input.dispatchEvent(key)
    input.dispatchEvent(pointer)
    return { key: key.defaultPrevented, pointer: pointer.defaultPrevented, shown: window.art.contextmenu.show }
  })).toEqual({ key: false, pointer: false, shown: false })
  await page.locator('#play').focus()
  expect(await page.evaluate(() => {
    const event = new MouseEvent('contextmenu', { clientX: 200, clientY: 120, bubbles: true, cancelable: true })
    window.art.template.$player.dispatchEvent(event)
    return event.defaultPrevented
  })).toBe(true)
  await expect(page.locator('.art-contextmenus')).toBeVisible()
  await expect(page.locator('#play')).toBeFocused()
  await page.evaluate(() => {
    window.art.contextmenu.show = false
  })
  await expect(page.locator('#play')).toBeFocused()
})

test('candidate: keyboard menu remains inside the player and ignores a canceled opening', async ({ page }, testInfo) => {
  await setup(page, { playbackRate: true, aspectRatio: true, flip: true, lang: 'zh-cn' })
  await page.evaluate(() => {
    window.art.on('contextmenu', function cancel(show) {
      if (show) {
        window.art.off('contextmenu', cancel)
        window.art.contextmenu.show = false
      }
    })
  })
  await page.keyboard.press('Shift+F10')
  await expect(page.locator('.art-contextmenus')).toBeHidden()
  await expect(page.locator('.art-control-playAndPause')).toBeFocused()
  await page.keyboard.press('Shift+F10')
  await expect(page.locator('.art-contextmenus')).toHaveAttribute('aria-label', '快捷菜单')
  expect(await page.evaluate(() => {
    const menu = window.art.template.$contextmenu.getBoundingClientRect()
    const player = window.art.template.$player.getBoundingClientRect()
    return menu.left >= player.left && menu.right <= player.right && menu.top >= player.top && menu.bottom <= player.bottom
  })).toBe(true)
  await page.locator('.art-video-player').screenshot({ path: `refactor/.cache/core23-contextmenu-keyboard-${testInfo.project.name}.png` })
})

test('candidate: custom menu handoff to mini returns to the control that opened the menu', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => window.art.contextmenu.add({ name: 'mini', html: 'Mini', click(menu) {
    this.mini = true
    menu.show = false
  } }))
  await page.keyboard.press('Shift+F10')
  await expect(page.locator('.art-contextmenu-mini')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('.art-mini-close')).toBeFocused()
  await expect(page.locator('.art-contextmenus')).toBeHidden()
  await page.keyboard.press('Escape')
  await expect(page.locator('.art-mini-popup')).toBeHidden()
  await expect(page.locator('.art-control-playAndPause')).toBeFocused()
})

test('candidate: context keyboard and focus ownership stay local to each player', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    const container = document.createElement('div')
    container.id = 'second-player'
    container.style.cssText = 'width:640px;height:360px'
    document.body.append(container)
    window.otherArt = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true })
  })
  await expect.poll(() => page.evaluate(() => window.otherArt.isReady)).toBe(true)
  await page.keyboard.press('Shift+F10')
  await expect(page.locator('.player .art-contextmenu-info')).toBeFocused()
  await page.locator('#second-player .art-control-playAndPause').focus()
  await expect(page.locator('.player .art-contextmenus')).toBeHidden()
  await page.keyboard.press('Shift+F10')
  await expect(page.locator('#second-player .art-contextmenu-info')).toBeFocused()
  await page.evaluate(() => window.art.destroy())
  await page.keyboard.press('Escape')
  await expect(page.locator('#second-player .art-control-playAndPause')).toBeFocused()
  expect(await page.evaluate(() => window.otherArt.playing)).toBe(false)
})
