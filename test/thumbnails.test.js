import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { thumbnailsMix, Emitter, beginLifecycle, getScope, beginSource, ownEntry, releaseEntry, loadImg, loadThumbnailImage } = await loadModules({
  thumbnailsMix: 'packages/artplayer/src/player/thumbnailsMix',
  Emitter: 'packages/artplayer/src/utils/emitter',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
  beginSource: { file: 'packages/artplayer/src/source/operation', name: 'beginSource' },
  ownEntry: { file: 'packages/artplayer/src/component/resources', name: 'ownEntry' },
  releaseEntry: { file: 'packages/artplayer/src/component/resources', name: 'releaseEntry' },
  loadImg: { file: 'packages/artplayer/src/image/load', name: 'loadImg' },
  loadThumbnailImage: { file: 'packages/artplayer/src/image/load', name: 'loadThumbnailImage' },
})

const flush = () => new Promise(resolve => setImmediate(resolve))

function fixture(t, overrides = {}) {
  const images = []
  const callbacks = []
  const errors = []
  const revoked = []
  const warnings = []
  class FakeImage {
    width = 1000
    height = 600
    naturalWidth = 1000
    src = ''
    onload = null
    onerror = null
    constructor() {
      images.push(this)
    }

    removeAttribute(name) {
      if (name === 'src')
        this.src = ''
    }
  }
  const canvas = { width: 0, height: 0, getContext: () => ({ drawImage() {} }), toBlob: callback => callbacks.push(callback) }
  for (const [name, value] of Object.entries({ Image: FakeImage, document: { createElement: () => canvas } })) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, name)
    Object.defineProperty(globalThis, name, { configurable: true, value })
    t.after(() => previous ? Object.defineProperty(globalThis, name, previous) : delete globalThis[name])
  }
  t.mock.method(URL, 'createObjectURL', () => 'blob:thumbnail')
  t.mock.method(URL, 'revokeObjectURL', url => revoked.push(url))
  t.mock.method(console, 'warn', (...args) => warnings.push(args))
  const art = Object.assign(new Emitter(), {
    option: { thumbnails: { url: 'first.png', number: 100, column: 10, width: 100, height: 60, scale: 1, ...overrides }, isLive: false },
    template: { $progress: { clientWidth: 1000 }, $video: { videoWidth: 320, videoHeight: 180 } },
    controls: { thumbnails: { style: {} } },
  })
  beginLifecycle(art)
  ownEntry(art, art.controls.thumbnails)
  thumbnailsMix(art)
  function bar(kind, percentage, event) {
    for (const listener of art.e?.setBar || []) {
      const result = listener.fn(kind, percentage, event)
      if (result?.catch)
        result.catch(error => errors.push(error))
    }
  }
  return { art, canvas, images, callbacks, errors, revoked, warnings, scope: getScope(art), bar, hover: percentage => bar('hover', percentage) }
}

test('thumbnail setter preserves option identity, live restrictions and immutable descriptor', (t) => {
  const f = fixture(t)
  const descriptor = Object.getOwnPropertyDescriptor(f.art, 'thumbnails')
  assert.equal(descriptor.enumerable, false)
  assert.equal(descriptor.configurable, false)
  const option = { url: 'next.png', number: 4 }
  f.art.thumbnails = option
  assert.equal(f.art.thumbnails, option)
  f.art.thumbnails = { url: '' }
  assert.equal(f.art.thumbnails, option)
  f.art.option.isLive = true
  f.art.thumbnails = { url: 'live.png' }
  assert.equal(f.art.thumbnails, option)
})

test('thumbnail layout matches generated sprite cells and preserves progress endpoint handling', async (t) => {
  const f = fixture(t)
  f.hover(0.1)
  f.images[0].onload()
  await flush()
  const style = f.art.controls.thumbnails.style
  assert.deepEqual(style, { backgroundImage: 'url(first.png)', height: '60px', width: '100px', backgroundPosition: '-0px -60px', left: '50px' })
  f.hover(0.11)
  assert.equal(style.backgroundPosition, '-100px -60px')
  const before = { ...style }
  f.hover(0)
  f.hover(1)
  f.hover(Number.NaN)
  assert.deepEqual(style, before)
  f.hover(0.001)
  assert.equal(style.backgroundPosition, '-0px -0px')
  assert.equal(style.left, 0)
  f.hover(0.999)
  assert.equal(style.backgroundPosition, '-900px -540px')
  assert.equal(style.left, '900px')
})

test('replaced thumbnail configuration cannot be overwritten by an older completed load', async (t) => {
  const f = fixture(t)
  f.hover(0.2)
  const oldLoad = f.images[0].onload
  f.art.thumbnails = { ...f.art.thumbnails, url: 'second.png' }
  f.hover(0.4)
  f.images[1].onload()
  await flush()
  oldLoad()
  await flush()
  assert.equal(f.art.controls.thumbnails.style.backgroundImage, 'url(second.png)')
})

test('failed thumbnail load can retry and does not escape the internal event handler', async (t) => {
  const f = fixture(t)
  f.hover(0.2)
  f.images[0].onerror()
  await flush()
  f.hover(0.3)
  assert.equal(f.images.length, 2)
  f.images[1].onload()
  await flush()
  assert.equal(f.art.controls.thumbnails.style.backgroundImage, 'url(first.png)')
  assert.deepEqual(f.errors, [])
})

test('destroy cancels pending thumbnail rendering and removes its setBar subscription', async (t) => {
  const f = fixture(t)
  f.hover(0.2)
  const loaded = f.images[0].onload
  f.scope.dispose()
  loaded()
  await flush()
  assert.deepEqual(f.art.controls.thumbnails.style, {})
  assert.equal(f.art.e?.setBar?.length || 0, 0)
})

test('scaled thumbnail Blob URL is released once on configuration replacement', async (t) => {
  const f = fixture(t, { scale: 0.5 })
  f.hover(0.2)
  f.images[0].onload()
  f.callbacks[0](new Blob(['image']))
  f.images[1].onload()
  await flush()
  assert.equal(f.art.controls.thumbnails.style.backgroundImage, 'url(blob:thumbnail)')
  f.art.thumbnails = { ...f.art.thumbnails, url: 'next.png' }
  assert.deepEqual(f.revoked, ['blob:thumbnail'])
  f.scope.dispose()
  assert.deepEqual(f.revoked, ['blob:thumbnail'])
})

test('pending load renders only the latest hover and suppresses stale source coordinates', async (t) => {
  const f = fixture(t)
  f.hover(0.2)
  f.hover(0.7)
  f.images[0].onload()
  await flush()
  assert.equal(f.art.controls.thumbnails.style.left, '650px')
  f.art.thumbnails = { ...f.art.thumbnails, url: 'next.png' }
  const before = { ...f.art.controls.thumbnails.style }
  f.hover(0.4)
  beginSource(f.art)
  f.images[1].onload()
  await flush()
  assert.deepEqual(f.art.controls.thumbnails.style, before)
  f.hover(0.5)
  assert.equal(f.art.controls.thumbnails.style.backgroundImage, 'url(next.png)')
})

test('removing the thumbnail control releases its image and a replacement starts a new request', async (t) => {
  const f = fixture(t, { scale: 0.5 })
  f.hover(0.2)
  f.images[0].onload()
  f.callbacks[0](new Blob(['image']))
  f.images[1].onload()
  await flush()
  releaseEntry(f.art.controls.thumbnails)
  assert.deepEqual(f.revoked, ['blob:thumbnail'])
  const next = { style: {} }
  f.art.controls.thumbnails = next
  ownEntry(f.art, next)
  f.hover(0.4)
  assert.equal(f.images.length, 3)
  f.scope.dispose()
})

test('cancelled scaling cannot allocate a Blob URL from a late encoder callback', async (t) => {
  const f = fixture(t, { scale: 0.5 })
  f.hover(0.2)
  f.images[0].onload()
  f.scope.dispose()
  f.callbacks[0](new Blob(['image']))
  await flush()
  assert.equal(f.images.length, 1)
  assert.deepEqual(f.revoked, [])
  assert.deepEqual(f.art.controls.thumbnails.style, {})
})

test('configuration replacement during rendering stops remaining stale style writes', async (t) => {
  const f = fixture(t)
  let background = ''
  Object.defineProperty(f.art.controls.thumbnails.style, 'backgroundImage', {
    get: () => background,
    set(value) {
      background = value
      f.art.thumbnails = { ...f.art.thumbnails, url: 'new.png' }
    },
  })
  f.hover(0.2)
  f.images[0].onload()
  await flush()
  assert.equal(background, 'url(first.png)')
  assert.equal(f.art.controls.thumbnails.style.width, undefined)
  assert.equal(f.art.thumbnails.url, 'new.png')
})

test('public loadImg preserves function name, arity, original image and no-scaling inputs', async (t) => {
  const f = fixture(t)
  assert.equal(loadImg.name, 'loadImg')
  assert.equal(loadImg.length, 2)
  for (const scale of [undefined, 0, 1, Number.NaN]) {
    const pending = loadImg('direct.png', scale)
    const image = f.images.at(-1)
    image.onload()
    assert.equal(await pending, image)
    assert.equal(image.src, 'direct.png')
    assert.equal(image.onload, null)
    assert.equal(image.onerror, null)
  }
  assert.equal(f.callbacks.length, 0)
})

test('public scaled loadImg transfers a successfully decoded Blob URL without revoking it', async (t) => {
  const f = fixture(t)
  const pending = loadImg('public.png', 0.5)
  f.images[0].onload()
  assert.deepEqual([f.canvas.width, f.canvas.height], [500, 300])
  f.callbacks[0](new Blob(['image']))
  f.images[1].onload()
  assert.equal(await pending, f.images[1])
  f.scope.dispose()
  assert.deepEqual(f.revoked, [])
  assert.equal(f.images[1].src, 'blob:thumbnail')
})

test('internal image cancellation settles undefined and detaches the image handlers', async (t) => {
  const f = fixture(t)
  const pending = loadThumbnailImage('cancel.png', 0.5, f.scope)
  const image = f.images[0]
  const staleLoad = image.onload
  f.scope.dispose()
  assert.equal(await pending, undefined)
  assert.equal(image.onload, null)
  assert.equal(image.onerror, null)
  assert.equal(image.src, '')
  staleLoad()
  assert.equal(f.callbacks.length, 0)
  assert.equal(await loadThumbnailImage('closed.png', 1, f.scope), undefined)
  assert.equal(f.images.length, 1)
})

test('null encoding result rejects public image loading without a callback escape', async (t) => {
  const f = fixture(t)
  const pending = loadImg('empty.png', 0.5)
  const rejected = assert.rejects(pending, /Unable to encode thumbnail image/)
  f.images[0].onload()
  assert.doesNotThrow(() => f.callbacks[0](null))
  await rejected
  assert.equal(f.images.length, 1)
})

test('scaled image failure releases its Blob exactly once and preserves the original URL in errors', async (t) => {
  const f = fixture(t)
  const pending = loadThumbnailImage('failed.png', 0.5, f.scope)
  const rejected = assert.rejects(pending, { message: 'Image load failed: failed.png' })
  f.images[0].onload()
  f.callbacks[0](new Blob(['image']))
  f.images[1].onerror()
  await rejected
  assert.deepEqual(f.revoked, ['blob:thumbnail'])
  f.scope.dispose()
  assert.deepEqual(f.revoked, ['blob:thumbnail'])
})

test('image scaling preserves thrown draw errors and rejects a missing canvas context', async (t) => {
  const f = fixture(t)
  const failure = new Error('draw failed')
  f.canvas.getContext = () => ({
    drawImage() {
      throw failure
    },
  })
  const first = loadImg('first.png', 0.5)
  const rejected = assert.rejects(first, error => error === failure)
  assert.doesNotThrow(() => f.images[0].onload())
  await rejected
  f.canvas.getContext = () => null
  const second = loadImg('second.png', 0.5)
  const missing = assert.rejects(second, { name: 'TypeError', message: 'Canvas 2D context is unavailable' })
  assert.doesNotThrow(() => f.images[1].onload())
  await missing
})

test('destruction during object URL allocation revokes the URL without starting a scaled image', async (t) => {
  const f = fixture(t)
  t.mock.method(URL, 'createObjectURL', () => {
    f.scope.dispose()
    return 'blob:cancelled'
  })
  const pending = loadThumbnailImage('cancel.png', 0.5, f.scope)
  f.images[0].onload()
  f.callbacks[0](new Blob(['image']))
  assert.equal(await pending, undefined)
  assert.deepEqual(f.revoked, ['blob:cancelled'])
  assert.equal(f.images.length, 1)
})

test('destruction inside the scaled image constructor does not start a late image request', async (t) => {
  const f = fixture(t)
  const ImageClass = globalThis.Image
  Object.defineProperty(globalThis, 'Image', { configurable: true, value: class extends ImageClass {
    constructor() {
      super()
      if (f.images.length === 2)
        f.scope.dispose()
    }
  } })
  const pending = loadThumbnailImage('cancel.png', 0.5, f.scope)
  f.images[0].onload()
  f.callbacks[0](new Blob(['image']))
  assert.equal(await pending, undefined)
  assert.deepEqual(f.revoked, ['blob:thumbnail'])
  assert.equal(f.images[1].src, '')
  assert.equal(f.images[1].onload, null)
})
