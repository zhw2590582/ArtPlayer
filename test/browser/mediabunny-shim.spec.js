import { hash } from '../../refactor/scripts/releases.mjs'
import { mbCandidate } from '../helpers/mediabunny.js'
import { expect, test } from './fixtures.js'

const implementation = await mbCandidate()
for (const scenario of ['callback', 'destroy', 'independent']) {
  test(`MediaBunny ${implementation.name}: native synthetic RAF ${scenario}`, async ({ page }, testInfo) => {
    await page.goto('/test/player.html?core=published')
    await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports;
      ${implementation.code}; window.mbFactory = module.exports.default || module.exports; })();` })
    const result = await page.evaluate(async (scenario) => {
      function create() {
        const listeners = new Map()
        const host = {
          constructor: window.Artplayer,
          option: { url: '', autoSize: false },
          template: { $player: document.querySelector('.player') },
          on(name, callback) {
            const list = listeners.get(name) || []
            list.push(callback)
            listeners.set(name, list)
          },
          emit(name, ...args) {
            for (const callback of listeners.get(name) || []) callback(...args)
          },
        }
        const canvas = window.mbFactory()(host)
        return { host, canvas }
      }
      const first = create()
      const second = scenario === 'independent' ? create() : null
      const calls = []
      const id = first.canvas.requestVideoFrameCallback((time, metadata) => calls.push({ owner: 'first', time: typeof time, mediaTime: metadata.mediaTime, presentedFrames: metadata.presentedFrames }))
      second?.canvas.requestVideoFrameCallback(() => calls.push({ owner: 'second' }))
      if (scenario !== 'callback') {
        first.host.emit('destroy')
        first.canvas.requestVideoFrameCallback(() => calls.push({ owner: 'after-destroy' }))
      }
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      first.host.emit('destroy')
      second?.host.emit('destroy')
      return { idType: typeof id, calls, listeners: first.canvas.events.listeners.size }
    }, scenario)
    expect(result.idType).toBe('number')
    expect(result.listeners).toBe(0)
    expect(result.calls).toEqual(scenario === 'callback' ? [{ owner: 'first', time: 'number', mediaTime: 0, presentedFrames: 0 }] : scenario === 'independent' ? [{ owner: 'second' }] : [])
    await testInfo.attach('mediabunny-shim-frames', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), scenario, result, scope: 'Real browser requestAnimationFrame and actual proxy instances; synthetic metadata is preserved, no decoding or video frame accuracy is claimed.' }) })
  })
}
