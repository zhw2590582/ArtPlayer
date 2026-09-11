import { expect, test } from './fixtures.js'

async function setup(page) {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => {
    window.focusCalls = []
    window.focusOrder = []
    const outside = document.createElement('button')
    outside.id = 'outside-focus'
    outside.textContent = 'Outside'
    document.body.append(outside)
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      controls: ['first', 'second', 'third'].map((name, index) => ({
        name,
        index: index + 10,
        position: 'right',
        html: name,
        click(component, event) {
          window.focusCalls.push([name, this === window.art, component === window.art.controls, event.type])
        },
      })),
    })
    window.art.template.$player.addEventListener('focusin', event => window.focusOrder.push(event.target.className))
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

const control = (page, name) => page.locator(`.art-control-${name}`)

test('candidate: replacing a focused control restores its new entry without intermediate focus', async ({ page }) => {
  await setup(page)
  await control(page, 'first').focus()
  const result = await page.evaluate(() => {
    window.focusOrder.length = 0
    return window.art.controls.update({ name: 'first', html: 'Updated' })
  })
  expect(result).toBeUndefined()
  await expect(control(page, 'first')).toBeFocused()
  expect(await page.evaluate(() => window.focusOrder)).toEqual(['art-control art-control-first'])
  await page.keyboard.press('Space')
  expect(await page.evaluate(() => window.focusCalls)).toEqual([['first', true, true, 'click']])
})

test('candidate: removing a focused control chooses a surviving neighbor and preserves external focus', async ({ page }) => {
  await setup(page)
  await control(page, 'first').focus()
  await page.evaluate(() => window.art.controls.remove('first'))
  await expect(control(page, 'second')).toBeFocused()
  await control(page, 'third').focus()
  await page.evaluate(() => window.art.controls.remove('third'))
  await expect(control(page, 'second')).toBeFocused()
  await page.locator('#outside-focus').focus()
  await page.evaluate(() => window.art.controls.remove('second'))
  await expect(page.locator('#outside-focus')).toBeFocused()
})

test('candidate: failed control replacement recovers focus but a veto keeps the original focused entry', async ({ page }) => {
  await setup(page)
  await control(page, 'first').focus()
  expect(await page.evaluate(() => {
    try {
      window.art.controls.update({ name: 'first', mounted() {
        throw new Error('mount failed')
      } })
    }
    catch (error) { return error.message }
  })).toBe('mount failed')
  await expect(control(page, 'second')).toBeFocused()
  expect(await page.evaluate(() => {
    try {
      window.art.controls.update({ name: 'second', beforeUnmount() {
        throw new Error('veto')
      } })
    }
    catch (error) { return error.message }
  })).toBe('veto')
  await expect(control(page, 'second')).toBeFocused()
})

test('candidate: callbacks can transfer focus outside without an intermediate or final control focus', async ({ page }) => {
  await setup(page)
  for (const phase of ['beforeUnmount', 'mounted']) {
    await control(page, 'first').focus()
    await page.evaluate((phase) => {
      window.focusOrder.length = 0
      window.art.controls.update({ name: 'first', beforeUnmount: undefined, mounted: undefined, [phase]() {
        document.querySelector('#outside-focus').focus()
      } })
    }, phase)
    await expect(page.locator('#outside-focus')).toBeFocused()
    expect(await page.evaluate(() => window.focusOrder)).toEqual([])
  }
})

test('candidate: replacing a focused selector option transfers focus to the new control', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => window.art.controls.update({ name: 'first', click: undefined, selector: [{ html: 'Auto', default: true }, { html: 'HD' }], onSelect: item => item.html }))
  await control(page, 'first').locator('.art-selector-value').focus()
  await page.keyboard.press('Enter')
  await expect(control(page, 'first').locator('.art-selector-item').first()).toBeFocused()
  await page.evaluate(() => window.art.controls.update({ name: 'first', selector: undefined, html: 'Button', click() {} }))
  await expect(control(page, 'first')).toBeFocused()
})

test('candidate: removing the last focusable control leaves focus on the player without an extra sequential Tab stop', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    for (const name of [...window.art.controls.cache.keys()]) {
      if (name !== 'first')
        window.art.controls.remove(name)
    }
  })
  await control(page, 'first').focus()
  await page.evaluate(() => window.art.controls.remove('first'))
  await expect(page.locator('.art-video-player')).toBeFocused()
  await expect(page.locator('.art-video-player')).toHaveAttribute('tabindex', '-1')
  await page.evaluate(() => window.art.destroy(false))
  await expect(page.locator('.art-video-player')).not.toHaveAttribute('tabindex')
})

test('candidate: focus recovery skips unavailable controls and uses a replacement native button', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    window.art.controls.second.style.visibility = 'hidden'
    window.art.controls.third.setAttribute('aria-disabled', 'true')
  })
  await control(page, 'first').focus()
  await page.evaluate(() => window.art.controls.update({ name: 'first', html: '<button>Native replacement</button>' }))
  await expect(control(page, 'first').locator('button')).toBeFocused()
  await expect(control(page, 'first')).not.toHaveAttribute('role', 'button')
  await page.keyboard.press('Space')
  expect(await page.evaluate(() => window.focusCalls)).toEqual([['first', true, true, 'click']])
  await page.evaluate(() => window.art.controls.remove('first'))
  await expect(page.locator('.art-icon-volumeClose')).toBeFocused()
})

test('candidate: an unrelated instance update cannot take focus from another player', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    const container = document.createElement('div')
    container.style.cssText = 'width:640px;height:360px'
    document.body.append(container)
    window.secondArt = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true, controls: [{ name: 'custom', position: 'right', html: 'Other', click() {} }] })
  })
  await control(page, 'first').focus()
  await page.evaluate(() => window.secondArt.controls.update({ name: 'custom', html: 'Changed' }))
  await expect(control(page, 'first')).toBeFocused()
  await control(page, 'custom').focus()
  await page.evaluate(() => window.art.controls.remove('first'))
  await expect(control(page, 'custom')).toBeFocused()
})

test('candidate: a disabled native replacement falls back and focus callbacks can destroy the player', async ({ page }) => {
  await setup(page)
  await control(page, 'first').focus()
  await page.evaluate(() => window.art.controls.update({ name: 'first', html: '<fieldset disabled><button>Unavailable</button></fieldset>' }))
  await expect(control(page, 'second')).toBeFocused()
  await page.evaluate(() => window.art.controls.update({ name: 'second', mounted(element) {
    window.retainedControl = element
    element.addEventListener('focus', () => window.art.destroy(false), { once: true })
  } }))
  expect(await page.evaluate(() => window.art.isDestroy)).toBe(true)
  await page.evaluate(() => window.retainedControl.click())
  expect(await page.evaluate(() => window.focusCalls)).toEqual([])
})
