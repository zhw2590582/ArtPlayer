import assert from 'node:assert/strict'

export const emitterContracts = {
  'EVENT.lazy-registry': function (Emitter) {
    const emitter = new Emitter()
    assert.deepEqual(Object.keys(emitter), [])
    emitter.emit('empty').off('empty')
    assert.equal(Object.getOwnPropertyDescriptor(emitter, 'e').enumerable, true)
    assert.deepEqual(Object.keys(emitter.e), [])
    assert.equal(typeof emitter.e.hasOwnProperty, 'function')
  },
  'EVENT.symbol-number-channels': function (Emitter) {
    const emitter = new Emitter()
    const symbol = Symbol('channel')
    const seen = []
    emitter.on(symbol, value => seen.push(value)).on(1, value => seen.push(value))
    emitter.emit(symbol, 'symbol').emit('1', 'numeric')
    emitter.off(symbol).off(1).emit(symbol).emit('1')
    assert.deepEqual(seen, ['symbol', 'numeric'])
  },
  'EVENT.context-removal': function (Emitter) {
    const emitter = new Emitter()
    const seen = []
    function fn() {
      seen.push(this)
    }
    const a = {}
    const b = {}
    emitter.on('value', fn, a).once('value', fn, b)
    const wrapper = emitter.e.value[1].fn
    assert.equal(wrapper._, fn)
    emitter.off('value', wrapper).emit('value')
    assert.deepEqual(seen, [a])
    emitter.on('value', fn, b).off('value', fn).emit('value')
    assert.deepEqual(seen, [a])
  },
  'EVENT.once-throw-consumed': function (Emitter) {
    const emitter = new Emitter()
    const marker = new Error('once failed')
    let calls = 0
    emitter.once('value', () => {
      calls++
      throw marker
    })
    assert.throws(() => emitter.emit('value'), error => error === marker)
    emitter.emit('value')
    assert.equal(calls, 1)
  },
  'EVENT.chain-context-arguments': function (Emitter) {
    const emitter = new Emitter()
    const context = {}
    const payload = {}
    let observed
    assert.equal(emitter.on('value', function (...args) {
      observed = { context: this, args }
    }, context), emitter)
    assert.equal(emitter.emit('value', payload, 42), emitter)
    assert.equal(observed.context, context)
    assert.deepEqual(observed.args, [payload, 42])
    assert.equal(emitter.off('value'), emitter)
  },
  'EVENT.once-reentry': function (Emitter) {
    const emitter = new Emitter()
    let calls = 0
    emitter.once('value', () => {
      calls++
      emitter.emit('value')
    })
    emitter.emit('value').emit('value')
    assert.equal(calls, 1)
  },
  'EVENT.dispatch-snapshot': function (Emitter) {
    const emitter = new Emitter()
    const trace = []
    const second = () => trace.push('second')
    const later = () => trace.push('later')
    emitter.on('value', () => {
      trace.push('first')
      emitter.off('value', second)
      emitter.on('value', later)
    }).on('value', second)
    emitter.emit('value').emit('value')
    assert.deepEqual(trace, ['first', 'second', 'first', 'later'])
  },
  'EVENT.off-original-once': function (Emitter) {
    const emitter = new Emitter()
    let calls = 0
    const listener = () => calls++
    emitter.once('value', listener).off('value', listener).emit('value')
    assert.equal(calls, 0)
    emitter.on('value', listener).on('value', listener).off('value', listener).emit('value')
    assert.equal(calls, 0)
  },
  'EVENT.throw-propagation': function (Emitter) {
    const emitter = new Emitter()
    const marker = new Error('listener failed')
    let later = false
    emitter.on('value', () => {
      throw marker
    }).on('value', () => {
      later = true
    })
    assert.throws(() => emitter.emit('value'), error => error === marker)
    assert.equal(later, false)
  },
}
