import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: mobile keeps keyboard initialization opt-in through the existing init method`, async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'ArtPlayer Android keyboard fixture' }))
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const initial = Object.keys(art.hotkey.keys)
      let hits = 0
      art.hotkey.add('KeyK', () => hits++)
      art.isFocus = true
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK' }))
      const before = hits
      art.hotkey.init()
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK' }))
      const result = { initial, before, after: hits }
      art.destroy()
      return result
    })).toEqual({ initial: [], before: 0, after: 1 })
  })

  test(`${core}: prototype-named hotkeys do not crash or replace the keys prototype`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const prototype = Object.getPrototypeOf(art.hotkey.keys)
      const errors = []
      let hits = 0
      art.isFocus = true
      for (const key of ['__proto__', 'constructor', 'toString']) {
        try {
          const callback = () => hits++
          art.hotkey.add(key, callback)
          document.dispatchEvent(new KeyboardEvent('keydown', { code: key, cancelable: true }))
          art.hotkey.remove(key, callback)
        }
        catch {
          errors.push(key)
        }
      }
      const stable = Object.getPrototypeOf(art.hotkey.keys) === prototype
      art.destroy()
      return { errors, hits, stable }
    })).toEqual({ errors: core === 'candidate' ? [] : ['__proto__', 'constructor', 'toString'], hits: core === 'candidate' ? 3 : 0, stable: true })
  })
}

test('candidate: native keyboard play/pause, seek, volume and web-fullscreen Escape retain their behavior', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(() => {
    window.art.isFocus = true
    window.nativeHotkeys = []
    window.art.on('hotkey', event => window.nativeHotkeys.push(event.code))
  })
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.art.playing && window.art.currentTime > 0.1)).toBe(true)
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.art.template.$video.paused && !window.art.template.$video.seeking)).toBe(true)
  await page.evaluate(() => {
    window.art.currentTime = 1
  })
  await expect.poll(() => page.evaluate(() => !window.art.template.$video.seeking && Math.abs(window.art.currentTime - 1) < 0.1)).toBe(true)
  await page.keyboard.press('ArrowRight')
  expect(await page.evaluate(() => window.nativeHotkeys.at(-1))).toBe('ArrowRight')
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(5)
  await expect.poll(() => page.evaluate(() => window.art.template.$video.seeking)).toBe(false)
  await page.keyboard.press('ArrowLeft')
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeLessThan(2)
  const volume = await page.evaluate(() => {
    window.art.volume = 0.5
    return window.art.volume
  })
  await page.keyboard.press('ArrowUp')
  expect(await page.evaluate(() => window.art.volume)).toBeGreaterThan(volume)
  await page.evaluate(() => {
    window.art.fullscreenWeb = true
  })
  await page.keyboard.press('Escape')
  expect(await page.evaluate(() => window.art.fullscreenWeb)).toBe(false)
  await page.evaluate(() => window.art.destroy())
})

for (const kind of ['inherited', 'plaintext', 'select']) {
  test(`candidate: ${kind} editing and IME composition do not activate player shortcuts`, async ({ page }) => {
    await setup(page, 'candidate')
    expect(await page.evaluate((kind) => {
      const art = window.art
      const root = document.createElement('div')
      root.innerHTML = kind === 'select' ? '<select><option>one</option></select>' : `<div contenteditable="${kind === 'plaintext' ? 'plaintext-only' : 'true'}"><span tabindex="0">edit</span></div>`
      art.template.$player.append(root)
      const target = root.querySelector('span,select')
      target.focus()
      art.isFocus = true
      let hits = 0
      const generic = []
      art.hotkey.add('KeyK', () => hits++)
      art.on('keydown', value => generic.push(value.code))
      const key = new KeyboardEvent('keydown', { code: 'KeyK', cancelable: true, bubbles: true })
      target.dispatchEvent(key)
      target.blur()
      const composition = new KeyboardEvent('keydown', { code: 'KeyK', cancelable: true, bubbles: true, isComposing: true })
      document.dispatchEvent(composition)
      art.destroy()
      return { hits, generic, prevented: [key.defaultPrevented, composition.defaultPrevented] }
    }, kind)).toEqual({ hits: 0, generic: ['KeyK', 'KeyK'], prevented: [false, false] })
  })
}

test('candidate: destroying during a key callback stops remaining keys and notifications', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const calls = []
    art.isFocus = true
    art.hotkey.add('KeyK', () => {
      calls.push('first')
      art.destroy(false)
    })
    art.hotkey.add('KeyK', () => calls.push('second'))
    art.on('hotkey', () => calls.push('hotkey'))
    art.on('keydown', () => calls.push('keydown'))
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK' }))
    art.hotkey.init()
    art.emit('document:keydown', new KeyboardEvent('keydown', { code: 'KeyK' }))
    return calls
  })).toEqual(['first'])
})

for (const core of ['published', 'candidate']) {
  test(`${core}: hotkey registration retains chain, array identity, receiver and event order`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      art.isFocus = true
      const calls = []
      const event = new KeyboardEvent('keydown', { code: 'KeyK', bubbles: true, cancelable: true })
      function callback(value) {
        calls.push(['callback', this === art, value === event])
      }
      const add = art.hotkey.add('KeyK', callback)
      const list = art.hotkey.keys.KeyK
      art.hotkey.add('KeyK', callback)
      art.on('hotkey', value => calls.push(['hotkey', value === event]))
      art.on('keydown', value => calls.push(['keydown', value === event]))
      document.dispatchEvent(event)
      const count = list.length
      const remove = art.hotkey.remove('KeyK', callback)
      const result = { chain: add === art.hotkey && remove === art.hotkey, count, retainedArray: list.length === 0, missing: !Object.hasOwn(art.hotkey.keys, 'KeyK'), keysPrototype: Object.getPrototypeOf(art.hotkey.keys) === Object.prototype, prevented: event.defaultPrevented, calls }
      art.destroy()
      return result
    })).toEqual({ chain: true, count: 1, retainedArray: true, missing: true, keysPrototype: true, prevented: true, calls: [['callback', true, true], ['hotkey', true], ['keydown', true]] })
  })

  test(`${core}: rebound document input retains typing instead of triggering a hotkey`, async ({ page }) => {
    await setup(page, core)
    await page.evaluate(() => {
      const frame = document.createElement('iframe')
      frame.id = 'keyboard-frame'
      document.body.append(frame)
      const doc = frame.contentDocument
      doc.body.innerHTML = '<input id="editor">'
      window.art.events.bindGlobalEvents({ document: doc, window: frame.contentWindow })
      window.hits = 0
      window.art.hotkey.add('KeyK', () => window.hits++)
      window.art.isFocus = true
    })
    const editor = page.frameLocator('#keyboard-frame').locator('#editor')
    await editor.focus()
    await editor.press('k')
    expect(await page.evaluate(() => window.hits)).toBe(core === 'candidate' ? 0 : 1)
    await expect(editor).toHaveValue(core === 'candidate' ? 'k' : '')
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: shadow-root input retains typing instead of triggering a hotkey`, async ({ page }) => {
    await setup(page, core)
    await page.evaluate(() => {
      const host = document.createElement('div')
      host.id = 'shadow-editor'
      window.art.template.$player.append(host)
      host.attachShadow({ mode: 'open' }).innerHTML = '<input id="editor">'
      window.hits = 0
      window.art.hotkey.add('KeyK', () => window.hits++)
      window.art.isFocus = true
    })
    const editor = page.locator('#shadow-editor input')
    await editor.focus()
    await editor.press('k')
    expect(await page.evaluate(() => window.hits)).toBe(core === 'candidate' ? 0 : 1)
    await expect(editor).toHaveValue(core === 'candidate' ? 'k' : '')
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: repeated hotkey init does not multiply the keyboard subscription`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      art.isFocus = true
      let hits = 0
      art.hotkey.add('KeyK', () => hits++)
      art.hotkey.init()
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', bubbles: true, cancelable: true }))
      art.destroy()
      return hits
    })).toBe(core === 'candidate' ? 1 : 2)
  })
}
