import { hash } from '../../refactor/scripts/releases.mjs'
import { mbCandidate } from '../helpers/mediabunny.js'
import { expect, test } from './fixtures.js'

const implementation = await mbCandidate()
for (const ending of ['destroy', 'source', 'timeout']) {
  test(`MediaBunny ${implementation.name}: native pending stream cancelled by ${ending}`, async ({ page }, testInfo) => {
    await page.goto('/test/player.html?core=published')
    await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports;
      ${implementation.code}; window.mbFactory = module.exports.default || module.exports; })();` })
    await page.evaluate(() => {
      const listeners = new Map()
      window.mbCancelled = []
      window.mbEvents = []
      window.mbHost = {
        constructor: window.Artplayer,
        option: { url: '', autoSize: false },
        template: { $player: document.querySelector('.player') },
        on(name, callback) {
          const list = listeners.get(name) || []
          list.push(callback)
          listeners.set(name, list)
        },
        emit(name, ...args) {
          window.mbEvents.push(name)
          for (const callback of listeners.get(name) || []) callback(...args)
        },
      }
      window.mbCanvas = window.mbFactory({ loadTimeout: 1000 })(window.mbHost)
      window.mbStream = new ReadableStream({ cancel() {
        window.mbCancelled.push('old')
      } })
      window.mbSettled = false
      window.mbLoad = window.mbCanvas.engine.load(window.mbStream).then(() => window.mbSettled = true)
    })
    try {
      await expect.poll(() => page.evaluate(() => window.mbStream.locked)).toBe(true)
      expect(await page.evaluate(() => window.mbSettled)).toBe(false)
      await page.evaluate((ending) => {
        if (ending === 'destroy')
          window.mbHost.emit('destroy')
        if (ending === 'source') {
          window.mbReplacement = new ReadableStream({ cancel() {
            window.mbCancelled.push('new')
          } })
          window.mbNextLoad = window.mbCanvas.engine.load(window.mbReplacement)
        }
      }, ending)
      await expect.poll(() => page.evaluate(() => window.mbSettled)).toBe(true)
      expect(await page.evaluate(() => window.mbCancelled)).toEqual(['old'])
      const state = await page.evaluate(() => ({ error: window.mbCanvas.error, readyState: window.mbCanvas.readyState, events: window.mbEvents, input: window.mbCanvas.engine.input === null }))
      expect(state.input).toBe(true)
      expect(state.readyState).toBe(0)
      expect(state.events.filter(name => ['video:loadedmetadata', 'video:loadeddata', 'video:canplay'].includes(name))).toEqual([])
      expect(state.error).toEqual(ending === 'timeout' ? { code: 4, message: 'Load timeout' } : null)
      if (ending === 'source')
        await expect.poll(() => page.evaluate(() => window.mbReplacement.locked)).toBe(true)
      await page.evaluate(() => window.mbHost.emit('destroy'))
      await expect.poll(() => page.evaluate(() => window.mbCancelled)).toEqual(ending === 'source' ? ['old', 'new'] : ['old'])
      await testInfo.attach('mediabunny-load-cancellation', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), ending, state, cancellations: await page.evaluate(() => window.mbCancelled), scope: 'Real browser ReadableStream and actual SDK Input disposal before first media bytes; real timeout; controlled ArtPlayer host; does not assert decoder, late frame or audio-node cleanup.' }) })
    }
    finally {
      await page.evaluate(() => window.mbHost.emit('destroy'))
    }
  })
}
