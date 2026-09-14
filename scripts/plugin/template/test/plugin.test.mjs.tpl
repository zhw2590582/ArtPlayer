import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
// eslint-disable-next-line test/no-import-node-test -- Verify the generated distribution contracts.
import test from 'node:test'
import plugin from 'artplayer-plugin-{{name}}'
import legacy from 'artplayer-plugin-{{name}}/legacy'

test('classic factory and historical default alias return the synchronous plugin result', () => {
  const require = createRequire(import.meta.url)
  for (const factory of [plugin, legacy, require('artplayer-plugin-{{name}}'), require('artplayer-plugin-{{name}}/legacy')]) {
    assert.equal(factory.default, factory)
    const result = factory({})({})
    assert.deepEqual(result, { name: '{{export}}' })
    assert.equal(result instanceof Promise, false)
  }
})
