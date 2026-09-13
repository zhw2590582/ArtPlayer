import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Candidate parser failures require strict Node rejection checks.
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { danmukuCandidate, danmukuCandidateEnvironment } from './helpers/danmuku-candidate.js'
import { danmukuEnvironment, danmukuHistorical, deferred } from './helpers/danmuku.js'

const implementation = await danmukuCandidate()
const historical = await danmukuHistorical()
const prefix = 'artplayerPluginDanmuku:'
const xml = `<i>
<d p="1.25,1,25,16777215,123,0,user-a,42"> &quot;quote&quot; &apos;apostrophe&apos; &lt;tag&gt; &amp; &amp;lt; </d>
<d p="2,2,18,15,124,1,user-b,43">second\nline</d>
<d p="3,3,19,0,125,2,user-c,44">third</d>
<d p="4,4,20,255,126,3,user-d,45">bottom</d>
<d p="5,5,21,65535,127,4,user-e,46">top</d>
<d p="6,9,22,255,128,5,user-f,47">unknown mode</d>
<d p="1,2,3">short attributes</d>
</i>`
const expectedRows = [
  { text: '"quote" \'apostrophe\' <tag> & &lt;', time: 1.25, mode: 0, fontSize: 25, color: '#ffffff', timestamp: 123, pool: 0, userID: 'user-a', rowID: 42 },
  { text: 'second\nline', time: 2, mode: 0, fontSize: 18, color: '#f', timestamp: 124, pool: 1, userID: 'user-b', rowID: 43 },
  { text: 'third', time: 3, mode: 0, fontSize: 19, color: '#0', timestamp: 125, pool: 2, userID: 'user-c', rowID: 44 },
  { text: 'bottom', time: 4, mode: 2, fontSize: 20, color: '#ff', timestamp: 126, pool: 3, userID: 'user-d', rowID: 45 },
  { text: 'top', time: 5, mode: 1, fontSize: 21, color: '#ffff', timestamp: 127, pool: 4, userID: 'user-e', rowID: 46 },
  { text: 'unknown mode', time: 6, mode: 0, fontSize: 22, color: '#ff', timestamp: 128, pool: 5, userID: 'user-f', rowID: 47 },
]

function rows(owner) {
  return Array.from(owner.queue, item => Object.fromEntries(Object.keys(expectedRows[0]).map(key => [key, item[key]])))
}

function events(env, name) {
  return env.events.filter(event => event.name === `${prefix}${name}`)
}

async function setup(t, settings = {}, configure = () => {}) {
  const env = danmukuCandidateEnvironment(implementation, settings)
  const plugin = env.factory({ danmuku: [] })(env.art)
  t.after(() => {
    if (!env.art.isDestroy)
      env.destroy()
  })
  await env.flush()
  // Faults belong to the parser; the built inline layout Worker reads the same global.
  configure(env)
  return { env, plugin }
}

function parserWorker(env) {
  const workers = env.workers.filter(worker => env.urls.has(worker.url))
  assert.equal(workers.length, 1, 'Exactly one actual parser Blob Worker is expected')
  return workers[0]
}

function released(env, worker) {
  assert.equal(worker.terminated, true)
  assert.deepEqual(env.revoked, [worker.url])
  for (const name of ['message', 'error', 'messageerror']) {
    assert.equal(worker[`on${name}`] == null, true, `${name} property detached`)
    assert.equal((worker.listeners.get(name) || []).length, 0, `${name} listener detached`)
  }
}

function dispatch(worker, name, event) {
  worker[`on${name}`]?.(event)
  for (const listener of [...worker.listeners.get(name) || []])
    listener(event)
}

test('danmuku parser: real candidate and frozen release Blob scripts preserve XML fields, entities and mode mapping', { timeout: 10000 }, async (t) => {
  for (const candidate of [...historical, implementation]) {
    const env = candidate === implementation
      ? danmukuCandidateEnvironment(candidate, { fetch: async () => ({ text: async () => xml }) })
      : danmukuEnvironment(candidate, { fetch: async () => ({ text: async () => xml }) })
    t.after(() => env.destroy())
    const plugin = env.factory({ danmuku: [] })(env.art)
    await env.flush()
    const pending = plugin.load('/fields.xml')
    await env.flush()
    const worker = parserWorker(env)
    assert.equal(worker.messages.length, 1)
    assert.equal(worker.messages[0].message.xml, xml)
    await worker.execute(worker.messages[0].message)
    const owner = await pending
    assert.deepEqual(rows(owner), expectedRows, candidate.name)
    if (candidate === implementation)
      released(env, worker)
  }
})

for (const input of ['', '<i></i>', '<i><d p="1,2,3">invalid fields</d></i>']) {
  test(`danmuku parser: empty result settles and releases resources for ${JSON.stringify(input)}`, { timeout: 3000 }, async (t) => {
    const { env, plugin } = await setup(t, { fetch: async () => ({ text: async () => input }) })
    const loaded = events(env, 'loaded').length
    const pending = plugin.load('/empty.xml')
    await env.flush()
    const worker = parserWorker(env)
    await worker.execute(worker.messages[0].message)
    const owner = await pending
    assert.equal(owner.queue.length, 0)
    assert.equal(events(env, 'loaded').length, loaded + 1)
    assert.equal(events(env, 'error').length, 0)
    released(env, worker)
  })
}

for (const stage of ['fetch', 'text']) {
  test(`danmuku parser: ${stage} rejection preserves public error identity and emits once`, { timeout: 3000 }, async (t) => {
    const failure = new Error(`${stage}-original`)
    const { env, plugin } = await setup(t, { fetch: async () => {
      if (stage === 'fetch')
        throw failure
      return { text: async () => {
        throw failure
      } }
    } })
    const loaded = events(env, 'loaded').length
    await assert.rejects(plugin.load('/failed.xml'), error => error === failure)
    assert.deepEqual(events(env, 'error').map(event => event.args), [[failure]])
    assert.equal(events(env, 'loaded').length, loaded)
    assert.equal(env.urls.size, 0)
    assert.equal(env.workers.length, 1, 'Network failure must not allocate the parser worker')
    assert.deepEqual(env.revoked, [])
  })
}

for (const stage of ['url', 'constructor', 'postMessage', 'error', 'messageerror']) {
  test(`danmuku parser: ${stage} failure falls back to the same XML parser and releases acquired resources`, { timeout: 3000 }, async (t) => {
    const failure = new Error(`${stage}-original`)
    const { env, plugin } = await setup(t, { fetch: async () => ({ text: async () => xml }) }, (env) => {
      const NativeWorker = env.context.Worker
      if (stage === 'url') {
        env.context.URL.createObjectURL = () => {
          throw failure
        }
      }
      else if (stage === 'constructor') {
        env.context.Worker = class {
          constructor() { throw failure }
        }
      }
      else if (stage === 'postMessage') {
        env.context.Worker = class extends NativeWorker {
          postMessage() { throw failure }
        }
      }
    })
    const pending = plugin.load('/fallback.xml')
    await env.flush()
    if (stage === 'error' || stage === 'messageerror') {
      let prevented = 0
      dispatch(parserWorker(env), stage, { error: failure, message: failure.message, preventDefault() {
        prevented++
      } })
      if (stage === 'error')
        assert.equal(prevented, 1, 'Only the recovered parser Worker error is prevented locally')
    }
    const owner = await pending
    assert.deepEqual(rows(owner), expectedRows)
    assert.equal(events(env, 'error').length, 0, 'Successful fallback is not a public load error')
    assert.equal(env.consoleErrors.length, 1)
    assert.equal(env.consoleErrors[0][0], 'Error parsing Bilibili Danmu:')
    assert.equal(env.consoleErrors[0][1], failure)
    if (stage === 'url') {
      assert.equal(env.urls.size, 0)
      assert.deepEqual(env.revoked, [])
    }
    else if (stage === 'constructor') {
      assert.equal(env.urls.size, 1)
      assert.deepEqual(env.revoked, [...env.urls.keys()])
    }
    else {
      released(env, parserWorker(env))
    }
  })
}

test('danmuku parser: ignores unrelated response IDs and disposes only after its matching result', { timeout: 3000 }, async (t) => {
  const { env, plugin } = await setup(t)
  let settled = false
  const pending = plugin.load('/correlated.xml')
  pending.then(() => settled = true, () => settled = true)
  await env.flush()
  const worker = parserWorker(env)
  const request = worker.messages[0].message
  worker.deliver({ id: `${request.id}-unrelated`, danmus: [] })
  await env.flush()
  assert.equal(settled, false)
  assert.equal(worker.terminated, false)
  assert.deepEqual(env.revoked, [])
  await worker.execute(request)
  const owner = await pending
  assert.equal(owner.queue[0].text, 'xml')
  released(env, worker)
})

test('danmuku parser: a matching malformed response rejects once and cannot later publish data', { timeout: 3000 }, async (t) => {
  const { env, plugin } = await setup(t)
  const pending = plugin.load('/malformed.xml')
  let rejectedError
  const rejected = assert.rejects(pending, (error) => {
    rejectedError = error
    return error.name === 'Error' && error.message === 'Invalid Bilibili Danmu worker response'
  })
  await env.flush()
  const worker = parserWorker(env)
  const { id } = worker.messages[0].message
  worker.deliver({ id, danmus: { text: 'not an array' } })
  await rejected
  assert.deepEqual(events(env, 'error').map(event => event.args), [[rejectedError]])
  released(env, worker)
  const count = env.events.length
  worker.deliver({ id, danmus: [{ text: 'late' }] })
  await env.flush()
  assert.equal(env.events.length, count)
})

for (const outcome of ['success', 'protocol-error', 'destroy']) {
  test(`danmuku parser: ${outcome} attempts every resource cleanup when termination and URL revocation throw`, { timeout: 3000 }, async (t) => {
    const terminateError = new Error('terminate-original')
    const revokeError = new Error('revoke-second')
    let terminateCalls = 0
    const { env, plugin } = await setup(t, {}, (env) => {
      const NativeWorker = env.context.Worker
      const revoke = env.context.URL.revokeObjectURL
      env.context.Worker = class extends NativeWorker {
        terminate() {
          terminateCalls++
          super.terminate()
          throw terminateError
        }
      }
      env.context.URL.revokeObjectURL = (url) => {
        revoke(url)
        throw revokeError
      }
    })
    const owner = plugin.show()
    const pending = plugin.load('/cleanup.xml')
    let rejectedError
    const observed = outcome === 'destroy'
      ? pending
      : assert.rejects(pending, (error) => {
          rejectedError = error
          return outcome === 'success'
            ? error === terminateError
            : error.message === 'Invalid Bilibili Danmu worker response'
        })
    await env.flush()
    const worker = parserWorker(env)
    if (outcome === 'destroy')
      env.destroy()
    else worker.deliver({ id: worker.messages[0].message.id, danmus: outcome === 'success' ? [] : null })
    const result = await observed
    assert.equal(terminateCalls, 1)
    released(env, worker)
    if (outcome === 'destroy') {
      assert.equal(result, owner)
      assert.equal(events(env, 'error').length, 0)
    }
    else {
      assert.deepEqual(events(env, 'error').map(event => event.args), [[rejectedError]])
    }
  })
}

test('danmuku parser: fallback parser failure rejects its original error once and releases the allocated URL', { timeout: 3000 }, async (t) => {
  const workerError = new Error('worker unavailable')
  const parserError = new Error('fallback parser original')
  const { env, plugin } = await setup(t, { fetch: async () => ({ text: async () => xml }) }, (env) => {
    env.context.Worker = class {
      constructor() { throw workerError }
    }
    env.context.parserError = parserError
    vm.runInContext('String.prototype.matchAll = function () { throw parserError }', env.context)
  })
  await assert.rejects(plugin.load('/fallback-failed.xml'), error => error === parserError)
  assert.deepEqual(events(env, 'error').map(event => event.args), [[parserError]])
  assert.equal(env.consoleErrors[0][1], workerError)
  assert.equal(env.urls.size, 1)
  assert.deepEqual(env.revoked, [...env.urls.keys()])
})

test('danmuku parser: successful parsing removes its abort listener before subsequent cancellation', { timeout: 3000 }, async (t) => {
  const subscriptions = []
  const { env, plugin } = await setup(t, {}, (env) => {
    env.context.AbortController = class extends AbortController {
      constructor() {
        super()
        const { signal } = this
        const add = signal.addEventListener.bind(signal)
        const remove = signal.removeEventListener.bind(signal)
        signal.addEventListener = (name, callback, ...rest) => {
          subscriptions.push({ name, callback, signal, removed: 0 })
          add(name, callback, ...rest)
        }
        signal.removeEventListener = (name, callback, ...rest) => {
          const entry = subscriptions.find(item => item.name === name && item.callback === callback && item.signal === signal)
          assert(entry, 'Only an owned abort listener can be removed')
          entry.removed++
          remove(name, callback, ...rest)
        }
      }
    }
  })
  const pending = plugin.load('/signal.xml')
  await env.flush()
  const worker = parserWorker(env)
  assert.equal(subscriptions.length, 1)
  assert.equal(subscriptions[0].name, 'abort')
  await worker.execute(worker.messages[0].message)
  await pending
  assert.equal(subscriptions[0].removed, 1)
  released(env, worker)
  env.destroy()
  assert.equal(subscriptions[0].removed, 1)
  assert.deepEqual(env.revoked, [worker.url])
})

for (const stage of ['fetch', 'text', 'worker']) {
  for (const abortController of [true, false]) {
    test(`danmuku parser: destroy during ${stage} settles silently with AbortController ${abortController}`, { timeout: 3000 }, async (t) => {
      const gate = deferred()
      const { env, plugin } = await setup(t, { fetch: async () => {
        if (stage === 'fetch')
          return gate.promise
        return { text: () => stage === 'text' ? gate.promise : Promise.resolve(xml) }
      } }, (env) => {
        if (!abortController) {
          env.context.AbortController = undefined
          env.context.window.AbortController = undefined
        }
      })
      const owner = plugin.show()
      const pending = plugin.load('/cancel.xml')
      await env.flush()
      const worker = stage === 'worker' ? parserWorker(env) : undefined
      env.destroy()
      const count = env.events.length
      assert.equal(await pending, owner)
      assert.equal(events(env, 'error').length, 0)
      if (abortController)
        assert.equal(env.fetchCalls[0].init.signal.aborted, true)
      if (worker) {
        released(env, worker)
        worker.deliver({ id: worker.messages[0].message.id, danmus: [{ text: 'late' }] })
      }
      else {
        assert.equal(env.urls.size, 0)
        gate.resolve(stage === 'fetch' ? { text: async () => xml } : xml)
      }
      await env.flush()
      assert.equal(env.events.length, count, 'Cancelled parser cannot emit a late loaded/error event')
      assert.equal(owner.queue.length, 0)
      assert.equal(env.workers.length, stage === 'worker' ? 2 : 1)
    })
  }
}

for (const stage of ['fetch', 'text']) {
  test(`danmuku parser: strict subprocess observes automatic ${stage} failure while public load still rejects`, () => {
    const program = `
      import assert from 'node:assert/strict';
      import fs from 'node:fs';
      import { danmukuCandidateEnvironment } from './test/helpers/danmuku-candidate.js';
      const implementation = JSON.parse(fs.readFileSync(0, 'utf8'));
      const failure = new Error(${JSON.stringify(`${stage}-original`)});
      const env = danmukuCandidateEnvironment(implementation, { fetch: async () => {
        if (${JSON.stringify(stage)} === 'fetch') throw failure;
        return { text: async () => { throw failure; } };
      } });
      const plugin = env.factory({ danmuku: '/automatic.xml' })(env.art);
      await env.flush();
      await new Promise(resolve => setImmediate(resolve));
      assert.deepEqual(env.events.filter(event => event.name === '${prefix}error').map(event => event.args), [[failure]]);
      assert.deepEqual(env.consoleWarnings, [['Failed to load initial danmuku:', failure]]);
      await assert.rejects(plugin.load('/public.xml'), error => error === failure);
      await new Promise(resolve => setImmediate(resolve));
      assert.deepEqual(env.events.filter(event => event.name === '${prefix}error').map(event => event.args), [[failure], [failure]]);
      assert.equal(env.consoleWarnings.length, 1);
      assert.equal(env.workers.length, 1);
      assert.equal(env.urls.size, 0);
      env.destroy();
      process.stdout.write('automatic-observed-public-rejected-once\\n');
    `
    const child = spawnSync(process.execPath, ['--unhandled-rejections=strict', '--input-type=module', '-e', program], {
      cwd: fileURLToPath(new URL('../', import.meta.url)),
      input: JSON.stringify(implementation),
      encoding: 'utf8',
      timeout: 5000,
      maxBuffer: 1024 * 1024,
    })
    assert.equal(child.error, undefined, child.error?.message)
    assert.equal(child.signal, null)
    assert.equal(child.status, 0, child.stderr)
    assert.equal(child.stdout, 'automatic-observed-public-rejected-once\n')
    assert.equal(child.stderr, '')
  })
}
