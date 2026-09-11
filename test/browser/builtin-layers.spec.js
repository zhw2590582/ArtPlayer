import { expect, test } from './fixtures.js'

async function setup(page, core, mobile = true, live = false) {
  await page.addInitScript(mobile => Object.defineProperty(navigator, 'userAgent', { configurable: true, value: mobile ? 'ArtPlayer Android builtin fixture' : 'ArtPlayer Desktop builtin fixture' }), mobile)
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate((live) => {
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      isLive: live,
      miniProgressBar: true,
      lock: true,
      autoPlayback: true,
      autoOrientation: true,
      fastForward: true,
    })
  }, live)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  for (const mobile of [true, false]) {
    for (const live of [true, false]) {
      test(`${core}: builtin availability keeps mobile=${mobile} live=${live} conditions`, async ({ page }) => {
        await setup(page, core, mobile, live)
        expect(await page.evaluate(() => {
          const names = ['mini-progress-bar', 'lock', 'auto-playback', 'autoOrientation', 'fastForward']
          const result = names.map(name => Boolean(window.art.plugins[name]))
          window.art.destroy()
          return result
        })).toEqual([!live, mobile, !live, mobile, mobile && !live])
      })
    }
  }

  test(`${core}: lock keeps public state, repeated events, DOM classes and icon switching`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const plugin = art.plugins.lock
      const events = []
      art.on('lock', state => events.push([state, art.isLock, plugin.state]))
      plugin.state = true
      plugin.state = true
      art.layers.lock.click()
      const result = {
        keys: Object.keys(plugin),
        events,
        lock: art.layers.lock.querySelector('.art-icon-lock').style.display,
        unlock: art.layers.lock.querySelector('.art-icon-unlock').style.display,
      }
      art.destroy()
      return result
    })).toEqual({ keys: ['name', 'state'], events: [[true, true, true], [true, true, true], [false, false, false]], lock: 'none', unlock: 'inline-flex' })
  })

  test(`${core}: removed lock icons stop observing the still-usable plugin state API`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const icon = art.layers.lock.querySelector('.art-icon-lock')
      art.layers.remove('lock')
      art.plugins.lock.state = true
      const result = { flag: art.isLock, state: art.plugins.lock.state, icon: icon.style.display }
      art.destroy()
      return result
    })).toEqual({ flag: true, state: true, icon: core === 'candidate' ? 'none' : 'inline-flex' })
  })

  test(`${core}: miniature progress follows the control event without adding public state`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const player = art.template.$player
      art.emit('control', false)
      const hiddenControls = player.classList.contains('art-mini-progress-bar')
      art.emit('control', true)
      const shownControls = player.classList.contains('art-mini-progress-bar')
      const keys = Object.keys(art.plugins['mini-progress-bar'])
      art.destroy()
      return { hiddenControls, shownControls, keys }
    })).toEqual({ hiddenControls: true, shownControls: false, keys: ['name'] })
  })
}

test('candidate: retained builtin setters and events do not mutate a destroyed player', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    art.emit('control', true)
    art.destroy(false)
    let events = 0
    art.on('lock', () => events++)
    art.plugins.lock.state = true
    art.emit('control', false)
    return { lock: art.isLock, state: art.plugins.lock.state, mini: art.template.$player.classList.contains('art-mini-progress-bar'), events }
  })).toEqual({ lock: false, state: false, mini: false, events: 0 })
})
