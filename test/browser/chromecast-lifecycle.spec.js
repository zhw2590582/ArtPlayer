import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

let candidate
test.beforeAll(async () => {
  candidate = process.env.ARTPLAYER_CHROMECAST_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_CHROMECAST_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-chromecast', 'umd')
})

async function setup(page, core, testInfo, loaded = true) {
  const external = []
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url())
    const local = ['127.0.0.1', 'localhost'].includes(url.hostname)
    const localBlob = url.protocol === 'blob:' && url.origin === new URL(testInfo.project.use.baseURL).origin
    if (!local && !localBlob) {
      external.push(url.href)
      return route.abort()
    }
    return route.continue()
  })
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: candidate })
  await page.evaluate(async (loaded) => {
    const listeners = new Map()
    const stub = window.castStub = {
      requests: [],
      loads: [],
      options: [],
      callbacks: [[], []],
      starts: [0, 0],
      errors: [[], []],
      current: null,
      deferredRequest: false,
      previousCalls: [],
      emit(type, event) { for (const listener of [...(listeners.get(type) || [])]) listener(event) },
      count() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0) },
      sessionState(value) {
        this.emit('session', { sessionState: value, session: this.current })
      },
    }
    const session = {
      loadMedia(request) {
        return new Promise((resolve, reject) => stub.loads.push({ request, resolve, reject }))
      },
    }
    const context = {
      setOptions(option) { stub.options.push(option) },
      getCurrentSession() { return stub.current },
      addEventListener(type, listener) {
        if (!listeners.has(type))
          listeners.set(type, new Set())
        listeners.get(type).add(listener)
      },
      removeEventListener(type, listener) { listeners.get(type)?.delete(listener) },
      requestSession() {
        return new Promise((resolve) => {
          const accept = () => {
            stub.current = session
            stub.sessionState('SESSION_STARTED')
            // The real SDK resolves without returning the CastSession.
            resolve(undefined)
          }
          stub.requests.push({ accept })
          if (!stub.deferredRequest)
            accept()
        })
      },
    }
    window.installCastStub = () => {
      window.cast = { framework: {
        CastContext: { getInstance: () => context },
        CastContextEventType: { SESSION_STATE_CHANGED: 'session', CAST_STATE_CHANGED: 'availability' },
        SessionState: Object.fromEntries(['NO_SESSION', 'SESSION_STARTING', 'SESSION_STARTED', 'SESSION_RESUMED', 'SESSION_ENDING', 'SESSION_ENDED', 'SESSION_START_FAILED'].map(name => [name, name])),
        CastState: Object.fromEntries(['NO_DEVICES_AVAILABLE', 'NOT_CONNECTED', 'CONNECTING', 'CONNECTED'].map(name => [name, name])),
      } }
      window.chrome ||= {}
      window.chrome.cast = {
        AutoJoinPolicy: { ORIGIN_SCOPED: 'origin' },
        media: {
          DEFAULT_MEDIA_RECEIVER_APP_ID: 'controlled-receiver',
          MediaInfo: class { constructor(contentId, contentType) { Object.assign(this, { contentId, contentType }) } },
          LoadRequest: class { constructor(media) { this.media = media } },
        },
      }
    }
    if (loaded)
      window.installCastStub()
    window.previousCastCallback = (...args) => stub.previousCalls.push(args)
    window.__onGCastApiAvailable = window.previousCastCallback
    window.castPlayers = []
    window.registrationBefore = []
    for (let index = 0; index < 2; index++) {
      const container = index === 0 ? document.querySelector('.player') : document.body.appendChild(document.createElement('div'))
      container.id = `cast-player-${index}`
      container.style.cssText = 'width:480px;height:270px'
      const art = new window.Artplayer({ container, url: `/test/pattern.mp4?player=${index}`, muted: true, mutex: false })
      window.castPlayers.push(art)
      const registration = art.plugins.add(window.artplayerPluginChromecast({
        sdk: '/test/controlled-cast-sdk.js',
        onStateChange: state => stub.callbacks[index].push(state),
        onCastStart: () => stub.starts[index]++,
        onError: error => stub.errors[index].push(String(error)),
      }))
      window.registrationBefore.push({ promise: registration instanceof Promise, absent: !art.plugins.artplayerPluginChromecast })
      await registration
      art.controls.show = true
    }
  }, loaded)
  await expect.poll(() => page.evaluate(() => window.castPlayers.every(art => art.isReady))).toBe(true)
  await testInfo.attach('chromecast-controlled-browser-inputs', { contentType: 'application/json', body: JSON.stringify({ core, artifact: process.env.ARTPLAYER_CHROMECAST_ARTIFACT || 'candidate source', sha256: hash(candidate), sdk: 'controlled stub; no receiver, discovery, real SDK or Cast media playback acceptance', native: 'ArtPlayer core, DOM controls, browser click dispatch and local video' }) })
  return external
}

const button = (page, index) => page.locator(`#cast-player-${index} .art-control-chromecast`)
const icon = (page, index) => page.locator(`#cast-player-${index} .art-icon-cast`)
const loads = page => page.evaluate(() => window.castStub.loads.length)

test.afterEach(async ({ page }, testInfo) => {
  await page.evaluate(() => {
    for (const art of window.castPlayers || []) {
      if (!art.isDestroy)
        art.destroy()
    }
  })
  await testInfo.attach('chromecast-controlled-browser-state', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ version: window.Artplayer?.version, listeners: window.castStub?.count(), starts: window.castStub?.starts, errors: window.castStub?.errors, callbacks: window.castStub?.callbacks, controls: document.querySelectorAll('.art-control-chromecast').length }))) })
  expect(await page.evaluate(() => window.castStub?.count() ?? 0)).toBe(0)
})

for (const core of ['published-5.3.0', 'published', 'candidate']) {
  test(`${core}: Cast async registration and native clicks update the owning control`, async ({ page }, testInfo) => {
    const external = await setup(page, core, testInfo)
    expect(await page.evaluate(() => window.registrationBefore)).toEqual([{ promise: true, absent: true }, { promise: true, absent: true }])
    await expect(button(page, 0)).toHaveCount(1)
    await expect(button(page, 1)).toHaveCount(1)
    await button(page, 1).click()
    await expect.poll(() => loads(page)).toBe(1)
    await expect(icon(page, 1)).toHaveCSS('color', 'rgb(255, 0, 0)')
    expect(await icon(page, 0).evaluate(node => node.style.color)).toBe('')
    expect(await page.evaluate(() => window.castStub.loads[0].request.media)).toEqual({ contentId: '/test/pattern.mp4?player=1', contentType: 'video/mp4' })
    await button(page, 1).click()
    expect(await loads(page)).toBe(1)
    await page.evaluate(() => window.castStub.loads[0].resolve(undefined))
    await expect.poll(() => page.evaluate(() => window.castStub.starts)).toEqual([0, 1])
    await button(page, 0).click()
    await expect.poll(() => loads(page)).toBe(2)
    expect(await page.evaluate(() => window.castStub.requests.length)).toBe(1)
    await page.evaluate(() => {
      window.castStub.sessionState('SESSION_RESUMED')
      window.castStub.loads[1].resolve(undefined)
    })
    await expect(icon(page, 0)).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect.poll(() => page.evaluate(() => window.castStub.starts)).toEqual([1, 1])
    expect(await page.evaluate(() => [window.castStub.options.length, window.castStub.count()])).toEqual([1, 4])
    expect(external).toEqual([])
  })

  test(`${core}: concurrent Cast controls share one local SDK load and release a destroyed waiter`, async ({ page }, testInfo) => {
    let sdkRoute
    let finish
    const held = new Promise(resolve => finish = resolve)
    const external = await setup(page, core, testInfo, false)
    const requests = []
    await page.route('**/test/controlled-cast-sdk.js', async (route) => {
      requests.push(route.request().url())
      sdkRoute = route
      await held
      await route.fulfill({ contentType: 'text/javascript', body: 'window.installCastStub(); window.__onGCastApiAvailable(true);' })
    })
    try {
      await button(page, 0).click()
      await button(page, 1).click()
      await expect.poll(() => Boolean(sdkRoute)).toBe(true)
      expect(requests).toHaveLength(1)
      expect(await page.locator('script[src="/test/controlled-cast-sdk.js"]').count()).toBe(1)
      await page.evaluate(() => window.castPlayers[0].destroy())
      finish()
      await expect.poll(() => loads(page)).toBe(1)
      expect(await page.evaluate(() => [window.castStub.options.length, window.castStub.count(), window.__onGCastApiAvailable === window.previousCastCallback])).toEqual([1, 2, true])
      expect(await page.evaluate(() => window.castStub.previousCalls)).toEqual([[true, undefined]])
      await page.evaluate(() => window.castStub.loads[0].resolve(undefined))
      await expect.poll(() => page.evaluate(() => window.castStub.starts)).toEqual([0, 1])
      expect(await page.evaluate(() => window.castStub.callbacks[0])).toEqual([])
      expect(external).toEqual([])
    }
    finally { finish() }
  })

  test(`${core}: Cast terminal states clear native controls and suppress stale media success`, async ({ page }, testInfo) => {
    const external = await setup(page, core, testInfo)
    for (const [index, state] of ['SESSION_ENDED', 'SESSION_START_FAILED', 'NO_SESSION'].entries()) {
      await button(page, 1).click()
      await expect.poll(() => loads(page)).toBe(index + 1)
      await expect(icon(page, 1)).toHaveCSS('color', 'rgb(255, 0, 0)')
      await page.evaluate(() => window.castStub.sessionState('SESSION_ENDING'))
      await expect(icon(page, 1)).toHaveCSS('color', 'rgb(255, 165, 0)')
      await page.evaluate((state) => {
        window.castStub.current = null
        window.castStub.sessionState(state)
      }, state)
      await expect(icon(page, 1)).toHaveCSS('color', 'rgb(255, 255, 255)')
      expect(await page.evaluate(() => {
        const plugin = window.castPlayers[1].plugins.artplayerPluginChromecast
        return [plugin.getCastState(), plugin.isCasting()]
      })).toEqual([state, false])
      await page.evaluate(index => window.castStub.loads[index].resolve(undefined), index)
      expect(await page.evaluate(() => window.castStub.starts)).toEqual([0, 0])
    }
    await button(page, 1).click()
    await expect.poll(() => loads(page)).toBe(4)
    await page.evaluate(() => window.castStub.loads[3].resolve(undefined))
    await expect.poll(() => page.evaluate(() => window.castStub.starts)).toEqual([0, 1])
    expect(external).toEqual([])
  })

  test(`${core}: destroy unbinds Cast listeners during pending session and media operations`, async ({ page }, testInfo) => {
    const external = await setup(page, core, testInfo)
    await page.evaluate(() => window.castStub.deferredRequest = true)
    await button(page, 0).click()
    await expect.poll(() => page.evaluate(() => window.castStub.requests.length)).toBe(1)
    expect(await page.evaluate(() => window.castStub.count())).toBe(2)
    await page.evaluate(() => {
      window.castPlayers[0].destroy()
      window.castStub.requests[0].accept()
    })
    expect(await loads(page)).toBe(0)
    expect(await page.evaluate(() => [window.castStub.count(), window.castPlayers[0].plugins.artplayerPluginChromecast.isCasting()])).toEqual([0, false])
    await button(page, 1).click()
    await expect.poll(() => loads(page)).toBe(1)
    await page.evaluate(() => {
      window.castPlayers[1].destroy()
      window.castStub.loads[0].resolve(undefined)
      window.castStub.sessionState('SESSION_STARTED')
    })
    expect(await page.evaluate(() => [window.castStub.count(), window.castStub.starts, window.castStub.callbacks])).toEqual([0, [0, 0], [[], []]])
    await expect(button(page, 0)).toHaveCount(0)
    await expect(button(page, 1)).toHaveCount(0)
    expect(external).toEqual([])
  })

  test(`${core}: native Cast click reports media rejection once and permits retry`, async ({ page }, testInfo) => {
    const external = await setup(page, core, testInfo)
    await button(page, 1).click()
    await expect.poll(() => loads(page)).toBe(1)
    await page.evaluate(() => window.castStub.loads[0].reject(new Error('Controlled media load failure')))
    await expect.poll(() => page.evaluate(() => window.castStub.errors)).toEqual([[], ['Error: Controlled media load failure']])
    await expect(page.locator('#cast-player-1 .art-notice')).toContainText('Error casting media')
    expect(await page.evaluate(() => window.castStub.starts)).toEqual([0, 0])
    await button(page, 1).click()
    await expect.poll(() => loads(page)).toBe(2)
    await page.evaluate(() => window.castStub.loads[1].resolve(undefined))
    await expect.poll(() => page.evaluate(() => window.castStub.starts)).toEqual([0, 1])
    await expect(page.locator('#cast-player-1 .art-notice')).toContainText('Casting started')
    expect(await page.evaluate(() => window.castStub.errors)).toEqual([[], ['Error: Controlled media load failure']])
    expect(external).toEqual([])
  })
}
