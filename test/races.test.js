import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a test framework.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

// Regression tests for race-condition fixes (todo: C3, C4, N1, C12).
// Why these tests exist: rapid source/quality/subtitle switching on master lets
// stale async handlers win (progress reset, user blob URLs revoked, subtitle
// blob of the winning switch revoked). Every assertion below fails on unfixed
// code and passes after the fix.

const { outputFiles } = await build({
  stdin: {
    contents: `
      export { default as switchMix } from './packages/artplayer/src/player/switchMix.js';
      export { default as currentTimeMix } from './packages/artplayer/src/player/currentTimeMix.js';
      export { default as urlMix } from './packages/artplayer/src/player/urlMix.js';
      export { default as Subtitle } from './packages/artplayer/src/subtitle.js';
      export { default as thumbnailsMix } from './packages/artplayer/src/player/thumbnailsMix.js';
      export { default as Emitter } from './packages/artplayer/src/utils/emitter.js';
    `,
    resolveDir: fileURLToPath(new URL('../', import.meta.url)),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
})

function createVideo() {
  const timeSet = []
  return {
    src: '',
    __timeSet: timeSet,
    set currentTime(v) {
      timeSet.push(v)
    },
    get currentTime() {
      return timeSet[timeSet.length - 1] ?? 0
    },
    textTracks: [{ __listeners: {}, addEventListener(n, cb) { (this.__listeners[n] ||= []).push(cb) }, removeEventListener() {} }],
    playsInline: false,
  }
}

function createArt() {
  const handlers = {}
  const art = {
    i18n: { get: key => key },
    notice: { show: '' },
    option: {
      url: '',
      type: '',
      customType: {},
      subtitle: { url: '', name: '', type: '', style: {}, escape: true, encoding: 'utf-8', onVttLoad: v => v },
    },
    isReady: true,
    playing: true,
    playbackRate: 2,
    aspectRatio: '16:9',
    paused: true,
    playingState: true,
    pause() {},
    template: {
      $video: createVideo(),
      $track: { src: '', parentNode: { removeChild() {} } },
      $subtitle: { innerHTML: '' },
      $player: {},
    },
    controls: {},
    events: {
      proxy() {
        return () => {}
      },
      remove() {},
    },
    on(name, cb) {
      ;(handlers[name] ||= []).push(cb)
    },
    once(name, cb) {
      ;(handlers[name] ||= []).push(function onceWrapper(...args) {
        const list = handlers[name]
        const index = list.indexOf(onceWrapper)
        if (index >= 0)
          list.splice(index, 1)
        cb(...args)
      })
    },
    off() {},
    emit(name, ...args) {
      for (const cb of [...(handlers[name] || [])]) cb(...args)
    },
    __handlers: handlers,
  }
  return art
}

const flush = () => new Promise(resolve => setTimeout(resolve, 0))

test('C3: a superseded switch must not touch the new source (stale metadata seek)', async () => {
  const { switchMix, currentTimeMix } = await import(
    `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`,
  )
  const art = createArt()
  art.template.$video.play = () => Promise.resolve()
  art.play = () => Promise.resolve()
  art.duration = 100
  currentTimeMix(art)
  // Pre-seed the current position: switchQuality must restore it after switching.
  art.template.$video.currentTime = 37
  switchMix(art)

  // Start with a stale source: switchUrl('a.mp4') is immediately replaced by
  // switchQuality('b.mp4') which wants to restore currentTime = 37.
  const stale = art.switchUrl('a.mp4')
  const fresh = art.switchQuality('b.mp4')
  art.emit('video:loadedmetadata')
  art.emit('video:canplay')

  // Master bug: the stale handler also ran and seeked the new source to 0
  // between the pre-seed and the fresh restore.
  assert.deepEqual(art.template.$video.__timeSet, [37, 37])
  await Promise.allSettled([stale, fresh])
})

test('C4: switching away from a user blob url must not revoke it', async () => {
  const { urlMix } = await import(
    `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`,
  )
  const art = createArt()
  urlMix(art)

  const revoked = []
  const originalRevoke = URL.revokeObjectURL.bind(URL)
  URL.revokeObjectURL = (url) => {
    revoked.push(url)
    originalRevoke(url)
  }
  try {
    art.template.$video.src = 'blob:user-owned'
    await flush()
    art.url = 'https://example.com/video.mp4'
    await flush()
    // Master bug: revokeObjectURL was called unconditionally with the user blob.
    assert.equal(revoked.includes('blob:user-owned'), false)
    assert.equal(art.template.$video.src, 'https://example.com/video.mp4')
  }
  finally {
    URL.revokeObjectURL = originalRevoke
  }
})

test('N1: a late subtitle response must not revoke the winning subtitle blob', async () => {
  const { Subtitle } = await import(
    `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`,
  )
  const art = createArt()
  let createdTracks = 0
  const fakeDoc = {
    createElement() {
      return {
        style: {},
        src: '',
        track: {},
        __listeners: {},
        addEventListener() {},
        insertAdjacentHTML() {},
        insertAdjacentElement() {},
        appendChild() {},
        parentNode: { removeChild() {} },
      }
    },
  }
  globalThis.document = fakeDoc

  const blobUrls = []
  const revokes = []
  const originalCreate = URL.createObjectURL.bind(URL)
  const originalRevoke = URL.revokeObjectURL.bind(URL)
  URL.createObjectURL = () => {
    const url = `blob:fake-${blobUrls.length}`
    blobUrls.push(url)
    return url
  }
  URL.revokeObjectURL = (url) => {
    revokes.push(url)
    originalRevoke(url)
  }

  const waiters = []
  globalThis.fetch = url => new Promise((resolve) => {
    waiters.push({ url, resolve })
  })

  try {
    const subtitle = new Subtitle(art)
    subtitle.createTrack = function createTrack(kind, url) {
      createdTracks++
      this.art.template.$track = { src: url, parentNode: { removeChild() {} } }
    }

    const switchA = subtitle.switch('http://example.com/a.vtt')
    const switchB = subtitle.switch('http://example.com/b.vtt')
    const vtt = 'WEBVTT\n\n00:00.000 --> 00:01.000\nhi'
    // B finishes first, then the stale A response arrives.
    waiters.filter(entry => entry.url.includes('b')).forEach((entry) => {
      entry.resolve({ arrayBuffer: async () => new TextEncoder().encode(vtt).buffer })
    })
    await switchB
    waiters.splice(0).filter(entry => entry.url.includes('a')).forEach((entry) => {
      entry.resolve({ arrayBuffer: async () => new TextEncoder().encode(vtt).buffer })
    })
    await switchA

    // B resolved first, so B owns blobUrls[0]; the stale A created blobUrls[1].
    const blobB = blobUrls[0]
    const blobA = blobUrls[1]
    // Master bug: the stale A response revoked B's live subtitle blob.
    assert.equal(revokes.includes(blobB), false, 'the winning subtitle blob must survive')
    assert.equal(createdTracks, 1, 'only the winning subtitle may create a track')
    assert.ok(revokes.includes(blobA), 'the stale response must clean up its own blob')
  }
  finally {
    URL.createObjectURL = originalCreate
    URL.revokeObjectURL = originalRevoke
    delete globalThis.fetch
    delete globalThis.document
  }
})

test('C12: a failed thumbnail image must not brick hover thumbnails forever', async () => {
  const { thumbnailsMix } = await import(
    `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`,
  )
  let attempts = 0
  globalThis.Image = class {
    get src() {
      return ''
    }

    set src(_value) {
      attempts++
      setTimeout(() => this.onerror && this.onerror(), 0)
    }
  }
  const art = createArt()
  art.option.thumbnails = { url: 'http://example.com/sprite.jpg', number: 10, column: 10, width: 10, height: 10, scale: 1 }
  art.controls.thumbnails = {}
  art.template.$progress = { clientWidth: 100 }
  thumbnailsMix(art)

  const setBarHandler = art.__handlers.setBar[0]
  // Master throws on the first call (unhandled rejection), so swallow it here
  // and let the retry assertion below be the red/green discriminator.
  await setBarHandler('hover', 0.5, {}).catch(() => {})
  await flush()
  await setBarHandler('hover', 0.5, {}).catch(() => {})
  await flush()
  // Master bug: the first rejection left `loding` true forever, so the second
  // hover never even retried (attempts stayed at 1) and the rejection was
  // unhandled.
  assert.equal(attempts, 2, 'a failed thumbnail load must be retried on the next hover')
  delete globalThis.Image
})
