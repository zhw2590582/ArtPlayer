import assert from 'node:assert/strict'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Control actual timers without wall-clock sleeps.
import { test } from 'node:test'
import { loadCoreArtifact, loadPackage, loadPublishedCore } from './helpers/load.js'

const globals = { setTimeout: (...args) => setTimeout(...args), clearTimeout: timer => clearTimeout(timer) }
const published = await loadPublishedCore(globals)
const current = { name: 'workspace', Artplayer: (await loadPackage('artplayer')).default }
const targets = [published, current]
if (process.env.ARTPLAYER_TEST_CORE)
  targets.push(await loadCoreArtifact(process.env.ARTPLAYER_TEST_CORE, globals))

for (const { name, Artplayer } of targets) {
  const utils = Artplayer.utils
  test(`utils formatting and extension conventions: ${name}`, () => {
    assert.deepEqual([utils.clamp(4, 5, 1), utils.clamp(-2, 5, 1), utils.clamp(9, 5, 1)], [4, 1, 5])
    assert(Number.isNaN(utils.clamp(Number.NaN, 0, 1)))
    for (const [value, result] of [[0, '00:00'], [59.9, '00:59'], [60, '01:00'], [3601, '01:00:01'], [360000, '100:00:00']])
      assert.equal(utils.secondToTime(value), result)
    const text = `<b title="A&B">'Text'</b>`
    assert.equal(utils.escape(text), '&lt;b title=&quot;A&amp;B&quot;&gt;&#39;Text&#39;&lt;/b&gt;')
    assert.equal(utils.unescape(utils.escape(text)), text)
    assert.equal(utils.unescape('&amp;lt; &#x3c;'), '&lt; &#x3c;')
    assert.equal(utils.capitalize('hello'), 'Hello')
    for (const [url, result] of [[' clip.MP4?token=a.b#hash ', 'mp4'], ['clip.webm#x?y=z', 'webm'], [' video ', 'video'], ['', '']])
      assert.equal(utils.getExt(url), result)
  })

  test(`utils property descriptors and deep merge array/reference behavior: ${name}`, () => {
    const key = Symbol('key')
    const object = Object.create({ inherited: true })
    assert.equal(utils.def(object, key, { value: 42 }), object)
    assert.equal(utils.has(object, key), true)
    assert.equal(utils.has(object, 'inherited'), false)
    assert.equal(utils.get(object, 'missing'), undefined)
    assert.deepEqual({ ...utils.get(object, key) }, { value: 42, writable: false, enumerable: false, configurable: false })
    const first = { nested: { x: 1 }, array: [1] }
    const array = [2, [3, 4]]
    const result = utils.mergeDeep(first, { nested: { y: 2 }, array })
    assert.equal(JSON.stringify(result), '{"nested":{"x":1,"y":2},"array":[1,2,3,4]}')
    assert.equal(first.array.length, 1)
    assert.equal(utils.mergeDeep({ array }).array, array)
    assert.equal(utils.has(utils.mergeDeep(), 'toString'), false)
  })

  test(`utils subtitle text output: ${name}`, () => {
    const srt = '1\n00:00:01,2 --> 00:00:02.3456\n{i}Hello{/i} {unknown}\n'
    assert.equal(utils.srtToVtt(srt), 'WEBVTT \r\n\r\n1\n00:00:01.200 --> 00:00:02.345\n<i>Hello</i> \n\r\n\r\n')
    const ass = '[Events]\nDialogue: 0,0:00:01.20,0:00:02.34,Default,,0,0,0,,{\\i1} Hello\\N World\n'
    assert.equal(utils.assToVtt(ass), 'WEBVTT\n\n1\n00:00:01.200 --> 00:00:02.340\nHello\nWorld')
    assert.equal(utils.assToVtt('[Script Info]\nno dialogue'), 'WEBVTT\n\n')
  })

  test(`utils errors retain identity and truthy return values: ${name}`, () => {
    const object = {}
    assert.equal(utils.errorHandle(object, 'unused'), object)
    assert.equal(utils.errorHandle('supported', 'unused'), 'supported')
    for (const condition of [false, 0, '', null, undefined]) {
      assert.throws(() => utils.errorHandle(condition, 'Failure'), error => error instanceof utils.ArtPlayerError && error.name === 'ArtPlayerError' && error.message === 'Failure')
    }
  })

  test(`utils timer arguments, receivers and leading/trailing behavior: ${name}`, async (context) => {
    context.mock.timers.enable({ apis: ['setTimeout'] })
    let slept = false
    const pending = utils.sleep(10).then(() => slept = true)
    context.mock.timers.tick(9)
    await Promise.resolve()
    assert.equal(slept, false)
    context.mock.timers.tick(1)
    await pending
    const calls = []
    function receive(value) {
      calls.push([this.id, value])
      return 42
    }
    const trailing = utils.debounce(receive, 10)
    assert.equal(trailing.call({ id: 'first' }, 1), undefined)
    context.mock.timers.tick(5)
    trailing.call({ id: 'last' }, 2)
    context.mock.timers.tick(9)
    assert.deepEqual(calls, [])
    context.mock.timers.tick(1)
    assert.deepEqual(calls, [['last', 2]])
    const leading = utils.throttle(receive, 10)
    assert.equal(leading.call({ id: 'leading' }, 3), undefined)
    leading.call({ id: 'ignored' }, 4)
    context.mock.timers.tick(10)
    assert.deepEqual(calls, [['last', 2], ['leading', 3]])
    leading.call({ id: 'later' }, 5)
    assert.deepEqual(calls, [['last', 2], ['leading', 3], ['later', 5]])
  })
}

test('utils export surface preserves the published namespace plus existing workspace additions', () => {
  const expected = [...Object.keys(published.Artplayer.utils), 'silencePromise', 'getSafeAreaInsets'].sort()
  for (const { Artplayer } of targets.slice(1)) {
    assert.deepEqual(Object.keys(Artplayer.utils).sort(), expected)
    for (const key of Object.keys(published.Artplayer.utils)) {
      assert.equal(typeof Artplayer.utils[key], typeof published.Artplayer.utils[key], key)
      if (typeof Artplayer.utils[key] === 'function')
        assert.equal(Artplayer.utils[key].length, published.Artplayer.utils[key].length, key)
    }
  }
})

test('mergeDeep keeps __proto__ as own data without replacing result prototypes', () => {
  const input = JSON.parse('{"__proto__":{"unexpected":true},"constructor":{"prototype":{"marker":true}}}')
  const old = published.Artplayer.utils.mergeDeep({}, input)
  assert.equal(Object.prototype.hasOwnProperty.call(old, '__proto__'), false)
  assert.equal(old.unexpected, true, 'Published defect remains demonstrable')
  for (const { Artplayer } of targets.slice(1)) {
    const result = Artplayer.utils.mergeDeep({}, input)
    assert.equal(Object.prototype.hasOwnProperty.call(result, '__proto__'), true)
    assert.equal(result.unexpected, undefined)
    assert.equal(Object.getPrototypeOf(result).unexpected, undefined)
    assert.equal(Object.getOwnPropertyDescriptor(result, '__proto__').value.unexpected, true)
    const nested = Artplayer.utils.mergeDeep({ nested: {} }, { nested: input })
    assert.equal(nested.nested.unexpected, undefined)
    assert.equal(Object.prototype.hasOwnProperty.call(nested.nested, '__proto__'), true)
    assert.equal({}.unexpected, undefined)
    assert.equal(JSON.stringify(input), '{"__proto__":{"unexpected":true},"constructor":{"prototype":{"marker":true}}}')
  }
})

test('throttle preserves synchronous reentry and retries after callback failure', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] })
  for (const { Artplayer } of targets) {
    let calls = 0
    const invoke = Artplayer.utils.throttle(() => {
      calls++
      if (calls === 1)
        invoke()
    }, 10)
    invoke()
    assert.equal(calls, 2)
    const broken = Artplayer.utils.throttle(() => {
      throw new Error('callback failure')
    }, 10)
    assert.throws(broken, /callback failure/)
    assert.throws(broken, /callback failure/)
  }
})
