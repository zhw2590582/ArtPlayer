import { hash } from '../../refactor/scripts/releases.mjs'
import { createVastSdk } from '../helpers/vast-sdk.js'
import { vastImplementations } from '../helpers/vast.js'
import { expect, test } from './fixtures.js'

const implementations = await vastImplementations()

async function setup(page, core, implementation, testInfo, deferLoad = false) {
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: `window.createVastSdk = ${createVastSdk.toString()};` })
  await page.evaluate((deferLoad) => {
    window.vastSdk = window.createVastSdk({ deferLoad })
    window.google = { ima: window.vastSdk.ima }
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true })
  }, deferLoad)
  await page.addScriptTag({ content: `(() => {
    const module = { exports: {} };
    const exports = module.exports;
    const require = name => {
      if (name !== '@glomex/vast-ima-player') throw new Error('Unexpected dependency: ' + name);
      return window.vastSdk.sdk;
    };
    ${implementation.code}
    window.artplayerPluginVast = module.exports.default || module.exports;
  })();` })
  await testInfo.attach('vast-inputs', { contentType: 'application/json', body: JSON.stringify({ core, implementation: implementation.name, sha256: hash(implementation.code), sdk: 'controlled wrapper recorder, no IMA execution' }) })
}

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => ({
    destroyed: window.art?.isDestroy,
    callbackCalls: window.vastCalls,
    players: window.vastSdk?.state.players.map(player => ({ requests: player.requests, destroyCalls: player.destroyCalls, connected: player.args[2].isConnected, display: player.args[2].style.display })),
    coreVersion: window.Artplayer?.version,
  }))
  await testInfo.attach('vast-state', { contentType: 'application/json', body: JSON.stringify(state) })
  await page.evaluate(() => {
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
    // Historical wrappers leak; explicit fixture cleanup runs only after assertions/evidence.
    for (const player of window.vastSdk?.state.players || []) player.destroy()
  })
})

for (const core of ['published-5.1.7', 'published', 'candidate']) {
  for (const implementation of implementations) {
    const label = `${core} / ${implementation.name}`
    test(`${label}: async SDK and callback gate real core registration and preserve requests`, async ({ page }, testInfo) => {
      await setup(page, core, implementation, testInfo, true)
      await page.evaluate(() => {
        window.vastCalls = 0
        window.vastDone = false
        const gate = new Promise((resolve) => {
          window.finishVastCallback = resolve
        })
        window.vastRegistration = window.art.plugins.add(window.artplayerPluginVast(async (context) => {
          window.vastContext = context
          window.vastCalls++
          await gate
          context.playUrl('/test/ad-tag.xml')
          context.playRes('<VAST/>')
        })).then(() => {
          window.vastDone = true
        })
      })
      expect(await page.evaluate(() => ({ calls: window.vastCalls, players: window.vastSdk.state.players.length, registered: Object.hasOwn(window.art.plugins, 'artplayerPluginVast') }))).toEqual({ calls: 0, players: 0, registered: false })
      await page.evaluate(() => window.vastSdk.resolveLoad())
      await expect.poll(() => page.evaluate(() => window.vastCalls)).toBe(1)
      expect(await page.evaluate(() => window.vastDone)).toBe(false)
      expect(await page.evaluate(() => Object.hasOwn(window.art.plugins, 'artplayerPluginVast'))).toBe(false)
      await page.evaluate(() => window.finishVastCallback())
      await page.evaluate(() => window.vastRegistration)
      const result = await page.evaluate(() => ({
        done: window.vastDone,
        name: window.art.plugins.artplayerPluginVast.name,
        requests: window.vastSdk.state.players[0].requests,
        owned: window.vastSdk.state.players[0].args[2].parentNode === window.art.template.$player,
        video: window.vastSdk.state.players[0].args[1] === window.art.template.$video,
      }))
      expect(result).toEqual({ done: true, name: 'artplayerPluginVast', requests: [{ adTagUrl: '/test/ad-tag.xml' }, { adsResponse: '<VAST/>' }], owned: true, video: true })
    })

    test(`${label}: SDK rejection stays observable and core can still play content`, async ({ page }, testInfo) => {
      await setup(page, core, implementation, testInfo, true)
      const result = await page.evaluate(async () => {
        const failure = new Error('controlled SDK failure')
        let calls = 0
        const registration = window.art.plugins.add(window.artplayerPluginVast(() => calls++))
        const observed = registration.catch(error => error === failure)
        window.vastSdk.rejectLoad(failure)
        return { sameFailure: await observed, calls, players: window.vastSdk.state.players.length, registered: Object.hasOwn(window.art.plugins, 'artplayerPluginVast') }
      })
      expect(result).toEqual({ sameFailure: true, calls: 0, players: 0, registered: false })
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.evaluate(() => {
        document.querySelector('#play').onclick = () => window.art.play()
      })
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.2)
      expect(await page.evaluate(() => window.art.template.$video.videoWidth)).toBeGreaterThan(0)
    })

    if (!implementation.published) {
      test(`${label}: real overlay follows SDK events and explicit cleanup supports inactive recreation`, async ({ page }, testInfo) => {
        await setup(page, core, implementation, testInfo)
        await page.evaluate(async () => {
          await window.art.plugins.add(window.artplayerPluginVast((context) => {
            window.vastContext = context
          }))
          window.vastContext.playUrl('/first.xml')
        })
        const container = page.locator('[id^="art-vast-"]')
        await expect(container).toHaveCount(1)
        await expect(container).toBeHidden()
        await page.evaluate(() => window.vastContext.imaPlayer.emit('AdStarted'))
        await expect(container).toBeVisible()
        await page.evaluate(() => {
          window.vastContext.playUrl('/suppressed.xml')
          window.vastContext.imaPlayer.emit('AdError', { code: 301 })
        })
        await expect(container).toBeHidden()
        expect(await page.evaluate(() => window.vastContext.imaPlayer.requests.length)).toBe(1)
        await page.evaluate(() => {
          window.vastContext.playRes('<VAST/>')
          window.vastContext.imaPlayer.emit('AdContentPauseRequested')
        })
        await expect(container).toBeVisible()
        await page.evaluate(() => window.vastContext.imaPlayer.emit('AdContentResumeRequested'))
        await expect(container).toBeHidden()
        await page.evaluate(() => {
          window.art.plugins.artplayerPluginVast.destroy()
          window.art.plugins.artplayerPluginVast.destroy()
        })
        await expect(container).toHaveCount(0)
        expect(await page.evaluate(() => window.vastSdk.state.players[0].destroyCalls)).toBe(1)
        await page.evaluate(() => window.art.switchUrl('/test/pattern.mp4?source=next'))
        await expect.poll(() => page.evaluate(() => window.art.template.$video.currentSrc)).toContain('?source=next')
        await expect.poll(() => page.evaluate(() => window.art.template.$video.videoWidth)).toBeGreaterThan(0)
        await page.evaluate(() => window.vastContext.playUrl('/new-session.xml'))
        await expect(container).toHaveCount(1)
        expect(await page.evaluate(() => window.vastSdk.state.players[1].requests[0].adTagUrl)).toBe('/new-session.xml')
        expect(await page.evaluate(() => window.vastSdk.state.players[1].args[1] === window.art.template.$video)).toBe(true)
      })
    }

    if (implementation.historical) {
      test(`${label} historical: late SDK after destroy allocates into the detached player`, async ({ page }, testInfo) => {
        await setup(page, core, implementation, testInfo, true)
        await page.evaluate(() => {
          window.vastCalls = 0
          window.vastRegistration = window.art.plugins.add(window.artplayerPluginVast((context) => {
            window.vastCalls++
            context.playUrl('/late.xml')
          }))
          window.art.destroy()
          window.vastSdk.resolveLoad()
        })
        await page.evaluate(() => window.vastRegistration)
        expect(await page.evaluate(() => ({
          calls: window.vastCalls,
          players: window.vastSdk.state.players.length,
          destroys: window.vastSdk.state.players[0].destroyCalls,
          connected: window.vastSdk.state.players[0].args[2].isConnected,
          url: window.vastSdk.state.players[0].requests[0].adTagUrl,
        }))).toEqual({ calls: 1, players: 1, destroys: 0, connected: false, url: '/late.xml' })
      })
    }
    else {
      test(`${label}: candidate suppresses late SDK initialization after real core destruction`, async ({ page }, testInfo) => {
        await setup(page, core, implementation, testInfo, true)
        const state = await page.evaluate(async () => {
          let calls = 0
          const registration = window.art.plugins.add(window.artplayerPluginVast(() => calls++))
          window.art.destroy()
          window.vastSdk.resolveLoad()
          await registration
          return { calls, players: window.vastSdk.state.players.length }
        })
        expect(state).toEqual({ calls: 0, players: 0 })
      })

      test(`${label}: candidate isolates stale events and terminates recreated ads on core destroy`, async ({ page }, testInfo) => {
        await setup(page, core, implementation, testInfo)
        await page.evaluate(async () => {
          await window.art.plugins.add(window.artplayerPluginVast((context) => {
            window.vastContext = context
          }))
          window.vastContext.playUrl('/one.xml')
          const first = window.vastContext.imaPlayer
          window.lateVastEvents = [...first.listeners.values()].flatMap(values => [...values])
          first.emit('AdStarted')
        })
        const container = page.locator('[id^="art-vast-"]')
        await expect(container).toBeVisible()
        await page.evaluate(() => {
          window.art.plugins.artplayerPluginVast.destroy()
          window.vastContext.playUrl('/two.xml')
          for (const callback of window.lateVastEvents) callback({ detail: 'late' })
        })
        await expect(container).toBeHidden()
        expect(await page.evaluate(() => window.vastSdk.state.players.map(player => player.requests.length))).toEqual([1, 1])
        await page.evaluate(() => {
          window.art.destroy()
          window.vastContext.playUrl('/after-core-destroy.xml')
        })
        expect(await page.evaluate(() => window.vastContext.init())).toBe(null)
        expect(await page.evaluate(() => window.vastSdk.state.players.map(player => player.destroyCalls))).toEqual([1, 1])
        await expect(container).toHaveCount(0)
      })

      test(`${label}: candidate callback rejection cleans allocated SDK and DOM without destroying the core`, async ({ page }, testInfo) => {
        await setup(page, core, implementation, testInfo)
        const result = await page.evaluate(async () => {
          const failure = new Error('callback rejected')
          const registration = window.art.plugins.add(window.artplayerPluginVast((context) => {
            context.init()
            return Promise.reject(failure)
          }))
          return { sameError: await registration.catch(error => error === failure), destroys: window.vastSdk.state.players[0].destroyCalls, coreDestroyed: window.art.isDestroy }
        })
        expect(result).toEqual({ sameError: true, destroys: 1, coreDestroyed: false })
        await expect(page.locator('[id^="art-vast-"]')).toHaveCount(0)
      })
    }
  }
}
