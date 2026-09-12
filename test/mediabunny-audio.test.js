import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Actual proxy engine with controlled Web Audio and SDK pump interleavings.
import test from 'node:test'
import { mbCandidate, mbEnvironment } from './helpers/mediabunny.js'

const implementation = await mbCandidate()
const flush = () => new Promise(resolve => setImmediate(resolve))
function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
const item = value => ({ value, done: !value })
const buffer = (timestamp = 0, duration = 0.1) => ({ timestamp, buffer: { duration } })
function iterator(values = []) {
  let reads = 0
  let returns = 0
  return {
    async next() {
      reads++
      return item(values.shift())
    },
    async return() {
      returns++
      return item()
    },
    get reads() { return reads },
    get returns() { return returns },
  }
}
function environment(options = {}) {
  const env = mbEnvironment(implementation, options)
  const contexts = []
  const nodes = []
  const warnings = []
  env.globals.console = { ...console, error() {}, warn: (...args) => warnings.push(args) }
  env.eventNames.push('canplay', 'playing', 'ended')
  env.globals.window.AudioContext = class {
    constructor(options) {
      this.options = options
      this.currentTime = 10
      this.state = 'running'
      this.closed = 0
      this.resumes = 0
      this.destination = {}
      contexts.push(this)
    }

    createGain() {
      this.gain = {
        gain: { value: 0 },
        connect() {},
        disconnect() { this.disconnected = true },
      }
      return this.gain
    }

    createBufferSource() {
      const node = {
        playbackRate: { value: 1 },
        starts: [],
        stops: 0,
        disconnects: 0,
        onended: null,
        connect() {},
        start(...args) { this.starts.push(args) },
        stop() { this.stops++ },
        disconnect() { this.disconnects++ },
      }
      nodes.push(node)
      return node
    }

    async resume() {
      this.resumes++
      this.state = 'running'
    }

    async close() {
      this.closed++
      this.state = 'closed'
    }
  }
  const canvas = env.factory()(env.art)
  return { ...env, canvas, audio: canvas.engine.audio, contexts, nodes, warnings }
}
function withContext() {
  const env = environment()
  env.audio.ensureAudioContext()
  return { ...env, context: env.contexts[0] }
}

test('MediaBunny stale audio pump cannot cancel the current pending read', async () => {
  const env = withContext()
  const read = deferred()
  let returns = 0
  const frames = { next: () => read.promise, return: async () => {
    returns++
    return item()
  } }
  env.audio.paused = false
  env.audio.audioSink = { buffers: () => frames }
  const pumping = env.audio.runIterator(env.audio.asyncId)
  const obsolete = env.audio.runIterator(env.audio.asyncId - 1)
  try {
    await flush()
    assert.equal(returns, 0)
    assert.equal(env.audio.audioIterator, frames)
  }
  finally {
    env.audio.pause()
    read.resolve(item())
    await Promise.all([pumping, obsolete])
    env.art.emit('destroy')
  }
})

test('MediaBunny failed audio iterator construction remains retryable', async () => {
  const env = withContext()
  const failure = new Error('sink failed')
  env.audio.paused = false
  env.audio.audioSink = { buffers() {
    throw failure
  } }
  await assert.rejects(env.audio.runIterator(env.audio.asyncId), error => error === failure)
  assert.equal(env.audio.audioIterator, null)
  env.audio.audioSink = { buffers: () => iterator() }
  await env.audio.runIterator(env.audio.asyncId)
  env.art.emit('destroy')
})

test('MediaBunny source cancellation clears sink and input after node cleanup failure', async () => {
  const env = withContext()
  env.audio.paused = false
  env.audio.input = {}
  env.audio.audioSink = { buffers: () => iterator([buffer(11)]) }
  await env.audio.runIterator(env.audio.asyncId)
  const failure = new Error('stop failed')
  env.nodes[0].stop = () => {
    throw failure
  }
  assert.throws(() => env.audio.cancelPending(), error => error === failure)
  assert.equal(env.audio.input, null)
  assert.equal(env.audio.audioSink, null)
  assert.equal(env.audio.queuedNodes.size, 0)
  assert.equal(env.nodes[0].disconnects, 1)
  env.art.emit('destroy')
})

test('MediaBunny gain setup failure releases context without installing partial references', async () => {
  const env = environment()
  const Context = env.globals.window.AudioContext
  const failure = new Error('gain failed')
  env.globals.window.AudioContext = class extends Context {
    createGain() {
      const gain = super.createGain()
      Object.defineProperty(gain.gain, 'value', {
        get() { return 0 },
        set() { throw failure },
      })
      return gain
    }
  }
  assert.throws(() => env.audio.ensureAudioContext(), error => error === failure)
  assert.equal(env.contexts[0].closed, 1)
  assert.equal(env.contexts[0].gain.disconnected, true)
  assert.equal(env.audio.audioContext, null)
  assert.equal(env.audio.gainNode, null)
  env.globals.window.AudioContext = Context
  env.audio.ensureAudioContext()
  assert.equal(env.audio.audioContext, env.contexts[1])
  env.art.emit('destroy')
})

test('MediaBunny context setup cannot resurrect audio after synchronous destroy', () => {
  const env = environment()
  const Context = env.globals.window.AudioContext
  env.globals.window.AudioContext = class extends Context {
    createGain() {
      const gain = super.createGain()
      gain.connect = () => env.audio.destroy()
      return gain
    }
  }
  env.audio.ensureAudioContext()
  assert.equal(env.audio.audioContext, null)
  assert.equal(env.audio.gainNode, null)
  assert.equal(env.contexts[0].closed, 1)
  assert.equal(env.contexts[0].gain.disconnected, true)
  env.art.emit('destroy')
})

test('MediaBunny ended node disconnect failure is observed after removing retained references', async () => {
  const env = withContext()
  env.audio.paused = false
  env.audio.audioSink = { buffers: () => iterator([buffer(11)]) }
  await env.audio.runIterator(env.audio.asyncId)
  const failure = new Error('disconnect failed')
  env.nodes[0].disconnect = () => {
    throw failure
  }
  env.nodes[0].onended()
  assert.equal(env.audio.queuedNodes.size, 0)
  assert.equal(env.nodes[0].onended, null)
  assert.equal(env.warnings[0][1], failure)
  env.art.emit('destroy')
})

test('MediaBunny audio preserves clock, gain square law, mute and paused position', async () => {
  const env = withContext()
  env.audio.setVolume(0.5, false)
  assert.equal(env.context.gain.gain.value, 0.25)
  env.audio.setVolume(0.5, true)
  assert.equal(env.context.gain.gain.value, 0)
  await env.audio.seek(3)
  await env.audio.play()
  env.context.currentTime = 12
  assert.equal(env.audio.currentTime, 5)
  env.audio.pause()
  env.context.currentTime = 20
  assert.equal(env.audio.currentTime, 5)
  env.art.emit('destroy')
})

test('MediaBunny audio preserves current media time during a playing rate change', async () => {
  const env = withContext()
  await env.audio.seek(3)
  await env.audio.play()
  env.context.currentTime = 12
  env.audio.setPlaybackRate(2)
  assert.equal(env.audio.currentTime, 5)
  env.context.currentTime = 13
  assert.equal(env.audio.currentTime, 7)
  env.art.emit('destroy')
})

test('MediaBunny audio preserves future and partial late buffer scheduling math', async () => {
  const env = withContext()
  env.audio.paused = false
  env.audio.audioContextStartTime = 10
  env.audio.playbackTimeAtStart = 2
  env.audio.playbackRate = 2
  env.audio.audioSink = { buffers: () => iterator([buffer(1.8, 0.4), buffer(2.4, 0.4)]) }
  await env.audio.runIterator(env.audio.asyncId)
  assert.deepEqual(env.nodes.map(node => node.starts[0]), [[10, 0.1999999999999993], [10.2]])
  assert.deepEqual(env.nodes.map(node => node.playbackRate.value), [2, 2])
  assert(Math.abs(env.audio.latestScheduledEndTime - 2.8) < 0.000001)
  env.art.emit('destroy')
})

test('MediaBunny audio detaches iterator synchronously and releases it once', async () => {
  const env = environment()
  const release = deferred()
  let returns = 0
  env.audio.audioIterator = { return: () => {
    returns++
    return release.promise
  } }
  const first = env.audio.stopIterator()
  const detached = env.audio.audioIterator
  const second = env.audio.stopIterator()
  release.resolve(item())
  await Promise.all([first, second])
  assert.equal(detached, null)
  assert.equal(returns, 1)
  env.art.emit('destroy')
})

test('MediaBunny old audio iterator disposal cannot erase a current iterator', async () => {
  const env = environment()
  const release = deferred()
  env.audio.audioIterator = { return: () => release.promise }
  const closing = env.audio.stopIterator()
  const current = iterator()
  env.audio.audioIterator = current
  release.resolve(item())
  await closing
  assert.equal(env.audio.audioIterator, current)
  env.art.emit('destroy')
})

for (const ending of ['pause', 'destroy', 'source']) {
  test(`MediaBunny pending audio resume cannot restart after ${ending}`, async () => {
    const env = withContext()
    env.context.state = 'suspended'
    const resume = deferred()
    env.context.resume = () => resume.promise
    const playing = env.audio.play()
    if (ending === 'pause') {
      env.audio.pause()
    }
    else if (ending === 'destroy') {
      env.art.emit('destroy')
    }
    else {
      env.canvas.engine.performLoad = async () => {}
      await env.canvas.engine.load('next.mp4')
    }
    resume.resolve()
    await playing
    assert.equal(env.audio.paused, true)
    assert.equal(env.nodes.length, 0)
    env.art.emit('destroy')
  })
}

for (const ending of ['destroy', 'source']) {
  test(`MediaBunny stale audio capability cannot recreate context or metadata after ${ending}`, async () => {
    const env = environment()
    const capability = deferred()
    let metadata = 0
    const loading = env.audio.load({ input: {}, audioTrack: { codec: 'aac', canDecode: () => capability.promise }, duration: 8 }, () => metadata++)
    await flush()
    if (ending === 'destroy') {
      env.art.emit('destroy')
    }
    else {
      env.canvas.engine.performLoad = async () => {}
      await env.canvas.engine.load('next.mp4')
    }
    capability.resolve(false)
    await loading
    assert.equal(metadata, 0)
    assert.equal(env.contexts.length, 0)
    env.art.emit('destroy')
  })
}

test('MediaBunny audio nodes disconnect and clear ended listeners after pause', async () => {
  const env = withContext()
  env.audio.paused = false
  env.audio.audioSink = { buffers: () => iterator([buffer(11), buffer(12)]) }
  await env.audio.runIterator(env.audio.asyncId)
  assert.equal(env.nodes.length, 2)
  env.audio.pause()
  assert.deepEqual(env.nodes.map(node => [node.stops, node.disconnects, node.onended]), [[1, 1, null], [1, 1, null]])
  assert.equal(env.audio.queuedNodes.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny naturally ended audio node disconnects and releases its callback', async () => {
  const env = withContext()
  env.audio.paused = false
  env.audio.audioSink = { buffers: () => iterator([buffer(11)]) }
  await env.audio.runIterator(env.audio.asyncId)
  const node = env.nodes[0]
  node.onended()
  assert.equal(node.disconnects, 1)
  assert.equal(node.onended, null)
  assert.equal(env.audio.queuedNodes.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny audio cleanup attempts all nodes when one stop throws', async () => {
  const env = withContext()
  env.audio.paused = false
  env.audio.audioSink = { buffers: () => iterator([buffer(11), buffer(12)]) }
  await env.audio.runIterator(env.audio.asyncId)
  const failure = new Error('stop failed')
  env.nodes[0].stop = () => {
    throw failure
  }
  assert.throws(() => env.audio.stopQueuedNodes(), error => error === failure)
  assert.equal(env.nodes[1].stops, 1)
  assert.equal(env.nodes[0].disconnects, 1)
  assert.equal(env.audio.queuedNodes.size, 0)
  env.art.emit('destroy')
})

for (const ending of ['pause', 'destroy', 'rate']) {
  test(`MediaBunny audio pump cannot schedule a batch after pending resume and ${ending}`, async () => {
    const env = withContext()
    env.context.state = 'suspended'
    env.audio.paused = false
    env.audio.audioContextStartTime = 10
    const resume = deferred()
    env.context.resume = () => resume.promise
    env.audio.audioSink = { buffers: () => iterator([buffer(1)]) }
    const pumping = env.audio.runIterator(env.audio.asyncId)
    await flush()
    if (ending === 'pause') {
      env.audio.pause()
    }
    else if (ending === 'destroy') {
      env.art.emit('destroy')
    }
    else {
      env.audio.audioSink = null
      env.audio.setPlaybackRate(2)
    }
    env.emitted.length = 0
    resume.resolve()
    await pumping
    assert.equal(env.nodes.length, 0)
    assert.equal(env.emitted.some(event => ['video:canplay', 'video:playing'].includes(event.name)), false)
    env.art.emit('destroy')
  })
}

test('MediaBunny rate change cancels already scheduled old-rate audio nodes', async () => {
  const env = withContext()
  env.audio.paused = false
  env.audio.audioSink = { buffers: () => iterator([buffer(11)]) }
  await env.audio.runIterator(env.audio.asyncId)
  const old = env.nodes[0]
  env.audio.audioSink = null
  env.audio.setPlaybackRate(2)
  assert.equal(old.stops, 1)
  assert.equal(old.disconnects, 1)
  assert.equal(env.audio.queuedNodes.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny seeking before first context exists preserves paused position without throwing', async () => {
  const env = environment()
  await env.audio.seek(3)
  assert.equal(env.audio.currentTime, 3)
  assert.equal(env.audio.paused, true)
  assert.equal(env.contexts.length, 0)
  env.art.emit('destroy')
})

test('MediaBunny video ended stops the shared audio clock and scheduled nodes', async () => {
  const env = withContext()
  await env.audio.play()
  env.canvas.engine.paused = false
  env.context.currentTime = 12
  env.canvas.events.emit('ended')
  const stoppedAt = env.audio.currentTime
  env.context.currentTime = 14
  assert.equal(env.audio.paused, true)
  assert.equal(env.audio.currentTime, stoppedAt)
  env.art.emit('destroy')
})

test('MediaBunny audio destruction disconnects gain and observes context close', async () => {
  const env = withContext()
  const gain = env.context.gain
  env.art.emit('destroy')
  await flush()
  assert.equal(gain.disconnected, true)
  assert.equal(env.audio.gainNode, null)
  assert.equal(env.context.closed, 1)
  assert.equal(env.audio.audioContext, null)
  env.art.emit('destroy')
  assert.equal(env.context.closed, 1)
})

test('MediaBunny actual audio owner shares native resume across coordinator play-pause-play', async () => {
  const env = withContext()
  const pending = deferred()
  let resumes = 0
  env.context.state = 'suspended'
  env.context.resume = () => {
    resumes++
    return pending.promise
  }
  let starts = 0
  env.canvas.engine.video.start = () => starts++
  const first = env.canvas.play()
  env.canvas.pause()
  const second = env.canvas.play()
  pending.resolve()
  await Promise.all([first, second])
  assert.equal(resumes, 1)
  assert.equal(starts, 1)
  assert.equal(env.audio.paused, false)
  assert.equal(env.canvas.paused, false)
  env.art.emit('destroy')
})

test('MediaBunny canceled audio play settles without waiting for native resume and observes its rejection', async () => {
  const env = withContext()
  const pending = deferred()
  env.context.state = 'suspended'
  env.context.resume = () => pending.promise
  let settled = false
  const playing = env.audio.play().then(() => settled = true)
  env.audio.pause()
  await flush()
  assert.equal(settled, true)
  pending.reject(new Error('obsolete resume rejection'))
  await playing
  await flush()
  assert.equal(env.audio.paused, true)
  env.art.emit('destroy')
})

test('MediaBunny active resume rejection preserves the error and allows another play', async () => {
  const env = withContext()
  const failure = new Error('resume denied')
  env.context.state = 'suspended'
  env.context.resume = async () => {
    throw failure
  }
  await assert.rejects(env.audio.play(), error => error === failure)
  assert.equal(env.audio.paused, true)
  env.context.resume = async () => {}
  await env.audio.play()
  assert.equal(env.audio.paused, false)
  env.art.emit('destroy')
})

test('MediaBunny audio preserves no-track metadata and fallback context construction', async () => {
  const env = environment()
  const Context = env.globals.window.AudioContext
  const attempts = []
  env.globals.window.AudioContext = class extends Context {
    constructor(option) {
      attempts.push(option)
      if (option)
        throw new Error('sample rate not supported')
      super()
    }
  }
  env.audio.ensureAudioContext(96000)
  assert.deepEqual(attempts.map(option => option?.sampleRate), [96000, undefined])
  let metadata = 0
  await env.audio.load({ input: {}, audioTrack: null, duration: 8 }, () => metadata++)
  assert.equal(metadata, 1)
  assert.equal(env.audio.duration, 8)
  assert.equal(env.contexts.length, 1)
  env.art.emit('destroy')
})

test('MediaBunny expired buffers do not create silent retained source nodes', async () => {
  const env = withContext()
  env.audio.paused = false
  env.audio.audioContextStartTime = 0
  env.audio.audioSink = { buffers: () => iterator([buffer(1, 0.1)]) }
  await env.audio.runIterator(env.audio.asyncId)
  assert.equal(env.nodes.length, 0)
  env.art.emit('destroy')
})

test('MediaBunny audio seek stops old scheduled nodes even when called directly while playing', async () => {
  const env = withContext()
  env.audio.paused = false
  env.audio.audioSink = { buffers: () => iterator([buffer(11)]) }
  await env.audio.runIterator(env.audio.asyncId)
  const old = env.nodes[0]
  env.audio.audioSink = null
  await env.audio.seek(3)
  assert.equal(old.stops, 1)
  assert.equal(old.disconnects, 1)
  assert.equal(env.audio.currentTime, 3)
  env.art.emit('destroy')
})

test('MediaBunny background audio decode error stops playback and reports one media error', async () => {
  const env = withContext()
  const failure = new Error('decoder failed')
  env.audio.audioSink = { buffers: () => ({ next: async () => {
    throw failure
  }, return: async () => item() }) }
  await env.canvas.play()
  await flush()
  assert.deepEqual({ ...env.canvas.error }, { code: 4, message: 'decoder failed' })
  assert.equal(env.canvas.paused, true)
  assert.equal(env.audio.paused, true)
  assert.equal(env.emitted.filter(event => event.name === 'video:error').length, 1)
  env.art.emit('destroy')
})

test('MediaBunny decoder error is not replaced by iterator release failure', async () => {
  const env = withContext()
  env.audio.paused = false
  const failure = new Error('decoder failed')
  env.audio.audioSink = { buffers: () => ({ next: async () => {
    throw failure
  }, return: async () => {
    throw new Error('cleanup failed')
  } }) }
  await assert.rejects(env.audio.runIterator(env.audio.asyncId), error => error === failure)
  await flush()
  assert.equal(env.warnings.length, 1)
  env.art.emit('destroy')
})

test('MediaBunny destroy attempts context cleanup after a node stop error and preserves the first failure', async () => {
  const env = withContext()
  env.audio.paused = false
  env.audio.audioSink = { buffers: () => iterator([buffer(11)]) }
  await env.audio.runIterator(env.audio.asyncId)
  const failure = new Error('node failed')
  env.nodes[0].stop = () => {
    throw failure
  }
  assert.throws(() => env.audio.destroy(), error => error === failure)
  assert.equal(env.context.closed, 1)
  assert.equal(env.context.gain.disconnected, true)
  assert.equal(env.audio.audioContext, null)
  assert.equal(env.audio.audioIterator, null)
  assert.equal(env.audio.queuedNodes.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny destroyed audio context close rejection remains observed', async () => {
  const env = withContext()
  const failure = new Error('close failed')
  env.context.close = async () => {
    throw failure
  }
  env.art.emit('destroy')
  await flush()
  assert.equal(env.warnings.length, 1)
  assert.equal(env.warnings[0][1], failure)
  assert.equal(env.audio.audioContext, null)
})

test('MediaBunny paused audio pump clears owned batch and backpressure timers', async () => {
  const timers = new Map()
  let next = 0
  const env = environment({ setTimeout(callback, delay) {
    const id = next++
    timers.set(id, { callback, delay })
    return id
  }, clearTimeout(id) { timers.delete(id) } })
  env.audio.ensureAudioContext()
  env.audio.paused = false
  env.audio.audioContextStartTime = 10
  const frames = iterator(Array.from({ length: 32 }, (_, index) => buffer(index / 10)))
  env.audio.audioSink = { buffers: () => frames }
  const pumping = env.audio.runIterator(env.audio.asyncId)
  await flush()
  assert.equal(frames.reads, 16)
  assert.deepEqual([...timers.values()].map(timer => timer.delay), [0])
  const [id, timer] = [...timers][0]
  timers.delete(id)
  timer.callback()
  await flush()
  assert.deepEqual([...timers.values()].map(timer => timer.delay), [50])
  env.audio.pause()
  assert.equal(timers.size, 0)
  await pumping
  assert.equal(frames.returns, 1)
  assert.equal(env.nodes.every(node => node.disconnects === 1), true)
  env.art.emit('destroy')
})
