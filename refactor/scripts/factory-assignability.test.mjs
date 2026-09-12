import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Node compatibility runner.
import test from 'node:test'
import ts from 'typescript'
import compat from 'typescript-compat'
import { consumer, declaration, diagnostics, evaluateFactoryProposals, packages } from './factory-assignability.mjs'

test('Factory compatibility proposals retain exact published controls and expose conflicting CommonJS shapes', async () => {
  const records = await evaluateFactoryProposals()
  assert.equal(records.length, 72)
  for (const item of records) {
    const expected = {
      'published-1.0.0': { 'factory-replacement': [], 'require-call': [], 'require-default': [2339] },
      'published-1.1.0': { 'factory-replacement': [], 'require-call': [2349], 'require-default': [] },
      'required-default': { 'factory-replacement': [2741], 'require-call': [], 'require-default': [] },
      'optional-default': { 'factory-replacement': [], 'require-call': [], 'require-default': [2722] },
      'latest-default': { 'factory-replacement': [], 'require-call': [2349], 'require-default': [] },
      'callable-export-equals': { 'factory-replacement': [], 'require-call': [], 'require-default': [2339] },
    }[item.shape][item.usage]
    assert.deepEqual(item.diagnostics.map(diagnostic => diagnostic.code), expected, `${item.name} ${item.compiler} ${item.shape} ${item.usage}`)
  }
})

test('Adding an optional overload breaks replacement factories even without a default property', () => {
  const pkg = packages[1]
  const optionalOverload = declaration(pkg, 'latest-default').replace(
    'declare const plugin: Callable;',
    'interface RuntimeCallable { (option?: Option): (art: Artplayer) => Result; (option: Option): (art: Artplayer) => Result } declare const plugin: RuntimeCallable;',
  )
  for (const compiler of [ts, compat]) {
    assert.deepEqual(diagnostics(compiler, consumer(pkg, 'factory-replacement'), declaration(pkg, 'latest-default')), [])
    assert.deepEqual(diagnostics(compiler, consumer(pkg, 'factory-replacement'), optionalOverload).map(item => item.code), [2322])
  }
})
