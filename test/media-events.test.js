import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { mock, test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { loadModules } from './helpers/load.js'

const { Emitter, config, eventInit, urlMix, switchMix, playMix, beginLifecycle, getScope, getSourceScope } = await loadModules({
  Emitter: 'packages/artplayer/src/utils/emitter',
  config: 'packages/artplayer/src/config/index',
  eventInit: 'packages/artplayer/src/player/eventInit',
  urlMix: 'packages/artplayer/src/player/urlMix',
  switchMix: 'packages/artplayer/src/player/switchMix',
  playMix: 'packages/artplayer/src/player/playMix',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
  getSourceScope: { file: 'packages/artplayer/src/source/operation', name: 'getSourceScope' },
})

function createArt() {
  const ui = []
  const writes = []
  const forwarded = []
  const classes = new Set()
  const video = new EventTarget()
  let src = ''
  Object.defineProperty(video, 'src', { configurable: true, get: () => src, set(value) {
    src = value
    writes.push(value)
  } })
  const visibility = name => ({ get show() {
    return false
  }, set show(value) {
    ui.push([name, value])
  } })
  const art = Object.assign(new Emitter(), {
    template: { $video: video, $poster: { style: {} }, $player: { classList: { add: value => classes.add(value), remove: value => classes.delete(value) } } },
    option: { url: 'initial.mp4', type: '', customType: {}, loop: false },
    constructor: { RECONNECT_TIME_MAX: 2, RECONNECT_SLEEP_TIME: 10 },
    notice: { show: '' },
    i18n: { get: key => key },
    isReady: false,
    playing: false,
    currentTime: 3,
    aspectRatio: '16:9',
    playbackRate: 1,
    pause: () => {},
    play: mock.fn(() => Promise.resolve()),
    loading: visibility('loading'),
    controls: visibility('controls'),
    mask: visibility('mask'),
    proxy(target, name, callback) {
      forwarded.push([target, name, callback])
      target.addEventListener(name, callback)
      getScope(art).add(() => {
        target.removeEventListener(name, callback)
      })
    },
  })
  beginLifecycle(art)
  urlMix(art)
  switchMix(art)
  eventInit(art)
  art.url = art.option.url
  return { art, video, ui, writes, forwarded, classes, close: () => getScope(art).dispose() }
}

async function tick(t, milliseconds = 10) {
  t.mock.timers.tick(milliseconds)
  await setImmediate()
}

test('media forwarding uses configured names, original targets and exact native event objects', () => {
  const fixture = createArt()
  const { art, video, forwarded } = fixture
  assert.deepEqual(forwarded.map(item => item[1]), config.events)
  assert(forwarded.every(item => item[0] === video))
  const event = new Event('volumechange')
  const observed = []
  art.on('video:volumechange', value => observed.push(value))
  video.dispatchEvent(event)
  assert.deepEqual(observed, [event])
  fixture.close()
  // Even an externally retained forwarding callback must respect the closed owner.
  forwarded.find(item => item[1] === 'volumechange')[2](event)
  assert.deepEqual(observed, [event])
})

test('readiness and media UI retain callback order and ready is emitted once', () => {
  const { art, ui, close } = createArt()
  const order = []
  art.on('resize', () => order.push('resize'))
  art.on('ready', () => order.push(['ready', art.isReady]))
  art.on('video:canplay', () => order.push('canplay'))
  art.emit('video:loadstart')
  assert.deepEqual(ui, [['loading', true], ['mask', false], ['controls', true]])
  ui.length = 0
  art.emit('video:loadedmetadata')
  art.emit('video:canplay')
  art.emit('video:canplay')
  assert.deepEqual(order, ['resize', ['ready', true], 'canplay', 'canplay'])
  assert.deepEqual(ui, [['loading', false], ['loading', false], ['controls', true], ['mask', true], ['loading', false]])
  close()
})

test('reconnect coalesces errors, preserves the first error identity and respects the attempt limit', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { art, writes, classes, close } = createArt()
  const errors = []
  art.on('error', (...args) => errors.push(args))
  const first = new Event('error')
  art.emit('video:error', first)
  art.emit('video:error', new Event('error'))
  await tick(t)
  assert.deepEqual(writes, ['initial.mp4', 'initial.mp4'])
  assert.deepEqual(errors, [[first, 1]])
  assert.equal(art.notice.show, 'Reconnect: 1')
  const second = new Event('error')
  art.emit('video:error', second)
  await tick(t)
  assert.deepEqual(errors, [[first, 1], [second, 2]])
  art.emit('video:error', new Event('error'))
  assert(classes.has('art-error'))
  await tick(t)
  assert.equal(writes.length, 3)
  assert.equal(errors.length, 2)
  assert.equal(art.notice.show, 'Video Load Failed')
  close()
})

test('source replacement cancels the old retry and starts a fresh attempt budget', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { art, writes, close } = createArt()
  const attempts = []
  art.on('error', (_error, count) => attempts.push(count))
  art.emit('video:error', new Event('error'))
  await tick(t)
  const old = getSourceScope(art)
  art.emit('video:error', new Event('error'))
  art.url = 'replacement.mp4'
  art.notice.show = 'new source'
  assert.equal(old.closed, true)
  await tick(t)
  assert.deepEqual(writes, ['initial.mp4', 'initial.mp4', 'replacement.mp4'])
  assert.equal(art.notice.show, 'new source')
  art.emit('video:error', new Event('error'))
  await tick(t)
  assert.deepEqual(attempts, [1, 1])
  assert.equal(writes.at(-1), 'replacement.mp4')
  close()
})

test('a failed switch rejects while its current source can still reconnect', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { art, writes, close } = createArt()
  const error = new Event('error')
  const switching = art.switchUrl('failed.mp4')
  const source = getSourceScope(art)
  const rejected = assert.rejects(switching, actual => actual === error)
  art.emit('video:error', error)
  await rejected
  assert.equal(source.closed, false)
  await tick(t)
  assert.deepEqual(writes, ['initial.mp4', 'failed.mp4', 'failed.mp4'])
  assert.equal(art.notice.show, 'Reconnect: 1')
  close()
})

test('canplay cancels pending failure notices and clears recovered error UI', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { art, writes, classes, close } = createArt()
  art.constructor.RECONNECT_TIME_MAX = 0
  art.emit('video:error', new Event('error'))
  assert(classes.has('art-error'))
  art.emit('video:loadstart')
  assert.equal(classes.has('art-error'), false)
  art.notice.show = 'recovered'
  art.emit('video:canplay')
  await tick(t)
  assert.equal(art.notice.show, 'recovered')
  assert.equal(writes.length, 1)
  close()
})

test('destroy during readiness stops remaining UI work and removes only owned media handlers', () => {
  const { art, ui, close } = createArt()
  const ready = mock.fn()
  const userCanplay = mock.fn()
  art.on('ready', ready)
  art.on('video:canplay', userCanplay)
  art.controls = { get show() {
    return false
  }, set show(value) {
    ui.push(['controls', value])
    close()
  } }
  art.emit('video:canplay')
  assert.equal(art.isReady, false)
  assert.equal(ready.mock.callCount(), 0)
  assert.equal(userCanplay.mock.callCount(), 1)
  assert.deepEqual(ui, [['loading', false], ['loading', false], ['controls', true]])
  art.emit('video:canplay')
  assert.equal(userCanplay.mock.callCount(), 2)
  assert.deepEqual(Object.keys(art.e).sort(), ['ready', 'video:canplay'])
})

test('destroy cancels a pending reconnect and exhausted failure notice', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  for (const maximum of [0, 2]) {
    const { art, writes, close } = createArt()
    art.constructor.RECONNECT_TIME_MAX = maximum
    art.emit('video:error', new Event('error'))
    close()
    art.notice.show = 'closed'
    await tick(t)
    assert.deepEqual(writes, ['initial.mp4'])
    assert.equal(art.notice.show, 'closed')
    assert.deepEqual(Object.keys(art.e), [])
  }
})

test('owned reconnect listener failures are reported with the original error and never left unhandled', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const warning = t.mock.method(console, 'warn', () => {})
  const { art, close } = createArt()
  const failure = new Error('user retry observer')
  art.on('error', () => {
    throw failure
  })
  art.emit('video:error', new Event('error'))
  await tick(t)
  assert.equal(warning.mock.callCount(), 1)
  assert.deepEqual(warning.mock.calls[0].arguments, ['ArtPlayer reconnect failed:', failure])
  close()
})

test('loop playback handles rejection and stops when seek reentrantly replaces the source', async () => {
  const { art, ui, close } = createArt()
  art.option.loop = true
  art.play = mock.fn(() => Promise.reject(new DOMException('interrupted', 'AbortError')))
  art.emit('video:ended')
  await setImmediate()
  assert.equal(art.play.mock.callCount(), 1)
  assert.deepEqual(ui, [['controls', false], ['mask', false]])
  ui.length = 0
  Object.defineProperty(art, 'seek', { get: () => undefined, set() {
    art.url = 'reentrant.mp4'
  } })
  art.emit('video:ended')
  assert.equal(art.play.mock.callCount(), 1)
  assert.deepEqual(ui, [])
  close()
})

test('retry count remains stable when a proxy synchronously reports canplay during assignment', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { art, video, close } = createArt()
  const counts = []
  art.on('error', (_error, count) => counts.push(count))
  const descriptor = Object.getOwnPropertyDescriptor(video, 'src')
  Object.defineProperty(video, 'src', {
    get: descriptor.get,
    set(value) {
      descriptor.set.call(video, value)
      video.dispatchEvent(new Event('canplay'))
    },
  })
  art.emit('video:error', new Event('error'))
  await tick(t)
  assert.deepEqual(counts, [1])
  assert.equal(art.isReady, true)
  close()
})

test('an option URL getter that replaces the source cannot let an obsolete retry overwrite it', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { art, writes, close } = createArt()
  let requested = 'initial.mp4'
  let reentered = false
  Object.defineProperty(art.option, 'url', {
    get() {
      if (!reentered) {
        reentered = true
        art.url = 'newest.mp4'
      }
      return requested
    },
    set(value) { requested = value },
  })
  art.emit('video:error', new Event('error'))
  await tick(t)
  assert.deepEqual(writes, ['initial.mp4', 'newest.mp4'])
  close()
})

test('source lifetime guards late play after a failed switch has removed its operation', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { art, video, close } = createArt()
  const error = new Event('error')
  const rejected = assert.rejects(art.switchUrl('failed.mp4'), actual => actual === error)
  art.emit('video:error', error)
  await rejected
  let resolveNative
  video.play = () => new Promise(resolve => resolveNative = resolve)
  const pauseOther = mock.fn()
  art.constructor.instances = [{ pause: pauseOther }]
  art.option.mutex = true
  playMix(art)
  const plays = mock.fn()
  art.on('play', plays)
  const pending = art.play()
  close()
  art.notice.show = 'closed'
  resolveNative(42)
  assert.equal(await pending, 42)
  assert.equal(art.notice.show, 'closed')
  assert.equal(plays.mock.callCount(), 0)
  assert.equal(pauseOther.mock.callCount(), 0)
})
