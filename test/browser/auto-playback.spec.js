import { expect, test } from './fixtures.js'

async function setup(page, core, time = 1) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate((time) => {
    window.Artplayer.AUTO_PLAYBACK_MIN = 0.5
    window.Artplayer.AUTO_PLAYBACK_TIMEOUT = 24735
    localStorage.setItem('artplayer_settings', JSON.stringify({ volume: 0.4, times: { example: time } }))
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', id: 'example', autoPlayback: true, muted: true })
    window.resume = window.art.plugins['auto-playback']
    window.promptLayer = window.art.layers['auto-playback']
  }, time)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await expect.poll(() => page.evaluate(() => window.promptLayer.style.display)).toBe('flex')
}

for (const core of ['published', 'candidate']) {
  test(`${core}: resume close and playback rejection preserve the UI contract`, async ({ page }, testInfo) => {
    await setup(page, core)
    await page.locator('.art-auto-playback-close').click()
    expect(await page.evaluate(() => window.promptLayer.style.display)).toBe('none')
    await page.evaluate((published) => {
      window.art.emit('restart', window.art.url)
      const failure = new Error('controlled play rejection')
      window.resumeRejections = []
      if (published) {
        window.addEventListener('unhandledrejection', (event) => {
          if (event.reason === failure) {
            event.preventDefault()
            window.resumeRejections.push({ name: event.reason.name, message: event.reason.message, same: true })
          }
        })
      }
      window.art.template.$video.play = () => Promise.reject(failure)
    }, core === 'published')
    await page.locator('.art-auto-playback-jump').click()
    expect(await page.evaluate(() => ({ layer: window.promptLayer.style.display, poster: window.art.template.$poster.style.display }))).toEqual({ layer: 'none', poster: 'none' })
    if (core === 'published')
      await expect.poll(() => page.evaluate(() => window.resumeRejections.length)).toBe(2)
    const rejections = await page.evaluate(() => window.resumeRejections)
    expect(rejections).toEqual(core === 'published' ? Array.from({ length: 2 }, () => ({ name: 'Error', message: 'controlled play rejection', same: true })) : [])
    await testInfo.attach('known-resume-rejections', { contentType: 'application/json', body: JSON.stringify({ core, rejections }) })
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: resume API retains storage envelope, ID lookup and deletion`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const plugin = window.resume
      const before = plugin.times
      const removed = plugin.delete('example')
      const cleared = plugin.clear()
      const envelope = JSON.parse(localStorage.getItem('artplayer_settings'))
      window.art.destroy()
      return { keys: Object.keys(plugin), name: plugin.name, before, removed, cleared, times: plugin.times, volume: envelope.volume, removedTimes: !Object.hasOwn(envelope, 'times') }
    })).toEqual({ keys: ['name', 'times', 'clear', 'delete'], name: 'auto-playback', before: { example: 1 }, removed: {}, cleared: undefined, times: {}, volume: 0.4, removedTimes: true })
  })

  test(`${core}: resume button seeks and plays actual video`, async ({ page }) => {
    await setup(page, core)
    await page.locator('.art-auto-playback-jump').click()
    await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(1)
    expect(await page.evaluate(() => ({ prompt: window.promptLayer.style.display, poster: window.art.template.$poster.style.display }))).toEqual({ prompt: 'none', poster: 'none' })
    await expect.poll(() => page.evaluate(() => window.resume.times.example)).toBeGreaterThan(1)
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: repeated restart leaves one effective click for the current resume target`, async ({ page }) => {
    await setup(page, core)
    const result = await page.evaluate(() => {
      const art = window.art
      const seeks = []
      let plays = 0
      art.on('seek', (_time, requested) => seeks.push(requested))
      art.template.$video.play = () => {
        plays++
        return Promise.resolve()
      }
      art.storage.set('times', { example: 1.5 })
      art.emit('restart', art.url)
      art.storage.set('times', { example: 2 })
      art.emit('restart', art.url)
      window.promptLayer.querySelector('.art-auto-playback-jump').click()
      const label = window.promptLayer.querySelector('.art-auto-playback-last').textContent
      art.destroy()
      return { seeks, plays, label }
    })
    expect(result.seeks).toEqual(core === 'candidate' ? [2] : [1, 1.5, 2])
    expect(result.plays).toBe(core === 'candidate' ? 1 : 3)
    expect(result.label).toBe('Last Seen 00:02')
  })

  test(`${core}: restart below threshold invalidates the old prompt click`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      let plays = 0
      art.template.$video.play = () => {
        plays++
        return Promise.resolve()
      }
      art.storage.set('times', { example: 0.1 })
      art.emit('restart', art.url)
      window.promptLayer.querySelector('.art-auto-playback-jump').click()
      const result = { hidden: window.promptLayer.style.display, plays }
      art.destroy()
      return result
    })).toEqual({ hidden: 'none', plays: core === 'candidate' ? 0 : 1 })
  })
}

for (const action of ['restart', 'source', 'remove', 'destroy']) {
  test(`candidate: ${action} cancels obsolete resume timers and subscriptions`, async ({ page }) => {
    await setup(page, 'candidate')
    expect(await page.evaluate((action) => {
      const art = window.art
      const layer = window.promptLayer
      const set = window.setTimeout
      const clear = window.clearTimeout
      const pending = new Set()
      const callbacks = []
      let plays = 0
      art.template.$video.play = () => {
        plays++
        return Promise.resolve()
      }
      window.setTimeout = function (callback, delay, ...args) {
        const timer = set.call(this, callback, delay, ...args)
        if (delay === 24735) {
          callbacks.push(callback)
          pending.add(timer)
        }
        return timer
      }
      window.clearTimeout = function (timer) {
        pending.delete(timer)
        return clear.call(this, timer)
      }
      art.emit('video:timeupdate', new Event('timeupdate'))
      const scheduled = pending.size
      if (action === 'restart') {
        art.storage.set('times', { example: 2 })
        art.emit('restart', art.url)
      }
      else if (action === 'source') {
        art.url = '/test/pattern.mp4?resume=2'
      }
      else if (action === 'remove') {
        art.layers.remove('auto-playback')
      }
      else {
        art.destroy(false)
      }
      for (const callback of callbacks)
        callback()
      if (action !== 'restart')
        layer.querySelector('.art-auto-playback-jump').click()
      const result = { scheduled, remaining: pending.size, display: layer.style.display, plays }
      window.setTimeout = set
      window.clearTimeout = clear
      art.destroy()
      return result
    }, action)).toEqual({ scheduled: 1, remaining: 0, display: action === 'restart' ? 'flex' : 'none', plays: 0 })
  })
}

test('candidate: destruction inside seek prevents resume playback continuation', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    let plays = 0
    art.template.$video.play = () => {
      plays++
      return Promise.resolve()
    }
    art.on('seek', () => art.destroy(false))
    window.promptLayer.querySelector('.art-auto-playback-jump').click()
    return { destroyed: art.isDestroy, plays }
  })).toEqual({ destroyed: true, plays: 0 })
})
