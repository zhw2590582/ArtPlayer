import assert from 'node:assert/strict'

export const emitterContracts = {
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
