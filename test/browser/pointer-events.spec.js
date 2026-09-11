import { expect, test } from './fixtures.js'

async function setup(page, core, mobile = false) {
  if (mobile)
    await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'ArtPlayer Android pointer fixture' }))
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: real mouse input focuses the player, hovers and toggles actual playback`, async ({ page }) => {
    await setup(page, core)
    await page.evaluate(() => {
      window.art.constructor.DBCLICK_FULLSCREEN = false
      window.art.constructor.DBCLICK_TIME = 0
      window.pointerTrusted = []
      window.art.on('click', event => window.pointerTrusted.push(event.isTrusted))
    })
    const video = page.locator('.art-video')
    await video.click({ position: { x: 100, y: 100 } })
    await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
    expect(await page.evaluate(() => ({ focus: window.art.isFocus, hover: window.art.template.$player.classList.contains('art-hover') }))).toEqual({ focus: true, hover: true })
    await video.click({ position: { x: 100, y: 100 } })
    await expect.poll(() => page.evaluate(() => window.art.template.$video.paused)).toBe(true)
    expect(await page.evaluate(() => window.pointerTrusted)).toEqual([true, true])
    await page.mouse.move(1, 1)
    await expect.poll(() => page.evaluate(() => window.art.template.$player.classList.contains('art-hover'))).toBe(false)
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: click pairs preserve callback identity and playback ordering`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      art.constructor.DBCLICK_TIME = 60000
      art.constructor.DBCLICK_FULLSCREEN = false
      const calls = []
      const events = [new MouseEvent('click'), new MouseEvent('click'), new MouseEvent('click')]
      let current
      art.template.$video.play = () => {
        calls.push('play')
        return Promise.resolve()
      }
      for (const name of ['click', 'dblclick']) {
        art.on(name, function (event) {
          calls.push(`${name}:${event === current}:${this === art}`)
        }, art)
      }
      for (const event of events) {
        current = event
        art.template.$video.dispatchEvent(event)
      }
      art.destroy()
      return calls
    })).toEqual(['click:true:true', 'play', 'dblclick:true:true', 'click:true:true', 'play'])
  })

  for (const name of ['click', 'dblclick']) {
    test(`${core}: destruction in ${name} stops its subsequent default action`, async ({ page }) => {
      await setup(page, core, name === 'dblclick')
      expect(await page.evaluate((name) => {
        const art = window.art
        art.constructor.DBCLICK_TIME = 60000
        let plays = 0
        art.template.$video.play = () => {
          plays++
          return Promise.resolve()
        }
        art.on(name, () => art.destroy())
        const video = art.template.$video
        video.dispatchEvent(new MouseEvent('click'))
        if (name === 'dblclick')
          video.dispatchEvent(new MouseEvent('click'))
        return { plays, destroyed: art.isDestroy }
      }, name)).toEqual({ plays: core === 'published' ? 1 : 0, destroyed: true })
    })
  }

  test(`${core}: focus, hover and move preserve flags, classes and original events`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const { $player } = art.template
      const input = document.createElement('input')
      $player.append(input)
      const calls = []
      let expected
      for (const name of ['focus', 'blur', 'mousemove'])
        art.on(name, event => calls.push([name, event === expected, art.isFocus, art.isInput]))
      art.on('hover', (state, event) => calls.push(['hover', state, event === expected, $player.classList.contains('art-hover')]))
      expected = new MouseEvent('click', { bubbles: true })
      input.dispatchEvent(expected)
      expected = new MouseEvent('contextmenu', { bubbles: true })
      document.body.dispatchEvent(expected)
      expected = new MouseEvent('mouseenter')
      $player.dispatchEvent(expected)
      expected = new MouseEvent('mousemove')
      $player.dispatchEvent(expected)
      expected = new MouseEvent('mouseleave')
      $player.dispatchEvent(expected)
      art.destroy()
      return calls
    })).toEqual([
      ['focus', true, true, true],
      ['blur', true, false, false],
      ['hover', true, true, true],
      ['mousemove', true, false, false],
      ['hover', false, true, false],
    ])
  })
}
