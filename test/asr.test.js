import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Historical ASR contracts use the repository runner.
import test from 'node:test'
import { asrEnvironment, asrHistorical } from './helpers/asr.js'

for (const implementation of await asrHistorical()) {
  for (const script of [false, true]) {
    test(`ASR ${implementation.name}: ${script ? 'global' : 'CJS'} lazy factory, synchronous result and async stop`, async () => {
      const env = asrEnvironment(implementation, { script })
      if (!script) {
        const namespace = implementation.name.startsWith('published-2.0.0') || implementation.name === 'frozen-source'
        assert.equal(typeof env.exported, namespace ? 'object' : 'function')
        assert.deepEqual(Object.keys(env.exported), namespace ? ['default'] : [])
      }
      const register = env.factory()
      assert.equal(env.layers.length, 0)
      const result = register(env.art)
      assert.deepEqual(Object.keys(result), ['name', 'stop', 'hide', 'append'])
      assert.equal(result.name, 'artplayerPluginAsr')
      assert.equal(result.then, undefined)
      assert.equal(result.start, undefined)
      assert.equal(env.layers[0].name, 'asr')
      assert.deepEqual([...env.listeners.keys()], ['video:volumechange', 'play', 'pause', 'destroy'])
      const stopped = result.stop()
      assert.equal(typeof stopped.then, 'function')
      assert.equal(await stopped, undefined)
      assert.equal(env.listeners.get('play').length, 1, 'stop retains historical restart subscription')
      assert.equal(env.styles.size, 1)
      env.reload()
      assert.equal(env.styles.size, 1)
    })
  }
  test(`ASR ${implementation.name}: append replaces punctuation lines, permits markup, and hide retains content`, () => {
    const env = asrEnvironment(implementation)
    const result = env.factory()(env.art)
    assert.equal(result.append('One. Two! 三。 Four?'), undefined)
    assert.equal(env.layer.innerHTML, '<div class="art-asr-line">Two!</div><div class="art-asr-line">三。</div><div class="art-asr-line">Four?</div>')
    assert.equal([...env.timeouts.values()][0].delay, 10000)
    result.append('<b>markup</b>')
    assert.equal(env.layer.innerHTML, '<div class="art-asr-line"><b>markup</b></div>')
    assert.equal(env.timeouts.size, 1)
    result.hide()
    assert.equal(env.layer.style.display, 'none')
    assert.equal(result.append(null), undefined)
    assert.equal(env.layer.style.display, 'none')
    assert.equal(env.timeouts.size, 1)
    result.append('')
    assert.equal(env.layer.innerHTML, '')
    assert.equal(env.layer.style.display, '')
    ;[...env.timeouts.values()][0].callback()
    assert.equal(env.layer.style.display, 'none')
  })
  test(`ASR ${implementation.name}: options are captured at factory call and instances own subtitle timers`, () => {
    const option = { length: 1, autoHideTimeout: 25 }
    const env = asrEnvironment(implementation)
    const register = env.factory(option)
    option.length = 4
    option.autoHideTimeout = 99
    register(env.art).append('one. two.')
    assert.equal(env.layer.innerHTML, '<div class="art-asr-line">two.</div>')
    assert.equal([...env.timeouts.values()][0].delay, 25)
    const other = asrEnvironment(implementation)
    other.factory({ length: 0 })(other.art).append('one. two.')
    assert.equal(other.layer.innerHTML, '<div class="art-asr-line">one.</div><div class="art-asr-line">two.</div>', 'zero retains historical slice(-0) semantics')
    assert.equal(env.timeouts.size, 1)
    assert.equal(other.timeouts.size, 1)
  })
}
