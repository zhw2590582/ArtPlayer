import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const removeHtml of [false, true]) {
  for (const movedBeforeThrow of [false, true]) {
    test(`candidate: failed destroy restoration cannot orphan the player removeHtml=${removeHtml} movedBeforeThrow=${movedBeforeThrow}`, async ({ page }) => {
      await setup(page, 'candidate')
      expect(await page.evaluate(({ removeHtml, movedBeforeThrow }) => {
        const art = window.art
        const { $player: player, $container: container } = art.template
        art.constructor.FULLSCREEN_WEB_IN_BODY = true
        art.fullscreenWeb = true
        const original = container.insertBefore
        const failure = new Error('destroy restore denied')
        container.insertBefore = function (node, anchor) {
          if (movedBeforeThrow)
            original.call(this, node, anchor)
          throw failure
        }
        let sameError = false
        try {
          art.destroy(removeHtml)
        }
        catch (error) {
          sameError = error === failure
        }
        container.insertBefore = original
        return { sameError, orphan: player.isConnected && !container.contains(player), retained: container.contains(player), destroyed: art.isDestroy, registered: art.constructor.instances.includes(art) }
      }, { removeHtml, movedBeforeThrow })).toEqual({ sameError: true, orphan: false, retained: movedBeforeThrow && !removeHtml, destroyed: true, registered: false })
    })
  }
}

test('candidate: web fullscreen listener can exit without stale resize or overwritten restoration', async ({ page }) => {
  await setup(page, 'candidate')
  const result = await page.evaluate(() => {
    const art = window.art
    const player = art.template.$player
    player.style.width = '75%'
    const style = player.style.cssText
    const events = []
    art.on('fullscreenWeb', (value) => {
      events.push(value)
      if (value)
        art.fullscreenWeb = false
    })
    art.on('resize', () => events.push('resize'))
    art.fullscreenWeb = true
    const result = { events, active: art.fullscreenWeb, restored: player.style.cssText === style }
    art.destroy()
    return result
  })
  expect(result).toEqual({ events: [true, false, 'resize'], active: false, restored: true })
})

test('candidate: web fullscreen listener destroy restores ownership without post-destroy resize', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const { $player: player, $container: container } = art.template
    art.constructor.FULLSCREEN_WEB_IN_BODY = true
    const style = player.style.cssText
    const events = []
    art.on('fullscreenWeb', () => art.destroy(false))
    art.on('destroy', () => events.push('destroy'))
    art.on('resize', () => events.push('resize'))
    art.fullscreenWeb = true
    art.fullscreenWeb = true
    return { events, retained: container.contains(player), style: player.style.cssText === style, fullscreen: player.classList.contains('art-fullscreen-web') }
  })).toEqual({ events: ['destroy'], retained: true, style: true, fullscreen: false })
})

test('candidate: a failed body move restores style and keeps its original error', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const { $player: player, $container: container } = art.template
    const style = player.getAttribute('style')
    art.constructor.FULLSCREEN_WEB_IN_BODY = true
    const append = document.body.appendChild
    const failure = new Error('controlled body insertion failure')
    document.body.appendChild = function (node) {
      if (node === player)
        throw failure
      return append.call(this, node)
    }
    let sameError = false
    try {
      art.fullscreenWeb = true
    }
    catch (error) {
      sameError = error === failure
    }
    document.body.appendChild = append
    const result = { sameError, retained: container.contains(player), style: player.getAttribute('style') === style, active: art.fullscreenWeb }
    art.destroy()
    return result
  })).toEqual({ sameError: true, retained: true, style: true, active: false })
})

test('candidate: a failed web fullscreen exit can retry restoring the original placement', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const { $player: player, $container: container } = art.template
    art.constructor.FULLSCREEN_WEB_IN_BODY = true
    const style = player.getAttribute('style')
    art.fullscreenWeb = true
    const insert = container.insertBefore
    const failure = new Error('controlled restore failure')
    container.insertBefore = () => {
      throw failure
    }
    let sameError = false
    try {
      art.fullscreenWeb = false
    }
    catch (error) {
      sameError = error === failure
    }
    container.insertBefore = insert
    art.fullscreenWeb = false
    const result = { sameError, retained: container.contains(player), style: player.getAttribute('style') === style, active: art.fullscreenWeb }
    art.destroy()
    return result
  })).toEqual({ sameError: true, retained: true, style: true, active: false })
})

test('candidate: reentry during web fullscreen restoration preserves the newer active mode', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const { $player: player, $container: container } = art.template
    art.constructor.FULLSCREEN_WEB_IN_BODY = true
    player.style.width = '65%'
    const style = player.getAttribute('style')
    art.fullscreenWeb = true
    const insert = container.insertBefore
    container.insertBefore = function (node, anchor) {
      container.insertBefore = insert
      const result = insert.call(this, node, anchor)
      art.fullscreenWeb = true
      return result
    }
    art.fullscreenWeb = false
    const winner = art.fullscreenWeb && player.parentNode === document.body && player.style.width === '100%'
    art.fullscreenWeb = false
    const restored = container.contains(player) && player.getAttribute('style') === style
    art.destroy()
    return { winner, restored }
  })).toEqual({ winner: true, restored: true })
})

for (const core of ['published', 'candidate']) {
  for (const initial of ['', 'width: 70%; height: 80%; color: red;']) {
    test(`${core}: web fullscreen restores initial style after repeated entry (${initial || 'empty'})`, async ({ page }, testInfo) => {
      await setup(page, core)
      const result = await page.evaluate((initial) => {
        const art = window.art
        art.constructor.FULLSCREEN_WEB_IN_BODY = false
        const player = art.template.$player
        player.style.cssText = initial
        const before = player.style.cssText
        const events = []
        let restoredAtExit
        art.on('fullscreenWeb', (value) => {
          events.push(value)
          if (!value)
            restoredAtExit = player.style.cssText
        })
        art.fullscreenWeb = true
        art.fullscreenWeb = true
        art.fullscreenWeb = false
        const result = { restored: restoredAtExit === before, events, active: art.fullscreenWeb, dimensions: [player.style.width, player.style.height, player.style.color], styles: { before, restoredAtExit, after: player.style.cssText } }
        art.destroy()
        return result
      }, initial)
      const { styles, ...observed } = result
      await testInfo.attach('fullscreen-styles', { contentType: 'application/json', body: JSON.stringify(styles) })
      expect(observed).toEqual({ restored: core === 'candidate', events: [true, true, false], active: false, dimensions: core === 'candidate' ? (initial ? ['70%', '80%', 'red'] : ['', '', '']) : ['100%', '100%', initial ? 'red' : ''] })
    })
  }

  for (const changeFlag of [false, true]) {
    test(`${core}: body fullscreen restores original parent and sibling when flag changes=${changeFlag}`, async ({ page }) => {
      await setup(page, core)
      const result = await page.evaluate((changeFlag) => {
        const art = window.art
        const player = art.template.$player
        const wrapper = document.createElement('div')
        const sibling = document.createElement('span')
        art.template.$container.append(wrapper)
        wrapper.append(player, sibling)
        art.constructor.FULLSCREEN_WEB_IN_BODY = true
        art.fullscreenWeb = true
        const entered = player.parentNode === document.body
        if (changeFlag)
          art.constructor.FULLSCREEN_WEB_IN_BODY = false
        art.fullscreenWeb = false
        const result = { entered, parent: player.parentNode === wrapper, sibling: player.nextSibling === sibling, inBody: player.parentNode === document.body }
        art.destroy()
        player.remove()
        return result
      }, changeFlag)
      expect(result).toEqual({ entered: true, parent: core === 'candidate', sibling: core === 'candidate', inBody: core === 'published' && changeFlag })
    })
  }

  for (const removeHtml of [false, true]) {
    test(`${core}: destroy while web fullscreen removeHtml=${removeHtml} restores DOM ownership`, async ({ page }) => {
      await setup(page, core)
      const result = await page.evaluate((removeHtml) => {
        const art = window.art
        const { $player: player, $container: container } = art.template
        const style = player.style.cssText
        art.constructor.FULLSCREEN_WEB_IN_BODY = true
        art.fullscreenWeb = true
        art.destroy(removeHtml)
        const result = { orphan: player.parentNode === document.body, retained: container.contains(player), style: player.style.cssText === style, fullscreen: player.classList.contains('art-fullscreen-web') }
        player.remove()
        return result
      }, removeHtml)
      expect(result).toEqual(core === 'candidate'
        ? { orphan: false, retained: !removeHtml, style: true, fullscreen: false }
        : { orphan: true, retained: false, style: false, fullscreen: true })
    })
  }
}
