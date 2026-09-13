import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Deterministic candidate scheduling uses the Node runner.
import test from 'node:test'
import vm from 'node:vm'
import { danmukuCandidate, danmukuCandidateEnvironment, danmukuWorkerCode } from './helpers/danmuku-candidate.js'
import { deferred } from './helpers/danmuku.js'

const implementation = await danmukuCandidate()
const prefix = `Danmuku scheduler ${implementation.name}`
const output = (env, event) => env.events.filter(item => item.name === `artplayerPluginDanmuku:${event}`)

function measuredNode(node) {
  node.clientWidth = 100
  node.clientHeight = 20
  Object.defineProperty(node, 'offsetTop', { get: () => Number.parseFloat(node.style.top) || 0 })
  return node
}

async function fixture(options = {}, { automatic = false } = {}) {
  const env = danmukuCandidateEnvironment(implementation)
  const plugin = env.factory({ danmuku: [], ...options })(env.art)
  const owner = plugin.show()
  const createElement = env.context.document.createElement
  env.context.document.createElement = tag => measuredNode(createElement(tag))
  const layer = env.art.template.$danmuku
  let content = layer.textContent
  Object.defineProperty(layer, 'textContent', {
    get: () => content,
    set(value) {
      content = value
      for (const child of layer.children)
        child.parentElement = null
      layer.children.length = 0
    },
  })
  layer.appendChild = (child) => {
    const siblings = child.parentElement?.children
    const index = siblings?.indexOf(child) ?? -1
    if (index >= 0)
      siblings.splice(index, 1)
    layer.children.push(child)
    child.parentElement = layer
    return child
  }
  const worker = env.workers[0]
  const workerCode = await danmukuWorkerCode(implementation, env, worker)
  const responses = []
  const workerContext = vm.createContext({ postMessage: data => responses.push(structuredClone(data)), URL: { revokeObjectURL() {} }, location: { href: worker.url } })
  workerContext.self = workerContext
  vm.runInContext(workerCode, workerContext, { timeout: 1000 })
  function calculate(message) {
    workerContext.input = structuredClone(message)
    const count = responses.length
    vm.runInContext('onmessage({ data: input })', workerContext, { timeout: 1000 })
    assert.equal(responses.length, count + 1, 'The actual Worker algorithm must produce the response')
    return responses.at(-1)
  }
  function deliver(data) {
    const event = { data }
    worker.onmessage?.(event)
    for (const callback of [...worker.listeners.get('message') || []])
      callback(event)
  }
  function reply(index) {
    const message = worker.messages[index].message
    deliver(calculate(message))
  }
  const post = worker.postMessage.bind(worker)
  worker.postMessage = (message) => {
    post(structuredClone(message))
    if (automatic)
      queueMicrotask(() => deliver(calculate(message)))
  }
  return { env, plugin, owner, worker, layer, calculate, deliver, reply }
}

function geometry(mode = 1) {
  return { type: 'getDanmuTop', target: { mode, height: 20, speed: 148 }, visibles: [], antiOverlap: true, clientWidth: 640, clientHeight: 360, marginTop: 10, marginBottom: 90 }
}

test(`${prefix}: repeated play/playing and direct starts preserve events and internal return with only one queued frame`, async () => {
  const { env, owner } = await fixture()
  env.art.playing = true
  env.art.emit('video:play')
  env.art.emit('video:playing')
  assert.equal(owner.start(), owner)
  assert.equal(output(env, 'start').length, 3)
  assert.equal(env.frames.size, 1)
  assert.equal(owner.stop(), owner)
  assert.equal(owner.stop(), owner)
  assert.equal(output(env, 'stop').length, 2)
  assert.equal(env.frames.size, 0)
  env.destroy()
})

test(`${prefix}: additional starts while beforeVisible is pending do not schedule an overlapping frame`, async () => {
  const gate = deferred()
  const { env, plugin, owner } = await fixture({ beforeVisible: () => gate.promise })
  await plugin.emit({ text: 'waiting callback', time: 10 })
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  owner.start()
  env.art.emit('video:playing')
  assert.equal(env.frames.size, 0, 'The existing asynchronous frame owns this generation')
  env.destroy()
  gate.resolve(true)
  await env.flush()
})

for (const action of ['pause', 'destroy', 'reset', 'replace', 'seek', 'hide']) {
  for (const stage of ['beforeVisible', 'worker']) {
    test(`${prefix}: ${action} invalidates the pending ${stage} continuation without modifying an obsolete row`, async () => {
      const gate = deferred()
      const state = await fixture(stage === 'beforeVisible' ? { beforeVisible: () => gate.promise } : {})
      const { env, plugin, owner, worker, layer } = state
      await plugin.emit({ text: 'old', time: 10, mode: 1 })
      const row = owner.queue[0]
      env.art.playing = true
      owner.start()
      env.frame()
      await env.flush()
      let response
      if (stage === 'worker') {
        assert.equal(worker.messages.length, 1)
        response = state.calculate(worker.messages[0].message)
      }
      if (action === 'pause') {
        env.art.playing = false
        owner.stop()
      }
      else if (action === 'destroy') {
        env.destroy()
      }
      else if (action === 'reset') {
        plugin.reset()
      }
      else if (action === 'replace') {
        plugin.config({ danmuku: [{ text: 'new', time: 20 }] })
        await plugin.load()
      }
      else if (action === 'hide') {
        plugin.hide()
      }
      else {
        env.art.currentTime = 20
        env.art.emit('video:seeking')
      }
      const snapshot = { rowState: row.$state, rowRef: row.$ref, nodes: [...layer.children], events: output(env, 'visible').length, messages: worker.messages.length }
      if (stage === 'worker')
        state.deliver(response)
      else
        gate.resolve(true)
      await env.flush()
      assert.equal(row.$state, snapshot.rowState)
      assert.equal(row.$ref, snapshot.rowRef)
      assert.deepEqual(layer.children, snapshot.nodes)
      assert.equal(output(env, 'visible').length, snapshot.events)
      assert.equal(worker.messages.length, snapshot.messages)
      if (action !== 'destroy')
        env.destroy()
    })
  }
}

test(`${prefix}: pausing a never-settled callback does not block a fresh generation`, async () => {
  const gate = deferred()
  let calls = 0
  const { env, plugin, owner } = await fixture({ beforeVisible: () => ++calls === 1 ? gate.promise : true }, { automatic: true })
  await plugin.emit({ text: 'resumable', time: 10, mode: 1 })
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  owner.stop()
  owner.start()
  await env.flush()
  assert.equal(env.frames.size, 1)
  env.frame()
  await env.flush()
  assert.equal(output(env, 'visible').length, 1)
  assert.equal(calls, 2)
  env.destroy()
  gate.resolve(true)
  await env.flush()
  assert.equal(output(env, 'visible').length, 1)
})

test(`${prefix}: an already delivered Worker reply cannot resume its JavaScript continuation after destroy`, async () => {
  const { env, plugin, owner, layer, reply } = await fixture()
  await plugin.emit({ text: 'queued microtask', time: 10, mode: 1 })
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  reply(0)
  env.destroy()
  const row = owner.queue[0]
  const snapshot = { state: row.$state, ref: row.$ref, nodes: [...layer.children] }
  await env.flush()
  assert.equal(row.$state, snapshot.state)
  assert.equal(row.$ref, snapshot.ref)
  assert.deepEqual(layer.children, snapshot.nodes)
  assert.equal(output(env, 'visible').length, 0)
  assert.equal(env.frames.size, 0)
})

test(`${prefix}: beforeVisible rejection reports the original error once, skips that row until start, and allows other rows`, async () => {
  const error = new Error('visibility hook rejected')
  const calls = []
  let retry = false
  const { env, plugin, owner } = await fixture({
    beforeVisible(row) {
      calls.push(row.text)
      return row.text === 'failed' && !retry ? Promise.reject(error) : true
    },
  }, { automatic: true })
  await plugin.load([{ text: 'failed', time: 10, mode: 1 }, { text: 'healthy', time: 10, mode: 1 }])
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  await env.flush()
  assert.deepEqual(output(env, 'error').map(event => event.args[0]), [error])
  assert.deepEqual(output(env, 'visible').map(event => event.args[0].text), ['healthy'])
  env.frame()
  await env.flush()
  assert.deepEqual(calls, ['failed', 'healthy'])
  retry = true
  assert.equal(owner.start(), owner)
  assert.equal(env.frames.size, 1)
  env.frame()
  await env.flush()
  assert.deepEqual(calls, ['failed', 'healthy', 'failed'])
  assert.deepEqual(output(env, 'visible').map(event => event.args[0].text), ['healthy', 'failed'])
  assert.equal(output(env, 'error').length, 1)
  env.destroy()
})

test(`${prefix}: a cancelled beforeVisible rejection is observed without reporting a stale error`, async () => {
  const gate = deferred()
  const { env, plugin, owner } = await fixture({ beforeVisible: () => gate.promise })
  await plugin.emit({ text: 'cancelled', time: 10 })
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  env.destroy()
  gate.reject(new Error('rejected after destroy'))
  await env.flush()
  assert.equal(output(env, 'error').length, 0)
  assert.equal(output(env, 'visible').length, 0)
  assert.equal(env.frames.size, 0)
})

test(`${prefix}: beforeVisible false remains eligible for the next frame`, async () => {
  let calls = 0
  const { env, plugin, owner } = await fixture({ beforeVisible: () => ++calls > 1 }, { automatic: true })
  await plugin.emit({ text: 'retry false', time: 10, mode: 1 })
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  assert.equal(output(env, 'visible').length, 0)
  env.frame()
  await env.flush()
  assert.equal(calls, 2)
  assert.equal(output(env, 'visible').length, 1)
  assert.equal(output(env, 'error').length, 0)
  env.destroy()
})

test(`${prefix}: hide preserves an already visible row and show permits fresh scheduling`, async () => {
  const { env, plugin, owner } = await fixture({}, { automatic: true })
  await plugin.emit({ text: 'visible before hide', time: 10, mode: 1 })
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  const row = owner.queue[0]
  const ref = row.$ref
  const resets = output(env, 'reset').length
  assert.equal(plugin.hide(), owner)
  assert.equal(row.$state, 'emit')
  assert.equal(row.$ref, ref)
  assert.equal(output(env, 'reset').length, resets)
  assert.equal(plugin.show(), owner)
  await plugin.emit({ text: 'visible after show', time: 10, mode: 1 })
  env.frame()
  await env.flush()
  assert.equal(output(env, 'visible').length, 2)
  env.destroy()
})

test(`${prefix}: replacing beforeVisible releases an unresolved old callback without resetting displayed rows`, async () => {
  const gate = deferred()
  const calls = []
  const { env, plugin, owner } = await fixture({
    beforeVisible(row) {
      calls.push(`old:${row.text}`)
      return row.text === 'pending' ? gate.promise : true
    },
  }, { automatic: true })
  await plugin.load([{ text: 'displayed', time: 10, mode: 1 }, { text: 'pending', time: 10, mode: 1 }])
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  await env.flush()
  const displayed = owner.queue[0]
  const ref = displayed.$ref
  const resets = output(env, 'reset').length
  assert.deepEqual(calls, ['old:displayed', 'old:pending'])
  plugin.config({
    beforeVisible(row) {
      calls.push(`new:${row.text}`)
      return true
    },
  })
  assert.equal(displayed.$state, 'emit')
  assert.equal(displayed.$ref, ref)
  assert.equal(output(env, 'reset').length, resets)
  assert.equal(env.frames.size, 1)
  env.frame()
  await env.flush()
  assert.deepEqual(calls, ['old:displayed', 'old:pending', 'new:pending'])
  assert.deepEqual(output(env, 'visible').map(event => event.args[0].text), ['displayed', 'pending'])
  gate.resolve(true)
  await env.flush()
  assert.equal(output(env, 'visible').length, 2)
  env.destroy()
})

test(`${prefix}: configuring the same beforeVisible callback preserves the pending operation`, async () => {
  const gate = deferred()
  let calls = 0
  const beforeVisible = () => {
    calls++
    return gate.promise
  }
  const { env, plugin, owner } = await fixture({ beforeVisible }, { automatic: true })
  await plugin.emit({ text: 'same callback', time: 10, mode: 1 })
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  const configurations = output(env, 'config').length
  plugin.config({ beforeVisible })
  assert.equal(output(env, 'config').length, configurations)
  assert.equal(env.frames.size, 0)
  gate.resolve(true)
  await env.flush()
  assert.equal(calls, 1)
  assert.equal(output(env, 'visible').length, 1)
  assert.equal(env.frames.size, 1)
  env.destroy()
})

for (const action of ['destroy', 'stop']) {
  test(`${prefix}: ${action} inside a Worker rebuild error listener prevents the outer start from reviving stopped rows`, async () => {
    const { env, plugin, owner, worker } = await fixture({}, { automatic: true })
    await plugin.emit({ text: 'already displayed', time: 10, mode: 1 })
    env.art.playing = true
    owner.start()
    env.frame()
    await env.flush()
    const row = owner.queue[0]
    assert.equal(row.$state, 'emit')
    const workerError = new Error('initial worker fault')
    worker.onerror({ error: workerError, preventDefault() {} })
    owner.stop()
    assert.equal(row.$state, 'stop')
    const rebuildError = new Error('rebuild original error')
    // This is an explicit constructor-failure seam, not a native Worker assertion.
    owner.createWorker = () => {
      throw rebuildError
    }
    env.art.on('artplayerPluginDanmuku:error', (error) => {
      if (error === rebuildError) {
        if (action === 'destroy')
          env.destroy()
        else
          owner.stop()
      }
    })
    const starts = output(env, 'start').length
    assert.equal(owner.start(), owner)
    await env.flush()
    assert.equal(row.$state, 'stop')
    assert.equal(owner.isStop, true)
    assert.equal(output(env, 'start').length, starts)
    assert.equal(env.frames.size, 0)
    assert.deepEqual(output(env, 'error').map(event => event.args[0]), [workerError, rebuildError])
    if (action !== 'destroy')
      env.destroy()
  })
}

for (const action of ['reset', 'hide', 'start']) {
  test(`${prefix}: ${action} reentry from a rebuild error owns the recovery without a second outer start`, async () => {
    const { env, plugin, owner, worker } = await fixture({}, { automatic: true })
    await plugin.emit({ text: 'displayed before recovery', time: 10, mode: 1 })
    env.art.playing = true
    owner.start()
    env.frame()
    await env.flush()
    const row = owner.queue[0]
    assert.equal(row.$state, 'emit')
    const workerError = new Error('worker failed before reentry')
    worker.onerror({ error: workerError, preventDefault() {} })
    owner.stop()
    const createWorker = owner.createWorker
    const rebuildError = new Error('one rebuild failure')
    owner.createWorker = () => {
      throw rebuildError
    }
    let recoveries = 0
    env.art.on('artplayerPluginDanmuku:error', (error) => {
      if (error !== rebuildError)
        return
      recoveries++
      assert.equal(recoveries, 1, 'The recovery listener must not retry itself indefinitely')
      owner.createWorker = createWorker
      owner[action]()
    })
    const starts = output(env, 'start').length
    const resets = output(env, 'reset').length
    assert.equal(owner.start(), owner)
    await env.flush()
    assert.equal(recoveries, 1)
    assert.deepEqual(output(env, 'error').map(event => event.args[0]), [workerError, rebuildError])
    assert.equal(output(env, 'start').length, starts + (action === 'start' ? 1 : 0))
    assert.equal(output(env, 'reset').length, resets + (action === 'reset' ? 1 : 0))
    assert.equal(row.$state, action === 'reset' ? 'wait' : action === 'start' ? 'emit' : 'stop')
    assert.equal(owner.isHide, action === 'hide')
    assert.equal(env.frames.size, action === 'start' ? 1 : 0)
    if (action === 'reset')
      assert.equal(row.$ref, null)
    env.destroy()
  })
}

test(`${prefix}: requests in the same millisecond have distinct ids and reverse replies settle the right promises`, async () => {
  const { env, owner, worker, reply } = await fixture()
  let first
  let second
  owner.postMessage(geometry(1)).then(value => first = value)
  owner.postMessage(geometry(2)).then(value => second = value)
  assert.equal(worker.messages.length, 2)
  assert.notEqual(worker.messages[0].message.id, worker.messages[1].message.id)
  reply(1)
  await env.flush()
  assert.equal(first, undefined)
  assert.equal(second.result, 250)
  assert.equal(second.id, worker.messages[1].message.id)
  reply(0)
  await env.flush()
  assert.equal(first.result, 10)
  assert.equal(first.id, worker.messages[0].message.id)
  env.destroy()
})

test(`${prefix}: a synchronous real algorithm response cannot arrive before its resolver is installed`, async () => {
  const { env, owner, worker, calculate, deliver } = await fixture()
  const post = worker.postMessage.bind(worker)
  worker.postMessage = (message) => {
    post(message)
    deliver(calculate(message))
  }
  let response
  owner.postMessage(geometry(2)).then(value => response = value)
  await env.flush()
  assert.equal(response?.result, 250)
  env.destroy()
})

test(`${prefix}: the actual algorithm places three same-time fixed rows on distinct tracks in one frame`, async () => {
  const { env, plugin, owner, layer } = await fixture({}, { automatic: true })
  await plugin.load([0, 1, 2].map(index => ({ text: `fixed-${index}`, time: 10, mode: 1 })))
  env.art.playing = true
  owner.start()
  env.frame()
  for (let step = 0; step < 3; step++)
    await env.flush()
  assert.deepEqual(Array.from(owner.queue, row => row.$state), ['emit', 'emit', 'emit'])
  assert.deepEqual(Array.from(owner.queue, row => row.$ref.offsetTop), [10, 30, 50])
  assert.equal(layer.children.length, 3)
  assert.deepEqual(output(env, 'visible').map(event => event.args[0].text), ['fixed-0', 'fixed-1', 'fixed-2'])
  assert.equal(env.frames.size, 1)
  env.destroy()
})

for (const mode of [0, 1, 2]) {
  test(`${prefix}: delayed Worker reply starts visible lifetime at placement for mode ${mode}`, async (t) => {
    const { env, plugin, owner, worker, layer, reply } = await fixture({ speed: 1 })
    t.after(() => env.destroy())
    await plugin.emit({ text: `delayed-${mode}`, time: 10, mode })
    const row = owner.queue[0]
    env.art.playing = true
    owner.start()
    const pendingFrame = env.frame()
    await env.flush()
    assert.equal(worker.messages.length, 1)
    const ref = row.$ref
    assert.equal(layer.children.length, 1)
    assert.equal(output(env, 'visible').length, 0, 'Measurement before the Worker reply is not visible lifetime')
    assert.notEqual(ref.style.visibility, 'visible')

    // The reply uses the real positioning algorithm; only its delivery and the
    // wall/media clocks are controlled. No browser animation timing is claimed.
    env.tick(3000)
    env.art.currentTime += 3
    const placedAt = env.context.Date.now()
    reply(0)
    await pendingFrame
    assert.equal(row.$state, 'emit')
    assert.equal(row.$ref, ref)
    assert.equal(ref.style.visibility, 'visible')
    assert.deepEqual(output(env, 'visible').map(event => event.args[0]), [row])
    assert.equal(row.$restTime, 1)
    assert.equal(row.$lastStartTime, placedAt, 'Hidden Worker waiting must not shorten the visible duration')
    if (mode === 0)
      assert.equal(ref.style.transition, 'transform 1s linear 0s')

    env.tick(250)
    env.art.currentTime += 0.25
    await env.frame()
    assert.equal(row.$state, 'emit')
    assert.equal(row.$ref, ref)
    assert.equal(row.$restTime, 0.75, 'Only elapsed time since visible placement consumes lifetime')
    assert.equal(owner.$refs.length, 0)

    env.tick(750)
    env.art.currentTime += 0.75
    await env.frame()
    assert.equal(row.$state, 'wait')
    assert.equal(row.$ref, null)
    assert.equal(ref.style.visibility, 'hidden')
    assert.deepEqual(Array.from(owner.$refs), [ref], 'The expired node returns to its pool exactly once')
    await env.frame()
    assert.deepEqual(Array.from(owner.$refs), [ref])
    assert.equal(worker.messages.length, 1)
    assert.equal(output(env, 'visible').length, 1)
    assert.equal(output(env, 'error').length, 0)
  })
}

test(`${prefix}: a sampled three-hour simulated clock preserves batch order, pooled nodes, pause and seek state`, async (t) => {
  // Advance a controlled clock at lifecycle boundaries; this is not a real-time
  // endurance, frame-rate, CSS animation or browser memory measurement.
  const { env, plugin, owner, worker, layer } = await fixture({}, { automatic: true })
  t.after(() => env.destroy())
  const batchCount = 180
  const batchSize = 4
  const firstTime = 10
  const horizon = 3 * 60 * 60
  const rows = Array.from({ length: batchCount * batchSize }, (_, index) => ({
    text: `long-${index}`,
    time: firstTime + Math.floor(index / batchSize) * 60,
    mode: 1,
  }))
  await plugin.load(rows)
  const queue = owner.queue
  const expectedOrder = Array.from(queue, row => row.text)
  let advanced = 0
  const tick = (milliseconds) => {
    advanced += milliseconds
    env.tick(milliseconds)
  }
  const membership = () => {
    const items = Object.entries(owner.states).flatMap(([state, items]) => {
      for (const item of items)
        assert.equal(item.$state, state)
      return Array.from(items)
    })
    assert.equal(items.length, queue.length)
    assert.equal(new Set(items).size, queue.length, 'Every row belongs to exactly one state pool')
    assert(items.every(item => queue.includes(item)))
  }
  let pooledNodes
  let pauses = 0
  env.art.playing = true
  env.art.emit('video:play')
  env.art.emit('video:playing')

  for (let batch = 0; batch < batchCount; batch++) {
    const time = firstTime + batch * 60
    tick((time - env.art.currentTime) * 1000)
    env.art.currentTime = time
    assert.equal(env.frames.size, 1)
    const requests = worker.messages.length
    await env.frame()
    const active = Array.from(queue.slice(batch * batchSize, (batch + 1) * batchSize))
    assert.deepEqual(output(env, 'visible').slice(-batchSize).map(event => event.args[0]), active)
    assert.equal(worker.messages.length, requests + batchSize, 'One position request per row in this batch')
    assert.deepEqual(worker.messages.slice(requests).map(item => item.message.visibles.length), [0, 1, 2, 3])
    assert.deepEqual(active.map(row => row.$state), ['emit', 'emit', 'emit', 'emit'])
    assert.deepEqual(active.map(row => row.$ref.offsetTop), [10, 30, 50, 70])
    if (!pooledNodes)
      pooledNodes = new Set(layer.children)
    assert.equal(layer.children.length, batchSize)
    assert(active.every(row => pooledNodes.has(row.$ref)), 'Later batches reuse the original measured nodes')
    membership()

    tick(1000)
    env.art.currentTime++
    await env.frame()
    assert(active.every(row => row.$restTime === 4))
    if (batch % 12 === 11) {
      pauses++
      const refs = active.map(row => row.$ref)
      const resetCount = output(env, 'reset').length
      env.art.playing = false
      env.art.emit('video:pause')
      assert.equal(env.frames.size, 0)
      tick(120000)
      env.art.currentTime = time + 20
      env.art.emit('video:seeking')
      env.art.emit('video:seeked')
      assert.equal(output(env, 'reset').length, resetCount)
      assert(active.every(row => row.$state === 'stop' && row.$restTime === 4))
      assert.deepEqual(active.map(row => row.$ref), refs)
      env.art.playing = true
      env.art.emit('video:play')
      env.art.emit('video:playing')
      assert.equal(env.frames.size, 1)
      await env.frame()
      assert(active.every(row => row.$state === 'emit' && row.$restTime === 4))
      assert.deepEqual(active.map(row => row.$ref), refs)
      assert.equal(worker.messages.length, requests + batchSize, 'Resume and seek must not allocate duplicate rows')
    }

    tick(5000)
    env.art.currentTime += 5
    await env.frame()
    assert(active.every(row => row.$state === 'wait' && row.$ref === null))
    assert.equal(owner.$refs.length, batchSize)
    assert.equal(new Set(owner.$refs).size, batchSize, 'Each reusable node returns to the pool once')
    assert.equal(layer.children.length, batchSize)
    assert.equal(env.frames.size, 1)
    membership()
  }

  tick((firstTime + horizon - env.art.currentTime) * 1000)
  env.art.currentTime = firstTime + horizon
  await env.frame()
  assert.equal(pauses, 15)
  assert(advanced > horizon * 1000, 'The simulated wall clock also includes the paused intervals')
  assert.equal(owner.queue, queue)
  assert(queue.every(row => row.$state === 'wait' && row.$ref === null))
  assert.deepEqual(output(env, 'visible').map(event => event.args[0].text), expectedOrder)
  assert.equal(worker.messages.length, rows.length)
  assert.equal(new Set(worker.messages.map(item => item.message.id)).size, rows.length)
  assert.equal(output(env, 'error').length, 0)
  assert.equal(env.workers.length, 1)
  owner.stop()
  assert.equal(env.frames.size, 0)
})

test(`${prefix}: paused wall clock does not consume remaining lifetime and expiration returns a row to wait`, async () => {
  const { env, plugin, owner } = await fixture({}, { automatic: true })
  await plugin.emit({ text: 'clock', time: 10, mode: 1 })
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  const row = owner.queue[0]
  assert.equal(row.$restTime, 5)
  env.tick(1000)
  env.art.currentTime = 11
  env.frame()
  await env.flush()
  assert.equal(row.$restTime, 4)
  env.art.playing = false
  owner.stop()
  assert.equal(row.$state, 'stop')
  env.tick(5000)
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  assert.equal(row.$restTime, 4)
  env.tick(500)
  env.art.currentTime = 11.5
  env.frame()
  await env.flush()
  assert.equal(row.$restTime, 3.5)
  env.tick(4000)
  env.art.currentTime = 15.5
  env.frame()
  await env.flush()
  assert.equal(row.$state, 'wait')
  assert.equal(row.$ref, null)
  assert.equal(owner.queue.length, 1)
  assert.equal(output(env, 'visible').length, 1)
  env.destroy()
})

test(`${prefix}: playbackRate is sampled for new rows while active lifetime and seek reset-event semantics stay compatible`, async () => {
  const { env, plugin, owner } = await fixture({ synchronousPlayback: true }, { automatic: true })
  await plugin.load([{ text: 'already-visible', time: 10, mode: 1 }, { text: 'after-seek', time: 20, mode: 1 }])
  env.art.playbackRate = 2
  env.art.playing = true
  owner.start()
  env.frame()
  await env.flush()
  const existing = owner.queue[0]
  assert.equal(existing.$restTime, 2.5)
  env.art.playbackRate = 4
  const resets = output(env, 'reset').length
  env.art.currentTime = 20
  env.art.emit('video:seeking')
  assert.equal(existing.$state, 'emit')
  assert.equal(existing.$restTime, 2.5)
  assert.equal(output(env, 'reset').length, resets)
  assert.equal(env.frames.size, 1)
  env.frame()
  await env.flush()
  assert.equal(owner.queue[1].$restTime, 1.25)
  assert.equal(existing.$restTime, 2.5)
  env.destroy()
})
