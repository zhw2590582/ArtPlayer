import assert from 'node:assert/strict'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Run the same public contract against each actual implementation.
import { test } from 'node:test'
import { emitterContracts } from './contracts/emitter.js'
import { loadCoreArtifact, loadPackage, loadPublishedCore } from './helpers/load.js'

const targets = [await loadPublishedCore(), { name: 'workspace', Artplayer: (await loadPackage('artplayer')).default }]
if (process.env.ARTPLAYER_TEST_CORE)
  targets.push(await loadCoreArtifact(process.env.ARTPLAYER_TEST_CORE))

for (const { name, Artplayer } of targets) {
  for (const [id, verify] of Object.entries(emitterContracts))
    test(`${id}: ${name}`, () => verify(Artplayer.Emitter))
}

test('EVENT.prototype-event-names: candidate supports names that collide with Object.prototype', () => {
  for (const name of ['__proto__', 'constructor', 'toString', 'hasOwnProperty']) {
    assert.throws(() => new targets[0].Artplayer.Emitter().on(name, () => {}), error => error.name === 'TypeError')
    for (const { Artplayer } of targets.slice(1)) {
      const emitter = new Artplayer.Emitter()
      let calls = 0
      const fn = () => calls++
      emitter.emit(name).off(name)
      const prototype = Object.getPrototypeOf(emitter.e)
      emitter.on(name, fn).once(name, fn)
      emitter.emit(name).emit(name).off(name, fn).emit(name)
      assert.equal(calls, 3)
      assert.equal(Object.prototype.hasOwnProperty.call(emitter.e, name), false)
      assert.equal(Object.getPrototypeOf(emitter.e), prototype)
    }
  }
})

test('EVENT.once-nested-snapshot: candidate consumes a once registration across nested dispatch snapshots', () => {
  for (const [index, { Artplayer }] of targets.entries()) {
    const emitter = new Artplayer.Emitter()
    let nested = false
    let calls = 0
    emitter.on('value', () => {
      if (!nested) {
        nested = true
        emitter.emit('value')
      }
    }).once('value', () => calls++)
    emitter.emit('value')
    assert.equal(calls, index === 0 ? 2 : 1)
  }
})
