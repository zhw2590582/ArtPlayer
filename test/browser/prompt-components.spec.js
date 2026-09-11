import { expect, test } from './fixtures.js'

async function setup(page, core, mobile = false) {
  await page.addInitScript(mobile => Object.defineProperty(navigator, 'userAgent', { configurable: true, value: mobile ? 'ArtPlayer Android info fixture' : 'ArtPlayer Desktop info fixture' }), mobile)
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: mask preserves observations before and after its destroy handler`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    expect(await page.evaluate(() => {
      const seen = []
      const art = new window.Artplayer({ container: '.player', url: '', layers: [{
        name: 'observer',
        html: '',
        mounted() {
          this.on('destroy', () => seen.push(['before', this.template.$state.querySelector('.art-icon-error').style.display]))
        },
      }] })
      art.on('destroy', () => seen.push(['after', art.template.$state.querySelector('.art-icon-error').style.display]))
      art.destroy(false)
      return seen
    })).toEqual([['before', 'none'], ['after', '']])
  })

  test(`${core}: info preserves fields, native media text and close visibility`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      art.template.$video.volume = 0.4
      art.info.init()
      const volume = art.template.$infoPanel.querySelector('[data-video="volume"]').textContent
      const source = art.template.$infoPanel.querySelector('[data-video="currentSrc"]').textContent === art.template.$video.currentSrc
      art.info.show = true
      art.template.$infoClose.click()
      const result = { fields: Object.keys(art.info), prototype: Object.getOwnPropertyNames(Object.getPrototypeOf(art.info)), volume, source, visible: art.info.show }
      art.destroy()
      return result
    })).toEqual({ fields: ['id', 'art', 'cache', 'add', 'remove', 'update', 'name'], prototype: ['constructor', 'init'], volume: '0.40', source: true, visible: false })
  })

  test(`${core}: info retains native nullable string conversion for custom media fields`, async ({ page }) => {
    await setup(page, core, true)
    expect(await page.evaluate(() => {
      const art = window.art
      const item = document.createElement('span')
      item.dataset.video = 'fixtureValue'
      art.template.$infoPanel.append(item)
      const values = [null, undefined, true, 1.234, Number.NaN, Infinity, { toString: () => 'custom' }]
      const result = values.map((value) => {
        art.template.$video.fixtureValue = value
        art.info.init()
        return item.textContent
      })
      art.template.$video.fixtureValue = Symbol('not text')
      let failed
      try {
        art.info.init()
      }
      catch (error) {
        failed = error.name
      }
      art.destroy()
      return { result, failed }
    })).toEqual({ result: ['', '', 'true', '1.23', 'NaN', 'Infinity', 'custom'], failed: 'TypeError' })
  })

  test(`${core}: repeated info init owns only one new timer and close handler`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const set = window.setTimeout
      const clear = window.clearTimeout
      const pending = new Set()
      window.setTimeout = function (callback, delay, ...args) {
        const timer = set.call(this, callback, delay, ...args)
        if (delay === 24736)
          pending.add(timer)
        return timer
      }
      window.clearTimeout = function (timer) {
        pending.delete(timer)
        return clear.call(this, timer)
      }
      art.constructor.INFO_LOOP_TIME = 24736
      art.info.init()
      art.info.init()
      let closed = 0
      art.on('info', state => !state && closed++)
      art.info.show = true
      art.template.$infoClose.click()
      const timers = pending.size
      art.destroy()
      const result = { timers, closed, remaining: pending.size }
      window.setTimeout = set
      window.clearTimeout = clear
      return result
    })).toEqual({ timers: core === 'candidate' ? 1 : 2, closed: core === 'candidate' ? 1 : 3, remaining: 0 })
  })

  test(`${core}: info mobile construction waits for an explicit init`, async ({ page }) => {
    await setup(page, core, true)
    expect(await page.evaluate(() => {
      const art = window.art
      const node = art.template.$infoPanel.querySelector('[data-video="volume"]')
      const before = node.textContent
      art.template.$video.volume = 0.4
      art.info.init()
      const after = node.textContent
      art.destroy()
      return { before, after }
    })).toEqual({ before: '', after: '0.40' })
  })

  test(`${core}: mask click plays native video and destruction displays the terminal icon`, async ({ page }) => {
    await setup(page, core)
    await page.evaluate(() => window.art.template.$state.click())
    await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    expect(await page.evaluate(() => {
      const art = window.art
      const state = art.template.$state.querySelector('.art-icon-state')
      const error = art.template.$state.querySelector('.art-icon-error')
      art.loading.show = true
      const loading = art.loading.show
      const icon = Boolean(art.template.$loading.querySelector('.art-icon-loading'))
      art.destroy(false)
      return { loading, icon, state: state.style.display, error: error.style.display }
    })).toEqual({ loading: true, icon: true, state: 'none', error: '' })
  })
}

test('candidate: info destruction during a media getter prevents text writes and late init', async ({ page }) => {
  await setup(page, 'candidate')
  const result = await page.evaluate(() => {
    const art = window.art
    const node = art.template.$infoPanel.querySelector('[data-video="volume"]')
    const before = node.textContent
    Object.defineProperty(art.template.$video, 'volume', { configurable: true, get() {
      art.destroy(false)
      return 0.8
    } })
    art.info.init()
    const after = node.textContent
    art.info.init()
    return { before, after, destroyed: art.isDestroy }
  })
  expect(result.after).toBe(result.before)
  expect(result.destroyed).toBe(true)
})

test('candidate: reentrant info text conversion cannot write after player destruction', async ({ page }) => {
  await setup(page, 'candidate', true)
  expect(await page.evaluate(() => {
    const art = window.art
    const item = document.createElement('span')
    item.dataset.video = 'fixtureValue'
    item.textContent = 'before'
    art.template.$infoPanel.append(item)
    art.template.$video.fixtureValue = { toString() {
      art.destroy(false)
      return 'late'
    } }
    art.info.init()
    return { text: item.textContent, destroyed: art.isDestroy }
  })).toEqual({ text: 'before', destroyed: true })
})

test('candidate: mask finalization follows an earlier throwing observer without replacing its error', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  expect(await page.evaluate(() => {
    const failure = new Error('early observer failed')
    const art = new window.Artplayer({ container: '.player', url: '', layers: [{
      name: 'observer',
      html: '',
      mounted() {
        this.on('destroy', () => {
          throw failure
        })
      },
    }] })
    let original = false
    try {
      art.destroy(false)
    }
    catch (error) {
      original = error === failure
    }
    return { original, destroyed: art.isDestroy, state: art.template.$state.querySelector('.art-icon-state').style.display, error: art.template.$state.querySelector('.art-icon-error').style.display }
  })).toEqual({ original: true, destroyed: true, state: 'none', error: '' })
})
