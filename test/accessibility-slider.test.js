import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Exercise owned range interactions with the repository runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { keyboardSlider, isClaimedKey, ResourceScope, Emitter, beginLifecycle, getScope, beginSource, ownEntry, releaseEntry, installProgressKeyboard, currentTimeMix } = await loadModules({
  keyboardSlider: { file: 'packages/artplayer/src/accessibility/slider', name: 'keyboardSlider' },
  isClaimedKey: { file: 'packages/artplayer/src/accessibility/keyboard', name: 'isClaimedKey' },
  ResourceScope: 'packages/artplayer/src/lifecycle/scope',
  Emitter: 'packages/artplayer/src/utils/emitter',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
  beginSource: { file: 'packages/artplayer/src/source/operation', name: 'beginSource' },
  ownEntry: { file: 'packages/artplayer/src/component/resources', name: 'ownEntry' },
  releaseEntry: { file: 'packages/artplayer/src/component/resources', name: 'releaseEntry' },
  installProgressKeyboard: { file: 'packages/artplayer/src/control/progress/keyboard', name: 'installProgressKeyboard' },
  currentTimeMix: 'packages/artplayer/src/player/currentTimeMix',
})

class Slider extends EventTarget {
  attributes = new Map()
  setAttribute(key, value) { this.attributes.set(key, String(value)) }
  getAttribute(key) { return this.attributes.get(key) }
  press(key, options = {}) {
    const event = Object.assign(new Event('keydown', { cancelable: true }), { key, ...options })
    this.dispatchEvent(event)
    return event
  }
}

function fixture() {
  const scope = new ResourceScope()
  const element = new Slider()
  const range = { min: 0, max: 100, value: 50, step: 5, text: value => `${value}%` }
  const values = []
  const update = keyboardSlider(scope, element, 'Volume', () => range, (value) => {
    values.push(value)
    range.value = value
  }, 'vertical')
  return { scope, element, range, values, update }
}

test('slider keys repeat, clamp and expose the value actually written', () => {
  const f = fixture()
  for (const [key, value] of [['ArrowRight', 55], ['ArrowUp', 60], ['ArrowLeft', 55], ['ArrowDown', 50], ['PageUp', 100], ['PageDown', 50], ['Home', 0], ['End', 100], ['ArrowUp', 100]]) {
    assert.equal(isClaimedKey(f.element.press(key, { repeat: true })), true)
    assert.equal(f.range.value, value)
    assert.equal(f.element.getAttribute('aria-valuenow'), String(value))
  }
  assert.equal(f.element.getAttribute('aria-orientation'), 'vertical')
  assert.equal(f.element.getAttribute('aria-valuetext'), '100%')
  f.scope.dispose()
})

test('unavailable ranges claim navigation without writing NaN or invoking player shortcuts', () => {
  const f = fixture()
  for (const max of [0, -1, Number.NaN, Infinity]) {
    f.range.max = max
    f.update()
    assert.equal(f.element.getAttribute('aria-disabled'), 'true')
    assert.equal(f.element.getAttribute('aria-valuenow'), '0')
    assert.equal(f.element.getAttribute('aria-valuemax'), '0')
    assert.equal(isClaimedKey(f.element.press('End')), true)
  }
  assert.deepEqual(f.values, [])
  f.range.max = 100
  f.range.step = 0
  f.element.press('ArrowUp')
  assert.deepEqual(f.values, [])
  f.range.step = 5
  f.update()
  assert.equal(f.element.getAttribute('aria-disabled'), 'false')
  f.scope.dispose()
})

test('slider ignores modified, composing, descendant and externally prevented keys', () => {
  const f = fixture()
  for (const options of [{ ctrlKey: true }, { altKey: true }, { metaKey: true }, { isComposing: true }, { keyCode: 229 }, { composedPath: () => [new EventTarget()] }])
    assert.equal(isClaimedKey(f.element.press('ArrowUp', options)), false)
  const prevented = Object.assign(new Event('keydown', { cancelable: true }), { key: 'ArrowUp' })
  prevented.preventDefault()
  f.element.dispatchEvent(prevented)
  for (const key of ['k', 'toString', 'Tab', 'Escape'])
    assert.equal(isClaimedKey(f.element.press(key)), false)
  assert.deepEqual(f.values, [])
  f.scope.dispose()
  assert.equal(f.element.press('ArrowUp').defaultPrevented, false)
})

test('slider stops DOM updates when a write destroys its scope', () => {
  const scope = new ResourceScope()
  const element = new Slider()
  let value = 0
  keyboardSlider(scope, element, 'Range', () => ({ min: 0, max: 10, step: 1, value, text: String }), (next) => {
    value = next
    scope.dispose()
  })
  element.press('ArrowUp')
  assert.equal(value, 1)
  assert.equal(element.getAttribute('aria-valuenow'), '0')
  element.press('ArrowUp')
  assert.equal(value, 1)
})

function progressFixture() {
  const art = Object.assign(new Emitter(), { duration: 200, currentTime: 50, constructor: { SEEK_STEP: 5 }, i18n: { get: key => key } })
  const element = new Slider()
  const effects = []
  Object.defineProperty(art, 'seek', { get: () => undefined, set(value) {
    effects.push(['seek', value])
    art.currentTime = value
  } })
  art.on('setBar', (...args) => effects.push(['setBar', ...args]))
  beginLifecycle(art)
  ownEntry(art, element)
  installProgressKeyboard(art, element)
  return { art, element, effects }
}

test('progress keyboard preserves bar-before-seek and optional pointer payload', () => {
  const f = progressFixture()
  f.element.press('ArrowRight')
  assert.deepEqual(f.effects, [['setBar', 'played', 55 / 200], ['seek', 55]])
  assert.equal(f.element.getAttribute('aria-valuetext'), '00:55 / 03:20')
  f.art.currentTime = 60
  f.art.emit('video:timeupdate', new Event('timeupdate'))
  assert.equal(f.element.getAttribute('aria-valuenow'), '60')
  f.art.duration = Infinity
  f.art.emit('video:durationchange', new Event('durationchange'))
  assert.equal(f.element.getAttribute('aria-valuetext'), '00:00 / 00:00')
  assert.equal(f.element.getAttribute('aria-disabled'), 'true')
  getScope(f.art).dispose()
})

test('progress keyboard cancels after synchronous source replacement or entry disposal', () => {
  for (const cancel of [f => beginSource(f.art), f => releaseEntry(f.element), f => getScope(f.art).dispose()]) {
    const f = progressFixture()
    f.art.on('setBar', () => cancel(f))
    f.element.press('ArrowRight')
    assert.deepEqual(f.effects, [['setBar', 'played', 55 / 200]])
    getScope(f.art).dispose()
  }
})

test('nested progress keyboard action supersedes the outer seek and removal releases subscriptions', () => {
  const f = progressFixture()
  f.art.once('setBar', () => f.element.press('End'))
  f.element.press('ArrowRight')
  assert.deepEqual(f.effects, [['setBar', 'played', 55 / 200], ['setBar', 'played', 1], ['seek', 200]])
  releaseEntry(f.element)
  const before = f.element.getAttribute('aria-valuenow')
  f.art.currentTime = 0
  f.art.emit('video:timeupdate', new Event('timeupdate'))
  assert.equal(f.element.getAttribute('aria-valuenow'), before)
  assert.equal(f.element.press('Home').defaultPrevented, false)
  getScope(f.art).dispose()
})

function seekingFixture() {
  const f = progressFixture()
  let time = 50
  const writes = []
  const video = {
    seeking: false,
    get currentTime() { return time },
    set currentTime(value) {
      writes.push(value)
      time = value
      this.seeking = true
    },
  }
  f.art.template = { $video: video }
  currentTimeMix(f.art)
  beginSource(f.art)
  const finish = (value) => {
    time = value
    video.seeking = false
    f.art.emit('video:seeked', new Event('seeked'))
  }
  return { ...f, video, writes, finish }
}

test('progress corrects a native completion miss at most once without repeating public seek', () => {
  const f = seekingFixture()
  f.element.press('End')
  f.element.press('PageDown')
  f.finish(200)
  assert.deepEqual(f.writes, [200, 150, 150])
  assert.equal(f.art.currentTime, 150)
  f.finish(200)
  f.art.emit('video:ended', new Event('ended'))
  assert.deepEqual(f.writes, [200, 150, 150])
  assert.deepEqual(f.effects, [
    ['setBar', 'played', 1],
    ['seek', 200],
    ['setBar', 'played', 0.75],
    ['seek', 150],
  ])
  assert.equal(f.element.getAttribute('aria-valuenow'), '200')
  getScope(f.art).dispose()
})

test('public position changes supersede a pending progress correction', () => {
  for (const nested of [false, true]) {
    const f = seekingFixture()
    // setBar is public and can replace the intended seek before its setter runs.
    if (nested) {
      f.art.once('setBar', () => {
        f.art.currentTime = 30
      })
    }
    f.element.press('ArrowRight')
    if (!nested)
      f.art.currentTime = 30
    f.finish(30)
    assert.equal(f.art.currentTime, 30)
    assert.deepEqual(f.writes, nested ? [30] : [55, 30])
    getScope(f.art).dispose()
  }
})

test('source replacement, control removal and destruction release pending progress correction', () => {
  for (const cancel of [f => beginSource(f.art), f => releaseEntry(f.element), f => getScope(f.art).dispose()]) {
    const f = seekingFixture()
    const listenerCount = () => (f.art.e['video:seeked'] || []).length
    const before = listenerCount()
    f.element.press('ArrowRight')
    assert.equal(listenerCount(), before + 1)
    cancel(f)
    assert(listenerCount() <= before)
    f.finish(0)
    f.art.emit('video:ended', new Event('ended'))
    assert.deepEqual(f.writes, [55])
    assert.equal(f.art.currentTime, 0)
    getScope(f.art).dispose()
  }
})
