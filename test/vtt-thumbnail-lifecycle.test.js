import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate resource regressions use the Node runner.
import test from 'node:test'
import { vttText, vttThumbnailCandidate, vttThumbnailEnvironment } from './helpers/vtt-thumbnail.js'

const implementation = await vttThumbnailCandidate()
const create = options => vttThumbnailEnvironment(implementation, options)
async function flush() {
  for (let index = 0; index < 8; index++)
    await Promise.resolve()
}
const count = env => [...env.listeners.values()].reduce((sum, items) => sum + items.length, 0)

test('VTT candidate retains asynchronous registration, live style, floored bounds and literal image paths', async () => {
  const env = create({ deferred: true })
  const option = { vtt: '/folder/cues.vtt', style: {} }
  const pending = env.factory(option)(env.art)
  assert.equal(env.requests[0][0], option.vtt)
  assert.equal(env.controls.length, 0)
  option.style = { opacity: '0.8' }
  env.resolve()
  assert.equal((await pending).name, 'artplayerPluginVttThumbnail')
  assert.equal(env.controls[0].style, option.style)
  await env.hover(0.5)
  assert.equal(env.styles.backgroundImage, 'url(/folder/sheet.jpg)')
  assert.equal(env.styles.backgroundPosition, '-10px -20px')
  assert.equal(env.styles.left, '60px')
  await env.hover(0.51)
  assert.equal(env.styles.backgroundImage, 'url(/folder/second.jpg)')
})

for (const abort of [true, false]) {
  test(`VTT candidate settles destroyed pending registration without late mounting; AbortController=${abort}`, async () => {
    const env = create({ deferred: true })
    if (!abort)
      env.box.AbortController = undefined
    let settled = false
    const pending = env.factory({ vtt: '/cues.vtt' })(env.art).then((result) => {
      settled = true
      return result
    })
    await env.emit('destroy')
    await flush()
    assert.equal(settled, true, 'Destroy settles even a fetch that ignores cancellation')
    if (abort)
      assert.equal(env.requests[0][1].signal.aborted, true)
    env.resolve()
    await pending
    await flush()
    assert.equal(env.controls.length, 0)
    assert.equal(count(env), 0)
  })
}

test('VTT candidate observes late rejection after destroy without exposing an unhandled Promise', async () => {
  const env = create({ deferred: true })
  const pending = env.factory({})(env.art)
  await env.emit('destroy')
  env.reject(new Error('late network error'))
  await pending
  await flush()
  assert.equal(count(env), 0)
  assert.equal(env.controls.length, 0)
})

test('VTT candidate cancels while response body is pending', async () => {
  const env = create()
  let finish
  env.box.fetch = async () => ({ ok: true, text: () => new Promise((resolve) => {
    finish = resolve
  }) })
  const pending = env.factory({})(env.art)
  await flush()
  assert.equal(typeof finish, 'function')
  await env.emit('destroy')
  finish(vttText)
  await pending
  assert.equal(env.controls.length, 0)
  assert.equal(count(env), 0)
})

test('VTT candidate clears timer zero, removes its control and ignores captured stale callbacks', async () => {
  const env = create({ mobile: true })
  await env.factory({})(env.art)
  const listener = env.listeners.get('setBar')[0]
  await env.hover(0.3, 'played', {})
  assert.equal(env.timers.has(0), true)
  const timer = env.timers.get(0)
  await env.emit('destroy')
  assert.equal(env.timers.size, 0)
  assert.equal(count(env), 0)
  assert.deepEqual(env.removed, ['vtt-thumbnail'])
  env.styles.display = 'sentinel'
  timer.callback()
  await listener('hover', 0.7, {})
  assert.equal(env.styles.display, 'sentinel')
  await env.emit('destroy')
  assert.equal(env.removed.length, 1)
})

test('VTT candidate never removes a replacement control owned by another registration', async () => {
  const env = create()
  await env.factory({})(env.art)
  const replacement = {}
  env.art.controls['vtt-thumbnail'] = replacement
  await env.emit('destroy')
  assert.equal(env.art.controls['vtt-thumbnail'], replacement)
  assert.deepEqual(env.removed, [])
  assert.equal(count(env), 0)
})

for (const phase of ['fetch', 'text', 'parse', 'mount']) {
  test(`VTT candidate releases registration resources after ${phase} failure`, async () => {
    const env = create({ text: phase === 'parse' ? 'WEBVTT\ninvalid\npayload' : vttText })
    const failure = new Error(`${phase} failure`)
    if (phase === 'fetch')
      env.box.fetch = () => { throw failure }
    if (phase === 'text')
      env.box.fetch = async () => ({ text: async () => { throw failure } })
    if (phase === 'mount')
      env.art.constructor.utils.addClass = () => { throw failure }
    await assert.rejects(env.factory({})(env.art), error => phase === 'parse' ? error.name === 'TypeError' : error === failure)
    assert.equal(count(env), 0)
    assert.equal(env.timers.size, 0)
    if (phase === 'mount')
      assert.deepEqual(env.removed, ['vtt-thumbnail'])
  })
}

test('VTT candidate rejects HTTP failure before parsing its body', async () => {
  const env = create()
  let read = false
  env.box.fetch = async () => ({ ok: false, status: 404, text: async () => {
    read = true
    return vttText
  } })
  await assert.rejects(env.factory({})(env.art), /404/)
  assert.equal(read, false)
  assert.equal(count(env), 0)
})

test('VTT candidate cleans up a listener installed by an on implementation that throws', async () => {
  const env = create()
  const original = env.art.on
  const failure = new Error('partial listener registration')
  env.art.on = function (name, callback) {
    original.call(this, name, callback)
    if (name === 'setBar')
      throw failure
    return this
  }
  await assert.rejects(env.factory({})(env.art), error => error === failure)
  assert.equal(count(env), 0)
  assert.deepEqual(env.removed, ['vtt-thumbnail'])
})

test('VTT candidate does not install when style access destroys the player', async () => {
  const env = create()
  await env.factory({ get style() {
    env.emit('destroy')
    return {}
  } })(env.art)
  assert.equal(env.controls.length, 0)
  assert.equal(count(env), 0)
})

test('VTT candidate stops subsequent style writes and scheduling after reentrant destroy', async () => {
  const env = create({ mobile: true })
  await env.factory({})(env.art)
  const writes = []
  env.art.constructor.utils.setStyle = () => {
    throw new Error('Captured utility should remain unchanged')
  }
  Object.defineProperty(env.styles, 'display', {
    get() { return writes.at(-1) },
    set(value) {
      writes.push(value)
      env.emit('destroy')
    },
    configurable: true,
  })
  await env.hover(0.3, 'played', {})
  assert.deepEqual(Object.keys(env.styles), [])
  assert.deepEqual(writes, ['flex'])
  assert.equal(env.timers.size, 0)
  assert.equal(count(env), 0)
})

test('VTT candidate continues other cleanup when a timer cleanup throws', async () => {
  const env = create({ mobile: true })
  await env.factory({})(env.art)
  await env.hover(0.3, 'played', {})
  env.box.clearTimeout = () => {
    throw new Error('timer cleanup failed')
  }
  await env.emit('destroy')
  assert.equal(count(env), 0)
  assert.deepEqual(env.removed, ['vtt-thumbnail'])
  assert.equal(env.warnings.length, 1)
})

test('VTT candidate starts no work on an already destroyed player', async () => {
  const env = create()
  env.art.isDestroy = true
  assert.equal((await env.factory({})(env.art)).name, 'artplayerPluginVttThumbnail')
  assert.equal(env.requests.length, 0)
  assert.equal(count(env), 0)
})

test('VTT candidate removes a partially installed destroy listener before rejecting', async () => {
  const env = create()
  const original = env.art.on
  const error = new Error('destroy registration failed')
  env.art.on = function (name, callback) {
    original.call(this, name, callback)
    throw error
  }
  await assert.rejects(env.factory({})(env.art), value => value === error)
  assert.equal(count(env), 0)
  assert.equal(env.requests.length, 0)
})

test('VTT candidate invalidates replaced mobile callbacks and preserves the 500ms delay', async () => {
  const env = create({ mobile: true })
  await env.factory({})(env.art)
  await env.hover(0.3, 'played', {})
  const old = env.timers.get(0)
  await env.hover(0.7, 'played', {})
  assert.equal(env.timers.size, 1)
  old.callback()
  assert.equal(env.styles.display, 'flex')
  const latest = [...env.timers.values()][0]
  assert.equal(latest.delay, 500)
  latest.callback()
  assert.equal(env.styles.display, 'none')
})

test('VTT candidate cleans up timer handles returned after reentrant destruction', async () => {
  const env = create({ mobile: true })
  await env.factory({})(env.art)
  const schedule = env.box.setTimeout
  env.box.setTimeout = (...args) => {
    env.emit('destroy')
    return schedule(...args)
  }
  await env.hover(0.3, 'played', {})
  assert.equal(env.timers.size, 0)
  assert.equal(count(env), 0)
})

test('VTT candidate keeps registrations isolated and does not reload VTT on restart', async () => {
  const left = create({ mobile: true })
  const right = create({ mobile: true })
  await left.factory({ vtt: '/left/cues.vtt' })(left.art)
  const option = { vtt: '/right/cues.vtt' }
  await right.factory(option)(right.art)
  await right.hover(0.3, 'played', {})
  await left.emit('destroy')
  option.vtt = '/replacement.vtt'
  await right.emit('restart')
  await right.hover(0.7)
  assert.equal(right.requests.length, 1)
  assert.equal(right.styles.backgroundImage, 'url(/right/second.jpg)')
  assert.equal(right.timers.size, 1)
  assert.equal(right.removed.length, 0)
  await right.emit('destroy')
  assert.equal(right.timers.size, 0)
})
