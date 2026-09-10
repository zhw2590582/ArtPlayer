import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Exercise resource promises with Node's test runner.
import { test as it } from 'node:test'
import { loadModules } from './helpers/load.js'

const { ResourceScope, SubtitleRequest, parseSubtitle, subtitleOffsetMix, beginLifecycle, initSubtitleState, replaceSubtitleTrack } = await loadModules({
  ResourceScope: 'packages/artplayer/src/lifecycle/scope',
  SubtitleRequest: 'packages/artplayer/src/subtitle/request',
  parseSubtitle: { file: 'packages/artplayer/src/subtitle/parse', name: 'parseSubtitle' },
  subtitleOffsetMix: 'packages/artplayer/src/player/subtitleOffsetMix',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  initSubtitleState: { file: 'packages/artplayer/src/subtitle/state', name: 'initSubtitleState' },
  replaceSubtitleTrack: { file: 'packages/artplayer/src/subtitle/track', name: 'replaceSubtitleTrack' },
})

it('subtitle track attribute failure releases its new scope and preserves the original error', () => {
  const original = globalThis.document
  const error = new Error('label getter failed')
  const view = { art: { option: { subtitle: { get name() {
    throw error
  } } }, template: { $track: { parentNode: null, nextSibling: null } } } }
  beginLifecycle(view.art)
  const state = initSubtitleState(view, view.art)
  const child = state.scope.child.bind(state.scope)
  let open = 0
  state.scope.child = () => {
    const scope = child()
    open += 1
    scope.add(() => {
      open -= 1
    })
    return scope
  }
  try {
    globalThis.document = { createElement: () => ({ track: {}, remove() {} }) }
    for (let attempt = 0; attempt < 3; attempt++) {
      assert.throws(() => replaceSubtitleTrack(view, 'metadata', '/test.vtt'), caught => caught === error)
      assert.equal(open, 0)
    }
  }
  finally {
    state.scope.dispose()
    globalThis.document = original
  }
})

it('subtitle requests settle immediately on cancel, ignore late resolution and abort transport', async () => {
  const root = new ResourceScope()
  const request = new SubtitleRequest(root)
  let resolve
  const result = request.run(() => new Promise((done) => {
    resolve = done
  }))
  request.cancel()
  assert.equal(await result, undefined)
  assert.equal(request.signal.aborted, true)
  resolve('late')
  root.dispose()
})

it('subtitle cancellation observes late rejection without rejecting the cancelled caller', async () => {
  const root = new ResourceScope()
  const request = new SubtitleRequest(root)
  let reject
  const result = request.run(() => new Promise((_resolve, fail) => {
    reject = fail
  }))
  root.dispose()
  assert.equal(await result, undefined)
  reject(new Error('late failure'))
  await new Promise(resolve => setImmediate(resolve))
})

it('subtitle successful value and active rejection retain their identity', async () => {
  const root = new ResourceScope()
  const value = {}
  assert.equal(await new SubtitleRequest(root).run(async () => value), value)
  const error = new Error('active failure')
  await assert.rejects(new SubtitleRequest(root).run(async () => {
    throw error
  }), caught => caught === error)
  root.dispose()
})

it('subtitle closed roots never execute work and repeated cancellation is harmless', async () => {
  const root = new ResourceScope()
  root.dispose()
  const request = new SubtitleRequest(root)
  let calls = 0
  assert.equal(await request.run(async () => {
    calls += 1
  }), undefined)
  request.cancel()
  request.cancel()
  assert.equal(calls, 0)
})

it('subtitle requests still cancel without AbortController', async () => {
  const original = globalThis.AbortController
  try {
    globalThis.AbortController = undefined
    const root = new ResourceScope()
    const request = new SubtitleRequest(root)
    assert.equal(request.signal, undefined)
    const result = request.run(() => new Promise(() => {}))
    root.dispose()
    assert.equal(await result, undefined)
  }
  finally {
    globalThis.AbortController = original
  }
})

it('subtitle conversion keeps callback this, encoded text and inferred extension', () => {
  const option = { url: '/sub.SRT?token=1', encoding: 'utf-8', type: '', onVttLoad(vtt) {
    assert.equal(this, option)
    return `${vtt}NOTE transformed\n`
  } }
  const buffer = new TextEncoder().encode('1\n00:00:00,1 --> 00:00:01,23\nHello\n').buffer
  const result = parseSubtitle(buffer, option)
  assert.match(result.vtt, /00:00:00\.100 --> 00:00:01\.230/)
  assert.match(result.vtt, /NOTE transformed/)
  const latin = parseSubtitle(Uint8Array.from([0x63, 0x61, 0x66, 0xE9]).buffer, { ...option, type: 'vtt', encoding: 'windows-1252', onVttLoad: value => value })
  assert.equal(latin.vtt, 'café')
})

it('subtitle pass-through skips conversion callback; invalid decoder and callback errors propagate', () => {
  const buffer = new ArrayBuffer(0)
  assert.equal(parseSubtitle(buffer, { url: '/subtitle.unknown', encoding: 'utf-8', onVttLoad() {
    assert.fail('unexpected callback')
  } }), undefined)
  assert.throws(() => parseSubtitle(buffer, { url: '/subtitle.vtt', encoding: 'invalid-encoding' }), RangeError)
  const error = new Error('callback failure')
  assert.throws(() => parseSubtitle(buffer, { url: '/subtitle.vtt', onVttLoad() {
    throw error
  } }), caught => caught === error)
  // Unknown formats and invalid JS callback return values must remain distinct paths.
  assert.deepEqual(parseSubtitle(buffer, { url: '/subtitle.vtt', onVttLoad() {} }), { vtt: undefined })
})

it('subtitle offsets preserve cue identity and original bounds across repeated changes', () => {
  const cue = { startTime: 1, endTime: 5 }
  const events = []
  const art = { template: { $track: {} }, duration: 8, subtitle: { cues: [cue], update() {
    events.push('update')
  } }, notice: {}, i18n: { get: key => key }, emit: (...args) => events.push(args) }
  subtitleOffsetMix(art)
  art.subtitleOffset = 2
  assert.deepEqual(cue, { startTime: 3, endTime: 7, originalStartTime: 1, originalEndTime: 5 })
  art.subtitleOffset = -3
  assert.deepEqual(cue, { startTime: 0, endTime: 2, originalStartTime: 1, originalEndTime: 5 })
  assert.equal(art.subtitleOffset, -3)
  assert.equal(art.notice.show, 'Subtitle Offset: -3s')
  assert.deepEqual(events, ['update', ['subtitleOffset', 2], 'update', ['subtitleOffset', -3]])
  art.subtitleOffset = 20
  assert.equal(art.subtitleOffset, 10)
  assert.equal(art.notice.show, 'Subtitle Offset: 20s')
})

it('subtitle offsets with no cues retain the default state and do not notify', () => {
  const art = { template: {}, subtitle: { cues: [], update() {
    assert.fail()
  } }, notice: {}, i18n: { get() {
    assert.fail()
  } }, emit() {
    assert.fail()
  } }
  subtitleOffsetMix(art)
  art.subtitleOffset = 1
  assert.equal(art.subtitleOffset, 0)
  assert.equal(Object.hasOwn(art.notice, 'show'), false)
})
