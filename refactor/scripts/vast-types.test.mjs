import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Repository baseline runner.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { readMember } from './releases.mjs'
import { runtimeNegatives } from './vast-consumer.mjs'
import { verifyVastContract } from './vast-contract.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

test('VAST frozen workspace declaration reproduces the approved npm consumer conflict', async () => {
  const contract = await verifyVastContract()
  const historical = contract.sources.get('packages/artplayer-plugin-vast/types/artplayer-plugin-vast.d.ts')
  const source = fs.readFileSync('refactor/fixtures/consumers/vast-published.ts', 'utf8').replace('from \'artplayer-plugin-vast\'', 'from \'./vast-workspace-history\'')
  for (const compiler of [ts, compat]) {
    const filename = path.resolve('test/types/vast-history-consumer.ts')
    const declaration = path.resolve('test/types/vast-workspace-history.d.ts')
    const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, target: compiler.ScriptTarget.ES2020, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] }
    const host = compiler.createCompilerHost(options)
    const original = host.getSourceFile.bind(host)
    host.getSourceFile = (file, language, ...rest) => path.resolve(file) === filename
      ? compiler.createSourceFile(file, source, language, true)
      : path.resolve(file) === declaration ? compiler.createSourceFile(file, historical, language, true) : original(file, language, ...rest)
    const exists = host.fileExists.bind(host)
    host.fileExists = file => path.resolve(file) === declaration || exists(file)
    const program = compiler.createProgram([filename, declaration], options, host)
    const codes = compiler.getPreEmitDiagnostics(program).map(item => item.code)
    assert.deepEqual(codes, [2344, 2344, 2344, 2322, 2339, 2339, compiler === ts ? 18047 : 2531])
  }
})

test('VAST root retains actual npm declaration bytes and complete factory extraction/replacement', async () => {
  const contract = await verifyVastContract()
  const published = readMember(contract.archives.get('artplayer-plugin-vast@1.0.0'), 'package/types/artplayer-plugin-vast.d.ts').toString().replaceAll('\r\n', '\n')
  assert.equal(fs.readFileSync('packages/artplayer-plugin-vast/types/artplayer-plugin-vast.d.ts', 'utf8').replaceAll('\r\n', '\n'), published)
  const source = fs.readFileSync('refactor/fixtures/consumers/vast-published.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    const invalid = `${source}\nvast();\nvast(undefined);\nvast.default(() => {});\n`
    assert.deepEqual(checkConsumer(compiler, mode, invalid).map(item => item.code), [2554, 2345, 2339])
    assert.deepEqual(checkConsumer(compiler, mode, source.replaceAll('\'artplayer-plugin-vast\'', '\'artplayer-plugin-vast/legacy\'')), [])
  }
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', `import vast = require('artplayer-plugin-vast'); vast(({id}) => id);`), [])
})

test('VAST runtime checks both initialization modes, SDK fields and async results in current and old compilers', () => {
  assert.equal(fs.readFileSync('packages/artplayer-plugin-vast/types/runtime.d.ts', 'utf8'), fs.readFileSync('packages/artplayer-plugin-vast/types/runtime.d.cts', 'utf8'))
  const source = fs.readFileSync('test/types/vast-runtime.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    const { invalid, expected } = runtimeNegatives(source)
    const errors = checkConsumer(compiler, mode, invalid)
    assert.deepEqual(errors.map(item => item.line), expected, `${compiler.version} ${mode}: every invalid statement must fail on its own line`)
  }
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', `import vast = require('artplayer-plugin-vast/runtime');
const mode: vast.CompatibilityOptions = {compatibility:'workspace-1.2'};
vast(({imaPlayer}) => imaPlayer.addEventListener('AdStarted', () => {})); vast.default(undefined, mode);`), [])
})

test('VAST editor preserves the published global callback and pure synchronous historical factory', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-vast/types/artplayer-plugin-vast.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginVast')
  const file = 'docs/assets/ts/artplayer-plugin-vast.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `declare const art: Artplayer;
const factory: typeof artplayerPluginVast = (_option) => (_art) => ({name: 'artplayerPluginVast'});
const result: {name: 'artplayerPluginVast'} = artplayerPluginVast(({id, $container, imaPlayer}) => {
const idValue: string = id; const node: HTMLDivElement = $container; imaPlayer.addEventListener('AdStarted', () => {}); void [idValue, node]; })(art);
// @ts-expect-error Historical callback remains required.
artplayerPluginVast();
// @ts-expect-error New options and accurate Promise belong to runtime entry.
artplayerPluginVast(() => {}, {compatibility:'workspace-1.2'});
void [factory, result];`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 2)
  }
})
