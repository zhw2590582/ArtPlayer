import { hash } from '../../refactor/scripts/releases.mjs'
import { mbCandidate } from '../helpers/mediabunny.js'
import { expect, test } from './fixtures.js'

const implementation = await mbCandidate()
for (const core of ['published', 'candidate']) {
  for (const scenario of ['native-cleanup', 'replacement']) {
    test(`MediaBunny ${implementation.name}: ${core} core native Canvas entry ${scenario}`, async ({ page }, testInfo) => {
      await page.goto(`/test/player.html?core=${core}`)
      await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports;
        ${implementation.code}; window.mbFactory = module.exports.default || module.exports; })();` })
      const result = await page.evaluate((scenario) => {
        const registered = []
        const removed = []
        const art = new window.Artplayer({
          container: '.player',
          url: '',
          proxy(player) {
            const on = player.on
            const off = player.off
            player.on = function (name, callback) {
              registered.push({ name, callback })
              return on.call(this, name, callback)
            }
            player.off = function (name, callback) {
              removed.push({ name, callback })
              return off.call(this, name, callback)
            }
            return window.mbFactory()(player)
          },
        })
        const canvas = art.video
        const shim = art.mediabunny
        const resize = registered.find(item => item.name === 'resize')
        const metadata = registered.find(item => item.name === 'video:loadedmetadata')
        const destroy = registered.find(item => item.name === 'destroy')
        const receiver = canvas.getContext
        const bounds = canvas.getBoundingClientRect
        const attributes = canvas.setAttribute
        const identity = canvas instanceof HTMLCanvasElement && shim.canvas === canvas
        const context = receiver('2d')?.canvas === canvas
        const width = bounds().width
        let clickCount = 0
        canvas.addEventListener('click', () => clickCount++)
        canvas.dispatchEvent(new MouseEvent('click'))
        attributes('src', 'native-only.mp4')
        canvas.volume = 0.35
        art.emit('resize')
        // Core sizing listeners may reset inline styles after proxy resize; isolate its callback.
        resize.callback()
        const before = { identity, context, width, clickCount, source: shim.src, attribute: canvas.getAttribute('src'), volume: shim.volume, style: canvas.style.width, maybe: canvas.canPlayType('video/unknown') }
        const marker = { owner: 'replacement' }
        if (scenario === 'replacement')
          art.mediabunny = marker
        art.destroy(false)
        canvas.style.width = '43px'
        resize.callback()
        metadata.callback()
        const cleanup = {
          released: [resize, metadata, destroy].map(item => removed.some(entry => entry.name === item.name && entry.callback === item.callback)),
          destroyed: shim.engine.destroyed,
          styleAfter: canvas.style.width,
          alias: scenario === 'replacement' ? art.mediabunny === marker : !Object.hasOwn(art, 'mediabunny'),
        }
        return { before, cleanup, coreVersion: window.Artplayer.version }
      }, scenario)
      expect(result.before).toEqual({ identity: true, context: true, width: 640, clickCount: 1, source: null, attribute: 'native-only.mp4', volume: 0.35, style: '100%', maybe: 'maybe' })
      expect(result.cleanup).toEqual({ released: [true, true, true], destroyed: true, styleAfter: '43px', alias: true })
      await testInfo.attach('mediabunny-entry', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), core, scenario, result, scope: 'Actual browser Canvas descriptors and published/candidate core lifecycle. Empty source deliberately excludes decoding; existing media suites cover playback separately.' }) })
    })
  }
}
