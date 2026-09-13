import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Repository baseline runner.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { jassubConsumerSource, jassubInvalidStatements, jassubRuntimeSource } from './jassub-consumer.mjs'
import { verifyJassubContract } from './jassub-contract.mjs'
import { readMember } from './releases.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

test('JASSUB keeps both actual published root declarations without changing historical extraction or replacement types', async () => {
  const contract = await verifyJassubContract()
  const candidate = fs.readFileSync('packages/artplayer-plugin-jassub/types/artplayer-plugin-jassub.d.ts', 'utf8').replaceAll('\r\n', '\n')
  for (const archive of contract.archives.values())
    assert.equal(candidate, readMember(archive, 'package/types/artplayer-plugin-jassub.d.ts').toString().replaceAll('\r\n', '\n'))
  for (const [compiler, mode] of modes) {
    const source = jassubConsumerSource(mode)
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    const errors = checkConsumer(compiler, mode, `${source}\n${jassubInvalidStatements.join('\n')}\n`)
    assert.deepEqual(errors.map(item => item.line), jassubInvalidStatements.map((_, index) => source.split('\n').length + 1 + index))
  }
})

test('JASSUB runtime entry checks optional options, sync instances, worker messages, callbacks and invalid consumers', () => {
  for (const [compiler, mode] of modes) {
    const source = jassubRuntimeSource(mode)
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    const invalid = checkConsumer(compiler, mode, source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''))
    const expected = []
    let line = 1
    for (const text of source.split('\n')) {
      if (text.startsWith('// @ts-expect-error'))
        expected.push(line)
      else line++
    }
    assert.equal(expected.length, 14)
    assert.deepEqual(invalid.map(item => item.line), expected, `${compiler.version} ${mode}: each negative statement must fail independently`)
  }
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', `import root = require('artplayer-plugin-jassub'); import legacy = require('artplayer-plugin-jassub/legacy'); import runtime = require('artplayer-plugin-jassub/runtime');
const option: root.JassubOption = {workerUrl: '/worker.js', wasmUrl: '/worker.wasm', modernWasmUrl: '/modern.wasm'};
root.default(option); legacy.default(option); runtime(); const value: runtime.RuntimeOption = {}; runtime(value);`), [])
})

test('JASSUB generated editor declaration preserves the old global API and is valid in both compilers', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-jassub/types/artplayer-plugin-jassub.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginJassub')
  const file = 'docs/assets/ts/artplayer-plugin-jassub.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `declare const art: Artplayer;
const option: artplayerPluginJassub.JassubOption = {workerUrl: '/worker.js', wasmUrl: '/worker.wasm', modernWasmUrl: '/modern.wasm'};
const result = artplayerPluginJassub(option)(art);
const promise: Promise<void> = result.instance.resize(true, 640, 360);
const replacement: typeof artplayerPluginJassub = (_option) => (_art) => result;
// @ts-expect-error Keep the historical required options argument.
artplayerPluginJassub();
// @ts-expect-error Keep the historical required resource URLs.
artplayerPluginJassub({});
// @ts-expect-error Global editor uses the historical force-first resize signature.
result.instance.resize(640);`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 3)
    const oldEditor = `${source.replace(/^import.*$/gim, '')}\nexport = artplayerPluginJassub;\nexport as namespace artplayerPluginJassub;\n`
    assert(checkPluginEditorDeclaration(oldEditor, core, '', compiler).some(item => item.code === 2309), 'Reproduce the former conflicting export assignment before claiming the editor fix')
  }
})
