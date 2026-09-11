import { expect, test } from './fixtures.js'

async function setup(page) {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => {
    window.settingCalls = []
    window.settingHotkeys = []
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      hotkey: true,
      setting: true,
      fullscreenWeb: true,
      playbackRate: false,
      aspectRatio: false,
      flip: false,
      subtitleOffset: false,
      settings: [
        { name: 'quality', html: 'Quality', tooltip: 'Auto', selector: [
          { name: 'auto', html: 'Auto', default: true },
          { name: 'hd', html: 'HD' },
          { name: 'more', html: 'More', selector: [{ name: 'ultra', html: 'Ultra' }, { name: 'cinema', html: 'Cinema' }] },
        ], onSelect(item, element, event) {
          window.settingCalls.push(['select', item.name, this === window.art, element === item.$item, event.type])
          return item.html
        } },
        { name: 'loop', html: 'Loop', switch: false, onSwitch(item, element, event) {
          window.settingCalls.push(['switch', this === window.art, element === item.$item, event.type])
          return !item.switch
        } },
        { name: 'offset', html: 'Offset', range: [0, -10, 10, 1], onChange(item, element, event) {
          window.settingCalls.push(['input', item.range[0], this === window.art, element === item.$item, event.type])
          return `${item.range[0]}s`
        }, onRange(item, element, event) {
          window.settingCalls.push(['change', item.range[0], this === window.art, element === item.$item, event.type])
          return `${item.range[0]}s`
        } },
        { name: 'action', html: 'Action', onClick(item, element, event) {
          window.settingCalls.push(['action', this === window.art, element === item.$item, event.type])
          return 'Clicked'
        } },
      ],
    })
    window.art.on('hotkey', event => window.settingHotkeys.push(event.code))
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.locator('.art-control-setting').focus()
}

const row = (page, name) => page.locator(`.art-setting-item[data-name="${name}"]`)
const button = page => page.locator('.art-control-setting')

for (const unavailable of ['removed', 'hidden', 'disabled']) {
  test(`candidate: setting exit falls back to the player when its button is ${unavailable}`, async ({ page }) => {
    await setup(page)
    await page.keyboard.press('Enter')
    await expect(row(page, 'quality')).toBeFocused()
    await page.evaluate((unavailable) => {
      if (unavailable === 'removed')
        window.art.controls.remove('setting')
      else if (unavailable === 'hidden')
        window.art.controls.setting.style.visibility = 'hidden'
      else
        window.art.controls.setting.setAttribute('aria-disabled', 'true')
    }, unavailable)
    await page.keyboard.press('Escape')
    await expect(page.locator('.art-settings')).toHaveCount(1)
    await expect(page.locator('.art-settings')).toBeHidden()
    await expect(page.locator('.art-video-player')).toBeFocused()
  })
}

test('candidate: setting navigation ignores hidden rows and inert descendants', async ({ page }) => {
  await setup(page)
  await page.keyboard.press('Enter')
  await page.evaluate(() => {
    window.art.setting.find('loop').$item.style.visibility = 'hidden'
    window.art.setting.find('offset').$item.setAttribute('inert', '')
  })
  await page.keyboard.press('ArrowDown')
  await expect(row(page, 'action')).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(row(page, 'quality')).toBeFocused()
})

test('candidate: long setting panels observe live button availability on every navigation', async ({ page }, testInfo) => {
  await setup(page)
  await page.evaluate(() => {
    const setting = window.art.setting
    for (const name of ['quality', 'loop', 'offset', 'action'])
      setting.remove(name)
    for (let index = 0; index < 40; index++)
      setting.add({ name: `row-${index}`, html: `<button id="setting-button-${index}">Action ${index}</button>` })
  })
  await page.keyboard.press('Enter')
  await expect(page.locator('#setting-button-0')).toBeFocused()
  const measurements = []
  async function navigate(key, expected) {
    await page.evaluate(() => {
      const panel = window.art.setting.cache.get(window.art.setting.active)
      const query = panel.querySelectorAll
      const style = window.getComputedStyle
      const counts = { queries: 0, styles: 0 }
      panel.querySelectorAll = function (...args) {
        counts.queries++
        return query.apply(this, args)
      }
      window.getComputedStyle = function (element, ...args) {
        if (panel.contains(element))
          counts.styles++
        return style.call(this, element, ...args)
      }
      window.finishSettingMeasurement = () => {
        delete panel.querySelectorAll
        window.getComputedStyle = style
        delete window.finishSettingMeasurement
        return counts
      }
    })
    try {
      await page.keyboard.press(key)
    }
    finally {
      measurements.push({ key, expected, ...await page.evaluate(() => window.finishSettingMeasurement()) })
    }
    await expect(page.locator(`#setting-button-${expected}`)).toBeFocused()
  }
  await navigate('ArrowDown', 1)
  await page.evaluate(() => {
    document.querySelector('#setting-button-2').style.visibility = 'hidden'
    document.querySelector('#setting-button-3').closest('.art-setting-item').setAttribute('inert', '')
    document.querySelector('#setting-button-4').disabled = true
    document.querySelector('#setting-button-5').tabIndex = -1
  })
  await navigate('ArrowDown', 6)
  await navigate('a', 6)
  await navigate('End', 39)
  await page.evaluate(() => {
    document.querySelector('#setting-button-2').style.visibility = ''
    document.querySelector('#setting-button-3').closest('.art-setting-item').removeAttribute('inert')
    document.querySelector('#setting-button-4').disabled = false
    document.querySelector('#setting-button-5').removeAttribute('tabindex')
    window.art.setting.remove('row-1')
  })
  await navigate('Home', 0)
  await navigate('ArrowDown', 2)
  await navigate('ArrowDown', 3)
  await navigate('ArrowDown', 4)
  await navigate('ArrowDown', 5)
  await testInfo.attach('setting-navigation-work', { contentType: 'application/json', body: JSON.stringify(measurements, null, 2) })
})

test('candidate: setting keyboard enters nested panels and returns to the originating item', async ({ page }, testInfo) => {
  await setup(page)
  await page.evaluate(() => {
    window.art.fullscreenWeb = true
  })
  await expect(button(page)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(row(page, 'quality')).toBeFocused()
  await expect(button(page)).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.art-setting-panel.art-current')).toHaveAttribute('aria-label', 'Settings')
  await page.keyboard.press('ArrowRight')
  await expect(row(page, 'auto')).toBeFocused()
  await expect(row(page, 'auto')).toHaveAttribute('aria-current', 'true')
  await page.keyboard.press('ArrowDown')
  await expect(row(page, 'hd')).toBeFocused()
  expect(await page.evaluate(() => window.settingCalls)).toEqual([])
  await page.keyboard.press('Enter')
  await expect(row(page, 'quality')).toBeFocused()
  expect(await page.evaluate(() => window.settingCalls)).toEqual([['select', 'hd', true, true, 'click']])
  await expect(row(page, 'quality')).toContainText('HD')
  await page.keyboard.press('ArrowRight')
  await expect(row(page, 'hd')).toBeFocused()
  await expect(row(page, 'hd')).toHaveAttribute('aria-current', 'true')
  await page.keyboard.press('End')
  await expect(row(page, 'more')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(row(page, 'ultra')).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(row(page, 'more')).toBeFocused()
  await page.keyboard.press('Home')
  await expect(page.locator('.art-setting-panel.art-current .art-setting-item-back')).toBeFocused()
  await expect(page.locator('.art-setting-panel.art-current .art-setting-item-back')).toHaveAttribute('aria-label', 'Back: Quality')
  await page.keyboard.press('Space')
  await expect(row(page, 'quality')).toBeFocused()
  await page.locator('.art-video-player').screenshot({ path: testInfo.outputPath('setting-keyboard.png') })
  await page.keyboard.press('Escape')
  await expect(button(page)).toBeFocused()
  await expect(button(page)).toHaveAttribute('aria-expanded', 'false')
  expect(await page.evaluate(() => window.art.fullscreenWeb)).toBe(true)
  expect(await page.evaluate(() => window.settingHotkeys)).toEqual([])
  await page.keyboard.press('Escape')
  await expect.poll(() => page.evaluate(() => window.art.fullscreenWeb)).toBe(false)
})

test('candidate: setting switches and native ranges keep callbacks and avoid player shortcuts', async ({ page }) => {
  await setup(page)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await expect(row(page, 'loop')).toBeFocused()
  await expect(row(page, 'loop')).toHaveAttribute('role', 'switch')
  await expect(row(page, 'loop')).toHaveAttribute('aria-checked', 'false')
  await page.keyboard.down('Space')
  await page.keyboard.down('Space')
  await page.keyboard.up('Space')
  await expect(row(page, 'loop')).toHaveAttribute('aria-checked', 'true')
  expect(await page.evaluate(() => window.settingCalls)).toEqual([['switch', true, true, 'click']])
  await page.keyboard.press('Tab')
  const range = row(page, 'offset').locator('input')
  await expect(range).toBeFocused()
  await expect(range).toHaveAttribute('aria-label', 'Offset')
  await page.keyboard.press('ArrowRight')
  await expect(range).toHaveValue('1')
  await expect.poll(() => page.evaluate(() => window.settingCalls.filter(item => ['input', 'change'].includes(item[0])))).toEqual([
    ['input', 1, true, true, 'input'],
    ['change', 1, true, true, 'change'],
  ])
  await page.evaluate(() => {
    window.art.setting.find('offset').html = 'Subtitle delay'
  })
  await expect(range).toHaveAttribute('aria-label', 'Subtitle delay')
  expect(await page.evaluate(() => [window.art.currentTime, window.art.volume, window.art.video.paused])).toEqual([0, 0.7, true])
  expect(await page.evaluate(() => window.settingHotkeys)).toEqual([])
  await page.keyboard.press('Escape')
  await expect(button(page)).toBeFocused()
})

test('candidate: setting Tab leaves without trapping focus and pointer opening keeps its old focus path', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    window.settingFocusOrder = []
    window.art.template.$setting.addEventListener('focusin', event => window.settingFocusOrder.push(event.target.dataset.name))
  })
  await page.keyboard.press('ArrowUp')
  await expect(row(page, 'action')).toBeFocused()
  expect(await page.evaluate(() => window.settingFocusOrder)).toEqual(['action'])
  await page.keyboard.press('Tab')
  await expect.poll(() => page.evaluate(() => window.art.setting.show)).toBe(false)
  await expect(row(page, 'action')).not.toBeFocused()
  await button(page).click()
  await expect.poll(() => page.evaluate(() => window.art.setting.show)).toBe(true)
  await expect(row(page, 'quality')).not.toBeFocused()
  await row(page, 'action').click()
  expect(await page.evaluate(() => window.settingCalls)).toEqual([['action', true, true, 'click']])
})

test('candidate: setting update, failed replacement and removal recover visible focus', async ({ page }) => {
  await setup(page)
  await page.keyboard.press('ArrowUp')
  await expect(row(page, 'action')).toBeFocused()
  await page.evaluate(() => window.art.setting.update({ name: 'action', html: 'Updated' }))
  await expect(row(page, 'action')).toBeFocused()
  await expect(row(page, 'action')).toHaveText('Updated')
  await page.evaluate(() => {
    const setting = window.art.setting
    const create = setting.createItem
    setting.createItem = function (...args) {
      create.apply(this, args)
      throw new Error('forced keyboard replacement failure')
    }
    try {
      setting.update({ name: 'action', html: 'Failed' })
    }
    catch (error) {
      window.settingUpdateFailure = error.message
    }
    finally {
      setting.createItem = create
    }
  })
  expect(await page.evaluate(() => window.settingUpdateFailure)).toBe('forced keyboard replacement failure')
  await expect(row(page, 'action')).toBeFocused()
  await expect(row(page, 'action')).toHaveText('Updated')
  await page.keyboard.press('Enter')
  expect(await page.evaluate(() => window.settingCalls)).toEqual([['action', true, true, 'click']])
  await page.evaluate(() => window.art.setting.remove('action'))
  await expect(row(page, 'quality')).toBeFocused()
})

test('candidate: suspended settings ignore keyboard callbacks and restored items resume', async ({ page }) => {
  await setup(page)
  await page.keyboard.press('ArrowUp')
  await page.evaluate(() => {
    const target = { name: 'action' }
    Object.defineProperty(target, 'html', { enumerable: true, get() {
      const item = window.art.setting.find('action').$item
      item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
      item.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
      throw new Error('resume old keyboard item')
    } })
    try {
      window.art.setting.update(target)
    }
    catch {}
  })
  expect(await page.evaluate(() => window.settingCalls)).toEqual([])
  expect(await page.evaluate(() => window.art.currentTime)).toBe(0)
  await expect(row(page, 'action')).toBeFocused()
  await page.keyboard.press('Enter')
  expect(await page.evaluate(() => window.settingCalls)).toEqual([['action', true, true, 'click']])
})

test('candidate: native setting buttons retain their role, click path and keyboard navigation', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    window.art.setting.add({ name: 'native', html: '<button id="native-setting">Native action</button>', onClick(item, element, event) {
      window.settingCalls.push(['native', this === window.art, element === item.$item, event.type])
      return 'Done'
    } })
  })
  await page.keyboard.press('ArrowUp')
  const native = page.locator('#native-setting')
  await expect(native).toBeFocused()
  expect(await row(page, 'native').getAttribute('role')).toBeNull()
  await page.keyboard.press('Space')
  expect(await page.evaluate(() => window.settingCalls)).toEqual([['native', true, true, 'click']])
  expect(await page.evaluate(() => window.art.video.paused)).toBe(true)
  await page.keyboard.press('ArrowUp')
  await expect(row(page, 'action')).toBeFocused()
  expect(await page.evaluate(() => window.settingHotkeys)).toEqual([])
})

test('candidate: destroying during moved focus restoration cancels fullscreen notifications', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    window.modeEvents = []
    window.art.on('fullscreenWeb', value => window.modeEvents.push(['fullscreenWeb', value]))
    window.art.on('resize', () => window.modeEvents.push(['resize']))
    window.art.controls.setting.addEventListener('focus', () => window.art.destroy(false), { once: true })
    window.art.fullscreenWeb = true
  })
  expect(await page.evaluate(() => window.art.isDestroy)).toBe(true)
  expect(await page.evaluate(() => window.modeEvents)).toEqual([])
})
