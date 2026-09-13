import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Runs with the repository baseline node:test suite.
import test from 'node:test'
import { captureSiteInventory, validateSiteInventory } from './site-inventory.mjs'

test('Site inventory detects omitted HTML, declarations and fingerprint drift', () => {
  const snapshot = captureSiteInventory()
  validateSiteInventory(snapshot)
  for (const mutate of [
    value => value.pages = value.pages.filter(page => page.source !== 'docs/mobile.html'),
    value => value.editorDeclarations.pop(),
    value => value.assets[0].sha256 = 'changed',
    value => value.api.pop(),
  ]) {
    const changed = structuredClone(snapshot)
    mutate(changed)
    assert.throws(() => validateSiteInventory(changed))
  }
})
