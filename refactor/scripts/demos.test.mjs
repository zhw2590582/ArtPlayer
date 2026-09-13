import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Runs with the repository baseline node:test suite.
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

test('Demo additions require complete paths, specific routes and task ownership', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/demo-inventory.json'), 'utf8'))
  const additions = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/demo-additions.json'), 'utf8'))
  for (const mutate of [
    value => value.examples.pop(),
    value => value.examples.push(value.examples[0]),
    value => value.examples[0].route = '/?example=index',
    value => value.examples[0].owner = 'UNKNOWN-01',
    value => value.examples[0].source = 'docs/assets/example/../example/asr.local.js',
    value => value.examples[0].introducedBy = '',
  ]) {
    const changed = structuredClone(additions)
    mutate(changed)
    assert.throws(() => validateDemoInventory(inventory, changed))
  }
})
