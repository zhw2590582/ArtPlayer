import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Cleanup exception identity uses the Node lifecycle runner.
import test from 'node:test'
import { bothMenus, dashHost, dashImplementations } from './helpers/dash-control.js'

const implementations = (await dashImplementations()).filter(item => item.name.startsWith('source') || item.name.startsWith('artifact'))
const failures = [undefined, null, false, 0, -0, '', Number.NaN]
function attempt(callback) {
  try {
    callback()
    return { threw: false }
  }
  catch (error) {
    return { threw: true, error }
  }
}

for (const { sdk, name, factory } of implementations) {
  for (const trigger of ['update', 'destroy']) {
    test(`DASH ${sdk} (${name}): ${trigger} preserves the first falsy menu cleanup failure`, (t) => {
      const warnings = []
      t.mock.method(console, 'warn', (...args) => warnings.push(args))
      for (const failure of failures) {
        const host = dashHost(sdk)
        const plugin = factory(bothMenus())(host.art)
        plugin.update()
        const calls = []
        for (const surface of ['controls', 'setting']) {
          const remove = host.art[surface].remove
          host.art[surface].remove = (key) => {
            remove(key)
            calls.push([surface, key])
            if (surface === 'controls' && key === 'dash-quality')
              throw failure
            throw new Error(`later ${surface}/${key} failure`)
          }
        }
        if (trigger === 'update') {
          host.state.levels = []
          host.state.tracks = []
        }
        const result = attempt(() => trigger === 'update' ? plugin.update() : host.art.destroy())
        assert.equal(result.threw, true)
        assert(Object.is(result.error, failure), 'Later menu cleanup errors cannot replace the first value')
        assert.deepEqual(calls, [['controls', 'dash-quality'], ['setting', 'dash-quality'], ['controls', 'dash-audio'], ['setting', 'dash-audio']])
        assert.equal(host.controls.size + host.settings.size, 0)
        if (trigger === 'destroy') {
          assert.equal([...host.listeners.values()].reduce((sum, list) => sum + list.size, 0), 0)
          assert.doesNotThrow(() => host.art.destroy())
        }
      }
      if (trigger === 'update') {
        assert.equal(warnings.length, failures.length)
        assert(warnings.every(([message, error]) => message === 'ArtPlayer DASH cleanup failed:' && error instanceof Error))
      }
      else {
        assert.equal(warnings.length, 0)
      }
    })
  }

  test(`DASH ${sdk} (${name}): SDK unsubscribe preserves a falsy first failure while releasing all resources`, () => {
    for (const failure of failures) {
      const host = dashHost(sdk)
      const events = new Map()
      host.dash.on = (name, callback) => events.set(name, callback)
      let offCalls = 0
      host.dash.off = (name) => {
        events.delete(name)
        if (++offCalls === 1)
          throw failure
        throw new Error('later SDK removal failure')
      }
      factory(bothMenus())(host.art).update()
      const count = events.size
      assert(count > 0)
      const result = attempt(() => host.art.destroy())
      assert.equal(result.threw, true)
      assert(Object.is(result.error, failure))
      assert.equal(offCalls, count)
      assert.equal(events.size, 0)
      assert.equal(host.controls.size + host.settings.size, 0)
      assert.equal([...host.listeners.values()].reduce((sum, list) => sum + list.size, 0), 0)
      assert(!host.calls.some(call => call[0] === 'dash.destroy'), 'SDK remains caller-owned')
    }
  })
}
