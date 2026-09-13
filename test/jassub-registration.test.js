import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate adapter regressions use the repository runner.
import test from 'node:test'
import { jassubCandidate, jassubEnvironment } from './helpers/jassub.js'

const implementation = await jassubCandidate()

test('JASSUB custom canvas registration keeps caller DOM while releasing its actual vendor instance', async () => {
  const env = jassubEnvironment(implementation)
  const canvas = env.parent.appendChild(env.createCanvas())
  const result = env.factory({ canvas })(env.art)
  assert.equal(result.instance._canvas, canvas)
  assert.equal(result.instance._canvasParent, undefined)
  assert.equal(env.listeners.get('destroy').length, 1)
  await env.ready()
  assert.equal(env.workers[0].messages[0].target, 'init')
  env.emit('destroy')
  assert.equal(env.workers[0].terminated, 1)
  assert.equal(canvas.parentNode, env.parent)
  assert.equal(env.parent.children.length, 2)
})

test('JASSUB host cleanup tolerates an already destroyed exposed instance', async () => {
  const env = jassubEnvironment(implementation)
  const { instance } = env.factory()(env.art)
  await env.ready()
  instance.destroy()
  assert.doesNotThrow(() => env.emit('destroy'))
  assert.doesNotThrow(() => env.emit('destroy'))
  assert.equal(env.workers[0].terminated, 1)
  assert.equal(env.parent.children.length, 1)
})

test('JASSUB host cleanup before ready terminates once and retains the vendor destroyed-frame guard', async () => {
  const env = jassubEnvironment(implementation)
  const { instance } = env.factory()(env.art)
  env.emit('destroy')
  env.emit('destroy')
  await env.flush()
  assert.equal(instance._destroyed, true)
  assert.equal(env.workers[0].terminated, 1)
  assert.equal(env.parent.children.length, 1)
})

test('JASSUB host cleanup guards synchronous reentry without replacing the exposed destroy method', async () => {
  const env = jassubEnvironment(implementation)
  const { instance } = env.factory()(env.art)
  await env.ready()
  const original = instance.destroy
  let calls = 0
  const custom = function () {
    calls++
    env.emit('destroy')
    return original.call(this)
  }
  instance.destroy = custom
  env.emit('destroy')
  assert.equal(calls, 1)
  assert.equal(instance.destroy, custom)
  assert.equal(env.workers[0].terminated, 1)
})

test('JASSUB failing host disposal preserves its error and allows another cleanup attempt', async () => {
  const env = jassubEnvironment(implementation)
  const { instance } = env.factory()(env.art)
  await env.ready()
  const original = instance.destroy
  const failure = new Error('consumer cleanup failure')
  instance.destroy = () => {
    throw failure
  }
  assert.throws(() => env.emit('destroy'), error => error === failure)
  assert.equal(env.workers[0].terminated, 0)
  instance.destroy = original
  env.emit('destroy')
  assert.equal(env.workers[0].terminated, 1)
})

for (const offThrows of [false, true]) {
  test(`JASSUB registration failure rolls back its instance and retains the original error when offThrows=${offThrows}`, async () => {
    const env = jassubEnvironment(implementation)
    const unrelated = () => {}
    env.art.on('destroy', unrelated)
    const on = env.art.on
    const failure = new Error('host listener registration failed')
    env.art.on = (name, listener) => {
      on(name, listener)
      throw failure
    }
    if (offThrows)
      env.art.off = () => { throw new Error('secondary rollback failure') }
    assert.throws(() => env.factory()(env.art), error => error === failure)
    await env.flush()
    assert.equal(env.workers[0].terminated, 1)
    assert.equal(env.parent.children.length, 1)
    if (!offThrows)
      assert.deepEqual(env.listeners.get('destroy'), [unrelated])
    assert.doesNotThrow(() => env.emit('destroy'))
    assert.equal(env.workers[0].terminated, 1)
  })
}

test('JASSUB style setup failure releases the created instance before returning the original exception', async () => {
  const env = jassubEnvironment(implementation)
  const insert = env.art.video.insertAdjacentElement
  const failure = new Error('style setter failed')
  env.art.video.insertAdjacentElement = function (position, child) {
    insert.call(this, position, child)
    Object.defineProperty(child.style, 'zIndex', {
      get() { return undefined },
      set() {
        throw failure
      },
    })
  }
  assert.throws(() => env.factory()(env.art), error => error === failure)
  await env.flush()
  assert.equal(env.workers[0].terminated, 1)
  assert.equal(env.parent.children.length, 1)
  assert.equal(env.listeners.get('destroy'), undefined)
})
