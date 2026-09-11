import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { screenshotMix, beginLifecycle, getScope, beginSource } = await loadModules({
  screenshotMix: 'packages/artplayer/src/player/screenshotMix',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
  beginSource: { file: 'packages/artplayer/src/source/operation', name: 'beginSource' },
})

function fixture(t) {
  const calls = []
  const callbacks = []
  const context = { drawImage: (...args) => calls.push(['draw', ...args]) }
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
    toDataURL: type => `data:${type};base64,frame`,
    toBlob: callback => callbacks.push(callback),
  }
  const anchor = { style: {}, click: () => calls.push(['download', anchor.download]), remove: () => calls.push(['remove']) }
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document')
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    createElement: tag => tag === 'canvas' ? canvas : anchor,
    body: { appendChild: () => {} },
  } })
  t.after(() => previous ? Object.defineProperty(globalThis, 'document', previous) : delete globalThis.document)
  const video = { videoWidth: 320, videoHeight: 180, currentTime: 62 }
  const art = { template: { $video: video }, notice: { show: '' }, emit: (...args) => calls.push(args) }
  beginLifecycle(art)
  screenshotMix(art)
  return { art, canvas, video, context, calls, callbacks, scope: getScope(art) }
}

test('screenshot methods retain immutable bound descriptors, PNG dimensions and filename', async (t) => {
  const f = fixture(t)
  for (const name of ['getDataURL', 'getBlobUrl', 'screenshot']) {
    const descriptor = Object.getOwnPropertyDescriptor(f.art, name)
    assert.equal(descriptor.enumerable, false)
    assert.equal(descriptor.configurable, false)
    assert.equal(descriptor.writable, false)
  }
  const screenshot = f.art.screenshot
  assert.equal(await screenshot(), 'data:image/png;base64,frame')
  assert.equal(f.canvas.width, 320)
  assert.equal(f.canvas.height, 180)
  assert.deepEqual(f.calls, [
    ['draw', f.video, 0, 0],
    ['download', 'artplayer_01:02.png'],
    ['remove'],
    ['screenshot', 'data:image/png;base64,frame'],
  ])
  await screenshot('custom.png')
  assert.deepEqual(f.calls.at(-3), ['download', 'custom.png.png'])
})

test('capture rejects the original drawing and security errors through both methods', async (t) => {
  const f = fixture(t)
  const failure = new Error('tainted canvas')
  f.context.drawImage = () => {
    throw failure
  }
  await assert.rejects(f.art.getDataURL(), error => error === failure)
  await assert.rejects(f.art.getBlobUrl(), error => error === failure)
  assert.equal(f.art.notice.show, failure)
  assert.equal(f.callbacks.length, 0)
})

test('synchronous toBlob failure updates notice before returning its rejected Promise', async (t) => {
  const f = fixture(t)
  const failure = new Error('encoding failed synchronously')
  f.canvas.toBlob = () => {
    throw failure
  }
  const promise = f.art.getBlobUrl()
  assert.equal(f.art.notice.show, failure)
  await assert.rejects(promise, error => error === failure)
})

test('missing canvas context rejects both public captures', async (t) => {
  const f = fixture(t)
  f.canvas.getContext = () => null
  await assert.rejects(f.art.getDataURL(), { name: 'TypeError', message: /context/ })
  await assert.rejects(f.art.getBlobUrl(), { name: 'TypeError', message: /context/ })
})

test('throwing notice setter becomes a rejection even in an asynchronous callback', async (t) => {
  const f = fixture(t)
  const failure = new Error('consumer notice setter failed')
  Object.defineProperty(f.art.notice, 'show', {
    get: () => '',
    set() {
      throw failure
    },
  })
  const promise = f.art.getBlobUrl()
  const rejected = assert.rejects(promise, error => error === failure)
  assert.doesNotThrow(() => f.callbacks[0](null))
  await rejected
})

test('late capture rejection after destruction does not update notice', async (t) => {
  const f = fixture(t)
  const promise = f.art.getBlobUrl()
  const rejected = assert.rejects(promise, /encode/)
  f.scope.dispose()
  f.callbacks[0](null)
  await rejected
  assert.equal(f.art.notice.show, '')
})

test('asynchronous Blob URL failures reject without escaping the canvas callback', async (t) => {
  const f = fixture(t)
  const failure = new Error('object URL allocation failed')
  t.mock.method(URL, 'createObjectURL', () => {
    throw failure
  })
  const promise = f.art.getBlobUrl()
  const rejected = assert.rejects(promise, error => error === failure)
  assert.doesNotThrow(() => f.callbacks[0](new Blob(['frame'])))
  await rejected
  assert.equal(f.art.notice.show, failure)
})

test('null Blob rejects without allocating a URL or leaving the promise pending', async (t) => {
  const f = fixture(t)
  const allocate = t.mock.method(URL, 'createObjectURL')
  const promise = f.art.getBlobUrl()
  const rejected = assert.rejects(promise, /encode|blob/i)
  assert.doesNotThrow(() => f.callbacks[0](null))
  await rejected
  assert.equal(allocate.mock.callCount(), 0)
})

test('concurrent Blob captures settle independently and transfer URL ownership to consumers', async (t) => {
  const f = fixture(t)
  const revoke = t.mock.method(URL, 'revokeObjectURL', () => {})
  t.mock.method(URL, 'createObjectURL', blob => `blob:${blob.size}`)
  const first = f.art.getBlobUrl()
  const second = f.art.getBlobUrl()
  f.callbacks[1](new Blob(['bb']))
  f.scope.dispose()
  f.callbacks[0](new Blob(['a']))
  assert.deepEqual(await Promise.all([first, second]), ['blob:1', 'blob:2'])
  assert.equal(revoke.mock.callCount(), 0)
})

test('destruction during screenshot await preserves its result without download or event', async (t) => {
  const f = fixture(t)
  const promise = f.art.screenshot()
  f.scope.dispose()
  assert.equal(await promise, 'data:image/png;base64,frame')
  assert.deepEqual(f.calls, [['draw', f.video, 0, 0]])
})

test('source replacement during screenshot await suppresses stale download and event', async (t) => {
  const f = fixture(t)
  const promise = f.art.screenshot()
  beginSource(f.art)
  assert.equal(await promise, 'data:image/png;base64,frame')
  assert.deepEqual(f.calls, [['draw', f.video, 0, 0]])
})
