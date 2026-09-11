import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import vm from 'node:vm'
import { build } from 'esbuild'
import { loadPublishedCore, resolveSource } from './helpers/load.js'

const output = await build({ entryPoints: [resolveSource('packages/artplayer/src/utils/compatibility')], bundle: true, write: false, platform: 'node', format: 'cjs' })
const code = output.outputFiles[0].text
function evaluate(globals = {}) {
  const module = { exports: {} }
  const context = Object.defineProperties({ module, exports: module.exports }, Object.getOwnPropertyDescriptors(globals))
  vm.runInNewContext(code, context)
  return module.exports
}

test('environment flags preserve custom UA priority, empty overrides and native touch detection', () => {
  const native = { userAgent: 'Macintosh Safari', maxTouchPoints: 1 }
  const globals = { navigator: native, window: {}, document: {} }
  const mac = evaluate(globals)
  assert.equal(mac.isSafari, true)
  assert.equal(mac.isIOS13, true)
  assert.equal(mac.isMobile, true)
  assert.equal(mac.isBrowser, true)
  const empty = evaluate({ ...globals, CUSTOM_USER_AGENT: '' })
  assert.equal(empty.userAgent, '')
  assert.equal(empty.isMobile, false)
  const phone = evaluate({ ...globals, CUSTOM_USER_AGENT: 'iPhone Safari' })
  assert.equal(phone.isIOS, true)
  const excluded = evaluate({ ...globals, CUSTOM_USER_AGENT: 'iPhone Safari', window: { MSStream: {} } })
  assert.equal(excluded.isIOS, false)
})

test('SSR custom iOS and Macintosh UAs do not dereference absent browser globals', async () => {
  for (const ua of ['iPhone Safari', 'Macintosh Safari']) {
    await assert.rejects(loadPublishedCore({ CUSTOM_USER_AGENT: ua }), error => error.name === 'ReferenceError')
    const candidate = evaluate({ CUSTOM_USER_AGENT: ua })
    assert.equal(candidate.isBrowser, false)
    assert.equal(candidate.userAgent, ua)
    assert.equal(candidate.isMobile, ua.startsWith('iPhone'))
  }
  assert.equal(evaluate().userAgent, '')
})

test('a custom user agent retains lazy access to the native navigator', () => {
  const globals = { CUSTOM_USER_AGENT: 'Android Chrome' }
  Object.defineProperty(globals, 'navigator', { get() {
    throw new Error('navigator must not be read')
  } })
  const result = evaluate(globals)
  assert.equal(result.userAgent, 'Android Chrome')
  assert.equal(result.isMobile, true)
})
