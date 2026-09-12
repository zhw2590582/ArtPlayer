import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Runtime compatibility tests.
import test from 'node:test'
import vm from 'node:vm'
import { thumbnailCandidate, thumbnailEnvironment, thumbnailHistorical } from './helpers/thumbnail.js'

const candidate = await thumbnailCandidate()
function create(implementation) {
  const env = thumbnailEnvironment(implementation)
  return { ...env, tool: new env.Factory({ fileInput: new env.Element('input') }) }
}
const referenceModule = { exports: {} }
vm.runInNewContext(fs.readFileSync(new URL('../refactor/baselines/thumbnail-vendor/tiny-emitter-2.1.0.txt', import.meta.url), 'utf8'), { module: referenceModule })
const Upstream = referenceModule.exports
const upstream = () => new Upstream()
const emitters = [upstream, ...thumbnailHistorical().map(implementation => () => create(implementation).tool), () => create(candidate).tool]

test('Thumbnail typed facade preserves descriptors, lazy fields, default class and unknown options', () => {
  const { tool, Factory, exported } = create(candidate)
  const baseline = create(thumbnailHistorical().find(item => item.name === 'workspace.js'))
  const describe = object => Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(object)).map(([name, value]) => [name, {
    enumerable: value.enumerable,
    configurable: value.configurable,
    writable: value.writable,
    getter: typeof value.get,
    setter: typeof value.set,
    type: typeof value.value,
    arity: typeof value.value === 'function' ? value.value.length : undefined,
  }]))
  assert.deepEqual(describe(Factory.prototype), describe(baseline.Factory.prototype))
  assert.deepEqual(describe(Factory), describe(baseline.Factory))
  assert.deepEqual(describe(tool), describe(baseline.tool))
  assert.deepEqual(Object.keys(tool), ['processing', 'option', 'video', 'duration', 'inputChange', 'ondrop'])
  assert.equal(exported.default, undefined)
  assert.equal(typeof thumbnailEnvironment(candidate, true).exported, 'function')
  const metadata = { id: 123 }
  assert.equal(tool.setup({ custom: metadata, width: 21.5 }), tool)
  assert.equal(tool.option.custom, metadata)
  assert.equal(tool.option.width, 21.5)
  assert.notEqual(Factory.DEFAULTS, Factory.DEFAULTS)
  assert.deepEqual(Object.keys(Factory.DEFAULTS), Object.keys(baseline.Factory.DEFAULTS))
  assert(Number.isNaN(Factory.DEFAULTS.end))
  tool.destroy()
})

test('Thumbnail emitter keeps upstream snapshot order, duplicate removal and original once callback identity', () => {
  for (const create of emitters) {
    const emitter = create()
    const seen = []
    const callback = value => seen.push(value)
    assert.equal(emitter.on('value', () => emitter.off('value', callback)), emitter)
    emitter.on('value', callback).once('value', callback).on('value', callback)
    emitter.emit('value', 7).emit('value', 8)
    assert.deepEqual(seen, [7, 7, 7])
    assert.equal(emitter.off('value'), emitter)
    assert.equal(emitter.e.value, undefined)
    emitter.once('removed', callback).off('removed', callback).emit('removed', 9)
    assert.deepEqual(seen, [7, 7, 7])
  }
})

test('Thumbnail emitter preserves ctx, variadic arguments, symbol events and ignored callback returns', () => {
  for (const create of emitters) {
    const emitter = create()
    const ctx = { calls: 0 }
    const name = Symbol('event')
    function callback(...args) {
      assert.equal(this, ctx)
      assert.deepEqual(args, [1, 'two', null])
      this.calls++
      return 123
    }
    assert.equal(emitter.on(name, callback, ctx), emitter)
    assert.equal(emitter.once(name, callback, ctx), emitter)
    assert.equal(emitter.emit(name, 1, 'two', null), emitter)
    assert.equal(ctx.calls, 2)
    emitter.off(name, callback).emit(name)
    assert.equal(ctx.calls, 2)
  }
})

test('Thumbnail emitter synchronous listener failures retain identity and stop the current snapshot', () => {
  for (const create of emitters) {
    const emitter = create()
    const failure = { reason: 'listener failure' }
    let later = 0
    emitter.once('event', () => {
      throw failure
    })
    emitter.on('event', () => later++)
    assert.throws(() => emitter.emit('event'), error => error === failure)
    assert.equal(later, 0)
    emitter.emit('event')
    assert.equal(later, 1)
  }
})

test('Thumbnail emitter additions during dispatch wait until the next snapshot', () => {
  for (const create of emitters) {
    const emitter = create()
    const seen = []
    emitter.once('event', () => {
      seen.push('first')
      emitter.on('event', () => seen.push('new'))
    })
    emitter.on('event', () => seen.push('second'))
    emitter.emit('event')
    assert.deepEqual(seen, ['first', 'second'])
    emitter.emit('event')
    assert.deepEqual(seen, ['first', 'second', 'second', 'new'])
  }
})

test('Thumbnail typed facade retains synchronous validation, option mutation and grid geometry', () => {
  const { tool } = create(candidate)
  tool.setup({ number: 10, width: 20, height: 30, column: 3, begin: 5 })
  tool.duration = 100
  assert.deepEqual(JSON.parse(JSON.stringify(tool.creatScreenshotDate())), Array.from({ length: 10 }, (_, i) => ({ time: 10 + i * 10, x: i % 3 * 20, y: Math.floor(i / 3) * 30 })))
  const canvas = tool.creatCanvas()
  assert.equal(canvas.width, 60)
  assert.equal(canvas.height, 150)
  const errors = []
  tool.on('error', value => errors.push(value))
  assert.throws(() => tool.setup({ width: '80' }), /not a number/)
  assert.equal(tool.option.width, 20)
  assert.throws(() => tool.download(), /does not seem to be ready/)
  assert.equal(errors.length, 2)
  assert.equal(tool.errorHandle(true, 'unused'), undefined)
  tool.destroy()
})

test('Thumbnail error event preserves arbitrary thrown message values and Promise rejection identity', async () => {
  for (const failure of [{ message: 7 }, { message: { detail: 'failure' } }, 3, null]) {
    const { tool } = create(candidate)
    tool.setup({ number: 10 })
    tool.file = { name: 'sample.mp4' }
    tool.video.duration = 100
    const errors = []
    tool.on('error', value => errors.push(value))
    tool.on('update', () => {
      throw failure
    })
    const pending = tool.start()
    await Promise.resolve()
    tool.video.oncanplay()
    await assert.rejects(pending, error => error === failure)
    assert.deepEqual(errors, [failure?.message])
    assert.equal(tool.processing, false)
    tool.destroy()
  }
})
