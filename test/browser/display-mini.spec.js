import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => {
    window.createPlayer('/test/pattern.mp4')
    window.miniEvents = []
    window.art.on('mini', value => window.miniEvents.push(value))
    const video = window.art.template.$video
    const parent = document.createElement('div')
    parent.id = 'original-video-parent'
    const next = document.createElement('span')
    next.id = 'original-video-next'
    video.before(parent)
    parent.append(video, next)
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: mini retains first-entry and reuse DOM order and display`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      art.mini = true
      const popup = art.template.$mini
      const first = popup.firstChild === art.template.$video
      const display = popup.style.display
      art.mini = true
      const result = { first, display, last: popup.lastChild === art.template.$video, reusedDisplay: popup.style.display }
      art.destroy()
      return result
    })).toEqual({ first: true, display: '', last: true, reusedDisplay: 'flex' })
  })

  test(`${core}: mini restores the original video parent and sibling after repeated entry`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      art.mini = true
      const popup = art.template.$mini
      art.mini = true
      art.mini = false
      const result = { restored: art.template.$video.parentElement.id === 'original-video-parent', next: art.template.$video.nextSibling?.id === 'original-video-next', reused: popup === art.template.$mini, hidden: popup.style.display, events: [...window.miniEvents] }
      art.destroy()
      return result
    })).toEqual({ restored: core === 'candidate', next: core === 'candidate', reused: true, hidden: 'none', events: [true, true, false] })
  })

  for (const removeHtml of [false, true]) {
    test(`${core}: destroying active mini removeHtml=${removeHtml} removes the owned popup`, async ({ page }) => {
      await setup(page, core)
      expect(await page.evaluate((removeHtml) => {
        const art = window.art
        art.mini = true
        const popup = art.template.$mini
        const video = art.template.$video
        window.miniEvents.length = 0
        art.destroy(removeHtml)
        return { popupConnected: popup.isConnected, videoInPopup: popup.contains(video), events: window.miniEvents }
      }, removeHtml)).toEqual({ popupConnected: core === 'published', videoInPopup: core === 'published', events: [] })
    })
  }
}

test('candidate: hiding mini cancels drag and later document events cannot persist a hidden popup', async ({ page }) => {
  await setup(page, 'candidate')
  const result = await page.evaluate(() => {
    const art = window.art
    art.mini = true
    const popup = art.template.$mini
    const original = { left: art.storage.get('left'), top: art.storage.get('top') }
    popup.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 20, clientY: 20 }))
    art.emit('document:mousemove', new MouseEvent('mousemove', { clientX: 40, clientY: 50 }))
    art.mini = false
    art.emit('document:mouseup', new MouseEvent('mouseup'))
    const result = { original, after: { left: art.storage.get('left'), top: art.storage.get('top') }, dragging: popup.classList.contains('art-mini-dragging'), transform: popup.style.transform }
    art.destroy()
    return result
  })
  expect(result.after).toEqual(result.original)
  expect(result.dragging).toBe(false)
  expect(result.transform).toBe('')
})

test('candidate: mini remains in the viewport on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 280, height: 160 })
  await setup(page, 'candidate')
  await page.evaluate(() => {
    window.art.storage.set('left', 9000)
    window.art.storage.set('top', 9000)
    window.art.mini = true
  })
  const rect = await page.locator('.art-mini-popup').boundingBox()
  expect(rect.x).toBeGreaterThanOrEqual(0)
  expect(rect.y).toBeGreaterThanOrEqual(0)
  expect(rect.x + rect.width).toBeLessThanOrEqual(280)
  expect(rect.y + rect.height).toBeLessThanOrEqual(160)
  await page.evaluate(() => window.art.destroy())
})

test('candidate: mini drag stores the actual position and playback buttons remain usable', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(() => window.art.mini = true)
  const popup = page.locator('.art-mini-popup')
  const rect = await popup.boundingBox()
  await page.mouse.move(rect.x + 30, rect.y + 20)
  await page.mouse.down()
  await page.mouse.move(rect.x - 30, rect.y - 20)
  await page.mouse.up()
  expect(await page.evaluate(() => {
    const art = window.art
    const rect = art.template.$mini.getBoundingClientRect()
    return Math.abs(art.storage.get('left') - rect.left) < 1 && Math.abs(art.storage.get('top') - rect.top) < 1
  })).toBe(true)
  await popup.locator('.art-icon-play').click()
  await expect.poll(() => page.evaluate(() => window.art.playing && window.art.currentTime > 0)).toBe(true)
  await popup.locator('.art-icon-pause').click()
  await expect.poll(() => page.evaluate(() => window.art.template.$video.paused)).toBe(true)
  await popup.locator('.art-mini-close').click()
  await expect(popup).toBeHidden()
  expect(await page.evaluate(() => window.art.template.$video.parentElement.id)).toBe('original-video-parent')
  await page.evaluate(() => window.art.destroy())
})

test('candidate: mini exit failure keeps the active video and can restore on retry', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const parent = art.template.$video.parentNode
    art.mini = true
    const insert = parent.insertBefore
    const failure = new Error('controlled mini restore failure')
    parent.insertBefore = () => {
      throw failure
    }
    let rejected = false
    try {
      art.mini = false
    }
    catch (error) { rejected = error === failure }
    const active = art.mini && art.template.$mini.contains(art.template.$video)
    parent.insertBefore = insert
    art.mini = false
    const result = { rejected, active, restored: art.template.$video.parentNode === parent }
    art.destroy()
    return result
  })).toEqual({ rejected: true, active: true, restored: true })
})

test('candidate: mini reentry during restoration retains the new placement snapshot', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const parent = art.template.$video.parentNode
    const insert = parent.insertBefore
    art.mini = true
    parent.insertBefore = function (...args) {
      const result = insert.apply(this, args)
      parent.insertBefore = insert
      art.mini = true
      return result
    }
    art.mini = false
    const active = art.mini
    art.mini = false
    const result = { active, restored: art.template.$video.parentNode === parent, events: [...window.miniEvents] }
    art.destroy()
    return result
  })).toEqual({ active: true, restored: true, events: [true, true, false] })
})

for (const action of ['hide', 'destroy', 'fail']) {
  test(`candidate: mini construction ${action} releases incomplete UI and restores the video`, async ({ page }) => {
    await setup(page, 'candidate')
    expect(await page.evaluate((action) => {
      const art = window.art
      const icons = art.icons
      const failure = new Error('controlled mini icon failure')
      art.icons = {
        get close() {
          if (action === 'hide')
            art.mini = false
          else if (action === 'destroy')
            art.destroy(false)
          else
            throw failure
          return icons.close
        },
        get play() { return icons.play },
        get pause() { return icons.pause },
      }
      let rejected = false
      try {
        art.mini = true
      }
      catch (error) {
        rejected = error === failure
      }
      const restored = art.template.$video.parentElement.id === 'original-video-parent'
      const active = art.mini
      let retry = null
      if (action !== 'destroy') {
        art.icons = icons
        art.mini = true
        retry = art.mini && document.querySelectorAll('.art-mini-popup').length === 1
        art.destroy()
      }
      return { restored, active, rejected, retry, remaining: document.querySelectorAll('.art-mini-popup').length }
    }, action)).toEqual({ restored: true, active: false, rejected: action === 'fail', retry: action === 'destroy' ? null : true, remaining: 0 })
  })
}

test('candidate: mini preserves a caller-owned popup on destruction', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const popup = document.createElement('div')
    popup.style.cssText = 'display: grid; width: 320px; height: 180px;'
    document.body.append(popup)
    art.template.$mini = popup
    art.mini = true
    art.destroy(false)
    const result = { connected: popup.isConnected, display: popup.style.display, restored: art.template.$video.parentElement.id === 'original-video-parent', empty: popup.childNodes.length === 0 }
    popup.remove()
    return result
  })).toEqual({ connected: true, display: 'grid', restored: true, empty: true })
})

test('candidate: reentrant mini creation allocates only one owned popup', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const icons = art.icons
    let reentered = false
    art.icons = {
      get close() {
        if (!reentered) {
          reentered = true
          art.mini = true
        }
        return icons.close
      },
      get play() { return icons.play },
      get pause() { return icons.pause },
    }
    art.mini = true
    const result = { popups: document.querySelectorAll('.art-mini-popup').length, ownVideo: art.template.$mini.contains(art.template.$video), events: [...window.miniEvents] }
    art.destroy()
    return result
  })).toEqual({ popups: 1, ownVideo: true, events: [true] })
})

test('candidate: mini switches to body web fullscreen and restores the original video placement', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    window.Artplayer.FULLSCREEN_WEB_IN_BODY = true
    art.mini = true
    art.fullscreenWeb = true
    const switched = !art.mini && art.fullscreenWeb && art.template.$mini.style.display === 'none'
    art.fullscreenWeb = false
    const restored = art.template.$video.parentElement.id === 'original-video-parent'
    art.mini = true
    art.mini = false
    const events = [...window.miniEvents]
    art.destroy()
    return { switched, restored, events }
  })).toEqual({ switched: true, restored: true, events: [true, false, true, false] })
})

test('candidate: destroying a mini drag removes its document subscriptions', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    art.mini = true
    art.template.$mini.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 10, clientY: 10 }))
    art.destroy(false)
    let writes = 0
    art.storage.set = () => writes++
    art.emit('document:mousemove', new MouseEvent('mousemove', { clientX: 100, clientY: 100 }))
    art.emit('document:mouseup', new MouseEvent('mouseup'))
    return writes
  })).toBe(0)
})
