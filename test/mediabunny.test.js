import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Freeze historical lifecycle failures before candidate fixes.
import test from 'node:test'
import { mbEnvironment, mbHistorical } from './helpers/mediabunny.js'

for (const implementation of await mbHistorical()) {
  test(`MediaBunny historical ${implementation.name}: destroy still permits late load errors and scheduled events`, async () => {
    const timers = new Map()
    let nextTimer = 0
    const env = mbEnvironment(implementation, {
      setTimeout(fn) {
        const id = nextTimer++
        timers.set(id, fn)
        return id
      },
      clearTimeout(id) { timers.delete(id) },
    })
    const canvas = env.factory()(env.art)
    const engine = canvas.engine
    const events = []
    for (const name of ['waiting', 'loadstart', 'error'])
      canvas.events.addEventListener(name, () => events.push(name))
    let reject
    const pending = new Promise((resolve, fail) => {
      reject = fail
    })
    engine.performLoad = () => pending
    const loading = engine.load('controlled-input')
    const generation = engine.loadSeq
    env.art.emit('destroy')
    assert.equal(engine.loadSeq, generation, 'Destroy does not invalidate the load generation')
    assert.equal(env.art.mediabunny, undefined)
    assert.equal(timers.size, 2, 'Waiting and loadstart timers still exist after destroy')
    reject(new Error('late controlled rejection'))
    await loading
    for (const fn of timers.values()) fn()
    timers.clear()
    assert.deepEqual(events, ['error', 'waiting', 'loadstart'])
    assert.equal(env.emitted.at(-1).name, 'video:error')
    assert.deepEqual({ ...engine.error }, { code: 4, message: 'late controlled rejection' })
    assert.equal(engine.networkState, 3)
  })
}
