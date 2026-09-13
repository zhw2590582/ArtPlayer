import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Repository compatibility runner.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { publicInvalid, publicSource, runtimeInvalid, runtimeSource } from './auto-thumbnail-consumer.mjs'
import { verifyAutoThumbnailContract } from './auto-thumbnail-contract.mjs'
import { readMember } from './releases.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

test('Auto Thumbnail preserves actual npm 1.1.0 root bytes and historical factory extraction', async () => {
  const contract = await verifyAutoThumbnailContract()
  const current = fs.readFileSync('packages/artplayer-plugin-auto-thumbnail/types/artplayer-plugin-auto-thumbnail.d.ts', 'utf8')
  const previous = readMember(contract.archives.get('1.1.0'), 'package/types/artplayer-plugin-auto-thumbnail.d.ts').toString()
  assert.equal(current.replaceAll('\r\n', '\n'), previous.replaceAll('\r\n', '\n'))
  for (const [compiler, mode] of modes) {
    const source = publicSource(mode)
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    const invalid = checkConsumer(compiler, mode, `${source}\n${publicInvalid.join('\n')}`)
    assert.deepEqual(invalid.map(item => item.line), publicInvalid.map((_, index) => source.split('\n').length + 1 + index))
  }
})

test('Auto Thumbnail runtime types expose only the real asynchronous factory and options', () => {
  for (const [compiler, mode] of modes) {
    const source = runtimeSource(mode)
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    const invalid = checkConsumer(compiler, mode, `${source}\n${runtimeInvalid.join('\n')}`)
    assert.deepEqual(invalid.map(item => item.line), runtimeInvalid.map((_, index) => source.split('\n').length + 1 + index))
  }
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', `import runtime = require('artplayer-plugin-auto-thumbnail/runtime');
import type Artplayer from 'artplayer'; declare const art: Artplayer;
const option: runtime.Option = {}; const result: Promise<runtime.Result> = runtime(option)(art);
const factory: runtime.Factory = runtime; const alias: runtime.RuntimeFactory = runtime.default;
const second: Promise<runtime.Result> = alias(option)(art); void [result, factory, second];`), [])
})

test('Auto Thumbnail generated editor globals replace conflicting export assignments and retain old calls', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-auto-thumbnail/types/artplayer-plugin-auto-thumbnail.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginAutoThumbnail')
  const file = 'docs/assets/ts/artplayer-plugin-auto-thumbnail.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `declare const art: Artplayer;
type Option = Parameters<typeof artplayerPluginAutoThumbnail>[0];
type Result = ReturnType<ReturnType<typeof artplayerPluginAutoThumbnail>>;
const option: Option = { width: 80, number: 12 };
const result: Result = artplayerPluginAutoThumbnail(option)(art);
const replacement: typeof artplayerPluginAutoThumbnail = _option => _art => result;`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    const invalid = checkPluginEditorDeclaration(generated, core, `${consumer}\nartplayerPluginAutoThumbnail();\nconst bad: Promise<Result> = result;`, compiler)
    assert.deepEqual(invalid.map(item => item.code), [2554, 2739])
    const previous = `${source.replace(/^import.*$/gim, '')}\nexport = artplayerPluginAutoThumbnail;\nexport as namespace artplayerPluginAutoThumbnail;\n`
    assert(checkPluginEditorDeclaration(previous, core, '', compiler).some(item => item.code === 2309))
  }
})
