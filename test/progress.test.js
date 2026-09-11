import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { Emitter, installProgressInteractions, getPosFromEvent, beginLifecycle, getScope, beginSource, ownEntry, releaseEntry } = await loadModules({
  Emitter: 'packages/artplayer/src/utils/emitter',
  installProgressInteractions: { file: 'packages/artplayer/src/control/progress/interactions', name: 'installProgressInteractions' },
  getPosFromEvent: { file: 'packages/artplayer/src/control/progress/position', name: 'getPosFromEvent' },
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
  beginSource: { file: 'packages/artplayer/src/source/operation', name: 'beginSource' },
  ownEntry: { file: 'packages/artplayer/src/component/resources', name: 'ownEntry' },
  releaseEntry: { file: 'packages/artplayer/src/component/resources', name: 'releaseEntry' },
})

function mouse(name, clientX = 60, button = 0) {
  return Object.assign(new Event(name), { clientX, button })
}

function fixture() {
  const progress = Object.assign(new EventTarget(), { clientWidth: 100, getBoundingClientRect: () => ({ left: 10 }) })
  const indicator = new EventTarget()
  const control = Object.assign(new EventTarget(), { querySelector: () => indicator })
  const effects = []
  const art = Object.assign(new Emitter(), {
    template: { $progress: progress },
    duration: 200,
    isRotate: false,
    events: {
      proxy(target, name, callback) {
        target.addEventListener(name, callback)
        return () => target.removeEventListener(name, callback)
      },
      remove: cleanup => cleanup(),
    },
  })
  Object.defineProperty(art, 'seek', { get: () => 0, set: value => effects.push(['seek', value]) })
  art.on('setBar', (kind, percentage) => effects.push(['setBar', kind, percentage]))
  beginLifecycle(art)
  ownEntry(art, control)
  installProgressInteractions(art, control)
  return { art, progress, control, indicator, effects }
}

test('progress position clamps outside edges and retains its time and percentage calculations', () => {
  const f = fixture()
  assert.deepEqual(getPosFromEvent(f.art, mouse('click', 60)), { second: 100, time: '01:40', width: 50, percentage: 0.5 })
  assert.equal(getPosFromEvent(f.art, mouse('click', -100)).percentage, 0)
  assert.equal(getPosFromEvent(f.art, mouse('click', 1000)).percentage, 1)
  f.progress.clientWidth = 0
  assert(Number.isNaN(getPosFromEvent(f.art, mouse('click', 10)).percentage))
})

test('live progress clicks and drags preserve setBar before seek and mouseup stops dragging', () => {
  const f = fixture()
  f.progress.dispatchEvent(mouse('click'))
  assert.deepEqual(f.effects, [['setBar', 'played', 0.5], ['seek', 100]])
  f.effects.length = 0
  f.progress.dispatchEvent(mouse('mousedown'))
  f.art.emit('document:mousemove', mouse('mousemove', 85))
  f.art.emit('document:mouseup', mouse('mouseup'))
  f.art.emit('document:mousemove', mouse('mousemove', 100))
  assert.deepEqual(f.effects, [['setBar', 'played', 0.75], ['seek', 150]])
})

for (const mode of ['control removal', 'destruction', 'source replacement']) {
  test(`progress click does not seek after ${mode} inside setBar`, () => {
    const f = fixture()
    f.art.on('setBar', () => {
      if (mode === 'control removal')
        releaseEntry(f.control)
      else if (mode === 'destruction')
        getScope(f.art).dispose()
      else
        beginSource(f.art)
    })
    f.progress.dispatchEvent(mouse('click'))
    assert.deepEqual(f.effects, [['setBar', 'played', 0.5]])
  })
}

test('progress drag loses its source when media is replaced and a new mousedown can start again', () => {
  const f = fixture()
  f.progress.dispatchEvent(mouse('mousedown'))
  beginSource(f.art)
  f.art.emit('document:mousemove', mouse('mousemove', 85))
  assert.deepEqual(f.effects, [])
  f.progress.dispatchEvent(mouse('mousedown'))
  f.art.emit('document:mousemove', mouse('mousemove', 60))
  assert.deepEqual(f.effects, [['setBar', 'played', 0.5], ['seek', 100]])
})

test('progress drag does not seek when its control is removed inside setBar', () => {
  const f = fixture()
  f.art.on('setBar', () => releaseEntry(f.control))
  f.progress.dispatchEvent(mouse('mousedown'))
  f.art.emit('document:mousemove', mouse('mousemove', 60))
  assert.deepEqual(f.effects, [['setBar', 'played', 0.5]])
})

test('progress geometry reentry cannot emit or seek after disposal', () => {
  const f = fixture()
  f.progress.getBoundingClientRect = () => {
    getScope(f.art).dispose()
    return { left: 10 }
  }
  f.progress.dispatchEvent(mouse('click'))
  assert.deepEqual(f.effects, [])
})

test('a newer nested progress click supersedes the earlier seek', () => {
  const f = fixture()
  let nested = false
  f.art.on('setBar', () => {
    if (!nested) {
      nested = true
      f.progress.dispatchEvent(mouse('click', 85))
    }
  })
  f.progress.dispatchEvent(mouse('click', 60))
  assert.deepEqual(f.effects, [['setBar', 'played', 0.5], ['setBar', 'played', 0.75], ['seek', 150]])
})

test('right-button mousedown and mouseup inside setBar do not continue dragging', () => {
  const f = fixture()
  f.progress.dispatchEvent(mouse('mousedown', 60, 2))
  f.art.emit('document:mousemove', mouse('mousemove', 85))
  assert.deepEqual(f.effects, [])
  f.art.on('setBar', () => f.art.emit('document:mouseup', mouse('mouseup')))
  f.progress.dispatchEvent(mouse('mousedown'))
  f.art.emit('document:mousemove', mouse('mousemove', 60))
  assert.deepEqual(f.effects, [['setBar', 'played', 0.5]])
})
