import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Controlled client faults and real worker geometry use the Node runner.
import test from 'node:test'
import vm from 'node:vm'
import { danmukuCandidate, danmukuCandidateEnvironment } from './helpers/danmuku-candidate.js'
import { loadModules } from './helpers/load.js'

const { WorkerClient } = await loadModules({ WorkerClient: 'packages/artplayer-plugin-danmuku/src/worker-client' })
const implementation = await danmukuCandidate()

// This client double records protocol ownership; it does not simulate geometry.
function clientFixture(onFailure = () => {}) {
  const messages = []
  const failures = []
  const worker = {
    terminateCalls: 0,
    postMessage(message) { messages.push({ ...message }) },
    terminate() { this.terminateCalls++ },
  }
  const client = new WorkerClient(() => worker, (error) => {
    failures.push(error)
    onFailure(error)
  })
  return { client, worker, messages, failures }
}

function detached(worker) {
  assert.equal(worker.onmessage, null)
  assert.equal(worker.onerror, null)
  assert.equal(worker.onmessageerror, null)
}

test('danmuku worker client: simultaneous requests have distinct IDs and reversed replies retain their owners', async () => {
  const { client, worker, messages } = clientFixture()
  const inputs = [{ type: 'getDanmuTop', tag: 'first' }, { type: 'getDanmuTop', tag: 'second' }]
  const first = client.request(inputs[0])
  const second = client.request(inputs[1])
  assert.notEqual(inputs[0].id, inputs[1].id)
  assert.deepEqual(messages.map(item => item.id), inputs.map(item => item.id))
  assert.equal(client.pending.size, 2)
  worker.onmessage({ data: { id: inputs[1].id, result: 33 } })
  assert.deepEqual(await second, { id: inputs[1].id, result: 33 })
  assert.equal(client.pending.size, 1)
  worker.onmessage({ data: { id: inputs[0].id, result: 10 } })
  assert.deepEqual(await first, { id: inputs[0].id, result: 10 })
  assert.equal(client.pending.size, 0)
  client.dispose()
})

test('danmuku worker client: a synchronous reply is observed before postMessage returns', async () => {
  const { client, worker } = clientFixture()
  const callback = worker.onmessage
  worker.postMessage = message => callback({ data: { id: message.id, result: 72 } })
  const message = { type: 'getDanmuTop' }
  assert.deepEqual(await client.request(message), { id: message.id, result: 72 })
  assert.equal(worker.onmessage, callback, 'Requests must not replace the shared dispatcher')
  assert.equal(client.pending.size, 0)
  client.dispose()
})

test('danmuku worker client: unrelated and repeated messages cannot settle another request', async () => {
  const { client, worker } = clientFixture()
  const a = { type: 'getDanmuTop' }
  const b = { type: 'getDanmuTop' }
  const first = client.request(a)
  const second = client.request(b)
  worker.onmessage({ data: { id: 'unrelated', result: 100 } })
  assert.equal(client.pending.size, 2)
  worker.onmessage({ data: { id: a.id, result: 10 } })
  worker.onmessage({ data: { id: a.id, result: 999 } })
  assert.deepEqual(await first, { id: a.id, result: 10 })
  assert.equal(client.pending.size, 1)
  worker.onmessage({ data: { id: b.id, result: 33 } })
  assert.deepEqual(await second, { id: b.id, result: 33 })
  client.dispose()
})

test('danmuku worker client: cancellation settles every owner, ignores late replies and permits new work', async () => {
  const { client, worker, failures } = clientFixture()
  const messages = [{ type: 'getDanmuTop' }, { type: 'getDanmuTop' }]
  const pending = messages.map(message => client.request(message))
  client.cancel()
  assert.deepEqual(await Promise.all(pending), messages.map(message => ({ id: message.id, result: undefined })))
  assert.equal(client.pending.size, 0)
  assert.equal(worker.terminateCalls, 0)
  const next = { type: 'getDanmuTop' }
  const nextPending = client.request(next)
  for (const message of messages)
    worker.onmessage({ data: { id: message.id, result: 10 } })
  assert.equal(client.pending.size, 1)
  worker.onmessage({ data: { id: next.id, result: 56 } })
  assert.deepEqual(await nextPending, { id: next.id, result: 56 })
  assert.deepEqual(failures, [])
  client.dispose()
})

for (const eventName of ['error', 'messageerror']) {
  test(`danmuku worker client: ${eventName} rejects all pending requests with the original failure exactly once`, async () => {
    const { client, worker, messages, failures } = clientFixture()
    const error = new Error(`${eventName}-original`)
    const a = client.request({ type: 'getDanmuTop' })
    const b = client.request({ type: 'getDanmuTop' })
    const rejected = Promise.all([assert.rejects(a, value => value === error), assert.rejects(b, value => value === error)])
    let prevented = 0
    const handler = worker[`on${eventName}`]
    handler({ error, preventDefault() {
      prevented++
    } })
    handler({ error: new Error('duplicate') })
    await rejected
    assert.deepEqual(failures, [error])
    assert.equal(client.pending.size, 0)
    assert.equal(client.failed, true)
    if (eventName === 'error')
      assert.equal(prevented, 1)
    const ignored = { type: 'getDanmuTop' }
    assert.deepEqual(await client.request(ignored), { id: ignored.id, result: undefined })
    assert.equal(messages.length, 2)
    client.dispose()
    detached(worker)
    assert.equal(worker.terminateCalls, 1)
  })
}

for (const error of [new Error('post-original'), undefined, null, false]) {
  test(`danmuku worker client: synchronous postMessage throw ${String(error)} retains the exact rejection value`, async () => {
    const { client, worker, failures } = clientFixture()
    const first = client.request({ type: 'getDanmuTop' })
    const rejected = assert.rejects(first, value => value === error)
    worker.postMessage = () => {
      throw error
    }
    await assert.rejects(client.request({ type: 'getDanmuTop' }), value => value === error)
    await rejected
    assert.deepEqual(failures, [error])
    assert.equal(client.pending.size, 0)
    client.dispose()
  })
}

test('danmuku worker client: dispose cancels pending work, detaches handlers and terminates exactly once', async () => {
  const { client, worker, messages, failures } = clientFixture()
  const message = { type: 'getDanmuTop' }
  const pending = client.request(message)
  const oldHandler = worker.onmessage
  client.dispose()
  client.dispose()
  assert.deepEqual(await pending, { id: message.id, result: undefined })
  detached(worker)
  assert.equal(worker.terminateCalls, 1)
  oldHandler({ data: { id: message.id, result: 100 } })
  const after = { type: 'getDanmuTop' }
  assert.deepEqual(await client.request(after), { id: after.id, result: undefined })
  assert.equal(messages.length, 1)
  assert.deepEqual(failures, [])
})

test('danmuku worker client: termination failure still settles pending requests and detaches owned handlers', async () => {
  const { client, worker } = clientFixture()
  const error = new Error('terminate-original')
  worker.terminate = () => {
    worker.terminateCalls++
    throw error
  }
  const input = { type: 'getDanmuTop' }
  const pending = client.request(input)
  assert.throws(() => client.dispose(), value => value === error)
  assert.deepEqual(await pending, { id: input.id, result: undefined })
  detached(worker)
  client.dispose()
  assert.equal(worker.terminateCalls, 1)
})

test('danmuku worker client: fault cleanup cannot replace the original request error', async () => {
  const { client, worker, failures } = clientFixture()
  const original = new Error('worker-original')
  const cleanup = new Error('terminate-secondary')
  worker.terminate = () => {
    worker.terminateCalls++
    throw cleanup
  }
  const pending = client.request({ type: 'getDanmuTop' })
  const rejected = assert.rejects(pending, error => error === original)
  worker.onerror({ error: original, preventDefault() {} })
  await rejected
  assert.deepEqual(failures, [original])
  detached(worker)
  assert.equal(worker.terminateCalls, 1)
  client.dispose()
  assert.equal(worker.terminateCalls, 1)
})

test('danmuku worker client: initial handler setup failure terminates the worker and preserves the setup error', () => {
  const original = new Error('handler-setup-original')
  let terminated = 0
  const worker = {
    get onmessage() { return undefined },
    set onmessage(_value) { throw original },
    terminate() {
      terminated++
      throw new Error('terminate-secondary')
    },
  }
  assert.throws(() => new WorkerClient(() => worker, () => assert.fail('No initialized client may report a runtime fault')), error => error === original)
  assert.equal(terminated, 1)
})

test('danmuku worker client: independent clients never share pending ownership', async () => {
  const first = clientFixture()
  const second = clientFixture()
  const a = { type: 'getDanmuTop' }
  const b = { type: 'getDanmuTop' }
  const pa = first.client.request(a)
  const pb = second.client.request(b)
  assert.notEqual(a.id, b.id)
  first.client.dispose()
  assert.deepEqual(await pa, { id: a.id, result: undefined })
  assert.equal(second.worker.terminateCalls, 0)
  assert.equal(second.client.pending.size, 1)
  second.worker.onmessage({ data: { id: b.id, result: 70 } })
  assert.deepEqual(await pb, { id: b.id, result: 70 })
  second.client.dispose()
})

// Unlike the client double above, this executes the actual unmodified worker
// script. Numeric geometry inputs are controlled; no browser layout is claimed.
const workerCode = fs.readFileSync(new URL('../packages/artplayer-plugin-danmuku/src/worker.js', import.meta.url), 'utf8')

function calculateGeometry(input) {
  const replies = []
  const context = vm.createContext({ input, postMessage: data => replies.push(data) })
  vm.runInContext(workerCode, context, { timeout: 1000 })
  vm.runInContext('onmessage({ data: input })', context, { timeout: 1000 })
  assert.equal(replies.length, 1)
  assert.equal(replies[0].id, input.id)
  return replies[0].result
}

test('danmuku actual worker: fixed tracks preserve mode isolation, margins, gap direction and full-track deferral', () => {
  const base = { id: 1, type: 'getDanmuTop', clientWidth: 100, clientHeight: 100, marginTop: 10, marginBottom: 10, antiOverlap: true }
  const target = mode => ({ mode, height: 20, speed: 20 })
  assert.equal(calculateGeometry({ ...base, target: target(1), visibles: [] }), 10)
  assert.equal(calculateGeometry({ ...base, target: target(2), visibles: [] }), 70)
  assert.equal(calculateGeometry({ ...base, target: target(1), visibles: [{ mode: 1, top: 10, height: 20 }] }), 30)
  assert.equal(calculateGeometry({ ...base, target: target(2), visibles: [{ mode: 2, top: 70, height: 20 }] }), 50)
  assert.equal(calculateGeometry({ ...base, target: target(1), visibles: [{ mode: 0, top: 10, height: 80 }] }), 10)
  assert.equal(calculateGeometry({ ...base, target: target(1), visibles: [{ mode: 1, top: 95, height: 20 }] }), 10)
  for (const mode of [1, 2]) {
    const visibles = Object.freeze([Object.freeze({ mode, top: 10, height: 40 }), Object.freeze({ mode, top: 50, height: 40 })])
    assert.equal(calculateGeometry({ ...base, target: target(mode), visibles }), undefined)
  }
})

test('danmuku actual worker: rolling collision decisions retain distance, remaining-time and relative-speed semantics', () => {
  const base = { id: 2, type: 'getDanmuTop', clientWidth: 100, clientHeight: 100, marginTop: 10, marginBottom: 10, antiOverlap: true }
  const visible = { mode: 0, top: 10, height: 80, left: 40, width: 40, distance: 80, right: 20, speed: 10, time: 8 }
  const calculate = (speed, changed = {}) => calculateGeometry({ ...base, target: { mode: 0, height: 20, speed }, visibles: [{ ...visible, ...changed }] })
  assert.equal(calculate(5), 10, 'A slower follower cannot catch the existing row')
  assert.equal(calculate(10), 10, 'Equal speed with a positive gap remains safe')
  assert.equal(calculate(11), 10, 'Catch-up happens after the existing remaining lifetime')
  assert.equal(calculate(20), undefined, 'Catch-up before expiration defers the follower')
  assert.equal(calculate(5, { distance: 110, right: -10 }), undefined, 'An existing row not fully inside blocks reuse')
})

test('danmuku actual worker: disabled antiOverlap retains the historical occupancy ranking', () => {
  const base = { id: 3, type: 'getDanmuTop', clientWidth: 100, clientHeight: 100, marginTop: 10, marginBottom: 10, antiOverlap: false }
  for (const mode of [0, 1, 2]) {
    const visibles = [{ mode, top: 10, height: 40, width: 80, right: 10 }, { mode, top: 50, height: 40, width: 20, right: 30 }]
    assert.equal(calculateGeometry({ ...base, target: { mode, height: 20, speed: 20 }, visibles }), 50)
  }
})

test(`danmuku ${implementation.name}: owner requests made with the same clock tick remain distinct`, async (t) => {
  const env = danmukuCandidateEnvironment(implementation)
  const plugin = env.factory({ danmuku: [] })(env.art)
  t.after(() => env.destroy())
  const owner = plugin.show()
  const first = owner.postMessage({ type: 'getDanmuTop' })
  const second = owner.postMessage({ type: 'getDanmuTop' })
  const worker = env.workers[0]
  assert.equal(worker.messages.length, 2)
  const [a, b] = worker.messages.map(item => item.message.id)
  assert.notEqual(a, b, 'The controlled Date.now value is unchanged between calls')
  worker.deliver({ id: b, result: 33 })
  assert.equal((await second).result, 33)
  worker.deliver({ id: a, result: 10 })
  assert.equal((await first).result, 10)
})

for (const recovery of ['start', 'reset']) {
  test(`danmuku ${implementation.name}: a Worker fault stops the run once and ${recovery} rebuilds the client`, async (t) => {
    const env = danmukuCandidateEnvironment(implementation)
    const plugin = env.factory({ danmuku: [] })(env.art)
    t.after(() => env.destroy())
    const owner = plugin.show()
    env.art.playing = true
    env.art.emit('video:play')
    assert.equal(env.frames.size, 1)
    const worker = env.workers[0]
    const error = new Error(`${recovery}-worker-original`)
    const first = owner.postMessage({ type: 'getDanmuTop' })
    const second = owner.postMessage({ type: 'getDanmuTop' })
    const rejected = Promise.all([assert.rejects(first, value => value === error), assert.rejects(second, value => value === error)])
    const fail = worker.onerror
    fail({ error, preventDefault() {} })
    fail({ error: new Error('duplicate'), preventDefault() {} })
    await rejected
    assert.deepEqual(env.events.filter(event => event.name === 'artplayerPluginDanmuku:error').map(event => event.args), [[error]])
    assert.equal(env.frames.size, 0)
    assert.equal(worker.terminated, true)
    detached(worker)
    if (recovery === 'start')
      env.art.emit('video:play')
    else plugin.reset()
    assert.equal(env.workers.length, 2)
    assert.equal(env.frames.size, 1)
    const fresh = env.workers[1]
    assert.notEqual(fresh, worker)
    assert.equal(fresh.terminated, false)
    const pending = owner.postMessage({ type: 'getDanmuTop' })
    const { id } = fresh.messages[0].message
    fresh.deliver({ id, result: 10 })
    assert.equal((await pending).result, 10)
    assert.equal(env.events.filter(event => event.name === 'artplayerPluginDanmuku:error').length, 1)
  })
}
