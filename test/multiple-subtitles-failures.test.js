import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Historical failures use the repository Node runner.
import test from 'node:test'
import { loadModules } from './helpers/load.js'
import { multipleSubtitlesEnvironment, multipleSubtitlesHistorical, subtitleVtt } from './helpers/multiple-subtitles.js'

const implementations = await multipleSubtitlesHistorical()
const coreUtils = await loadModules({
  getExt: { file: 'packages/artplayer/src/utils/file', name: 'getExt' },
  srtToVtt: { file: 'packages/artplayer/src/utils/subtitle', name: 'srtToVtt' },
  assToVtt: { file: 'packages/artplayer/src/utils/subtitle', name: 'assToVtt' },
})
const subtitle = (url = 'a.vtt', name = 'a') => ({ url, name })
const options = (...subtitles) => ({ subtitles })
function deferred() {
  let resolve
  let reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
async function flush() {
  for (let step = 0; step < 6; step++)
    await Promise.resolve()
}
const cues = rows => `WEBVTT\n\n${rows.map(([start, end, text]) => `00:0${start}.000 --> 00:0${end}.000\n${text}\n`).join('\n')}`
const starts = text => [...text.matchAll(/^(\d{2}:\d{2}\.\d{3}) -->/gm)].map(match => match[1])

for (const implementation of implementations) {
  const create = setup => multipleSubtitlesEnvironment(implementation, setup)
  const oldMerge = implementation.version === '1.0.0'

  test(`Multiple-subtitles ${implementation.name} failure baseline: actual core converters accept SRT, ASS and encoded VTT`, async () => {
    const responses = {
      'srt.SRT?track=1': '1\n00:00:00,000 --> 00:00:02,000\nSRT text\n',
      'a.ass': 'Dialogue: 0,0:00:00.00,0:00:02.00,Default,,0,0,0,,ASS text',
      'latin.vtt': Buffer.from(subtitleVtt('café'), 'latin1'),
      'utf16.vtt': Buffer.from(subtitleVtt('日本語'), 'utf16le'),
    }
    const env = create({ responses, coreUtils })
    await env.factory(options(subtitle('srt.SRT?track=1', 'srt'), subtitle('a.ass', 'ass'), { ...subtitle('latin.vtt', 'latin'), encoding: 'windows-1252' }, { ...subtitle('utf16.vtt', 'utf16'), encoding: 'utf-16le' }))(env.art)
    const text = env.utils.unescape(await env.latestText())
    for (const expected of ['SRT text', 'ASS text', 'café', '日本語'])
      assert(text.includes(expected))
    assert.equal(starts(text).length, oldMerge ? 1 : 4)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: response order does not reorder tracks`, async () => {
    const first = deferred()
    const second = deferred()
    const env = create({ fetchResponse: url => url === 'a.vtt' ? first.promise : second.promise })
    const pending = env.factory(options(subtitle(), subtitle('b.vtt', 'b')))(env.art)
    second.resolve(env.responseFor('b.vtt'))
    await flush()
    assert.equal(env.initialized.length, 0)
    first.resolve(env.responseFor('a.vtt'))
    await pending
    const text = env.utils.unescape(await env.latestText())
    assert(text.indexOf('art-subtitle-a') < text.indexOf('art-subtitle-b'))
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: fetch rejection preserves error while sibling work continues`, async () => {
    const error = new Error('fetch failed')
    const sibling = deferred()
    let bodyRead = false
    const env = create({ fetchResponse: url => url === 'a.vtt' ? Promise.reject(error) : sibling.promise })
    await assert.rejects(env.factory(options(subtitle(), subtitle('b.vtt', 'b')))(env.art), caught => caught === error)
    assert.equal(env.initialized.length, 0)
    assert.deepEqual(env.requestOptions, [undefined, undefined])
    sibling.resolve({ arrayBuffer: async () => {
      bodyRead = true
      return new TextEncoder().encode(subtitleVtt('late')).buffer
    } })
    await flush()
    assert.equal(bodyRead, true)
    assert.equal(env.blobs.size, 0)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: HTTP errors with parseable bodies still mount`, async () => {
    const env = create({ fetchResponse: (_url, _options, responseFor) => ({ ...responseFor('a.vtt'), ok: false, status: 404 }) })
    await env.factory(options(subtitle()))(env.art)
    assert.equal(env.initialized.length, 1)
    assert((await env.latestText()).includes('a.vtt'))
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: body and decoder errors reject before allocating URLs`, async () => {
    const error = new Error('body failed')
    const env = create({ fetchResponse: () => ({ arrayBuffer: async () => {
      throw error
    } }) })
    await assert.rejects(env.factory(options(subtitle()))(env.art), caught => caught === error)
    assert.equal(env.blobs.size, 0)
    const invalid = create()
    await assert.rejects(invalid.factory(options({ ...subtitle(), encoding: 'invalid-encoding-label' }))(invalid.art), { name: 'RangeError' })
    assert.equal(invalid.blobs.size, 0)
    assert.equal(invalid.initialized.length, 0)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: missing names throw before replacing the active URL`, async () => {
    const env = create()
    const result = await env.factory(options(subtitle()))(env.art)
    assert.throws(() => result.tracks(['missing']), { name: 'TypeError' })
    assert.deepEqual(env.revoked, [''])
    assert.equal(env.liveBlobs.has('blob:subtitle-1'), true)
    result.reset()
    assert.equal(env.initialized.length, 2)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: duplicate names select the first parsed track`, async () => {
    const env = create({ responses: { 'a.vtt': subtitleVtt('First text'), 'b.vtt': subtitleVtt('Second text') } })
    const result = await env.factory(options(subtitle('a.vtt', 'same'), subtitle('b.vtt', 'same')))(env.art)
    result.tracks(['same'])
    const text = await env.latestText()
    assert(text.includes('First text'))
    assert(!text.includes('Second text'))
    result.reset()
    assert((await env.latestText()).includes('Second text'))
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: a shorter later track exposes the old index merge failure`, async () => {
    const env = create({ responses: { 'a.vtt': cues([[0, 2, 'A'], [3, 5, 'B']]), 'b.vtt': subtitleVtt('C') } })
    const pending = env.factory(options(subtitle(), subtitle('b.vtt', 'b')))(env.art)
    if (oldMerge) {
      await assert.rejects(pending, { name: 'TypeError' })
      assert.equal(env.blobs.size, 0)
    }
    else {
      await pending
      assert.equal(starts(await env.latestText()).length, 3)
    }
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: a longer later track used to lose its tail`, async () => {
    const env = create({ responses: { 'a.vtt': subtitleVtt('A'), 'b.vtt': cues([[0, 2, 'B'], [3, 5, 'Tail']]) } })
    await env.factory(options(subtitle(), subtitle('b.vtt', 'b')))(env.art)
    const text = await env.latestText()
    assert.equal(text.includes('Tail'), !oldMerge)
    assert.equal(starts(text).length, oldMerge ? 1 : 3)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: each track sorts internally without globally sorting the merge`, async () => {
    const env = create({ responses: { 'a.vtt': cues([[2, 6, 'A2'], [0, 4, 'A0']]), 'b.vtt': cues([[5, 7, 'B5'], [1, 3, 'B1']]) } })
    await env.factory(options(subtitle(), subtitle('b.vtt', 'b')))(env.art)
    assert.deepEqual(starts(await env.latestText()), oldMerge
      ? ['00:00.000', '00:02.000']
      : ['00:00.000', '00:02.000', '00:01.000', '00:05.000'])
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: parser diagnostics are discarded but usable cues survive`, async () => {
    const env = create({ responses: { 'a.vtt': subtitleVtt('usable').replace('WEBVTT', 'BAD HEADER') } })
    await env.factory(options(subtitle()))(env.art)
    assert((await env.latestText()).includes('usable'))
    const empty = create({ responses: { 'a.vtt': 'WEBVTT\n\n', 'unknown.bin': 'not subtitles' } })
    await empty.factory(options(subtitle(), subtitle('unknown.bin', 'unknown')))(empty.art)
    assert.equal(await empty.latestText(), 'WEBVTT\n\n')
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: destroy while fetching still permits late registration and leaks its URL`, async () => {
    const request = deferred()
    const env = create({ fetchResponse: () => request.promise })
    let settled = false
    const pending = env.factory(options(subtitle()))(env.art).then((result) => {
      settled = true
      return result
    })
    env.emit('destroy')
    await flush()
    assert.equal(settled, false)
    assert.equal(env.requestOptions[0], undefined)
    request.resolve(env.responseFor('a.vtt'))
    assert.equal((await pending).name, 'multipleSubtitles')
    assert.deepEqual(env.initStates, [{ destroyed: true }])
    assert.equal(env.liveBlobs.size, 1)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: destroy during body decoding also permits late installation`, async () => {
    const body = deferred()
    const started = deferred()
    const env = create({ fetchResponse: () => ({ arrayBuffer: () => {
      started.resolve()
      return body.promise
    } }) })
    const pending = env.factory(options(subtitle()))(env.art)
    await started.promise
    env.emit('destroy')
    body.resolve(new TextEncoder().encode(subtitleVtt('late body')).buffer)
    await pending
    assert.deepEqual(env.initStates, [{ destroyed: true }])
    assert.equal(env.liveBlobs.size, 1)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: retained methods allocate new URLs after destroy`, async () => {
    const env = create()
    const result = await env.factory(options(subtitle()))(env.art)
    env.emit('destroy')
    assert.equal(env.liveBlobs.has('blob:subtitle-1'), true)
    assert.equal(result.tracks([]), undefined)
    result.reset()
    assert.deepEqual(env.initStates, [{ destroyed: false }, { destroyed: true }, { destroyed: true }])
    assert.equal(env.liveBlobs.has('blob:subtitle-3'), true)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: synchronous subtitle init failure leaves its new URL owned by nobody`, async () => {
    const error = new Error('init failed')
    const env = create({ onInit: () => {
      throw error
    } })
    await assert.rejects(env.factory(options(subtitle()))(env.art), caught => caught === error)
    assert.equal(env.liveBlobs.size, 1)
    assert.equal(env.art.option.subtitle.escape, false)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: registration ignores an observed asynchronous init rejection`, async () => {
    const error = new Error('async init failed')
    const errors = []
    const env = create({ onInit: () => {
      const rejected = Promise.reject(error)
      rejected.catch(caught => errors.push(caught))
      return rejected
    } })
    assert.equal((await env.factory(options(subtitle()))(env.art)).name, 'multipleSubtitles')
    await flush()
    assert.deepEqual(errors, [error])
    assert.equal(env.liveBlobs.size, 1)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: URL allocation failure happens after revoking the prior active URL`, async () => {
    const error = new Error('allocation failed')
    let calls = 0
    const env = create({ onCreate: () => {
      if (++calls === 2)
        throw error
    } })
    const result = await env.factory(options(subtitle()))(env.art)
    assert.throws(() => result.reset(), caught => caught === error)
    assert.equal(env.liveBlobs.size, 0)
    assert.equal(env.initialized.length, 1)
    assert.deepEqual(env.revoked, ['', 'blob:subtitle-1'])
    result.reset()
    assert.equal(env.liveBlobs.size, 1)
  })

  test(`Multiple-subtitles ${implementation.name} failure baseline: metadata remains live after download and restart does not reload`, async () => {
    const request = deferred()
    const env = create({ fetchResponse: () => request.promise })
    const entry = subtitle()
    const pending = env.factory(options(entry))(env.art)
    entry.name = 'renamed'
    request.resolve(env.responseFor('a.vtt'))
    const result = await pending
    env.art.option.url = 'next.mp4'
    env.emit('restart')
    result.tracks(['renamed'])
    assert(env.utils.unescape(await env.latestText()).includes('art-subtitle-renamed'))
    assert.deepEqual(env.requests, ['a.vtt'])
  })
}
