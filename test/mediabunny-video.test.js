import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Real compiled video engine with controlled SDK iterator interleavings.
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
const frame = (name, timestamp = 0) => ({ canvas: { name }, timestamp, duration: 0.1 })
const item = value => ({ value, done: !value })
function iterator(values = []) {
  let reads = 0
  let returns = 0
  return {
    next: async () => {
      reads++
      return item(values.shift())
    },
    return: async () => {
      returns++
      return item()
    },
    get reads() { return reads },
    get returns() { return returns },
  }
}
function environment(options = {}) {
  const env = mbEnvironment(implementation)
  env.eventNames.push('timeupdate', 'ended', 'waiting', 'playing', 'canplay')
  const canvas = env.factory(options)(env.art)
  const video = canvas.engine.video
  canvas.engine.audio.seek = async () => {}
  const draws = []
  env.context.drawImage = source => draws.push(source.name)
  video.audioClock = { currentTime: 1 }
  return { ...env, canvas, video, draws }
}

test('MediaBunny video preserves first seek frame and queues the second with exact iterator timestamp', async () => {
  const env = environment()
  const frames = iterator([frame('first', 3), frame('second', 3.1)])
  env.video.videoSink = { canvases: (time) => {
    assert.equal(time, 3)
    return frames
  } }
  await env.video.seek(3)
  assert.deepEqual(env.draws, ['first'])
  assert.equal(env.video.nextFrame.canvas.name, 'second')
  assert.equal(frames.reads, 2)
  env.art.emit('destroy')
})

test('MediaBunny video detaches iterator before awaiting release, and releases it once', async () => {
  const env = environment()
  const release = deferred()
  let returns = 0
  env.video.videoIterator = { return: () => {
    returns++
    return release.promise
  } }
  const closing = env.video.stopIterator()
  assert.equal(env.video.videoIterator, null)
  const again = env.video.stopIterator()
  release.resolve(item())
  await Promise.all([closing, again])
  assert.equal(returns, 1)
  env.art.emit('destroy')
})

test('MediaBunny old iterator return cannot erase a newer iterator', async () => {
  const env = environment()
  const release = deferred()
  env.video.videoIterator = { return: () => release.promise }
  const closing = env.video.stopIterator()
  const next = iterator()
  env.video.videoIterator = next
  release.resolve(item())
  await closing
  assert.equal(env.video.videoIterator, next)
  env.art.emit('destroy')
})

for (const ending of ['stop', 'destroy']) {
  test(`MediaBunny pending render frame cannot draw after ${ending}`, async () => {
    const env = environment()
    const pending = deferred()
    let reads = 0
    env.video.videoIterator = { next: () => ++reads === 1 ? pending.promise : Promise.resolve(item()), return: async () => item() }
    const reading = env.video.updateNextFrame(env.video.asyncId)
    if (ending === 'stop')
      env.video.stop()
    else env.art.emit('destroy')
    pending.resolve(item(frame('obsolete')))
    await reading
    assert.deepEqual(env.draws, [])
    assert.equal(env.video.nextFrame, null)
    env.art.emit('destroy')
  })
}

for (const ending of ['destroy', 'seek']) {
  test(`MediaBunny pending first seek frame cannot consume or overwrite frames after ${ending}`, async () => {
    const env = environment()
    const pending = deferred()
    let oldReads = 0
    const old = { next: async () => {
      oldReads++
      return oldReads === 1 ? pending.promise : item(frame('old-second'))
    }, return: async () => item() }
    const latest = iterator([frame('new-first'), frame('new-second')])
    env.video.videoSink = { canvases: time => time === 1 ? old : latest }
    const seeking = env.video.seek(1)
    await flush()
    if (ending === 'destroy')
      env.art.emit('destroy')
    else await env.video.seek(2)
    pending.resolve(item(frame('old-first')))
    await seeking
    assert.deepEqual(env.draws, ending === 'destroy' ? [] : ['new-first'])
    assert.equal(oldReads, 1)
    if (ending === 'seek')
      assert.equal(env.video.nextFrame.canvas.name, 'new-second')
    env.art.emit('destroy')
  })
}

test('MediaBunny a new load does not wait for obsolete iterator disposal', async () => {
  const env = environment()
  const release = deferred()
  env.video.videoIterator = { return: () => release.promise }
  let metadata = 0
  const loading = env.video.load({ input: {}, videoTrack: null, duration: 9 }, () => metadata++)
  await flush()
  assert.equal(metadata, 1)
  assert.equal(env.video.duration, 9)
  release.resolve(item())
  await loading
  env.art.emit('destroy')
})

for (const ending of ['destroy', 'source']) {
  test(`MediaBunny stale codec capability result cannot alter metadata after ${ending}`, async () => {
    const env = environment()
    const capability = deferred()
    let metadata = 0
    const loading = env.video.load({ input: {}, videoTrack: { codec: 'avc', canDecode: () => capability.promise }, duration: 8 }, () => metadata++)
    await flush()
    if (ending === 'destroy')
      env.art.emit('destroy')
    else await env.video.load({ input: {}, videoTrack: null, duration: 4 })
    env.canvas.width = 42
    capability.resolve(false)
    await loading
    assert.equal(metadata, 0)
    assert.equal(env.canvas.width, 42)
    env.art.emit('destroy')
  })
}

for (const ending of ['stop', 'destroy']) {
  test(`MediaBunny timeupdate listener ${ending} prevents rendering and RAF rescheduling`, () => {
    const env = environment()
    env.video.nextFrame = frame('due')
    env.video.events.addEventListener('timeupdate', () => ending === 'stop' ? env.video.stop() : env.art.emit('destroy'))
    env.video.render()
    assert.deepEqual(env.draws, [])
    assert.equal(env.frames.size, 0)
    env.art.emit('destroy')
  })
}

test('MediaBunny repeated video start owns only one native RAF including id zero', async () => {
  const env = environment()
  env.video.start({ currentTime: 0 })
  assert.equal(env.frames.size, 1)
  env.video.start({ currentTime: 0 })
  assert.equal(env.frames.size, 1)
  env.video.stop()
  assert.equal(env.frames.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny already queued RAF callback stays inert after stop', () => {
  const env = environment()
  env.video.start({ currentTime: 0 })
  const callback = [...env.frames.values()][0]
  env.video.stop()
  env.emitted.length = 0
  callback()
  assert.deepEqual(env.emitted, [])
  assert.equal(env.frames.size, 0)
  env.art.emit('destroy')
})

for (const ending of ['destroy', 'source']) {
  test(`MediaBunny poster callback cannot overwrite canvas after ${ending}`, async () => {
    const env = environment({ poster: 'poster.jpg' })
    const images = []
    env.globals.Image = class {
      constructor() {
        this.name = 'poster'
        this.naturalWidth = 320
        this.naturalHeight = 180
        images.push(this)
      }
    }
    env.video.drawPoster()
    const callback = images[0].onload
    if (ending === 'destroy') {
      env.art.emit('destroy')
    }
    else {
      env.video.poster = ''
      await env.video.load({ input: {}, videoTrack: null, duration: 9 })
    }
    env.canvas.width = 42
    callback()
    assert.deepEqual(env.draws, [])
    assert.equal(env.canvas.width, 42)
    env.art.emit('destroy')
  })
}

for (const dropLateFrames of [false, true]) {
  test(`MediaBunny video retains default/tolerance frame selection with dropLateFrames=${dropLateFrames}`, async () => {
    const env = environment({ dropLateFrames, avSyncTolerance: 0.12 })
    env.video.playbackRate = 2
    env.video.videoIterator = iterator([frame('late', 0.8), frame('near', 0.97), frame('future', 1.2)])
    await env.video.updateNextFrame(env.video.asyncId)
    assert.deepEqual(env.draws, dropLateFrames ? ['near'] : ['late', 'near'])
    assert.equal(env.video.nextFrame.canvas.name, 'future')
    env.art.emit('destroy')
  })
}

test('MediaBunny waiting listener pause prevents a new RAF', () => {
  const env = environment()
  env.video.duration = 8
  env.video.events.addEventListener('waiting', () => env.video.stop())
  env.video.render()
  assert.equal(env.frames.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny stalled canplay listener pause suppresses playing and another RAF', () => {
  const env = environment()
  env.video.stalled = true
  env.video.nextFrame = frame('due')
  env.video.events.addEventListener('canplay', () => env.video.stop())
  env.video.render()
  assert.equal(env.emitted.some(event => event.name === 'video:playing'), false)
  assert.equal(env.frames.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny seek during pending capability detection preserves the current load metadata', async () => {
  const env = environment()
  const capability = deferred()
  let metadata = 0
  const loading = env.video.load({ input: {}, videoTrack: { codec: 'avc', canDecode: () => capability.promise }, duration: 8 }, () => metadata++)
  await flush()
  const seeking = env.video.seek(3)
  capability.resolve(false)
  await Promise.all([loading, seeking])
  assert.equal(metadata, 1)
  assert.equal(env.video.duration, 8)
  env.art.emit('destroy')
})

test('MediaBunny new source cancels a pending seek before its own track selection finishes', async () => {
  const env = environment()
  const pending = deferred()
  let reads = 0
  env.video.videoSink = { canvases: () => ({ next: async () => ++reads === 1 ? pending.promise : item(frame('second')), return: async () => item() }) }
  const seeking = env.canvas.engine.seek(2)
  await flush()
  const source = deferred()
  env.canvas.engine.performLoad = () => source.promise
  const loading = env.canvas.engine.load('new.mp4')
  pending.resolve(item(frame('old-source')))
  await seeking
  await flush()
  assert.deepEqual(env.draws, [])
  source.resolve()
  await loading
  env.art.emit('destroy')
})

test('MediaBunny paused seek still renders its requested first frame', async () => {
  const env = environment()
  env.video.stop()
  env.video.videoSink = { canvases: () => iterator([frame('target'), frame('next')]) }
  await env.canvas.engine.seek(3)
  assert.deepEqual(env.draws, ['target'])
  assert.equal(env.canvas.paused, true)
  assert.equal(env.frames.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny late seek failure cannot release the current iterator', async () => {
  const env = environment()
  const pending = deferred()
  const latest = iterator([frame('current'), frame('next')])
  env.video.videoSink = { canvases: time => time === 1 ? { next: () => pending.promise, return: async () => item() } : latest }
  const old = env.video.seek(1)
  await flush()
  await env.video.seek(2)
  pending.reject(new Error('old decoder failed'))
  await old
  assert.equal(env.video.videoIterator, latest)
  assert.equal(latest.returns, 0)
  assert.deepEqual(env.draws, ['current'])
  env.art.emit('destroy')
})

test('MediaBunny stale transparency rejection is observed after source replacement', async () => {
  const env = environment()
  const pending = deferred()
  const loading = env.video.load({ input: {}, videoTrack: { codec: 'avc', canDecode: async () => true, canBeTransparent: () => pending.promise }, duration: 8 })
  await flush()
  await env.video.load({ input: {}, videoTrack: null, duration: 4 })
  pending.reject(new Error('old capability failed'))
  await loading
  assert.equal(env.video.duration, 4)
  env.art.emit('destroy')
})

test('MediaBunny old frame fetch completion cannot unlock a newer pending fetch', async () => {
  const env = environment()
  const old = deferred()
  const latest = deferred()
  env.video.videoIterator = { next: () => old.promise, return: async () => item() }
  const reading = env.video.updateNextFrame(env.video.asyncId)
  await flush()
  env.video.stop()
  env.video.videoIterator = { next: () => latest.promise, return: async () => item() }
  env.video.start({ currentTime: 1 })
  await flush()
  old.resolve(item(frame('obsolete')))
  await reading
  assert.equal(env.video.isFetching, true)
  latest.resolve(item(frame('future', 3)))
  await flush()
  assert.equal(env.video.isFetching, false)
  assert.equal(env.video.nextFrame.canvas.name, 'future')
  env.art.emit('destroy')
})

test('MediaBunny stop/start shares a pending read without concurrent iterator.next calls', async () => {
  const env = environment()
  const pending = deferred()
  let reads = 0
  env.video.videoIterator = { next: () => {
    reads++
    return pending.promise
  }, return: async () => item() }
  const old = env.video.updateNextFrame(env.video.asyncId)
  await flush()
  env.video.stop()
  env.video.start({ currentTime: 1 })
  await flush()
  assert.equal(reads, 1)
  pending.resolve(item(frame('future', 2)))
  await old
  await flush()
  assert.equal(env.video.nextFrame.canvas.name, 'future')
  assert.equal(reads, 1)
  env.art.emit('destroy')
})

test('MediaBunny renderer observes decoder failure, stops and reports one media error', async () => {
  const env = environment()
  const failure = new Error('decode failed')
  const active = iterator()
  active.next = async () => {
    throw failure
  }
  env.video.videoIterator = active
  env.video.start({ currentTime: 1 })
  await flush()
  assert.deepEqual({ ...env.canvas.error }, { code: 4, message: failure.message })
  assert.equal(env.emitted.filter(event => event.name === 'video:error').length, 1)
  assert.equal(env.frames.size, 0)
  assert.equal(active.returns, 1)
  assert.equal(env.video.videoIterator, null)
  env.art.emit('destroy')
})

test('MediaBunny explicit iterator release preserves rejection after detachment', async () => {
  const env = environment()
  const failure = new Error('release failed')
  env.video.videoIterator = { return: async () => {
    throw failure
  } }
  await assert.rejects(env.video.stopIterator(), error => error === failure)
  assert.equal(env.video.videoIterator, null)
  env.art.emit('destroy')
})

test('MediaBunny normal ended sequence remains timeupdate, ended, pause, canplay', () => {
  const env = environment()
  env.video.duration = 1
  env.video.render()
  assert.deepEqual(env.emitted.map(event => event.name), ['video:timeupdate', 'video:ended', 'video:pause', 'video:canplay'])
  assert.equal(env.frames.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny ended listener restart suppresses old pause/canplay without canceling its new RAF', () => {
  const env = environment()
  env.video.duration = 1
  env.video.events.addEventListener('ended', () => env.video.start({ currentTime: 0 }))
  env.video.render()
  assert.deepEqual(env.emitted.map(event => event.name), ['video:timeupdate', 'video:ended'])
  assert.equal(env.frames.size, 1)
  env.art.emit('destroy')
})

test('MediaBunny inactive instance cleanup cannot cancel another instance RAF id zero', () => {
  const env = environment()
  const other = new env.video.constructor({ canvas: { width: 0, height: 0 }, ctx: env.context, events: env.video.events })
  env.video.start({ currentTime: 0 })
  assert.equal(env.frames.size, 1)
  other.destroy()
  assert.equal(env.frames.size, 1)
  env.art.emit('destroy')
})

test('MediaBunny decoder failure remains observable if audio cleanup throws', async () => {
  const env = environment()
  env.globals.console = { ...console, warn() {} }
  env.canvas.engine.paused = false
  env.canvas.engine.audio.pause = () => {
    throw new Error('audio cleanup failed')
  }
  env.video.videoIterator = { next: async () => {
    throw new Error('original decode failure')
  }, return: async () => item() }
  env.video.start({ currentTime: 1 })
  await flush()
  env.canvas.engine.audio.pause = () => {}
  assert.equal(env.canvas.error.message, 'original decode failure')
  assert.equal(env.canvas.paused, true)
  assert.equal(env.frames.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny destroy observes iterator release failure and keeps terminal references cleared', async () => {
  const env = environment()
  const warnings = []
  env.globals.console = { ...console, warn: (...values) => warnings.push(values) }
  const failure = new Error('iterator return failed')
  env.video.videoIterator = { return: async () => {
    throw failure
  } }
  env.art.emit('destroy')
  await flush()
  assert.equal(warnings.length, 1)
  assert.equal(warnings[0][1], failure)
  assert.equal(env.video.videoIterator, null)
  assert.equal(env.video.nextFrame, null)
  assert.equal(env.video.input, null)
  assert.equal(env.video.videoSink, null)
})

for (const ending of ['destroy', 'seek']) {
  test(`MediaBunny pending second seek frame cannot overwrite the current image after ${ending}`, async () => {
    const env = environment()
    const second = deferred()
    let reads = 0
    const old = { next: async () => ++reads === 1 ? item(frame('old-first')) : second.promise, return: async () => item() }
    env.video.videoSink = { canvases: time => time === 1 ? old : iterator([frame('new-first'), frame('new-second')]) }
    const seeking = env.video.seek(1)
    await flush()
    assert.equal(reads, 2)
    if (ending === 'destroy')
      env.art.emit('destroy')
    else await env.video.seek(2)
    second.resolve(item(frame('old-second')))
    await seeking
    assert.deepEqual(env.draws, ending === 'destroy' ? [] : ['new-first'])
    env.art.emit('destroy')
  })
}

test('MediaBunny missing 2D context rejects loading with a descriptive error', async () => {
  const env = environment()
  env.video.ctx = null
  await assert.rejects(env.video.load({ input: {}, videoTrack: null, duration: 8 }), /Canvas 2D context is unavailable/)
  env.art.emit('destroy')
})

test('MediaBunny start retains the queued second frame until its clock time before fetching another', async () => {
  const env = environment()
  const frames = iterator([frame('third', 1)])
  env.video.nextFrame = frame('second', 0.5)
  env.video.videoIterator = frames
  const clock = { currentTime: 0 }
  env.video.start(clock)
  await flush()
  assert.equal(frames.reads, 0)
  assert.equal(env.video.nextFrame.canvas.name, 'second')
  clock.currentTime = 0.5
  env.video.render()
  await flush()
  assert.deepEqual(env.draws, ['second'])
  assert.equal(frames.reads, 1)
  assert.equal(env.video.nextFrame.canvas.name, 'third')
  env.art.emit('destroy')
})
