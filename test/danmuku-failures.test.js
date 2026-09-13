import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Historical failures are explicit Node observations.
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { danmukuEnvironment, danmukuHistorical, deferred } from './helpers/danmuku.js'

const implementations = await danmukuHistorical()
const cache = fileURLToPath(new URL('../refactor/.cache/danmuku02-controlled/', import.meta.url))
fs.mkdirSync(cache, { recursive: true })
const evidenceDirectory = fs.mkdtempSync(path.join(cache, 'run-'))

function isolated(implementation, scenario) {
  const program = `
    import fs from 'node:fs';
    import vm from 'node:vm';
    import { danmukuEnvironment } from './test/helpers/danmuku.js';
    const implementation = JSON.parse(fs.readFileSync(0, 'utf8'));
    const scenario = ${JSON.stringify(scenario)};
    let settled = false;
    let env;
    process.on('uncaughtExceptionMonitor', (error, origin) => {
      process.stdout.write(JSON.stringify({ stage: 'fatal', origin, error: error.message, settled, errors: env?.events.filter(e => e.name === 'artplayerPluginDanmuku:error').length }) + '\\n');
    });
    if (scenario === 'heatmap-zero' || scenario === 'heatmap-positive') {
      env = danmukuEnvironment(implementation, { heatmapWidth: 99 });
      env.factory({ danmuku: [], heatmap: scenario === 'heatmap-positive' ? { sampling: 1 } : true })(env.art);
      const sandbox = vm.createContext({ run: () => env.art.emit('ready') });
      process.stdout.write('heatmap-ready\\n');
      try {
        vm.runInContext('run()', sandbox, { timeout: 100 });
        process.stdout.write(JSON.stringify({ stage: 'complete' }) + '\\n');
      } catch (error) {
        if (error.code !== 'ERR_SCRIPT_EXECUTION_TIMEOUT') throw error;
        process.stdout.write(JSON.stringify({ stage: 'bounded-timeout', code: error.code }) + '\\n');
      }
      process.exit(0);
    }
    if (scenario === 'beforeVisible-reject') {
      env = danmukuEnvironment(implementation);
      const plugin = env.factory({ danmuku: [], beforeVisible: () => Promise.reject(new Error('beforeVisible-original')) })(env.art);
      await plugin.emit({ text: 'visible', time: 10 });
      env.art.playing = true;
      env.art.emit('video:play');
      // Browser rAF ignores a callback's returned Promise. Do not observe it here.
      env.frame();
    } else {
      env = danmukuEnvironment(implementation, { fetch: async () => {
        if (scenario === 'fetch-reject') throw new Error('fetch-original');
        return { text: async () => { throw new Error('text-original'); } };
      } });
      const plugin = env.factory({ danmuku: [] })(env.art);
      plugin.load('/controlled.xml').then(() => settled = true, () => settled = true);
    }
    setTimeout(() => process.stdout.write('unexpected-survival\\n'), 200);
  `
  const child = spawnSync(process.execPath, ['--unhandled-rejections=strict', '--input-type=module', '-e', program], {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    input: JSON.stringify(implementation),
    encoding: 'utf8',
    timeout: 3000,
    maxBuffer: 2 * 1024 * 1024,
  })
  const evidence = { implementation: implementation.name, scenario, status: child.status, signal: child.signal, errorCode: child.error?.code ?? null, stdout: child.stdout, stderr: child.stderr }
  fs.writeFileSync(path.join(evidenceDirectory, `${implementation.name}-${scenario}.json`), `${JSON.stringify(evidence, null, 2)}\n`)
  assert.equal(child.error, undefined, `Isolated process infrastructure failed: ${child.error?.message}`)
  return evidence
}

for (const implementation of implementations) {
  for (const scenario of ['fetch-reject', 'text-reject']) {
    test(`danmuku ${implementation.name}: historical ${scenario} crashes the isolated process while public load stays pending`, () => {
      const evidence = isolated(implementation, scenario)
      assert.equal(evidence.status, 1)
      const record = JSON.parse(evidence.stdout.trim())
      assert.equal(record.stage, 'fatal')
      assert.equal(record.origin, 'unhandledRejection')
      assert.equal(record.settled, false)
      assert.equal(record.errors, 0)
      assert.equal(record.error, scenario === 'fetch-reject' ? 'fetch-original' : 'text-original')
    })
  }

  test(`danmuku ${implementation.name}: historical beforeVisible rejection is an unobserved animation callback Promise`, () => {
    const evidence = isolated(implementation, 'beforeVisible-reject')
    assert.equal(evidence.status, 1)
    const record = JSON.parse(evidence.stdout.trim())
    assert.equal(record.error, 'beforeVisible-original')
    assert.equal(record.origin, 'unhandledRejection')
    assert.equal(record.errors, 0)
  })

  test(`danmuku ${implementation.name}: historical heatmap width 99 blocks at default sampling zero but sampling 1 completes`, () => {
    const zero = isolated(implementation, 'heatmap-zero')
    const positive = isolated(implementation, 'heatmap-positive')
    assert.equal(zero.status, 0)
    assert.equal(positive.status, 0)
    assert.match(zero.stdout, /heatmap-ready\n\{"stage":"bounded-timeout","code":"ERR_SCRIPT_EXECUTION_TIMEOUT"\}/u)
    assert.match(positive.stdout, /heatmap-ready\n\{"stage":"complete"\}/u)
  })

  for (const event of ['error', 'empty-xml']) {
    test(`danmuku ${implementation.name}: historical Bilibili ${event} leaves loading pending and parser worker alive`, async () => {
      const env = danmukuEnvironment(implementation, event === 'empty-xml' ? { fetch: async () => ({ text: async () => '' }) } : {})
      const plugin = env.factory({ danmuku: [] })(env.art)
      let settled = false
      plugin.load('/controlled.xml').then(() => settled = true, () => settled = true)
      await env.flush()
      assert.equal(env.workers.length, 2)
      const worker = env.workers[1]
      assert.equal(worker.messages.length, 1)
      if (event === 'error') {
        assert.equal(worker.onerror, undefined)
        worker.fail(new Error('parser worker failure'))
      }
      else {
        assert.equal(worker.messages[0].message.xml, '')
        // Execute the actual Blob, not a reimplementation of its empty-input branch.
        await worker.execute(worker.messages[0].message)
      }
      await env.flush()
      assert.equal(settled, false)
      env.destroy()
      assert.equal(worker.terminated, false, 'Parser worker is not owned by the Danmuku destroy path')
    })
  }

  test(`danmuku ${implementation.name}: historical successful parser leaves its Blob URL allocated`, async () => {
    const env = danmukuEnvironment(implementation)
    const plugin = env.factory({ danmuku: [] })(env.art)
    const pending = plugin.load('/controlled.xml')
    await env.flush()
    const worker = env.workers[1]
    await worker.execute(worker.messages[0].message)
    const internal = await pending
    assert.equal(internal.queue.length, 1)
    assert.equal(internal.queue[0].text, 'xml')
    assert.equal(worker.terminated, true)
    assert.equal(env.urls.has(worker.url), true)
    assert.equal(env.revoked.includes(worker.url), false)
    env.destroy()
  })

  test(`danmuku ${implementation.name}: historical parser worker completion emits new data after player destruction`, async () => {
    const env = danmukuEnvironment(implementation)
    const plugin = env.factory({ danmuku: [] })(env.art)
    const pending = plugin.load('/controlled.xml')
    await env.flush()
    const worker = env.workers[1]
    env.destroy()
    const count = env.events.length
    assert.equal(worker.terminated, false)
    await worker.execute(worker.messages[0].message)
    const internal = await pending
    assert.equal(internal.queue[0].text, 'xml')
    assert.deepEqual(env.events.slice(count).map(event => event.name), ['artplayerPluginDanmuku:loaded'])
    assert.equal(worker.terminated, true)
  })

  test(`danmuku ${implementation.name}: historical overlapping replacement loads let the oldest completion overwrite newer data`, async () => {
    const env = danmukuEnvironment(implementation)
    const plugin = env.factory({ danmuku: [] })(env.art)
    const first = deferred()
    const second = deferred()
    const jobs = [first, second]
    // Change an additional scalar because the historical function-only config bug is separate.
    plugin.config({ danmuku: () => jobs.shift().promise, opacity: 0.9 })
    const older = plugin.load()
    const newer = plugin.load()
    second.resolve([{ text: 'newer', time: 10 }])
    const internal = await newer
    assert.deepEqual(Array.from(internal.queue, item => item.text), ['newer'])
    first.resolve([{ text: 'older', time: 10 }])
    await older
    assert.deepEqual(Array.from(internal.queue, item => item.text), ['older'])
    env.destroy()
  })

  test(`danmuku ${implementation.name}: historical asynchronous input mutates queue and emits loaded after destroy`, async () => {
    const env = danmukuEnvironment(implementation)
    const plugin = env.factory({ danmuku: [] })(env.art)
    const input = deferred()
    const pending = plugin.load(() => input.promise)
    env.destroy()
    const count = env.events.length
    input.resolve([{ text: 'late', time: 10 }])
    const internal = await pending
    assert.deepEqual(Array.from(internal.queue, item => item.text), ['late'])
    assert.deepEqual(env.events.slice(count).map(event => event.name), ['artplayerPluginDanmuku:loaded'])
  })

  test(`danmuku ${implementation.name}: historical pending beforeVisible allocates DOM and posts to a terminated worker after destroy`, async () => {
    const visible = deferred()
    const env = danmukuEnvironment(implementation)
    const plugin = env.factory({ danmuku: [], beforeVisible: () => visible.promise })(env.art)
    await plugin.emit({ text: 'late visible', time: 10 })
    env.art.playing = true
    env.art.emit('video:play')
    env.frame()
    await env.flush()
    assert.equal(env.art.template.$danmuku.children.length, 0)
    env.destroy()
    visible.resolve(true)
    await env.flush()
    assert.equal(env.art.template.$danmuku.children.length, 1)
    assert.equal(env.workers[0].messages.length, 1)
    assert.equal(env.workers[0].messages[0].afterTerminate, true)
    assert.equal(env.events.filter(event => event.name === 'artplayerPluginDanmuku:visible').length, 0)
  })

  test(`danmuku ${implementation.name}: historical worker response continuation still mutates state after destroy`, async () => {
    const env = danmukuEnvironment(implementation)
    const plugin = env.factory({ danmuku: [] })(env.art)
    await plugin.emit({ text: 'pending position', time: 10 })
    env.art.playing = true
    env.art.emit('video:play')
    const frame = env.frame()
    await env.flush()
    const worker = env.workers[0]
    const { id } = worker.messages[0].message
    const internal = plugin.show()
    // Delivery starts before terminate; its awaiting rAF continuation runs afterward.
    // This does not require a native Worker to dispatch a new event after terminate.
    worker.deliver({ id, result: 10 })
    env.destroy()
    assert.equal(internal.queue[0].$state, 'wait')
    await frame
    assert.equal(internal.queue[0].$state, 'ready')
    assert.equal(internal.queue[0].$ref, null)
    assert.equal(env.frames.size, 0)
    assert.equal(env.events.filter(event => event.name === 'artplayerPluginDanmuku:visible').length, 0)
  })

  test(`danmuku ${implementation.name}: historical play and playing schedule duplicate loops and overwrite pending worker response handlers`, async () => {
    const env = danmukuEnvironment(implementation)
    const plugin = env.factory({ danmuku: [] })(env.art)
    await plugin.emit({ text: 'two loops', time: 10 })
    env.art.playing = true
    env.art.emit('video:play')
    env.art.emit('video:playing')
    assert.equal(env.frames.size, 2)
    let firstSettled = false
    env.frame().then(() => firstSettled = true)
    await env.flush()
    env.tick(1)
    const second = env.frame()
    await env.flush()
    const worker = env.workers[0]
    assert.equal(worker.messages.length, 2)
    const firstId = worker.messages[0].message.id
    const secondId = worker.messages[1].message.id
    assert.notEqual(firstId, secondId)
    worker.deliver({ id: firstId, result: 10 })
    await env.flush()
    assert.equal(firstSettled, false)
    worker.deliver({ id: secondId, result: 10 })
    await second
    assert.equal(firstSettled, false)
    assert.equal(env.events.filter(event => event.name === 'artplayerPluginDanmuku:visible').length, 1)
    env.destroy()
  })

  test(`danmuku ${implementation.name}: historical duplicate start then pause cancels only the latest scheduled frame`, () => {
    const env = danmukuEnvironment(implementation)
    env.factory({ danmuku: [] })(env.art)
    env.art.emit('video:play')
    env.art.emit('video:playing')
    env.art.emit('video:pause')
    assert.equal(env.frames.size, 1)
    env.destroy()
    assert.equal(env.frames.size, 1)
  })
}

process.stdout.write(`Danmuku controlled subprocess evidence: ${evidenceDirectory}\n`)
