import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Verify the actual coordinator with controlled asynchronous operations.
import test from 'node:test'
import { mbCandidate, mbEnvironment } from './helpers/mediabunny.js'
import { tracklessMp4 } from './helpers/trackless-mp4.js'

const implementation = await mbCandidate()
const flush = () => new Promise(resolve => setImmediate(resolve))
const media = new Blob([fs.readFileSync(new URL('./browser/media/pattern.mp4', import.meta.url))])
function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

function environment() {
  const env = mbEnvironment(implementation)
  for (const name of ['playing', 'seeking', 'seeked', 'waiting', 'loadstart', 'loadeddata', 'canplay', 'canplaythrough', 'durationchange', 'progress', 'ended']) {
    if (!env.eventNames.includes(name))
      env.eventNames.push(name)
  }
  const canvas = env.factory()(env.art)
  const engine = canvas.engine
  const calls = []
  for (const name of env.eventNames) canvas.events.addEventListener(name, () => calls.push(name))
  engine.audio.play = async () => calls.push('audio:play')
  engine.audio.pause = () => calls.push('audio:pause')
  engine.audio.seek = async time => calls.push(`audio:seek:${time}`)
  engine.video.start = () => calls.push('video:start')
  engine.video.stop = () => calls.push('video:stop')
  engine.video.seek = async time => calls.push(`video:seek:${time}`)
  env.globals.console = { log() {}, warn() {}, error() {}, debug() {} }
  return { ...env, canvas, engine, calls }
}

test('MediaBunny coordinator preserves ordinary play, seek-resume and synchronous pause ordering', async () => {
  const env = environment()
  await env.engine.play()
  assert.deepEqual(env.calls, ['audio:play', 'video:start', 'play', 'playing'])
  env.calls.length = 0
  await env.engine.seek(3)
  assert.deepEqual(env.calls, ['seeking', 'waiting', 'audio:pause', 'video:stop', 'pause', 'audio:seek:3', 'video:seek:3', 'seeked', 'audio:play', 'video:start', 'play', 'playing'])
  env.calls.length = 0
  assert.equal(env.engine.pause(), undefined)
  assert.deepEqual(env.calls, ['audio:pause', 'video:stop', 'pause'])
  env.art.emit('destroy')
})

for (const operation of ['pause', 'destroy', 'source']) {
  test(`MediaBunny coordinator discards pending play after ${operation}`, async () => {
    const env = environment()
    const audio = deferred()
    env.engine.audio.play = () => audio.promise
    const playing = env.engine.play()
    if (operation === 'pause') {
      env.engine.pause()
    }
    else if (operation === 'destroy') {
      env.art.emit('destroy')
    }
    else {
      env.engine.performLoad = async () => {}
      await env.engine.load('new.mp4')
    }
    env.calls.length = 0
    audio.resolve()
    await playing
    assert.equal(env.engine.paused, true)
    assert.equal(env.calls.includes('video:start'), false)
    assert.equal(env.calls.includes('play'), false)
    assert.equal(env.calls.includes('playing'), false)
    env.art.emit('destroy')
  })
}

test('MediaBunny coordinator restores paused state after a play rejection and allows retry', async () => {
  const env = environment()
  const error = new Error('resume denied')
  let attempts = 0
  env.engine.audio.play = async () => {
    if (++attempts === 1)
      throw error
  }
  await assert.rejects(env.engine.play(), value => value === error)
  assert.equal(env.engine.paused, true)
  await env.engine.play()
  assert.equal(attempts, 2)
  assert.equal(env.engine.paused, false)
  assert.equal(env.calls.filter(name => name === 'video:start').length, 1)
  env.art.emit('destroy')
})

test('MediaBunny coordinator shares delayed audio resume across play-pause-play and starts video once', async () => {
  const env = environment()
  const audio = deferred()
  let attempts = 0
  env.engine.audio.play = () => {
    attempts++
    return audio.promise
  }
  const first = env.engine.play()
  env.engine.pause()
  const second = env.engine.play()
  audio.resolve()
  await Promise.all([first, second])
  assert.equal(attempts, 1)
  assert.equal(env.engine.paused, false)
  assert.equal(env.calls.filter(name => name === 'video:start').length, 1)
  assert.equal(env.calls.filter(name => name === 'play').length, 1)
  env.art.emit('destroy')
})

test('MediaBunny coordinator stops the play event sequence when a listener pauses', async () => {
  const env = environment()
  env.canvas.events.addEventListener('play', () => env.engine.pause())
  await env.engine.play()
  assert.equal(env.engine.paused, true)
  assert.equal(env.calls.includes('playing'), false)
  env.art.emit('destroy')
})

test('MediaBunny coordinator honors an explicit pause while a playing seek is pending', async () => {
  const env = environment()
  await env.engine.play()
  const video = deferred()
  env.engine.video.seek = () => video.promise
  const seeking = env.engine.seek(4)
  env.engine.pause()
  env.calls.length = 0
  video.resolve()
  await seeking
  assert.equal(env.engine.paused, true)
  assert.equal(env.engine.seeking, false)
  assert.deepEqual(env.calls.filter(name => ['seeked', 'video:start', 'play'].includes(name)), ['seeked'])
  env.art.emit('destroy')
})

test('MediaBunny coordinator keeps the newest seek active when an earlier seek finishes first', async () => {
  const env = environment()
  const first = deferred()
  const second = deferred()
  env.engine.video.seek = time => time === 1 ? first.promise : second.promise
  const a = env.engine.seek(1)
  const b = env.engine.seek(2)
  first.resolve()
  await a
  assert.equal(env.engine.seeking, true)
  assert.equal(env.calls.includes('seeked'), false)
  second.resolve()
  await b
  assert.equal(env.engine.seeking, false)
  assert.equal(env.calls.filter(name => name === 'seeked').length, 1)
  env.art.emit('destroy')
})

test('MediaBunny coordinator drops an older seek result after the newest result and preserves playing intent', async () => {
  const env = environment()
  await env.engine.play()
  const first = deferred()
  const second = deferred()
  env.engine.video.seek = time => time === 1 ? first.promise : second.promise
  const a = env.engine.seek(1)
  const b = env.engine.seek(2)
  env.calls.length = 0
  second.resolve()
  await b
  assert.equal(env.engine.paused, false)
  first.resolve()
  await a
  assert.equal(env.calls.filter(name => name === 'seeked').length, 1)
  assert.equal(env.calls.filter(name => name === 'video:start').length, 1)
  env.art.emit('destroy')
})

for (const operation of ['destroy', 'source']) {
  test(`MediaBunny coordinator prevents pending seek completion and resume after ${operation}`, async () => {
    const env = environment()
    await env.engine.play()
    const video = deferred()
    env.engine.video.seek = () => video.promise
    const seeking = env.engine.seek(4)
    if (operation === 'destroy') {
      env.art.emit('destroy')
    }
    else {
      env.engine.performLoad = async () => {}
      await env.engine.load('new.mp4')
    }
    env.calls.length = 0
    video.resolve()
    await seeking
    assert.equal(env.calls.includes('video:start'), false)
    assert.equal(env.calls.includes('audio:play'), false)
    assert.equal(env.calls.includes('seeked'), false)
    env.art.emit('destroy')
  })
}

test('MediaBunny coordinator does not continue old seek after a seeking listener requests another position', async () => {
  const env = environment()
  let replacement
  let first = true
  env.canvas.events.addEventListener('seeking', () => {
    if (first) {
      first = false
      replacement = env.engine.seek(7)
    }
  })
  await env.engine.seek(2)
  await replacement
  assert.equal(env.calls.includes('audio:seek:2'), false)
  assert.equal(env.calls.includes('video:seek:2'), false)
  assert.equal(env.calls.filter(name => name === 'seeked').length, 1)
  env.art.emit('destroy')
})

test('MediaBunny coordinator waits for pending seek when play is requested, without a resume deadlock', { timeout: 3000 }, async () => {
  const env = environment()
  const video = deferred()
  env.engine.video.seek = () => video.promise
  const seeking = env.engine.seek(3)
  const playing = env.engine.play()
  await flush()
  assert.equal(env.calls.includes('audio:play'), false)
  video.resolve()
  await Promise.all([seeking, playing])
  assert.equal(env.engine.paused, false)
  assert.equal(env.calls.filter(name => name === 'video:start').length, 1)
  env.art.emit('destroy')
})

test('MediaBunny coordinator resets seeking after an active failure and permits another seek', async () => {
  const env = environment()
  const error = new Error('seek failed')
  let attempts = 0
  env.engine.video.seek = async () => {
    if (++attempts === 1)
      throw error
  }
  await assert.rejects(env.engine.seek(2), value => value === error)
  assert.equal(env.engine.seeking, false)
  await env.engine.seek(3)
  assert.equal(attempts, 2)
  assert.equal(env.engine.seeking, false)
  env.art.emit('destroy')
})

test('MediaBunny coordinator replay after ended seeks to zero then starts normally', async () => {
  const env = environment()
  env.engine.ended = true
  await env.engine.play()
  assert.equal(env.engine.ended, false)
  assert.equal(env.engine.paused, false)
  assert.deepEqual(env.calls, ['seeking', 'waiting', 'audio:seek:0', 'video:seek:0', 'seeked', 'audio:play', 'video:start', 'play', 'playing'])
  env.art.emit('destroy')
})

test('MediaBunny coordinator preserves a resume-play rejection from the seek Promise', async () => {
  const env = environment()
  await env.engine.play()
  const failure = new Error('resume failed')
  env.engine.audio.play = async () => {
    throw failure
  }
  await assert.rejects(env.engine.seek(3), error => error === failure)
  assert.equal(env.engine.paused, true)
  assert.equal(env.engine.seeking, false)
  env.art.emit('destroy')
})

test('MediaBunny coordinator keeps original play rejection when cleanup fails and still stops video', async () => {
  const env = environment()
  const failure = new Error('resume failed')
  env.engine.audio.play = async () => {
    throw failure
  }
  env.engine.audio.pause = () => {
    throw new Error('cleanup failed')
  }
  await assert.rejects(env.engine.play(), error => error === failure)
  assert.equal(env.calls.includes('video:stop'), true)
  assert.equal(env.engine.paused, true)
  env.engine.audio.pause = () => {}
  env.art.emit('destroy')
})

test('MediaBunny coordinator attempts both decoder cleanups when audio teardown throws', () => {
  const env = environment()
  const failure = new Error('audio teardown failed')
  let videoDestroyed = 0
  env.engine.audio.destroy = () => {
    throw failure
  }
  env.engine.video.destroy = () => videoDestroyed++
  assert.throws(() => env.art.emit('destroy'), error => error === failure)
  assert.equal(videoDestroyed, 1)
  assert.equal(env.canvas.events.listeners.size, 0)
  assert.doesNotThrow(() => env.engine.destroy())
  assert.equal(videoDestroyed, 1)
})

test('MediaBunny coordinator does not resume if a seeked listener pauses', async () => {
  const env = environment()
  await env.engine.play()
  env.canvas.events.addEventListener('seeked', () => env.engine.pause())
  env.calls.length = 0
  await env.engine.seek(3)
  assert.equal(env.engine.paused, true)
  assert.equal(env.calls.includes('video:start'), false)
  env.art.emit('destroy')
})

test('MediaBunny coordinator settles canceled play before audio resume returns and observes its late rejection', async () => {
  const env = environment()
  const audio = deferred()
  env.engine.audio.play = () => audio.promise
  let settled = false
  const playing = env.engine.play().then(() => settled = true)
  env.art.emit('destroy')
  await flush()
  assert.equal(settled, true)
  audio.reject(new Error('late resume failure'))
  await playing
  await flush()
  assert.equal(env.calls.includes('video:start'), false)
})

test('MediaBunny coordinator ignores stale seek failure after a newer seek succeeds', async () => {
  const env = environment()
  const first = deferred()
  env.engine.video.seek = time => time === 1 ? first.promise : Promise.resolve()
  const a = env.engine.seek(1)
  await env.engine.seek(2)
  first.reject(new Error('obsolete seek error'))
  await a
  await flush()
  assert.equal(env.engine.error, null)
  assert.equal(env.engine.seeking, false)
  assert.equal(env.calls.includes('error'), false)
  env.art.emit('destroy')
})

test('MediaBunny synchronous currentTime setter observes an active seek rejection after one error event', async () => {
  const env = environment()
  env.engine.video.seek = async () => {
    throw new Error('seek rejected')
  }
  assert.equal(Reflect.set(env.canvas, 'currentTime', 3), true)
  await flush()
  assert.equal(env.engine.error.message, 'seek rejected')
  assert.equal(env.engine.seeking, false)
  assert.equal(env.calls.filter(name => name === 'error').length, 1)
  env.art.emit('destroy')
})

async function loadingEnvironment() {
  const env = environment()
  const video = deferred()
  const audio = deferred()
  const metadata = {}
  env.engine.video.load = (media, callback) => {
    metadata.video = callback
    return video.promise
  }
  env.engine.audio.load = (media, callback) => {
    metadata.audio = callback
    return audio.promise
  }
  const loading = env.engine.load(media)
  await flush()
  assert.equal(typeof metadata.video, 'function')
  assert.equal(typeof metadata.audio, 'function')
  return { ...env, video, audio, metadata, loading }
}

test('MediaBunny coordinator waits for both metadata participants and publishes readiness once', async () => {
  const env = await loadingEnvironment()
  env.metadata.video()
  assert.equal(env.calls.includes('loadedmetadata'), false)
  env.metadata.audio()
  env.metadata.video()
  env.metadata.audio()
  env.video.resolve()
  env.audio.resolve()
  await env.loading
  assert.deepEqual(env.calls.filter(name => ['loadedmetadata', 'durationchange', 'loadeddata', 'canplay', 'canplaythrough'].includes(name)), ['loadedmetadata', 'durationchange', 'loadeddata', 'canplay', 'canplaythrough'])
  assert.equal(env.engine.readyState, 4)
  env.art.emit('destroy')
})

for (const event of ['loadedmetadata', 'loadeddata']) {
  test(`MediaBunny coordinator stops the old readiness sequence when ${event} starts another source`, async () => {
    const env = await loadingEnvironment()
    let replacement
    env.canvas.events.addEventListener(event, () => {
      env.engine.performLoad = async () => {}
      replacement = env.engine.load('new.mp4')
    })
    env.metadata.video()
    env.metadata.audio()
    env.video.resolve()
    env.audio.resolve()
    await env.loading
    await replacement
    const cursor = env.calls.indexOf(event)
    assert(cursor >= 0)
    assert.equal(env.calls.slice(cursor + 1).includes('canplay'), false)
    if (event === 'loadedmetadata')
      assert.equal(env.calls.slice(cursor + 1).includes('durationchange'), false)
    assert.equal(env.engine.readyState, 0)
    env.art.emit('destroy')
  })
}

test('MediaBunny coordinator keeps failed decoder setup from becoming ready through a later metadata callback', async () => {
  const env = await loadingEnvironment()
  env.video.reject(new Error('decoder unavailable'))
  await env.loading
  const cursor = env.calls.length
  env.metadata.audio()
  env.audio.resolve()
  await flush()
  assert.equal(env.engine.error.message, 'decoder unavailable')
  assert.equal(env.engine.readyState, 0)
  assert.deepEqual(env.calls.slice(cursor), [])
  env.art.emit('destroy')
})

test('MediaBunny coordinator rejects a real trackless container before decoder or AudioContext setup', async () => {
  const env = environment()
  const bytes = tracklessMp4(fs.readFileSync(new URL('./browser/media/pattern.mp4', import.meta.url)))
  let setups = 0
  env.engine.video.load = async () => setups++
  env.engine.audio.load = async () => setups++
  await env.engine.load(new Blob([bytes]))
  assert.equal(setups, 0)
  assert.deepEqual({ ...env.engine.error }, { code: 4, message: 'Input has no audio or video tracks.' })
  assert.equal(env.engine.readyState, 0)
  assert.equal(env.calls.includes('loadedmetadata'), false)
  assert.equal(env.calls.includes('canplay'), false)
  env.art.emit('destroy')
})

for (const [method, query] of [['selectHlsQuality', 'getVideoTracks'], ['selectHlsAudio', 'getAudioTracks']]) {
  for (const ending of ['source', 'destroy', 'active']) {
    test(`MediaBunny ${method} ${ending} query rejection respects source ownership`, async () => {
      const env = environment()
      const pending = deferred()
      const failure = new Error('track query failed')
      env.engine.input = { [query]: () => pending.promise }
      env.engine.media = { isHls: true }
      let replaced = 0
      env.engine.replaceTracks = async () => replaced++
      const selecting = env.engine[method]('auto')
      if (ending === 'source') {
        env.engine.performLoad = async () => {}
        await env.engine.load('new.mp4')
      }
      else if (ending === 'destroy') {
        env.art.emit('destroy')
      }
      pending.reject(failure)
      if (ending === 'active')
        await assert.rejects(selecting, error => error === failure)
      else await selecting
      assert.equal(replaced, 0)
      assert.equal(env.engine.error, null)
      env.art.emit('destroy')
    })
  }

  test(`MediaBunny ${method} retains active replacement rejection after media identity changes`, async () => {
    const env = environment()
    const track = { id: 1, canBePairedWith: () => true }
    env.engine.input = { [query]: async () => [track] }
    env.engine.media = { isHls: true, videoTrack: track, audioTrack: track }
    const failure = new Error('replacement failed')
    env.engine.replaceTracks = async () => {
      env.engine.media = { ...env.engine.media }
      throw failure
    }
    await assert.rejects(env.engine[method](1), error => error === failure)
    env.art.emit('destroy')
  })
}

function replacementEnvironment() {
  const env = environment()
  const track = { isLive: async () => false }
  const input = { getDurationFromMetadata: async () => 8 }
  env.engine.media = { input, videoTrack: track, audioTrack: null, isHls: true, videoMode: 'auto', audioMode: 'auto', duration: 8 }
  env.engine.video.load = async () => env.calls.push('video:load')
  env.engine.audio.load = async () => env.calls.push('audio:load')
  return env
}

test('MediaBunny track replacement preserves normal pause, readiness, seek and resume ordering', async () => {
  const env = replacementEnvironment()
  await env.engine.play()
  env.calls.length = 0
  await env.engine.replaceTracks({ videoMode: 'manual' })
  assert.deepEqual(env.calls, ['audio:pause', 'video:stop', 'pause', 'seeking', 'waiting', 'video:load', 'audio:load', 'video:seek:0', 'audio:seek:0', 'loadedmetadata', 'durationchange', 'progress', 'loadeddata', 'canplay', 'canplaythrough', 'seeked', 'audio:play', 'video:start', 'play', 'playing'])
  assert.equal(env.engine.readyState, 4)
  assert.equal(env.engine.media.videoMode, 'manual')
  env.art.emit('destroy')
})

test('MediaBunny track replacement honors pause during delayed decoder setup', async () => {
  const env = replacementEnvironment()
  await env.engine.play()
  const loading = deferred()
  env.engine.video.load = () => loading.promise
  const replacing = env.engine.replaceTracks({ videoMode: 'manual' })
  await flush()
  env.engine.pause()
  env.calls.length = 0
  loading.resolve()
  await replacing
  assert.equal(env.engine.paused, true)
  assert.equal(env.calls.includes('video:start'), false)
  assert.equal(env.calls.includes('seeked'), true)
  env.art.emit('destroy')
})

for (const ending of ['source', 'destroy']) {
  test(`MediaBunny track replacement cannot seek or publish readiness after ${ending}`, async () => {
    const env = replacementEnvironment()
    const loading = deferred()
    env.engine.video.load = () => loading.promise
    const replacing = env.engine.replaceTracks({ videoMode: 'manual' })
    await flush()
    if (ending === 'destroy') {
      env.art.emit('destroy')
    }
    else {
      env.engine.performLoad = async () => {}
      await env.engine.load('new.mp4')
    }
    env.calls.length = 0
    loading.resolve()
    await replacing
    await flush()
    assert.deepEqual(env.calls.filter(name => !['waiting', 'loadstart'].includes(name)), [])
    env.art.emit('destroy')
  })
}
