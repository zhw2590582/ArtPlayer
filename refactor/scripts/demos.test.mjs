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
  assert.doesNotThrow(() => validateDemoInventory(inventory, additions))
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

test('Added HTML pages retain exact routes, unique paths and accountable introductions', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/demo-inventory.json'), 'utf8'))
  const additions = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/demo-additions.json'), 'utf8'))
  assert.doesNotThrow(() => validateDemoInventory(inventory, additions))
  const pending = structuredClone(additions)
  delete pending.pages[0].introducedBy
  pending.pages[0].introducedAfter = JSON.parse(fs.readFileSync(path.join(refactorDir, 'tasks.json'), 'utf8')).baselineCommit
  assert.doesNotThrow(() => validateDemoInventory(inventory, pending), 'A new page can record its pre-change baseline without requiring its own future commit hash')
  for (const [mutate, error] of [
    [value => value.pages.pop(), /HTML route coverage drift/],
    [value => value.pages.push(value.pages[0]), /Duplicate baseline\/addition HTML paths/],
    [value => value.pages[0].source = 'docs/document/../private.html', /Invalid added HTML path/],
    [value => value.pages[0].route += '?ignored=1', /Added page route does not match its HTML path/],
    [value => value.pages[0].owner = 'UNKNOWN-01', /Missing added page owner/],
    [value => value.pages[0].finalDemoOwner = 'SITE-01', /Missing added page owner/],
    [value => value.pages[0].introducedBy = '', /Missing page introduction commit/],
    [value => value.pages[0].introducedAfter = value.pages[0].introducedBy, /Page requires one introduction reference/],
    [value => delete value.pages[0].introducedBy, /Page requires one introduction reference/],
    [value => value.pages = false, /Invalid added pages/],
  ]) {
    const changed = structuredClone(additions)
    mutate(changed)
    assert.throws(() => validateDemoInventory(inventory, changed), error)
  }
})
