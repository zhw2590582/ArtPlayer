import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Lifecycle regressions use the repository Node runner.
import test from 'node:test'
import { multipleSubtitlesCandidate, multipleSubtitlesEnvironment, subtitleVtt } from './helpers/multiple-subtitles.js'

const candidate = await multipleSubtitlesCandidate()
const create = options => multipleSubtitlesEnvironment(candidate, options)
const options = { subtitles: [{ url: 'a.vtt', name: 'a' }] }
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
  for (let index = 0; index < 20; index++)
    await Promise.resolve()
}
function empty(env) {
  assert.equal(env.liveBlobs.size, 0)
  for (const listeners of env.listeners.values()) assert.equal(listeners.size, 0)
}

for (const abortController of [true, false]) {
  for (const phase of ['fetch', 'body']) {
    test(`Multiple subtitles candidate: destroy cancels ${phase}, AbortController=${abortController}`, async () => {
      const held = deferred()
      const started = deferred()
      const env = create({ abortController, fetchResponse: (_url, _options, responseFor) => {
        if (phase === 'fetch') {
          started.resolve()
          return held.promise
        }
        return { ...responseFor('a.vtt'), arrayBuffer() {
          started.resolve()
          return held.promise
        } }
      } })
      const pending = env.factory(options)(env.art)
      await started.promise
      env.emit('destroy')
      const result = await pending
      assert.equal(result.name, 'multipleSubtitles')
      assert.equal(result.reset(), undefined)
      assert.equal(result.tracks(['missing']), undefined)
      assert.equal(env.requestOptions[0]?.signal.aborted, abortController ? true : undefined)
      assert.equal(env.initialized.length, 0)
      empty(env)
      held.reject(new Error('late rejected operation'))
      await flush()
      assert.equal(env.initialized.length, 0)
      assert.equal(env.warnings.length, 0)
    })
  }
}

test('Multiple subtitles candidate: already destroyed hosts do not request or subscribe', async () => {
  const env = create()
  env.emit('destroy')
  const result = await env.factory(options)(env.art)
  result.reset()
  assert.equal(env.requests.length, 0)
  assert.equal(env.initialized.length, 0)
  empty(env)
})

test('Multiple subtitles candidate: failed request preserves error identity and cancels a sibling body', async () => {
  const failed = deferred()
  const body = deferred()
  const started = deferred()
  const error = new Error('network failed')
  const env = create({ fetchResponse: url => url === 'a.vtt'
    ? failed.promise
    : { ok: true, arrayBuffer() {
        started.resolve()
        return body.promise
      } } })
  const pending = env.factory({ subtitles: [...options.subtitles, { url: 'b.vtt', name: 'b' }] })(env.art)
  await started.promise
  failed.reject(error)
  await assert.rejects(pending, caught => caught === error)
  assert.equal(env.requestOptions[1].signal.aborted, true)
  body.resolve(new TextEncoder().encode(subtitleVtt('late')).buffer)
  await flush()
  assert.equal(env.initialized.length, 0)
  empty(env)
})

test('Multiple subtitles candidate: HTTP failure rejects without reading or installing its body', async () => {
  let read = false
  const env = create({ fetchResponse: () => ({ ok: false, status: 404, arrayBuffer() {
    read = true
  } }) })
  await assert.rejects(env.factory(options)(env.art), { message: 'Failed to fetch multiple subtitles: HTTP 404' })
  assert.equal(read, false)
  assert.equal(env.requestOptions[0].signal.aborted, true)
  assert.equal(env.initialized.length, 0)
  empty(env)
})

test('Multiple subtitles candidate: body failure and bad encoding release registration resources', async () => {
  const error = new Error('body failed')
  const env = create({ fetchResponse: () => ({ ok: true, arrayBuffer: () => Promise.reject(error) }) })
  await assert.rejects(env.factory(options)(env.art), caught => caught === error)
  empty(env)
  const invalid = create()
  await assert.rejects(invalid.factory({ subtitles: [{ ...options.subtitles[0], encoding: 'invalid-label' }] })(invalid.art), { name: 'RangeError' })
  empty(invalid)
})

test('Multiple subtitles candidate: destroy releases the last URL and makes retained methods inert', async () => {
  const env = create()
  const result = await env.factory(options)(env.art)
  env.emit('destroy')
  env.emit('destroy')
  assert.equal(result.reset(), undefined)
  assert.equal(result.tracks(), undefined)
  assert.deepEqual(env.revoked, ['blob:subtitle-1'])
  assert.equal(env.initialized.length, 1)
  empty(env)
})

test('Multiple subtitles candidate: allocation failure preserves the old URL and reset recovers', async () => {
  let calls = 0
  const error = new Error('allocation failed')
  const env = create({ onCreate() {
    if (++calls === 2)
      throw error
  } })
  const result = await env.factory(options)(env.art)
  assert.throws(() => result.reset(), caught => caught === error)
  assert.equal(env.liveBlobs.has('blob:subtitle-1'), true)
  assert.equal(env.revoked.length, 0)
  result.reset()
  assert.deepEqual([...env.liveBlobs.keys()], ['blob:subtitle-2'])
  env.emit('destroy')
  empty(env)
})

test('Multiple subtitles candidate: synchronous initial host failure rolls back escape and frees the new URL', async () => {
  const error = new Error('init failed')
  const env = create({ onInit() {
    throw error
  } })
  await assert.rejects(env.factory(options)(env.art), caught => caught === error)
  assert.equal(env.art.option.subtitle.escape, true)
  empty(env)
})

test('Multiple subtitles candidate: a failed synchronous replacement retains the previous resource', async () => {
  let calls = 0
  const error = new Error('replacement failed')
  const env = create({ onInit() {
    if (++calls === 2)
      throw error
  } })
  const result = await env.factory(options)(env.art)
  assert.throws(() => result.reset(), caught => caught === error)
  assert.deepEqual([...env.liveBlobs.keys()], ['blob:subtitle-1'])
  result.reset()
  assert.deepEqual([...env.liveBlobs.keys()], ['blob:subtitle-3'])
  env.emit('destroy')
  empty(env)
})

test('Multiple subtitles candidate: host media loading does not delay registration or change void selection', async () => {
  const held = deferred()
  const env = create({ onInit: () => held.promise })
  const result = await env.factory(options)(env.art)
  assert.equal(result.name, 'multipleSubtitles')
  assert.equal(result.reset(), undefined)
  assert.equal(env.initialized.length, 2)
  held.resolve()
  await flush()
  assert.deepEqual([...env.liveBlobs.keys()], ['blob:subtitle-2'])
  env.emit('destroy')
  empty(env)
})

test('Multiple subtitles candidate: asynchronous rejection is observed and only frees its own URL', async () => {
  const operations = [deferred(), deferred()]
  let calls = 0
  const env = create({ onInit: () => operations[calls++].promise })
  const result = await env.factory(options)(env.art)
  result.reset()
  operations[0].reject(new Error('stale failure'))
  await flush()
  assert.deepEqual([...env.liveBlobs.keys()], ['blob:subtitle-2'])
  operations[1].reject(new Error('current failure'))
  await flush()
  assert.equal(env.liveBlobs.size, 0)
  assert.equal(env.warnings.length, 2)
  env.emit('destroy')
  empty(env)
})

test('Multiple subtitles candidate: destroy in host init does not install resources again', async () => {
  const env = create({ onInit() {
    env.emit('destroy')
  } })
  const result = await env.factory(options)(env.art)
  result.reset()
  assert.equal(env.initialized.length, 1)
  assert.deepEqual(env.revoked, ['blob:subtitle-1'])
  empty(env)
})

test('Multiple subtitles candidate: reentrant selection keeps only the newest resource', async () => {
  let result
  let reenter = false
  const env = create({ onInit() {
    if (reenter) {
      reenter = false
      result.tracks([])
    }
  } })
  result = await env.factory(options)(env.art)
  reenter = true
  result.reset()
  assert.deepEqual([...env.liveBlobs.keys()], ['blob:subtitle-3'])
  assert.equal(await env.latestText(), 'WEBVTT\n\n')
  env.emit('destroy')
  empty(env)
})

test('Multiple subtitles candidate: unknown names throw before allocation and do not corrupt later resets', async () => {
  const env = create()
  const result = await env.factory(options)(env.art)
  assert.throws(() => result.tracks(['missing']), { name: 'TypeError' })
  assert.deepEqual([...env.liveBlobs.keys()], ['blob:subtitle-1'])
  result.reset()
  assert.equal((env.utils.unescape(await env.latestText()).match(/<div/g) || []).length, 1)
  env.emit('destroy')
  empty(env)
})

test('Multiple subtitles candidate: destroy during allocation releases the returned URL immediately', async () => {
  const env = create({ onCreate() {
    env.emit('destroy')
  } })
  await env.factory(options)(env.art)
  assert.equal(env.initialized.length, 0)
  empty(env)
})

test('Multiple subtitles candidate: throwing live configuration preserves the old resource', async () => {
  const env = create()
  const result = await env.factory(options)(env.art)
  const old = env.art.option.subtitle
  const error = new Error('configuration getter failed')
  Object.defineProperty(env.art.option, 'subtitle', { configurable: true, get() {
    throw error
  } })
  assert.throws(() => result.reset(), caught => caught === error)
  assert.deepEqual([...env.liveBlobs.keys()], ['blob:subtitle-1'])
  Object.defineProperty(env.art.option, 'subtitle', { value: old })
  result.reset()
  env.emit('destroy')
  empty(env)
})

test('Multiple subtitles candidate: destroy from live configuration stops the following init', async () => {
  const env = create()
  const result = await env.factory(options)(env.art)
  Object.defineProperty(env.art.option.subtitle, 'style', { enumerable: true, get() {
    env.emit('destroy')
    return {}
  } })
  result.reset()
  assert.equal(env.initialized.length, 1)
  empty(env)
})

test('Multiple subtitles candidate: reentrant successful selection survives the outer host error', async () => {
  let result
  let reenter = false
  const error = new Error('outer init failed')
  const env = create({ onInit() {
    if (reenter) {
      reenter = false
      result.tracks([])
      throw error
    }
  } })
  result = await env.factory(options)(env.art)
  reenter = true
  assert.throws(() => result.reset(), caught => caught === error)
  assert.deepEqual([...env.liveBlobs.keys()], ['blob:subtitle-3'])
  env.emit('destroy')
  empty(env)
})

test('Multiple subtitles candidate: late host rejection after destroy is handled without another write', async () => {
  const host = deferred()
  const env = create({ onInit: () => host.promise })
  await env.factory(options)(env.art)
  env.emit('destroy')
  host.reject(new Error('late host failure'))
  await flush()
  assert.equal(env.warnings.length, 0)
  assert.equal(env.initialized.length, 1)
  assert.deepEqual(env.revoked, ['blob:subtitle-1'])
  empty(env)
})

test('Multiple subtitles candidate: destroy from a URL getter stops the request before dispatch', async () => {
  const env = create()
  const entry = { name: 'a', get url() {
    env.emit('destroy')
    return 'a.vtt'
  } }
  await env.factory({ subtitles: [entry] })(env.art)
  assert.equal(env.requests.length, 0)
  assert.equal(env.initialized.length, 0)
  empty(env)
})
