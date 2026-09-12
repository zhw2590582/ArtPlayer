import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate event regressions are also run against the frozen workspace.
import test from 'node:test'
import { thumbnailCandidate, thumbnailEnvironment } from './helpers/thumbnail.js'

const implementation = await thumbnailCandidate()
function create() {
  const env = thumbnailEnvironment(implementation)
  return new env.Factory({ fileInput: new env.Element('input') })
}

test('Thumbnail emitter accepts prototype-colliding event names without changing its registry prototype', () => {
  for (const name of ['__proto__', 'constructor', 'toString', 'valueOf', 'hasOwnProperty', '__defineGetter__']) {
    const tool = create()
    assert.equal(tool.emit(name), tool)
    assert.equal(tool.off(name, () => {}), tool)
    const prototype = Object.getPrototypeOf(tool.e)
    let calls = 0
    const callback = () => calls++
    tool.on(name, callback).once(name, callback)
    const descriptor = Object.getOwnPropertyDescriptor(tool.e, name)
    assert.equal(descriptor.enumerable, true)
    assert.equal(descriptor.configurable, true)
    assert.equal(descriptor.writable, true)
    tool.emit(name).emit(name)
    assert.equal(calls, 3)
    tool.off(name, callback)
    assert.equal(Object.hasOwn(tool.e, name), false)
    assert.equal(Object.getPrototypeOf(tool.e), prototype)
    tool.destroy()
  }
})

test('Thumbnail emitter does not read inherited listener getters or trigger inherited setters', () => {
  const tool = create()
  let reads = 0
  let writes = 0
  const prototype = Object.create(null, {
    value: {
      get() {
        reads++
        return []
      },
      set() { writes++ },
    },
  })
  tool.e = Object.create(prototype)
  tool.emit('value').off('value', () => {})
  let calls = 0
  tool.on('value', () => calls++).emit('value')
  assert.equal(calls, 1)
  assert.equal(reads, 0)
  assert.equal(writes, 0)
  assert.equal(Object.getPrototypeOf(tool.e), prototype)
  tool.off('value')
  assert.equal(Object.hasOwn(tool.e, 'value'), false)
  tool.destroy()
})

test('Thumbnail once is consumed once across nested dispatch snapshots', () => {
  const tool = create()
  let nesting = false
  const seen = []
  tool.on('value', (value) => {
    if (!nesting) {
      nesting = true
      tool.emit('value', 'inner')
    }
    seen.push(`on:${value}`)
  })
  tool.once('value', value => seen.push(`once:${value}`))
  tool.emit('value', 'outer')
  assert.deepEqual(seen, ['on:inner', 'once:inner', 'on:outer'])
  tool.destroy()
})

test('Thumbnail nested once callback failure stays consumed when its caller catches the error', () => {
  const tool = create()
  let nesting = false
  let calls = 0
  const failure = { reason: 'once listener' }
  tool.on('value', () => {
    if (nesting)
      return
    nesting = true
    assert.throws(() => tool.emit('value'), error => error === failure)
  })
  tool.once('value', () => {
    calls++
    throw failure
  })
  assert.doesNotThrow(() => tool.emit('value'))
  assert.equal(calls, 1)
  tool.emit('value')
  assert.equal(calls, 1)
  tool.destroy()
})

test('Thumbnail once re-registration is independent from a consumed outer registration', () => {
  const tool = create()
  let nesting = false
  const seen = []
  tool.on('value', () => {
    if (!nesting) {
      nesting = true
      tool.emit('value', 'inner')
    }
  })
  function callback(value) {
    seen.push(value)
    if (value === 'inner')
      tool.once('value', callback)
  }
  tool.once('value', callback).emit('value', 'outer').emit('value', 'next')
  assert.deepEqual(seen, ['inner', 'next'])
  tool.destroy()
})

test('Thumbnail keeps duplicate registrations, symbol/numeric names and independent instance registries', () => {
  const first = create()
  const second = create()
  for (const name of [0, Symbol('event')]) {
    let firstCalls = 0
    let secondCalls = 0
    const callback = () => firstCalls++
    first.once(name, callback).once(name, callback)
    second.on(name, () => secondCalls++)
    first.emit(name).emit(name)
    assert.equal(firstCalls, 2)
    assert.equal(secondCalls, 0)
    second.emit(name)
    assert.equal(secondCalls, 1)
    assert.notEqual(first.e, second.e)
  }
  first.destroy()
  second.destroy()
})
