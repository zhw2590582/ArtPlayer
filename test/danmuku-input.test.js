import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate compatibility and failure tests use the Node runner.
import test from 'node:test'
import { setImmediate as nextTurn } from 'node:timers/promises'
import { danmukuCandidate, danmukuCandidateEnvironment } from './helpers/danmuku-candidate.js'
import { deferred } from './helpers/danmuku.js'

const implementation = await danmukuCandidate()
const prefix = `Danmuku ${implementation.name}`
const names = env => env.events.map(event => event.name)
const loaded = env => env.events.filter(event => event.name === 'artplayerPluginDanmuku:loaded')
const failures = env => env.events.filter(event => event.name === 'artplayerPluginDanmuku:error')

function fixture(option = { danmuku: [] }) {
  const env = danmukuCandidateEnvironment(implementation)
  const plugin = env.factory(option)(env.art)
  return { env, plugin }
}

test(`${prefix}: synchronous empty initialization and load retain method return identity and getter surface`, async () => {
  const { env, plugin } = fixture()
  assert.equal(typeof plugin.then, 'undefined')
  assert.deepEqual(Object.keys(plugin), ['name', 'emit', 'load', 'config', 'hide', 'show', 'reset', 'mount', 'option', 'isHide', 'isStop'])
  assert.deepEqual(names(env), ['artplayerPluginDanmuku:show', 'artplayerPluginDanmuku:config', 'artplayerPluginDanmuku:reset', 'artplayerPluginDanmuku:loaded'])
  const internal = plugin.show()
  assert.notEqual(internal, plugin)
  assert.equal(internal.name, undefined)
  const start = env.events.length
  const promise = plugin.load()
  assert.equal(typeof promise.then, 'function')
  assert.deepEqual(names(env).slice(start), ['artplayerPluginDanmuku:reset', 'artplayerPluginDanmuku:loaded'], 'Empty arrays finish the visible work before the first await')
  assert.equal(await promise, internal)
  const emit = plugin.emit
  assert.equal(await emit({ text: 'bound', time: 12 }), internal)
  assert.equal(plugin.hide(), internal)
  assert.equal(plugin.reset(), internal)
  env.destroy()
})

test(`${prefix}: nonempty array load inserts the first row synchronously and resolves to internal state`, async () => {
  const { env, plugin } = fixture()
  const internal = plugin.show()
  const count = loaded(env).length
  const pending = plugin.load([{ text: 'first', time: 1 }, { text: 'second', time: 2 }])
  assert.deepEqual(Array.from(internal.queue, row => row.text), ['first'])
  assert.equal(loaded(env).length, count)
  assert.equal(await pending, internal)
  assert.deepEqual(Array.from(internal.queue, row => row.text), ['first', 'second'])
  assert.equal(loaded(env).at(-1).args[0], internal.queue)
  env.destroy()
})

test(`${prefix}: explicit targets append and omitted target replaces without changing configured input`, async () => {
  const { env, plugin } = fixture()
  const configured = [{ text: 'configured', time: 2 }]
  plugin.config({ danmuku: configured })
  const internal = await plugin.load()
  await plugin.load([{ text: 'append', time: 3 }])
  assert.equal(plugin.option.danmuku, configured)
  assert.deepEqual(Array.from(internal.queue, row => row.text), ['configured', 'append'])
  await plugin.load(undefined)
  assert.deepEqual(Array.from(internal.queue, row => row.text), ['configured'])
  env.destroy()
})

test(`${prefix}: independent asynchronous appends survive reversed completion and a replacement`, async () => {
  const { env, plugin } = fixture()
  const first = deferred()
  const second = deferred()
  const a = plugin.load(() => first.promise)
  const b = plugin.load(() => second.promise)
  plugin.config({ danmuku: [{ text: 'replacement', time: 1 }] })
  const internal = await plugin.load()
  second.resolve([{ text: 'second completed first', time: 2 }])
  assert.equal(await b, internal)
  first.resolve([{ text: 'first completed last', time: 3 }])
  assert.equal(await a, internal)
  assert.deepEqual(Array.from(internal.queue, row => row.text), ['replacement', 'second completed first', 'first completed last'])
  env.destroy()
})

test(`${prefix}: replacement supersedes only the older replacement and settles it before its input completes`, async () => {
  const { env, plugin } = fixture()
  const first = deferred()
  const second = deferred()
  const jobs = [first, second]
  plugin.config({ danmuku: () => jobs.shift().promise })
  const internal = plugin.show()
  let oldSettled = false
  const a = plugin.load().then((value) => {
    oldSettled = true
    return value
  })
  const b = plugin.load()
  await env.flush()
  assert.equal(oldSettled, true, 'Cancellation must settle the public Promise without awaiting a stale source')
  assert.equal(await a, internal)
  second.resolve([{ text: 'current', time: 1 }])
  await b
  const count = env.events.length
  first.resolve([{ text: 'obsolete', time: 2 }])
  await env.flush()
  assert.deepEqual(Array.from(internal.queue, row => row.text), ['current'])
  assert.equal(env.events.length, count)
  env.destroy()
})

test(`${prefix}: destroyed pending replacement and appends settle without late state or error events`, async () => {
  const { env, plugin } = fixture()
  const replacement = deferred()
  const append = deferred()
  plugin.config({ danmuku: () => replacement.promise })
  const internal = plugin.show()
  const pending = [plugin.load(), plugin.load(() => append.promise)]
  let settled = false
  const all = Promise.all(pending).then((results) => {
    settled = true
    return results
  })
  env.destroy()
  await env.flush()
  assert.equal(settled, true, 'Destroy settles all owned loads without depending on their unresolved inputs')
  assert.deepEqual(await all, [internal, internal])
  const count = env.events.length
  replacement.resolve([{ text: 'late', time: 1 }])
  append.reject(new Error('late append failure'))
  await nextTurn()
  assert.equal(internal.queue.length, 0)
  assert.equal(env.events.length, count)
  assert.equal(failures(env).length, 0)
})

test(`${prefix}: reset event reentry can replace input without an older load clearing or adding rows`, async () => {
  const { env, plugin } = fixture()
  plugin.config({ danmuku: [{ text: 'old', time: 1 }] })
  let nested
  let entered = false
  env.art.on('artplayerPluginDanmuku:reset', () => {
    if (entered)
      return
    entered = true
    plugin.config({ danmuku: [{ text: 'new', time: 2 }] })
    nested = plugin.load()
  })
  const count = loaded(env).length
  const internal = await plugin.load()
  await nested
  assert.deepEqual(Array.from(internal.queue, row => row.text), ['new'])
  assert.equal(loaded(env).length, count + 1)
  env.destroy()
})

for (const action of ['replace', 'destroy']) {
  test(`${prefix}: filter synchronous ${action} reentry prevents the obsolete row from being pushed`, async () => {
    const { env, plugin } = fixture()
    let nested
    plugin.config({
      danmuku: [{ text: 'old1', time: 1 }, { text: 'old2', time: 2 }],
      filter(row) {
        if (row.text === 'old1') {
          if (action === 'destroy') {
            env.destroy()
          }
          else {
            plugin.config({ danmuku: [{ text: 'new', time: 3 }] })
            nested = plugin.load()
          }
        }
        return true
      },
    })
    const count = loaded(env).length
    const internal = await plugin.load()
    await nested
    assert.deepEqual(Array.from(internal.queue, row => row.text), action === 'destroy' ? [] : ['new'])
    assert.equal(loaded(env).length, count + (action === 'destroy' ? 0 : 1))
    if (action !== 'destroy')
      env.destroy()
  })
}

test(`${prefix}: loader receiver, filter receiver, input mutation and extra fields retain the public behavior`, async () => {
  let loaderReceiver = 'unset'
  let filterReceiver
  const { env, plugin } = fixture({
    danmuku: [],
    filter() {
      filterReceiver = this
      return true
    },
  })
  const row = { text: 'zero', time: 0, id: 'custom-id', extension: { value: 1 } }
  const internal = await plugin.load(function () {
    loaderReceiver = this
    return [row]
  })
  assert.equal(loaderReceiver, undefined)
  assert.equal(filterReceiver, plugin.option)
  assert.equal(row.time, 0, 'Accepted defect correction preserves an explicit zero timestamp')
  assert.equal(row.mode, 0)
  assert.equal(row.color, '#FFFFFF')
  assert.deepEqual(Object.keys(row.style), [])
  assert.equal(internal.queue[0].extension, row.extension)
  assert.equal(internal.queue[0].id, row.id)
  const missing = { text: 'default time' }
  const negative = { text: 'negative', time: -2 }
  await plugin.emit(missing)
  await plugin.emit(negative)
  assert.equal(missing.time, 10.5)
  assert.equal(negative.time, 0)
  env.destroy()
})

test(`${prefix}: invalid later rows preserve earlier insertions and reject with the single emitted original error`, async () => {
  const { env, plugin } = fixture()
  const internal = plugin.show()
  let caught
  const loadedCount = loaded(env).length
  await assert.rejects(plugin.load([{ text: 'valid', time: 1 }, { text: 123 }]), (error) => {
    caught = error
    return error.message.includes('text')
  })
  assert.deepEqual(Array.from(internal.queue, row => row.text), ['valid'])
  assert.equal(failures(env).length, 1)
  assert.equal(failures(env)[0].args[0], caught)
  assert.equal(loaded(env).length, loadedCount)
  env.destroy()
})

test(`${prefix}: function configuration changes are applied while structurally equal plain values remain silent`, () => {
  const { env, plugin } = fixture()
  const original = plugin.option
  const filter = () => false
  const before = env.events.length
  plugin.config({ filter })
  assert.equal(plugin.option.filter, filter)
  assert.notEqual(plugin.option, original)
  assert.deepEqual(names(env).slice(before), ['artplayerPluginDanmuku:show', 'artplayerPluginDanmuku:config'])
  const updated = plugin.option
  const count = env.events.length
  plugin.config({ filter, margin: [10, '25%'], points: [], OPACITY: {} })
  assert.equal(env.events.length, count)
  assert.equal(plugin.option, updated)
  env.destroy()
})

test(`${prefix}: invalid configuration cannot replace or partially mutate a valid option`, () => {
  const { env, plugin } = fixture()
  const original = plugin.option
  const count = env.events.length
  assert.throws(() => plugin.config({ opacity: 0.2, speed: 'invalid', visible: false }), /speed/iu)
  assert.equal(plugin.option, original)
  assert.equal(plugin.option.opacity, 1)
  assert.equal(plugin.option.visible, true)
  assert.equal(plugin.isHide, false)
  assert.equal(env.events.length, count)
  env.destroy()
})

test(`${prefix}: initial Promise source is accepted and successful completion reports loaded`, async () => {
  const input = deferred()
  const { env, plugin } = fixture({ danmuku: input.promise })
  assert.equal(typeof plugin.then, 'undefined')
  assert.equal(loaded(env).length, 0)
  input.resolve([{ text: 'initial promise', time: 0 }])
  await env.flush()
  assert.equal(loaded(env).length, 1)
  assert.equal(loaded(env)[0].args[0][0].text, 'initial promise')
  assert.equal(loaded(env)[0].args[0][0].time, 0)
  env.destroy()
})

test(`${prefix}: ignored constructor load rejection is locally observed while explicit load still rejects`, async () => {
  const error = new Error('source failed')
  const { env, plugin } = fixture({ danmuku: () => Promise.reject(error) })
  await nextTurn()
  assert.equal(failures(env).length, 1)
  assert.equal(failures(env)[0].args[0], error)
  await assert.rejects(plugin.load(), failure => failure === error)
  assert.equal(failures(env).length, 2)
  assert.equal(failures(env)[1].args[0], error)
  env.destroy()
})

for (const event of ['show', 'config', 'loaded']) {
  test(`${prefix}: synchronous initial ${event} destruction leaves a complete facade without later Worker or setting creation`, async () => {
    const env = danmukuCandidateEnvironment(implementation)
    const destroy = () => env.destroy()
    env.art.on(`artplayerPluginDanmuku:${event}`, destroy)
    const before = [...env.listeners.values()].reduce((total, listeners) => total + listeners.length, 0)
    const plugin = env.factory({ danmuku: [], heatmap: true })(env.art)
    assert.equal(env.art.isDestroy, true)
    assert.equal(typeof plugin.then, 'undefined')
    assert.deepEqual(Object.keys(plugin), ['name', 'emit', 'load', 'config', 'hide', 'show', 'reset', 'mount', 'option', 'isHide', 'isStop'])
    assert.equal(plugin.name, 'artplayerPluginDanmuku')
    for (const key of ['option', 'isHide', 'isStop']) {
      const descriptor = Object.getOwnPropertyDescriptor(plugin, key)
      assert.equal(typeof descriptor.get, 'function')
      assert.equal(descriptor.set, undefined)
      assert.equal(descriptor.enumerable, true)
      assert.equal(descriptor.configurable, true)
    }
    assert.equal(plugin.option.heatmap, true)
    assert.equal(plugin.isStop, true)
    assert.equal(plugin.isHide, false)
    assert.equal(plugin.mount('#external'), undefined)
    assert.equal(plugin.mount(), undefined)
    assert.equal(env.workers.length, event === 'loaded' ? 1 : 0)
    assert(env.workers.every(worker => worker.terminated), 'A Worker created before loaded reentry must be terminated')
    assert.equal(env.art.template.$controlsCenter.children.length, 0)
    assert.equal(env.art.template.$player.children.length, 0)
    assert.equal(env.controls.length, 0)
    assert.equal(env.proxies.length, 0)
    assert.equal(env.frames.size, 0)
    assert.equal(env.timers.size, 0)
    assert.equal([...env.listeners.values()].reduce((total, listeners) => total + listeners.length, 0), before, 'Only the pre-existing user listener remains')
    await env.flush()
    assert.equal(env.consoleWarnings.length, 0)
  })
}

test(`${prefix}: invalid initial configuration rolls back the early destroy listener before throwing`, () => {
  const env = danmukuCandidateEnvironment(implementation)
  const existingDestroy = () => {}
  env.art.on('destroy', existingDestroy)
  const before = [...env.listeners.values()].reduce((total, listeners) => total + listeners.length, 0)
  assert.throws(() => env.factory({ danmuku: [], speed: 'invalid' })(env.art), /speed/iu)
  assert.equal([...env.listeners.values()].reduce((total, listeners) => total + listeners.length, 0), before)
  assert.deepEqual(env.listeners.get('destroy'), [existingDestroy])
  assert.equal(env.workers.length, 0)
  assert.equal(env.art.template.$controlsCenter.children.length, 0)
  assert.equal(env.art.template.$player.children.length, 0)
  assert.equal(env.controls.length, 0)
  assert.equal(env.proxies.length, 0)
  assert.equal(env.frames.size, 0)
  assert.equal(env.timers.size, 0)
})

test(`${prefix}: initial scheduler Worker construction failure preserves the error and rolls back subscriptions`, () => {
  const error = new Error('initial scheduler Worker failed')
  const env = danmukuCandidateEnvironment(implementation, { initialWorkerError: error })
  const existingDestroy = () => {}
  env.art.on('destroy', existingDestroy)
  const before = [...env.listeners.values()].reduce((total, listeners) => total + listeners.length, 0)
  assert.throws(() => env.factory({ danmuku: [] })(env.art), failure => failure === error)
  assert.equal([...env.listeners.values()].reduce((total, listeners) => total + listeners.length, 0), before)
  assert.deepEqual(env.listeners.get('destroy'), [existingDestroy])
  assert.equal(env.workers.length, 0)
  assert.equal(env.art.template.$controlsCenter.children.length, 0)
  assert.equal(env.art.template.$player.children.length, 0)
  assert.equal(env.controls.length, 0)
  assert.equal(env.proxies.length, 0)
  assert.equal(env.frames.size, 0)
  assert.equal(env.timers.size, 0)
})
