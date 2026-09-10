import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { validateDemoInventory } from './demos.mjs'
import { refactorDir } from './releases.mjs'

test('Demo inventory rejects missing files, routes and ecosystem packages', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/demo-inventory.json'), 'utf8'))
  validateDemoInventory(inventory)
  for (const mutate of [
    value => value.examples.pop(),
    value => value.pages.pop(),
    value => value.examples.find(item => item.menuLinks.length).menuLinks.pop(),
    value => value.packages.pop(),
  ]) {
    const changed = structuredClone(inventory)
    mutate(changed)
    assert.throws(() => validateDemoInventory(changed))
  }
})
