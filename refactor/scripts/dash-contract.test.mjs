import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Frozen release checks use the built-in runner.
import test from 'node:test'
import { dashFunctionHash, verifyDashContract } from './dash-contract.mjs'

test('DASH Control release and its pre-refactor v4/v5 difference remain immutable', verifyDashContract)

test('DASH function comparison ignores formatting but detects changed SDK calls', async () => {
  const original = 'function uniqBy(a) { return a } export default function artplayerPluginDashControl(dash) { return dash.getQualityFor("video") }'
  const formatted = original.replace('export default ', '').replaceAll(' }', ';\n }')
  assert.equal(await dashFunctionHash(original), await dashFunctionHash(formatted))
  assert.notEqual(await dashFunctionHash(original), await dashFunctionHash(original.replace('getQualityFor', 'getCurrentRepresentationForType')))
  await assert.rejects(dashFunctionHash('function unrelated() {}'), /Expected one function/)
})
