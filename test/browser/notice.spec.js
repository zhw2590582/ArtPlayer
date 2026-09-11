import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.evaluate(() => {
    window.Artplayer.NOTICE_TIME = 24733
    window.art.notice.destroy()
  })
}

for (const core of ['published', 'candidate']) {
  test(`${core}: notice updates do not call a consumer override of destroy`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const notice = window.art.notice
      const original = notice.destroy
      let calls = 0
      notice.destroy = function () {
        calls++
        return original.call(this)
      }
      notice.show = 'first'
      notice.show = 'second'
      const implicit = calls
      notice.destroy()
      const explicit = calls
      window.art.destroy()
      return { implicit, explicit }
    })).toEqual({ implicit: 0, explicit: 1 })
  })

  test(`${core}: notice preserves public shape, Error text and false hide semantics`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const notice = art.notice
      notice.show = new Error('  trimmed  ')
      const visible = notice.show
      const text = art.template.$noticeInner.textContent
      const timer = notice.timer
      notice.show = false
      const result = {
        fields: Object.keys(notice),
        prototype: Object.getOwnPropertyNames(Object.getPrototypeOf(notice)),
        visible,
        text,
        hidden: !notice.show,
        retained: art.template.$noticeInner.textContent,
        sameTimer: timer === notice.timer,
      }
      notice.destroy()
      art.destroy()
      return result
    })).toEqual({ fields: ['art', 'timer'], prototype: ['constructor', 'destroy', 'show'], visible: true, text: 'trimmed', hidden: true, retained: 'trimmed', sameTimer: true })
  })

  test(`${core}: notice expires naturally during real playback`, async ({ page }) => {
    await setup(page, core)
    await page.evaluate(() => window.art.play())
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    await page.evaluate(() => {
      window.Artplayer.NOTICE_TIME = 20
      window.art.notice.show = 'transient'
    })
    await expect.poll(() => page.evaluate(() => ({ visible: window.art.notice.show, text: window.art.template.$noticeInner.textContent }))).toEqual({ visible: false, text: '' })
    expect(await page.evaluate(() => window.art.playing)).toBe(true)
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: manual notice destroy permits reuse and does not hide its DOM`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const notice = window.art.notice
      notice.show = 'visible'
      notice.destroy()
      const visible = notice.show
      const timer = notice.timer
      notice.show = 'reused'
      const reused = window.art.template.$noticeInner.textContent
      notice.destroy()
      window.art.destroy()
      return { visible, timer, reused }
    })).toEqual({ visible: true, timer: null, reused: 'reused' })
  })

  test(`${core}: destruction during notice text assignment cannot schedule a late timer`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const notice = art.notice
      const inner = art.template.$noticeInner
      const descriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')
      Object.defineProperty(inner, 'textContent', {
        configurable: true,
        get() {
          return descriptor.get.call(this)
        },
        set(value) {
          descriptor.set.call(this, value)
          art.destroy(false)
        },
      })
      notice.show = 'destroy during write'
      const result = { destroyed: art.isDestroy, timer: notice.timer !== null, visible: notice.show }
      notice.destroy()
      return result
    })).toEqual({ destroyed: true, timer: core === 'published', visible: core === 'published' })
  })

  test(`${core}: expiry does not hide a notice installed during the clearing write`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const inner = art.template.$noticeInner
      const descriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')
      const original = window.setTimeout
      let expire
      window.setTimeout = function (callback, delay, ...args) {
        if (delay === 24733)
          expire = callback
        return original.call(this, callback, delay, ...args)
      }
      art.notice.show = 'old'
      Object.defineProperty(inner, 'textContent', {
        configurable: true,
        get() {
          return descriptor.get.call(this)
        },
        set(value) {
          descriptor.set.call(this, value)
          if (value === '')
            art.notice.show = 'nested'
        },
      })
      expire()
      const result = { text: inner.textContent, visible: art.notice.show }
      window.setTimeout = original
      art.notice.destroy()
      art.destroy()
      return result
    })).toEqual({ text: 'nested', visible: core === 'candidate' })
  })
}

test('candidate: retained callbacks and assignments cannot revive destroyed notice resources', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const original = window.setTimeout
    const callbacks = []
    window.setTimeout = function (callback, delay, ...args) {
      if (delay === 24733)
        callbacks.push(callback)
      return original.call(this, callback, delay, ...args)
    }
    art.notice.show = 'old'
    art.notice.show = 'new'
    callbacks[0]()
    const before = art.template.$noticeInner.textContent
    art.destroy(false)
    callbacks[1]()
    art.notice.show = 'ignored'
    window.setTimeout = original
    return { before, after: art.template.$noticeInner.textContent, timer: art.notice.timer, calls: callbacks.length }
  })).toEqual({ before: 'new', after: 'new', timer: null, calls: 2 })
})
