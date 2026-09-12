import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Actual proxy, controlled SDK/UI interleavings and immutable old artifact controls.
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
function state(selected = 1) {
  const levels = [
    { id: 1, index: 0, name: '720P', height: 720, bitrate: 2000 },
    { id: 2, index: 1, name: '1080P', height: 1080, bitrate: 4000 },
  ]
  const audios = [
    { id: 3, index: 0, name: 'English', lang: 'en', language: 'en', bitrate: 128 },
    { id: 4, index: 1, name: 'French', lang: 'fr', language: 'fr', bitrate: 128 },
  ]
  return { levels, audios, currentLevel: levels.find(track => track.id === selected), currentAudio: audios[0], videoMode: 'auto', audioMode: 'auto' }
}
function environment(option = { m3u8: { quality: { control: true, setting: true }, audio: { control: true, setting: true } } }) {
  const env = mbEnvironment(implementation)
  const calls = []
  const warnings = []
  const notices = []
  const controls = new Map()
  const settings = new Map()
  env.globals.console = { ...console, warn: (...args) => warnings.push(args), error() {} }
  const registry = (cache, kind) => ({
    cache,
    find: name => cache.get(name),
    update(menu) {
      calls.push([kind, 'update', menu.name])
      cache.set(menu.name, menu)
    },
    remove(name) {
      calls.push([kind, 'remove', name])
      cache.delete(name)
    },
  })
  env.art.controls = registry(controls, 'control')
  env.art.setting = registry(settings, 'setting')
  env.art.notice = {
    get show() { return notices.at(-1) },
    set show(value) { notices.push(value) },
  }
  env.art.off = (name, callback) => {
    env.handlers.set(name, (env.handlers.get(name) || []).filter(item => item !== callback))
  }
  const canvas = env.factory(option)(env.art)
  canvas.engine.getHlsState = async () => state()
  const refresh = async () => {
    await Promise.all((env.handlers.get('video:loadedmetadata') || []).map(callback => callback()))
  }
  return { ...env, canvas, option, controls, settings, calls, warnings, notices, refresh }
}

test('MediaBunny HLS retains normal menu names, ordering, defaults and notices', async () => {
  const env = environment()
  await env.refresh()
  const quality = env.controls.get('mediabunny-quality')
  assert.equal(quality.html, '720P')
  assert.deepEqual(Array.from(quality.selector, item => [item.value, item.default]), [[2, false], [1, true], ['auto', false]])
  assert.equal(env.settings.get('mediabunny-quality').width, 200)
  assert.equal(env.settings.get('mediabunny-audio').html, 'Audio')
  const selected = []
  env.canvas.engine.selectHlsQuality = async value => selected.push(value)
  assert.equal(await quality.onSelect(quality.selector[0]), '1080P')
  assert.deepEqual(selected, [2])
  assert.deepEqual(env.notices, ['Quality: 1080P'])
  env.art.emit('destroy')
})

test('MediaBunny disabled HLS integration installs no menu callbacks', () => {
  const env = environment({})
  assert.equal(env.handlers.get('restart'), undefined)
  assert.equal(env.controls.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny HLS clears all menus for a settled non-HLS source', async () => {
  const env = environment()
  await env.refresh()
  env.canvas.engine.getHlsState = async () => null
  await env.refresh()
  assert.equal(env.controls.size + env.settings.size, 0)
  env.art.emit('destroy')
})

for (const surface of ['control', 'setting']) {
  test(`MediaBunny HLS removes disabled ${surface} while preserving the other surface`, async () => {
    const env = environment()
    await env.refresh()
    env.option.m3u8.quality[surface] = false
    env.option.m3u8.audio[surface] = false
    await env.refresh()
    assert.equal(env[surface === 'control' ? 'controls' : 'settings'].size, 0)
    assert.equal(env[surface === 'control' ? 'settings' : 'controls'].size, 2)
    env.art.emit('destroy')
  })
}

for (const ending of ['newer', 'source', 'destroy']) {
  test(`MediaBunny HLS pending state cannot paint after ${ending}`, async () => {
    const env = environment()
    const pending = deferred()
    env.canvas.engine.getHlsState = () => pending.promise
    const refresh = env.refresh()
    if (ending === 'newer') {
      env.canvas.engine.getHlsState = async () => state(2)
      await env.refresh()
    }
    else if (ending === 'source') {
      env.canvas.engine.loadSeq++
    }
    else {
      env.art.emit('destroy')
    }
    pending.resolve(state(1))
    await refresh
    if (ending === 'newer')
      assert.equal(env.controls.get('mediabunny-quality').html, '1080P')
    else assert.equal(env.controls.size + env.settings.size, 0)
    env.art.emit('destroy')
  })
}

for (const event of ['video:loadstart', 'video:error', 'destroy']) {
  test(`MediaBunny HLS ${event} clears rendered menus immediately`, async () => {
    const env = environment()
    await env.refresh()
    env.art.emit(event)
    assert.equal(env.controls.size + env.settings.size, 0)
    env.art.emit('destroy')
  })
}

for (const ending of ['menu', 'source', 'destroy']) {
  test(`MediaBunny stale HLS selection callback is inert after ${ending}`, async () => {
    const env = environment()
    await env.refresh()
    const menu = env.controls.get('mediabunny-quality')
    const calls = []
    env.canvas.engine.selectHlsQuality = async value => calls.push(value)
    if (ending === 'menu')
      await env.refresh()
    else if (ending === 'source')
      env.canvas.engine.loadSeq++
    else env.art.emit('destroy')
    assert.equal(await menu.onSelect(menu.selector[0]), '1080P')
    assert.deepEqual(calls, [])
    assert.deepEqual(env.notices, [])
    env.art.emit('destroy')
  })
}

for (const ending of ['newer', 'source', 'destroy']) {
  test(`MediaBunny pending HLS selection cannot notify after ${ending}`, async () => {
    const env = environment()
    await env.refresh()
    const menu = env.controls.get('mediabunny-quality')
    const pending = deferred()
    env.canvas.engine.selectHlsQuality = () => pending.promise
    const selecting = menu.onSelect(menu.selector[0])
    if (ending === 'newer') {
      env.canvas.engine.selectHlsQuality = async () => {}
      await menu.onSelect(menu.selector[1])
    }
    else if (ending === 'source') {
      env.canvas.engine.loadSeq++
    }
    else {
      env.art.emit('destroy')
    }
    const notices = env.notices.slice()
    pending.resolve()
    await selecting
    assert.deepEqual(env.notices, notices)
    env.art.emit('destroy')
  })
}

test('MediaBunny background HLS refresh failure is observed without an unhandled rejection', async () => {
  const env = environment()
  const failure = new Error('state unavailable')
  env.canvas.engine.getHlsState = async () => {
    throw failure
  }
  await env.refresh()
  assert.equal(env.warnings.length, 1)
  assert.equal(env.warnings[0][1], failure)
  env.art.emit('destroy')
})

test('MediaBunny current HLS selection failure retains its Promise rejection without success notice', async () => {
  const env = environment()
  await env.refresh()
  const menu = env.controls.get('mediabunny-quality')
  const failure = new Error('selection unavailable')
  env.canvas.engine.selectHlsQuality = async () => {
    throw failure
  }
  await assert.rejects(menu.onSelect(menu.selector[0]), error => error === failure)
  assert.deepEqual(env.notices, [])
  env.art.emit('destroy')
})

test('MediaBunny same-label levels retain the actually selected ID and one highlight', async () => {
  const env = environment()
  env.option.m3u8.quality.getName = () => 'Same'
  env.canvas.engine.getHlsState = async () => state(2)
  await env.refresh()
  const menu = env.controls.get('mediabunny-quality')
  assert.deepEqual(Array.from(menu.selector, item => [item.value, item.default]), [[2, true], ['auto', false]])
  env.art.emit('destroy')
})

test('MediaBunny HLS single audio topology removes only audio menus', async () => {
  const env = environment()
  await env.refresh()
  const single = state()
  single.audios.length = 1
  env.canvas.engine.getHlsState = async () => single
  await env.refresh()
  assert.deepEqual([...env.controls.keys()], ['mediabunny-quality'])
  assert.deepEqual([...env.settings.keys()], ['mediabunny-quality'])
  env.art.emit('destroy')
})

test('MediaBunny HLS name callback destroy cannot recreate controls or settings', async () => {
  const env = environment()
  env.option.m3u8.quality.getName = (level) => {
    env.art.emit('destroy')
    return level.name
  }
  await env.refresh()
  assert.equal(env.controls.size + env.settings.size, 0)
})

test('MediaBunny HLS control update reentry cannot write later settings or audio menus', async () => {
  const env = environment()
  const update = env.art.controls.update
  env.art.controls.update = (menu) => {
    update(menu)
    env.art.emit('destroy')
  }
  await env.refresh()
  assert.equal(env.controls.size + env.settings.size, 0)
})

test('MediaBunny HLS destruction removes its refresh listeners and preserves proxy teardown', async () => {
  const env = environment()
  await env.refresh()
  const metadataListener = env.handlers.get('video:loadedmetadata').at(-1)
  env.art.emit('destroy')
  assert.equal(env.canvas.engine.destroyed, true)
  assert.equal(env.art.mediabunny, undefined)
  assert.equal(env.handlers.get('video:loadedmetadata').includes(metadataListener), false)
  assert.equal(env.handlers.get('restart')?.length || 0, 0)
})

function selectionEnvironment() {
  const env = environment({})
  const pairs = []
  const videos = [1, 2].map(id => ({ id, canBePairedWith: () => true }))
  const audios = [3, 4].map(id => ({ id, canBePairedWith: () => true }))
  env.canvas.engine.input = { getVideoTracks: async () => videos, getAudioTracks: async () => audios }
  env.canvas.engine.media = { isHls: true, videoTrack: videos[0], audioTrack: audios[0], videoMode: 'auto', audioMode: 'auto' }
  env.canvas.engine.replaceTracks = async (tracks) => {
    pairs.push(tracks)
    env.canvas.engine.media = { ...env.canvas.engine.media, ...tracks }
  }
  return { ...env, engine: env.canvas.engine, videos, audios, pairs }
}

for (const [method, query, field, ids] of [['selectHlsQuality', 'getVideoTracks', 'videoTrack', [1, 2]], ['selectHlsAudio', 'getAudioTracks', 'audioTrack', [3, 4]]]) {
  test(`MediaBunny ${method} honors the latest request when the older query resolves first`, async () => {
    const env = selectionEnvironment()
    const first = deferred()
    const second = deferred()
    const values = await env.engine.input[query]()
    let queries = 0
    env.engine.input[query] = () => (++queries === 1 ? first.promise : second.promise)
    const older = env.engine[method](ids[0])
    const newer = env.engine[method](ids[1])
    first.resolve(values)
    await flush()
    second.resolve(values)
    await Promise.all([older, newer])
    assert.deepEqual(env.pairs.map(pair => pair[field].id), [ids[1]])
    env.art.emit('destroy')
  })
}

test('MediaBunny later audio intent supersedes an unresolved quality query', async () => {
  const env = selectionEnvironment()
  const pending = deferred()
  env.engine.input.getVideoTracks = () => pending.promise
  const older = env.engine.selectHlsQuality(2)
  const newer = env.engine.selectHlsAudio(4)
  pending.resolve(env.videos)
  await Promise.all([older, newer])
  assert.equal(env.pairs.length, 1)
  assert.equal(env.pairs[0].audioTrack.id, 4)
  assert.equal(env.pairs[0].videoTrack.id, 1)
  env.art.emit('destroy')
})

test('MediaBunny HLS selection survives its own loadedmetadata refresh without a duplicate notice', async () => {
  const env = environment()
  await env.refresh()
  const menu = env.controls.get('mediabunny-quality')
  env.canvas.engine.selectHlsQuality = async () => {
    env.canvas.engine.getHlsState = async () => state(2)
    await env.refresh()
  }
  await menu.onSelect(menu.selector[0])
  assert.equal(env.controls.get('mediabunny-quality').html, '1080P')
  assert.deepEqual(env.notices, ['Quality: 1080P'])
  env.art.emit('destroy')
})

test('MediaBunny HLS selection invalidates an older state read before it can paint', async () => {
  const env = environment()
  await env.refresh()
  const menu = env.controls.get('mediabunny-quality')
  const read = deferred()
  const switchTrack = deferred()
  env.canvas.engine.getHlsState = () => read.promise
  const updating = env.refresh()
  env.canvas.engine.selectHlsQuality = () => switchTrack.promise
  const selecting = menu.onSelect(menu.selector[0])
  const writes = env.calls.length
  read.resolve(state())
  await updating
  assert.equal(env.calls.length, writes)
  env.canvas.engine.getHlsState = async () => state(2)
  switchTrack.resolve()
  await selecting
  assert.equal(env.controls.get('mediabunny-quality').html, '1080P')
  env.art.emit('destroy')
})

test('MediaBunny failed HLS selection restores highlight from actual tracks before rejecting', async () => {
  const env = environment()
  await env.refresh()
  const menu = env.controls.get('mediabunny-quality')
  for (const item of menu.selector) item.default = item.value === 2
  const failure = new Error('track failed')
  env.canvas.engine.selectHlsQuality = async () => {
    throw failure
  }
  await assert.rejects(menu.onSelect(menu.selector[0]), error => error === failure)
  assert.deepEqual(Array.from(env.controls.get('mediabunny-quality').selector).filter(item => item.default).map(item => item.value), [1])
  env.art.emit('destroy')
})

test('MediaBunny stale HLS selection rejection is observed without disturbing the current source', async () => {
  const env = environment()
  await env.refresh()
  const menu = env.controls.get('mediabunny-quality')
  const pending = deferred()
  env.canvas.engine.selectHlsQuality = () => pending.promise
  const selecting = menu.onSelect(menu.selector[0])
  env.canvas.engine.loadSeq++
  pending.reject(new Error('old source closed'))
  await selecting
  assert.equal(env.notices.length + env.warnings.length, 0)
  env.art.emit('destroy')
})

test('MediaBunny HLS clears all owned surfaces even when one registry cleanup fails', async () => {
  const env = environment()
  await env.refresh()
  const failure = new Error('control cleanup failed')
  const remove = env.art.controls.remove
  env.art.controls.remove = (name) => {
    remove(name)
    throw failure
  }
  env.art.emit('destroy')
  assert.equal(env.controls.size + env.settings.size, 0)
  assert.equal(env.canvas.engine.destroyed, true)
  assert.equal(env.handlers.get('restart').length, 0)
  assert.equal(env.warnings[0][1], failure)
})

test('MediaBunny HLS failing listener removal still attempts remaining removals and proxy teardown', async () => {
  const env = environment()
  const off = env.art.off
  const removed = []
  env.art.off = (name, callback) => {
    removed.push(name)
    off(name, callback)
    if (name === 'restart')
      throw new Error('off failed')
  }
  env.art.emit('destroy')
  assert.deepEqual(removed.slice(0, 5), ['video:loadedmetadata', 'restart', 'video:loadstart', 'video:error', 'destroy'])
  assert.equal(env.canvas.engine.destroyed, true)
  assert.equal(env.warnings.length, 1)
})

test('MediaBunny runtime HLS disable clears menus on the next refresh', async () => {
  const env = environment()
  await env.refresh()
  env.option.m3u8 = undefined
  await env.refresh()
  assert.equal(env.controls.size + env.settings.size, 0)
  env.art.emit('destroy')
})

test('MediaBunny HLS custom labels retain Auto text while highlighting the actual selected track', async () => {
  const env = environment()
  env.option.m3u8.audio = { control: true, setting: true, title: 'Language', auto: 'Automatic', getName: track => track.lang }
  await env.refresh()
  const menu = env.controls.get('mediabunny-audio')
  assert.equal(menu.html, 'en')
  assert.deepEqual(Array.from(menu.selector, item => [item.html, item.default]), [['en', true], ['fr', false], ['Automatic', false]])
  const values = []
  env.canvas.engine.selectHlsAudio = async value => values.push(value)
  await menu.onSelect(menu.selector[2])
  assert.deepEqual(values, ['auto'])
  assert.deepEqual(env.notices, ['Language: Automatic'])
  assert.equal(env.controls.get('mediabunny-audio').html, 'en')
  env.art.emit('destroy')
})

for (const kind of ['quality', 'audio']) {
  test(`MediaBunny ${kind} pairing fallback preserves a coherent pair and resets only the counterpart mode`, async () => {
    const env = selectionEnvironment()
    env.engine.media.videoMode = 'manual'
    env.engine.media.audioMode = 'manual'
    if (kind === 'quality') {
      env.videos[1].canBePairedWith = () => false
      env.videos[1].getPrimaryPairableAudioTrack = async () => env.audios[1]
      await env.engine.selectHlsQuality(2)
      assert.deepEqual([env.pairs[0].videoTrack.id, env.pairs[0].audioTrack.id, env.pairs[0].videoMode, env.pairs[0].audioMode], [2, 4, 'manual', 'auto'])
    }
    else {
      env.audios[1].canBePairedWith = () => false
      env.audios[1].getPrimaryPairableVideoTrack = async () => env.videos[1]
      await env.engine.selectHlsAudio(4)
      assert.deepEqual([env.pairs[0].videoTrack.id, env.pairs[0].audioTrack.id, env.pairs[0].videoMode, env.pairs[0].audioMode], [2, 4, 'auto', 'manual'])
    }
    env.art.emit('destroy')
  })
}

test('MediaBunny latest selection still applies when an earlier replacement changes media during its query', async () => {
  const env = selectionEnvironment()
  const replacing = deferred()
  const query = deferred()
  env.engine.replaceTracks = async (tracks) => {
    env.pairs.push(tracks)
    if (env.pairs.length === 1)
      await replacing.promise
    env.engine.media = { ...env.engine.media, ...tracks }
  }
  const older = env.engine.selectHlsQuality(1)
  await flush()
  env.engine.input.getVideoTracks = () => query.promise
  const latest = env.engine.selectHlsQuality(2)
  replacing.resolve()
  await older
  query.resolve(env.videos)
  await latest
  assert.equal(env.engine.media.videoTrack.id, 2)
  env.art.emit('destroy')
})

test('MediaBunny obsolete selection query rejection cannot replace the newer selection result', async () => {
  const env = selectionEnvironment()
  const query = deferred()
  env.engine.input.getVideoTracks = () => query.promise
  const older = env.engine.selectHlsQuality(2)
  await env.engine.selectHlsAudio(4)
  query.reject(new Error('obsolete query'))
  await older
  assert.equal(env.engine.media.audioTrack.id, 4)
  env.art.emit('destroy')
})

test('MediaBunny Auto audio resolves against the current video when media changes during pairing', async () => {
  const env = selectionEnvironment()
  const pending = deferred()
  env.videos[0].getPrimaryPairableAudioTrack = () => pending.promise
  env.videos[1].getPrimaryPairableAudioTrack = async () => env.audios[1]
  const selecting = env.engine.selectHlsAudio('auto')
  await flush()
  env.engine.media = { ...env.engine.media, videoTrack: env.videos[1] }
  pending.resolve(env.audios[0])
  await selecting
  assert.equal(env.pairs[0].videoTrack.id, 2)
  assert.equal(env.pairs[0].audioTrack.id, 4)
  env.art.emit('destroy')
})

for (const ending of ['resolve', 'reject']) {
  test(`MediaBunny state ${ending} is discarded when the source generation changes before media replacement`, async () => {
    const env = environment({})
    delete env.canvas.engine.getHlsState
    const query = deferred()
    env.canvas.engine.media = { isHls: true, input: { getVideoTracks: () => query.promise }, videoTrack: null }
    const reading = env.canvas.engine.getHlsState()
    env.canvas.engine.loadSeq++
    if (ending === 'resolve')
      query.resolve([])
    else query.reject(new Error('obsolete state'))
    assert.equal(await reading, null)
    env.art.emit('destroy')
  })
}

test('MediaBunny selection failure superseded during UI recovery does not reject after the newer intent', async () => {
  const env = environment()
  await env.refresh()
  const menu = env.controls.get('mediabunny-quality')
  const recovery = deferred()
  env.canvas.engine.getHlsState = () => recovery.promise
  env.canvas.engine.selectHlsQuality = async () => {
    throw new Error('first selection failed')
  }
  const older = menu.onSelect(menu.selector[0]).then(value => ({ value }), error => ({ error }))
  await flush()
  env.canvas.engine.getHlsState = async () => state()
  env.canvas.engine.selectHlsQuality = async () => {}
  await menu.onSelect(menu.selector[1])
  recovery.resolve(state())
  assert.equal((await older).error, undefined)
  assert.deepEqual(env.notices, ['Quality: 720P'])
  env.art.emit('destroy')
})
