import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import vm from 'node:vm'
import { checkCoreVendors } from '../refactor/scripts/core-vendor.mjs'

test('copied core libraries match fixed references plus reviewed local adaptations', async () => {
  const evidence = await checkCoreVendors()
  assert.equal(evidence.sources.length, 4)
})

const methods = [
  ['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange'],
  ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange'],
  ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange'],
  ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange'],
  ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange'],
]
const source = fs.readFileSync(new URL('../packages/artplayer/src/libs/screenfull.js', import.meta.url), 'utf8').replace('export default screenfull', 'globalThis.result = screenfull')

for (const [request, exit, element, enabled, change] of methods) {
  test(`screenfull preserves ${request} mapping, options, promise completion and listeners`, async () => {
    const listeners = new Map()
    const options = { navigationUI: 'hide' }
    const document = {
      [element]: null,
      [enabled]: true,
      [exit]() {
        this[element] = null
        listeners.get(change)?.()
        return Promise.resolve()
      },
      addEventListener(name, callback) { listeners.set(name, callback) },
      removeEventListener(name, callback) {
        if (listeners.get(name) === callback)
          listeners.delete(name)
      },
    }
    document.documentElement = {
      [request](actual) {
        assert.equal(actual, options)
        document[element] = this
        listeners.get(change)?.()
        return Promise.resolve()
      },
    }
    const context = { document, Promise }
    vm.runInNewContext(source, context)
    const screenfull = context.result
    assert.equal(screenfull.isEnabled, true)
    assert.equal(screenfull.element, null)
    assert.equal(await screenfull.request(undefined, options), undefined)
    assert.equal(screenfull.element, document.documentElement)
    assert.equal(screenfull.isFullscreen, true)
    assert.equal(listeners.size, 0)
    assert.equal(await screenfull.toggle(), undefined)
    assert.equal(screenfull.isFullscreen, false)
    assert.equal(listeners.size, 0)
  })
}

test('screenfull import remains inert without document and retains local disabled surface', () => {
  const context = {}
  vm.runInNewContext(source, context)
  assert.equal(typeof context.result.request, 'function')
  assert.equal(context.result.raw, false)
  const browser = { document: {} }
  vm.runInNewContext(source, browser)
  assert.equal(browser.result.isEnabled, false)
  assert.equal(browser.result.element, undefined)
})
