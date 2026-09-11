import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { optionInit, previousInit, airplayMix, previousAirplay, beginLifecycle, getScope } = await loadModules({
  optionInit: 'packages/artplayer/src/player/optionInit',
  previousInit: 'test/helpers/legacy-option-init',
  airplayMix: 'packages/artplayer/src/player/airplayMix',
  previousAirplay: 'test/helpers/legacy-airplay',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function initialHost(boundary) {
  const calls = []
  let art
  const record = (kind, key, value) => {
    calls.push([kind, key, value])
    if (`${kind}:${key}` === boundary)
      getScope(art).dispose()
  }
  const video = new Proxy({}, { set(target, key, value) {
    record('video', key, value)
    return Reflect.set(target, key, value)
  } })
  const poster = { style: new Proxy({}, { set(target, key, value) {
    record('poster', key, value)
    return Reflect.set(target, key, value)
  } }) }
  art = {
    option: { moreVideoAttr: { controls: false }, muted: true, volume: 2, poster: 'poster.png', autoplay: true, playsInline: true, theme: 'green', cssVar: { '--custom': '2' }, url: 'video.mp4' },
    storage: { get(key) {
      record('storage', key, undefined)
      return 0.4
    } },
    template: { $video: video, $poster: poster },
    attr: (key, value) => record('attr', key, value),
    cssVar: (key, value) => record('css', key, value),
    get muted() { return undefined },
    set muted(value) { record('player', 'muted', value) },
    get url() { return undefined },
    set url(value) { record('player', 'url', value) },
  }
  beginLifecycle(art)
  return { art, calls }
}

test('option initialization retains native/DOM/write order, storage precedence and CSS mutation', () => {
  const old = initialHost()
  const current = initialHost()
  assert.equal(previousInit(old.art), undefined)
  assert.equal(optionInit(current.art), undefined)
  assert.deepEqual(current.calls, old.calls)
  assert.deepEqual(current.calls, [
    ['attr', 'controls', false],
    ['player', 'muted', true],
    ['video', 'volume', 1],
    ['storage', 'volume', undefined],
    ['video', 'volume', 0.4],
    ['poster', 'backgroundImage', 'url(poster.png)'],
    ['video', 'autoplay', true],
    ['video', 'playsInline', true],
    ['video', 'webkit-playsinline', true],
    ['css', '--custom', '2'],
    ['css', '--art-theme', 'green'],
    ['player', 'url', 'video.mp4'],
  ])
  assert.deepEqual(current.art.option.cssVar, { '--custom': '2', '--art-theme': 'green' })
})

test('option initialization stops after reentrant teardown from each external write boundary', () => {
  for (const boundary of ['attr:controls', 'player:muted', 'video:volume', 'storage:volume', 'poster:backgroundImage', 'video:autoplay', 'video:playsInline', 'css:--custom']) {
    const old = initialHost(boundary)
    const current = initialHost(boundary)
    previousInit(old.art)
    optionInit(current.art)
    assert(current.calls.length < old.calls.length, boundary)
    assert.deepEqual(current.calls.at(-1).slice(0, 2).join(':'), boundary)
    assert.equal(current.calls.some(call => call[0] === 'player' && call[1] === 'url'), false)
  }
})

test('initial option value getters and native conversion cannot write after teardown', () => {
  for (const field of ['moreVideoAttr', 'cssVar', 'url', 'volume']) {
    const { art, calls } = initialHost()
    if (field === 'moreVideoAttr' || field === 'cssVar') {
      const key = field === 'cssVar' ? '--custom' : 'controls'
      Object.defineProperty(art.option[field], key, { enumerable: true, get() {
        getScope(art).dispose()
        return 'stale'
      } })
    }
    else {
      Object.defineProperty(art.option, field, { get() {
        getScope(art).dispose()
        return field === 'url' ? 'stale.mp4' : 1
      } })
    }
    optionInit(art)
    assert.equal(calls.some(call => call[2] === 'stale' || call[2] === 'stale.mp4'), false)
    assert.equal(calls.some(call => call[0] === 'player' && call[1] === 'url'), false)
    if (field === 'volume')
      assert.equal(calls.some(call => call[0] === 'video' && call[1] === 'volume'), false)
  }
})

function airplayHost(t, supported = true) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', { configurable: true, writable: true, value: supported ? { WebKitPlaybackTargetAvailabilityEvent() {} } : {} })
  t.after(() => descriptor ? Object.defineProperty(globalThis, 'window', descriptor) : delete globalThis.window)
  const calls = []
  let listener
  const video = Object.assign(new EventTarget(), { webkitShowPlaybackTargetPicker() {
    assert.equal(this, video)
    calls.push('picker')
  } })
  const art = { template: { $video: video }, proxy(target, name, callback) {
    assert.equal(target, video)
    assert.equal(name, 'webkitplaybacktargetavailabilitychanged')
    listener = callback
  }, i18n: { get: key => key }, notice: { show: '' }, emit: name => calls.push(name) }
  beginLifecycle(art)
  return { art, calls, availability: value => listener({ availability: value }) }
}

test('AirPlay retains availability, captured native receiver, event order and unavailable notice', (t) => {
  const { art, calls, availability } = airplayHost(t)
  airplayMix(art)
  const airplay = art.airplay
  assert.equal(airplay(), undefined)
  assert.deepEqual(calls, ['picker', 'airplay'])
  availability('not-available')
  airplay()
  assert.equal(art.notice.show, 'AirPlay Not Available')
  assert.deepEqual(calls, ['picker', 'airplay'])
  availability('available')
  airplay()
  assert.deepEqual(calls, ['picker', 'airplay', 'picker', 'airplay'])
  assert.deepEqual(Object.getOwnPropertyDescriptor(art, 'airplay'), { value: airplay, configurable: false, enumerable: false, writable: false })
})

test('AirPlay installation stops after capability getters or registration destroy its owner', (t) => {
  for (const install of [previousAirplay, airplayMix]) {
    for (const boundary of ['capability', 'picker', 'registration']) {
      const { art } = airplayHost(t)
      const reads = []
      Object.defineProperty(globalThis.window, 'WebKitPlaybackTargetAvailabilityEvent', { get() {
        reads.push('capability')
        if (boundary === 'capability')
          getScope(art).dispose()
        return true
      } })
      Object.defineProperty(art.template.$video, 'webkitShowPlaybackTargetPicker', { get() {
        reads.push('picker')
        if (boundary === 'picker')
          getScope(art).dispose()
        return () => {}
      } })
      art.proxy = () => {
        reads.push('registration')
        if (boundary === 'registration')
          getScope(art).dispose()
      }
      install(art)
      assert.equal(Object.hasOwn(art, 'airplay'), install === previousAirplay)
      const expected = ['capability', 'picker', 'registration']
      assert.deepEqual(reads, install === previousAirplay ? expected : expected.slice(0, expected.indexOf(boundary) + 1))
    }
  }
})

test('AirPlay calls and picker completion cannot publish effects after destruction', (t) => {
  for (const install of [previousAirplay, airplayMix]) {
    const { art, calls, availability } = airplayHost(t)
    install(art)
    getScope(art).dispose()
    availability('available')
    art.airplay()
    assert.deepEqual(calls, install === previousAirplay ? ['picker', 'airplay'] : [])
  }
  const { art, calls } = airplayHost(t)
  art.template.$video.webkitShowPlaybackTargetPicker = () => {
    calls.push('picker')
    getScope(art).dispose()
  }
  airplayMix(art)
  art.airplay()
  assert.deepEqual(calls, ['picker'])
})

test('AirPlay unavailable translation and picker getters respect teardown; native errors still throw', (t) => {
  const unavailable = airplayHost(t, false)
  unavailable.art.i18n.get = () => {
    getScope(unavailable.art).dispose()
    return 'stale notice'
  }
  airplayMix(unavailable.art)
  unavailable.art.airplay()
  assert.equal(unavailable.art.notice.show, '')
  const { art, calls } = airplayHost(t)
  airplayMix(art)
  const error = new Error('picker failed')
  art.template.$video.webkitShowPlaybackTargetPicker = () => {
    throw error
  }
  assert.throws(() => art.airplay(), value => value === error)
  Object.defineProperty(art.template.$video, 'webkitShowPlaybackTargetPicker', { get() {
    getScope(art).dispose()
    return () => calls.push('stale picker')
  } })
  art.airplay()
  assert.deepEqual(calls, [])
})
