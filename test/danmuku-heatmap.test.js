import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Heatmap compatibility and isolated historical hangs use Node.
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { danmukuEnvironment, danmukuHistorical } from './helpers/danmuku.js'
import { loadModules } from './helpers/load.js'

const { heatmap, heatmapGeometry, sampleHeatmap } = await loadModules({
  heatmap: 'packages/artplayer-plugin-danmuku/src/heatmap',
  heatmapGeometry: { file: 'packages/artplayer-plugin-danmuku/src/heatmap-geometry', name: 'heatmapGeometry' },
  sampleHeatmap: { file: 'packages/artplayer-plugin-danmuku/src/heatmap-sampling', name: 'sampleHeatmap' },
})
const historical = await danmukuHistorical()

function fixture({ width = 400, height = 100, duration = 60, queue = [] } = {}) {
  const listeners = new Map()
  const removed = []
  const element = { offsetWidth: width, offsetHeight: height, writes: 0, nodes: new Map(), removed: 0 }
  let html = ''
  Object.defineProperty(element, 'innerHTML', {
    get: () => html,
    set(value) {
      html = value
      element.writes++
      element.nodes = new Map(['#heatmap-start', '#heatmap-stop'].map(key => [key, {
        attributes: {},
        writes: 0,
        setAttribute(name, value) {
          this.attributes[name] = value
          this.writes++
        },
      }]))
    },
  })
  const art = {
    duration,
    played: 0.25,
    option: { isLive: false },
    constructor: { utils: { query: (selector, root) => root.nodes.get(selector) } },
    on(name, callback) { listeners.set(name, [...listeners.get(name) || [], callback]) },
    off(name, callback) { listeners.set(name, (listeners.get(name) || []).filter(item => item !== callback)) },
    emit(name, ...args) {
      for (const callback of [...listeners.get(name) || []])
        callback(...args)
    },
    controls: {
      add(option) {
        this.option = option
        this.heatmap = element
        option.mounted(element)
        return undefined
      },
      remove(name) {
        assert.equal(name, 'heatmap')
        this.option.beforeUnmount?.(this.heatmap)
        this.heatmap.removed++
        delete this.heatmap
        removed.push(name)
      },
    },
  }
  const danmuku = { queue }
  return {
    art,
    danmuku,
    element,
    listeners,
    removed,
    install: option => heatmap(art, danmuku, option),
    destroy() {
      art.isDestroy = true
      art.emit('destroy')
    },
  }
}

function pathOf(element) {
  return element.innerHTML.match(/<path[^>]+d="([^"]*)"/u)?.[1]
}

function listenerCount(env) {
  return [...env.listeners.values()].reduce((sum, list) => sum + list.length, 0)
}

test('heatmap: sampled SVG path matches frozen source and actual 5.3.0 main/legacy for legal options', async () => {
  const queue = [0, 0.6, 1, 2, 2, 2.1, 8, 15, 28, 59.9, 60, Number.NaN, Infinity, -Infinity].map(time => ({ time }))
  for (const option of [true, { sampling: 2.5, smoothing: 0.3, flattening: 0.1, scale: 0.4, opacity: 0.7, minHeight: 2, xMin: -10, xMax: 450, yMin: -1, yMax: 40 }]) {
    const candidate = fixture({ queue })
    candidate.install(option)
    candidate.art.emit('ready')
    assert(pathOf(candidate.element))
    for (const implementation of historical) {
      const env = danmukuEnvironment(implementation, { heatmapWidth: 400 })
      const plugin = env.factory({ danmuku: [], heatmap: option })(env.art)
      await env.flush()
      plugin.show().queue = queue
      env.art.emit('ready')
      assert.equal(pathOf(candidate.element), pathOf(env.controls[0].element), `${implementation.name} / ${JSON.stringify(option)}`)
      env.destroy()
    }
    candidate.destroy()
  }
})

test('heatmap: custom points retain nested mutation, repeated transformation and exact historical SVG curves', async () => {
  const option = { sampling: 4, scale: 0.25, minHeight: 5, smoothing: 0.2, flattening: 0.2 }
  const candidate = fixture()
  candidate.install(option)
  const points = [[0, 10], [200, 20], [300, 0]]
  const references = [...points]
  const snapshots = []
  for (let index = 0; index < 2; index++) {
    candidate.art.emit('artplayerPluginDanmuku:points', points)
    snapshots.push({ points: structuredClone(points), path: pathOf(candidate.element) })
  }
  assert.deepEqual(snapshots[0].points, [[0, 12.5], [200, 30], [300, 5]])
  assert.equal(points.length, 3, 'The closing point is appended only to the copied outer array')
  assert.equal(points[1], references[1])
  for (const implementation of historical) {
    const env = danmukuEnvironment(implementation, { heatmapWidth: 400 })
    env.factory({ danmuku: [], heatmap: option, points: [[0, 999], [400, 999]] })(env.art)
    await env.flush()
    const oldPoints = [[0, 10], [200, 20], [300, 0]]
    for (const expected of snapshots) {
      env.art.emit('artplayerPluginDanmuku:points', oldPoints)
      assert.deepEqual(oldPoints, expected.points, implementation.name)
      assert.equal(pathOf(env.controls[0].element), expected.path, implementation.name)
    }
    env.destroy()
  }
  candidate.art.emit('resize')
  assert.notEqual(pathOf(candidate.element), snapshots[1].path, 'A later automatic update resamples the queue, not the previous custom points')
  candidate.destroy()
})

test('heatmap: historical zero/default-narrow/negative sampling hangs are bounded in isolated processes', () => {
  for (const implementation of historical) {
    for (const scenario of [{ width: 99, option: true }, { width: 400, option: { sampling: 0 } }, { width: 400, option: { sampling: -1 } }]) {
      const program = `
        import fs from 'node:fs';
        import vm from 'node:vm';
        import { danmukuEnvironment } from './test/helpers/danmuku.js';
        const { implementation, scenario } = JSON.parse(fs.readFileSync(0, 'utf8'));
        const env = danmukuEnvironment(implementation, { heatmapWidth: scenario.width });
        env.factory({ danmuku: [], heatmap: scenario.option })(env.art);
        const sandbox = vm.createContext({ update: () => env.art.emit('ready') });
        try { vm.runInContext('update()', sandbox, { timeout: 100 }); process.stdout.write('unexpected-completion'); }
        catch (error) { if (error.code !== 'ERR_SCRIPT_EXECUTION_TIMEOUT') throw error; process.stdout.write(error.code); }
      `
      const child = spawnSync(process.execPath, ['--input-type=module', '-e', program], {
        cwd: fileURLToPath(new URL('../', import.meta.url)),
        input: JSON.stringify({ implementation, scenario }),
        encoding: 'utf8',
        timeout: 5000,
        maxBuffer: 1024 * 1024,
      })
      assert.equal(child.error, undefined)
      assert.equal(child.status, 0, child.stderr)
      assert.equal(child.stdout, 'ERR_SCRIPT_EXECUTION_TIMEOUT')
    }
  }
})

test('heatmap: narrow widths and invalid sampling produce finite bounded curves without a hanging loop', () => {
  for (const width of [1, 50, 99, 100, 640]) {
    for (const sampling of [undefined, 0, -1, Number.NaN, Infinity, -Infinity]) {
      const result = heatmapGeometry({ width, height: 100, duration: 60, queue: [{ time: 1 }], option: { sampling } })
      assert(result, `${width}/${sampling}`)
      assert.doesNotMatch(result.path, /NaN|Infinity/u)
      assert(result.path.length < 100000)
    }
  }
})

test('heatmap: invalid dimensions, duration and coordinate ranges leave an empty chart', () => {
  const base = { width: 400, height: 100, duration: 60, queue: [] }
  for (const key of ['width', 'height', 'duration']) {
    for (const value of [0, -1, Number.NaN, Infinity, -Infinity])
      assert.equal(heatmapGeometry({ ...base, [key]: value }), null, `${key}/${value}`)
  }
  for (const option of [{ xMin: 1, xMax: 1 }, { yMin: 1, yMax: 1 }])
    assert.equal(heatmapGeometry({ ...base, option }), null)
  const env = fixture()
  env.install(true)
  env.art.emit('ready')
  assert(pathOf(env.element))
  env.art.duration = Infinity
  env.art.emit('resize')
  assert.equal(env.element.innerHTML, '')
  env.art.duration = 60
  env.art.option.isLive = true
  env.art.emit('ready')
  assert.equal(env.element.innerHTML, '')
  env.destroy()
})

test('heatmap sampling: strict-left inclusive-right bins preserve fractional step boundaries and numeric edge values', () => {
  const queue = [0, -1, 0.1, 0.2, 0.3, 0.6, 1, 60, Number.NaN, Infinity, -Infinity].map(time => ({ time }))
  for (const [width, duration, sampling] of [[10, 1, 0.3], [400, 60, 2.5], [100, 60, 1], [1, 1e308, 1e308]]) {
    const expected = []
    const gap = duration / width
    for (let x = 0; x <= width; x += sampling)
      expected.push([x, queue.filter(({ time }) => time > x * gap && time <= (x + sampling) * gap).length])
    assert.deepEqual(sampleHeatmap(queue, width, duration, sampling), expected)
  }
})

test('heatmap sampling: only unrepresentable array lengths are rejected before scanning the queue', () => {
  const queue = {
    map() { assert.fail('Oversized sampling must stop before reading the queue') },
  }
  assert.deepEqual(sampleHeatmap(queue, 400, 60, Number.MIN_VALUE), [])
  assert.deepEqual(sampleHeatmap(queue, 0xFFFFFFFF, 60, 1), [])
  assert.equal(heatmapGeometry({ width: 400, height: 100, duration: 60, queue, option: { sampling: Number.MIN_VALUE } }), null)
})

test('heatmap sampling: legal small steps retain more than 100000 exact historical bins', () => {
  const queue = [0, 0.001, 1, 50, 100, 100.001, 101].map(time => ({ time }))
  const expected = []
  for (let x = 0; x <= 101; x += 0.001)
    expected.push([x, queue.filter(({ time }) => time > x && time <= x + 0.001).length])
  assert(expected.length > 100000)
  const actual = sampleHeatmap(queue, 101, 101, 0.001)
  assert.equal(actual.length, expected.length)
  assert.deepEqual(actual, expected)
  assert.equal(sampleHeatmap([], 100001, 60, 1).length, 100002)
})

test('heatmap geometry: more than 100000 custom points retain all segments and nested y writes', () => {
  const points = Array.from({ length: 100001 }, (_, index) => [index, index % 2 ? 20 : 10])
  const first = points[0]
  const result = heatmapGeometry({ width: 100001, height: 100, duration: 60, queue: [], points })
  assert(result)
  assert.equal(points.length, 100001)
  assert.equal(points[0], first)
  assert.deepEqual(points[0], [0, 12.5])
  assert.deepEqual(points[1], [1, 30])
  assert.equal(result.path.match(/C /gu).length, 100001, 'Every caller segment and the closing width point remain')
  assert.doesNotMatch(result.path, /NaN|Infinity/u)
  assert(result.path.endsWith(' z'))
})

test('heatmap: malformed points do not generate NaN SVG or change caller data', () => {
  for (const points of [[undefined], [[1]], [[0, Number.NaN]], [[Infinity, 2]], [{ time: 1, value: 2 }]]) {
    const original = structuredClone(points)
    assert.equal(heatmapGeometry({ width: 400, height: 100, duration: 60, queue: [], points }), null)
    assert.deepEqual(points, original)
  }
})

test('heatmap: instances own different gradients while preserving local stop hooks and progress updates', () => {
  const a = fixture()
  const b = fixture()
  a.install(true)
  b.install({ opacity: 0.7 })
  a.art.emit('ready')
  b.art.emit('ready')
  const gradient = env => env.element.innerHTML.match(/linearGradient id="([^"]+)"/u)[1]
  assert.notEqual(gradient(a), gradient(b))
  for (const env of [a, b]) {
    assert(env.element.innerHTML.includes(`fill="url(#${gradient(env)})"`))
    assert.equal(env.element.nodes.get('#heatmap-start').attributes.offset, '25%')
    assert.equal(env.art.controls.option.name, 'heatmap')
    assert.equal(env.art.controls.option.position, 'top')
  }
  a.art.played = 0.5
  a.art.emit('video:timeupdate')
  assert.equal(a.element.nodes.get('#heatmap-start').attributes.offset, '50%')
  assert.equal(b.element.nodes.get('#heatmap-start').attributes.offset, '25%')
  a.art.emit('setBar', 'loaded', 0.9)
  assert.equal(a.element.nodes.get('#heatmap-stop').attributes.offset, '50%')
  a.art.emit('setBar', 'played', 0.9)
  assert.equal(a.element.nodes.get('#heatmap-stop').attributes.offset, '90%')
  a.destroy()
  assert.equal(listenerCount(a), 0)
  assert.deepEqual(a.removed, ['heatmap'])
  b.art.emit('resize')
  assert(pathOf(b.element))
  assert.equal(b.removed.length, 0)
  b.destroy()
})

test('heatmap: control unmount detaches all subscriptions and stale callbacks cannot write', () => {
  const env = fixture()
  const dispose = env.install(true)
  env.art.emit('ready')
  const oldCallbacks = [...env.listeners].map(([name, callbacks]) => [name, [...callbacks]])
  const oldStops = [...env.element.nodes.values()]
  env.art.controls.remove('heatmap')
  assert.equal(listenerCount(env), 0)
  const writes = env.element.writes
  const stopWrites = oldStops.map(node => node.writes)
  for (const [name, callbacks] of oldCallbacks) {
    for (const callback of callbacks) {
      if (name === 'artplayerPluginDanmuku:points')
        callback([[0, 10], [400, 20]])
      else if (name === 'setBar')
        callback('played', 0.9)
      else callback()
    }
  }
  dispose()
  assert.equal(env.element.writes, writes)
  assert.deepEqual(oldStops.map(node => node.writes), stopWrites)
  assert.deepEqual(env.removed, ['heatmap'])
})

test('heatmap: destroy preserves a later same-name control and cleanup attempts every owned removal', () => {
  const env = fixture()
  const dispose = env.install(true)
  const replacement = { removed: 0 }
  env.art.controls.heatmap = replacement
  const originalOff = env.art.off.bind(env.art)
  const failure = new Error('off-original')
  let attempts = 0
  env.art.off = (...args) => {
    originalOff(...args)
    attempts++
    if (attempts === 1)
      throw failure
  }
  assert.throws(dispose, error => error === failure)
  assert.equal(attempts, 7)
  assert.equal(listenerCount(env), 0)
  assert.equal(env.art.controls.heatmap, replacement)
  assert.equal(replacement.removed, 0)
  dispose()
})

test('heatmap: setup and update failures clean subscriptions/control and preserve their original errors', () => {
  const first = fixture()
  const setupError = new Error('add-original')
  first.art.controls.add = () => {
    throw setupError
  }
  assert.throws(() => first.install(true), error => error === setupError)
  assert.equal(listenerCount(first), 0)
  const second = fixture()
  second.install(true)
  const geometryError = new Error('points-original')
  const point = [0, 1]
  Object.defineProperty(point, '1', {
    get: () => 1,
    set() { throw geometryError },
  })
  assert.throws(() => second.art.emit('artplayerPluginDanmuku:points', [point, [400, 2]]), error => error === geometryError)
  assert.equal(listenerCount(second), 0)
  assert.deepEqual(second.removed, ['heatmap'])
  assert.equal(second.art.controls.heatmap, undefined)
})
