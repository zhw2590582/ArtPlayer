import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Public declaration compatibility runner.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { verifyMultipleSubtitlesContract } from './multiple-subtitles-contract.mjs'
import { readMember } from './releases.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

test('Multiple subtitles editor globals keep old extraction and expose explicit asynchronous types', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-multiple-subtitles/types/artplayer-plugin-multiple-subtitles.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginMultipleSubtitles')
  const file = 'docs/assets/ts/artplayer-plugin-multiple-subtitles.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `declare const art: Artplayer;
const option: artplayerPluginMultipleSubtitles.Option = { subtitles: [{name: 'en'}] };
const old: artplayerPluginMultipleSubtitles.LegacyResult = artplayerPluginMultipleSubtitles(option)(art);
declare const runtime: artplayerPluginMultipleSubtitles.RuntimeFactory;
const pending: Promise<artplayerPluginMultipleSubtitles.Result> = runtime({})(art);
pending.then(result => { result.tracks(['en']); result.reset(); });
// @ts-expect-error Historical extraction remains synchronous.
const changed: Promise<artplayerPluginMultipleSubtitles.Result> = old;
// @ts-expect-error URL is text.
artplayerPluginMultipleSubtitles({ subtitles: [{ url: 1 }] });`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 2)
  }
})

test('Multiple subtitles public extraction stays exact in five modes while runtime methods need no cast', () => {
  const source = fs.readFileSync('test/types/multiple-subtitles-public.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    assert.equal(checkConsumer(compiler, mode, source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')).length, 12)
  }
})

test('Multiple subtitles runtime CommonJS supports direct and default calls', () => {
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', `import runtime = require('artplayer-plugin-multiple-subtitles/runtime');
import legacy = require('artplayer-plugin-multiple-subtitles');
import type Artplayer from 'artplayer'; declare const art: Artplayer;
const first = runtime({})(art); const second = runtime.default({})(art);
const promise: Promise<{name: 'multipleSubtitles', tracks(names?: string[]): void, reset(): void}> = first;
legacy.default({subtitles: []})(art).name; void [promise, second];`), [])
})

test('Multiple subtitles raw callable module alternatives retain the required-default versus replacement conflict', () => {
  const source = fs.readFileSync('refactor/fixtures/consumers/multiple-subtitles-export-alternatives.ts', 'utf8')
  for (const [compiler, mode] of [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [compat, 'node10-commonjs']]) {
    assert.deepEqual(checkConsumer(compiler, mode, source).map(item => ({ line: item.line, code: item.code })), [{ line: 4, code: 2322 }, { line: 6, code: 2722 }])
  }
})

test('Multiple subtitles actual three historical declarations retain default-import and replacement consumers', async () => {
  const contract = await verifyMultipleSubtitlesContract()
  const consumer = fs.readFileSync('refactor/fixtures/consumers/multiple-subtitles-published.ts', 'utf8')
  for (const release of [contract.baseline.release, ...contract.baseline.previous]) {
    const old = readMember(contract.archives.get(release.version), `package/${release.manifest.types.replace(/^\.\//, '')}`).toString()
    for (const compiler of [ts, compat]) {
      const filename = path.resolve('test/types/multiple-subtitles-historical-consumer.ts')
      const declaration = path.resolve('test/types/multiple-subtitles-historical.d.ts')
      const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] }
      function historical(source) {
        const host = compiler.createCompilerHost(options)
        const read = host.getSourceFile.bind(host)
        host.getSourceFile = (file, language, ...rest) => path.resolve(file) === filename
          ? compiler.createSourceFile(file, source.replace('from \'artplayer-plugin-multiple-subtitles\'', 'from \'./multiple-subtitles-historical\''), language, true)
          : path.resolve(file) === declaration ? compiler.createSourceFile(file, old, language, true) : read(file, language, ...rest)
        const exists = host.fileExists.bind(host)
        host.fileExists = file => path.resolve(file) === declaration || exists(file)
        return compiler.getPreEmitDiagnostics(compiler.createProgram([filename, declaration], options, host)).map(error => error.code)
      }
      assert.deepEqual(historical(consumer), [])
      assert.deepEqual(historical(`${consumer}\nsubtitles();`), [2554])
      assert.deepEqual(historical(`${consumer}\nconst absent: Parameters<typeof subtitles>[0] = undefined;`), [2322])
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', consumer), [])
    }
  }
})
