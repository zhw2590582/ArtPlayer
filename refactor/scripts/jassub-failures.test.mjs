import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Frozen failure observations use the repository runner.
import test from 'node:test'
import { jassubEnvironment, jassubHistorical } from '../../test/helpers/jassub.js'

const observations = []
const implementations = await jassubHistorical()

function environment(implementation) {
  // Expose only VM platform constructors for controlled faults; vendor methods stay unchanged.
  const code = `${implementation.code}\nObject.defineProperty(module.exports.default || module.exports, '__reviewPlatform', { value: { createCanvas: () => document.createElement('canvas'), setGlobal: (name, value) => { globalThis[name] = value }, ErrorEvent, Video: HTMLVideoElement } });`
  const env = jassubEnvironment({ ...implementation, code })
  env.platform = env.factory.__reviewPlatform
  return env
}

function trackListeners(video) {
  const listeners = new Map()
  const add = video.addEventListener
  const remove = video.removeEventListener
  video.addEventListener = function (type, callback, ...options) {
    if (!listeners.has(type))
      listeners.set(type, new Set())
    listeners.get(type).add(callback)
    return add.call(this, type, callback, ...options)
  }
  video.removeEventListener = function (type, callback, ...options) {
    listeners.get(type)?.delete(callback)
    return remove.call(this, type, callback, ...options)
  }
  return () => [...listeners.values()].reduce((count, entries) => count + entries.size, 0)
}

function frames(env) {
  const pending = new Map()
  const cancelled = []
  let next = 0
  env.platform.Video.prototype.requestVideoFrameCallback = function (callback) {
    pending.set(++next, { video: this, callback })
    return next
  }
  env.platform.Video.prototype.cancelVideoFrameCallback = function (id) {
    cancelled.push(id)
    pending.delete(id)
  }
  return {
    pending,
    cancelled,
    deliver(video, metadata) {
      const entry = [...pending].find(([, row]) => row.video === video)
      assert(entry, 'must deliver an actually queued frame callback')
      const [id, row] = entry
      pending.delete(id)
      row.callback(0, metadata)
    },
  }
}

for (const implementation of implementations) {
  test(`JASSUB failure baseline ${implementation.name}: fallback ratechange forwards the Event instead of the numeric media rate`, async () => {
    const env = environment(implementation)
    const { instance } = env.factory()(env.art)
    await env.ready()
    instance.setRate(2)
    await env.flush()
    assert.equal(env.workers[0].messages.at(-1).rate, 2)
    env.art.video.playbackRate = 1.5
    const event = new Event('ratechange')
    env.art.video.dispatchEvent(event)
    await env.flush()
    const message = env.workers[0].messages.at(-1)
    assert.equal(message.target, 'video')
    assert.equal(message.rate, event)
    assert.notEqual(message.rate, env.art.video.playbackRate)
    observations.push({ implementation: implementation.name, case: 'rate-event-payload', mediaRate: 1.5, forwardedType: message.rate.type, directNumericRatePreserved: true })
    instance.destroy()
  })

  test(`JASSUB failure baseline ${implementation.name}: direct destroy followed by art destroy throws on the removed container`, async () => {
    const env = environment(implementation)
    const active = trackListeners(env.art.video)
    const { instance } = env.factory()(env.art)
    await env.ready()
    assert.equal(active(), 7)
    instance.destroy()
    assert.equal(active(), 0)
    assert.equal(env.workers[0].terminated, 1)
    assert.equal(env.parent.children.length, 1)
    assert.throws(() => env.emit('destroy'), { code: 'ERR_ASSERTION' })
    assert.throws(() => instance.destroy(), { code: 'ERR_ASSERTION' })
    assert.equal(env.workers[0].terminated, 1)
    observations.push({ implementation: implementation.name, case: 'repeated-destroy', throws: true, workerTerminations: 1 })
  })

  test(`JASSUB failure baseline ${implementation.name}: setVideo across parents makes destroy throw before releasing the worker`, async () => {
    const env = environment(implementation)
    const { instance } = env.factory()(env.art)
    await env.ready()
    const secondParent = new env.parent.constructor()
    const secondVideo = secondParent.appendChild(new env.platform.Video())
    const active = trackListeners(secondVideo)
    instance.setVideo(secondVideo)
    assert.equal(active(), 7)
    assert.throws(() => instance.destroy(), { code: 'ERR_ASSERTION' })
    assert.notEqual(instance._destroyed, true)
    assert.equal(env.workers[0].terminated, 0)
    assert.equal(env.parent.children.length, 2)
    assert.equal(active(), 7)
    observations.push({ implementation: implementation.name, case: 'set-video-parent', workerTerminations: 0, listenersRetained: active(), originalContainerRetained: true })
    instance.setVideo(env.art.video)
    instance.destroy()
  })

  test(`JASSUB failure baseline ${implementation.name}: a supplied canvas makes the adapter throw after allocating the worker`, async () => {
    const env = environment(implementation)
    const active = trackListeners(env.art.video)
    const canvas = env.parent.appendChild(env.platform.createCanvas())
    assert.throws(() => env.factory({ canvas })(env.art), { name: 'TypeError', message: /reading 'style'/ })
    await env.flush()
    assert.equal(env.workers.length, 1)
    assert.equal(env.workers[0].terminated, 0)
    assert.equal(env.workers[0].messages[0].target, 'init')
    assert.equal(env.listeners.has('destroy'), false)
    assert.equal(canvas.parentNode, env.parent)
    assert.equal(active(), 7)
    observations.push({ implementation: implementation.name, case: 'custom-canvas', workerTerminations: 0, listenersRetained: active(), hostDestroyHandlerRegistered: false, initSent: true })
    env.workers[0].terminate()
  })

  test(`JASSUB failure baseline ${implementation.name}: Worker construction failure leaves the already inserted container and video listeners`, async () => {
    const env = environment(implementation)
    const active = trackListeners(env.art.video)
    const failure = new DOMException('Controlled Worker construction failure', 'SecurityError')
    env.platform.setGlobal('Worker', class {
      constructor() { throw failure }
    })
    assert.throws(() => env.factory()(env.art), error => error === failure)
    await env.flush()
    assert.equal(env.workers.length, 0)
    assert.equal(env.listeners.has('destroy'), false)
    assert.equal(env.parent.children.length, 2)
    assert.equal(env.parent.children[1].className, 'JASSUB')
    assert.equal(active(), 7)
    observations.push({ implementation: implementation.name, case: 'worker-construction-failure', originalErrorPreserved: true, insertedContainerRetained: true, listenersRetained: active() })
  })

  test(`JASSUB failure baseline ${implementation.name}: a previous video's queued frame drives the replacement video and creates a second loop`, async () => {
    const env = environment(implementation)
    const clock = frames(env)
    const oldVideo = env.art.video
    const { instance } = env.factory()(env.art)
    await env.ready()
    assert.equal(clock.pending.size, 1)
    const newVideo = env.createVideo()
    newVideo.currentTime = 9
    instance.setVideo(newVideo)
    await env.flush()
    assert.equal(clock.pending.size, 2)
    assert.equal(clock.cancelled.length, 0)
    clock.deliver(oldVideo, { mediaTime: 123, width: 640, height: 360 })
    await env.flush()
    assert.equal(env.workers[0].messages.filter(item => item.target === 'demand').at(-1).time, 123)
    assert.equal([...clock.pending.values()].filter(row => row.video === newVideo).length, 2)
    observations.push({ implementation: implementation.name, case: 'old-video-frame', replacementCurrentTime: newVideo.currentTime, staleDemandTime: 123, replacementPendingCallbacks: 2, cancelledCallbacks: 0 })
    instance.destroy()
  })

  test(`JASSUB containment baseline ${implementation.name}: destroy before ready terminates and detaches, but initialization continues after termination`, async () => {
    const env = environment(implementation)
    const active = trackListeners(env.art.video)
    const { instance } = env.factory()(env.art)
    const worker = env.workers[0]
    const post = worker.postMessage
    const afterTermination = []
    worker.postMessage = function (message) {
      if (this.terminated)
        afterTermination.push(message.target)
      return post.call(this, message)
    }
    let settled = false
    instance._loaded.then(() => {
      settled = true
    })
    instance.setTrack('[Script Info]')
    instance.destroy()
    await env.flush()
    assert.equal(worker.terminated, 1)
    assert.equal(env.parent.children.length, 1)
    assert.equal(active(), 0)
    assert.deepEqual(afterTermination, ['init'])
    assert.equal(settled, false)
    assert.equal(worker.messages.some(item => item.target === 'setTrack'), false)
    observations.push({ implementation: implementation.name, case: 'destroy-before-ready', workerTerminations: 1, listenersRetained: 0, postAfterTermination: afterTermination, loadedSettledWithinFixtureFlush: settled })
  })

  test(`JASSUB containment baseline ${implementation.name}: Worker errors reach the instance and explicit host destroy still releases resources`, async () => {
    const env = environment(implementation)
    const active = trackListeners(env.art.video)
    const { instance } = env.factory()(env.art)
    const failure = new Error('Controlled Worker script load failure')
    const errors = []
    instance.addEventListener('error', event => errors.push(event.error))
    env.workers[0].onerror(new env.platform.ErrorEvent('error', { error: failure }))
    await env.flush()
    assert.deepEqual(errors, [failure])
    assert.equal(env.errors.at(-1), failure)
    assert.equal(env.workers[0].terminated, 0)
    assert.equal(active(), 7)
    env.emit('destroy')
    assert.equal(env.workers[0].terminated, 1)
    assert.equal(env.parent.children.length, 1)
    assert.equal(active(), 0)
    observations.push({ implementation: implementation.name, case: 'worker-error', exactErrorForwarded: true, automaticallyTerminated: false, explicitHostCleanup: true })
  })

  test(`JASSUB containment baseline ${implementation.name}: the outstanding frame after destroy does no work and does not rearm`, async () => {
    const env = environment(implementation)
    const clock = frames(env)
    const { instance } = env.factory()(env.art)
    await env.ready()
    instance.destroy()
    await env.flush()
    assert.equal(clock.pending.size, 1)
    assert.equal(clock.cancelled.length, 0)
    const before = env.workers[0].messages.length
    clock.deliver(env.art.video, { mediaTime: 123, width: 640, height: 360 })
    await env.flush()
    assert.equal(env.workers[0].messages.length, before)
    assert.equal(clock.pending.size, 0)
    observations.push({ implementation: implementation.name, case: 'frame-after-destroy', activelyCancelled: false, callbackDoesNoWork: true, callbackRearms: false })
  })
}

test.after(() => {
  if (process.env.ARTPLAYER_JASSUB_FAILURE_REPORT)
    fs.writeFileSync(process.env.ARTPLAYER_JASSUB_FAILURE_REPORT, `${JSON.stringify(observations, null, 2)}\n`)
})
