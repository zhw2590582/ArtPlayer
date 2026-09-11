import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Verify the actual compiled entry in isolated server environments.
import { test } from 'node:test'
import vm from 'node:vm'
import { compilePackage, loadPublishedCore } from './helpers/load.js'

const source = await compilePackage('artplayer', 'umd')

test('the complete core imports without DOM or timers for ordinary and custom-UA server environments', async () => {
  for (const userAgent of [undefined, '', 'iPhone Safari', 'Macintosh Safari', 'Android Chrome']) {
    const module = { exports: {} }
    let timers = 0
    const globals = { module, exports: module.exports, setTimeout() {
      timers++
    } }
    if (userAgent !== undefined)
      globals.CUSTOM_USER_AGENT = userAgent
    vm.runInNewContext(source, globals, { timeout: 5000 })
    const Artplayer = module.exports
    assert.equal(typeof Artplayer, 'function')
    assert.equal(Artplayer.length, 2)
    assert.equal(Artplayer.utils.isBrowser, false)
    assert.equal(Artplayer.utils.userAgent, userAgent ?? '')
    assert.equal(Artplayer.instances.length, 0)
    assert.match(Artplayer.html, /art-video-player/)
    assert.equal(timers, 0)
    assert.equal(Object.hasOwn(globals, 'Artplayer'), false)
    assert.throws(() => new Artplayer({}), error => error.message === 'Artplayer can only be used in the browser environment')
    if (userAgent?.startsWith('iPhone') || userAgent?.startsWith('Macintosh'))
      await assert.rejects(loadPublishedCore({ CUSTOM_USER_AGENT: userAgent }), error => error.name === 'ReferenceError')
  }
})

test('the full entry preserves lazy navigator access under a non-iOS custom UA', () => {
  const module = { exports: {} }
  const globals = { module, exports: module.exports, CUSTOM_USER_AGENT: 'Android Chrome' }
  Object.defineProperty(globals, 'navigator', { get() {
    throw new Error('native navigator must remain unread')
  } })
  vm.runInNewContext(source, globals, { timeout: 5000 })
  assert.equal(module.exports.utils.userAgent, 'Android Chrome')
  assert.equal(module.exports.utils.isBrowser, false)
})
