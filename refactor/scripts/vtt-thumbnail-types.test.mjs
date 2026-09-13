import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Compatibility declaration runner.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { readMember } from './releases.mjs'
import { verifyVttThumbnailContract } from './vtt-thumbnail-contract.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

test('VTT generated editor globals retain legacy calls and expose separately named data and runtime types', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-vtt-thumbnail/types/artplayer-plugin-vtt-thumbnail.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginVttThumbnail')
  const file = 'docs/assets/ts/artplayer-plugin-vtt-thumbnail.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `declare const art: Artplayer;
const options: artplayerPluginVttThumbnail.Option = { vtt: '/cues.vtt' };
const result: artplayerPluginVttThumbnail.Result = artplayerPluginVttThumbnail(options)(art);
declare const runtime: artplayerPluginVttThumbnail.RuntimeFactory;
const pending: Promise<artplayerPluginVttThumbnail.Result> = runtime(options)(art);
// @ts-expect-error Legacy extraction stays synchronous.
const changed: Promise<artplayerPluginVttThumbnail.Result> = result;
// @ts-expect-error URL must be text.
artplayerPluginVttThumbnail({ vtt: 12 });`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 2)
  }
})

test('VTT public legacy extraction remains exact while runtime entry gives cast-free Promise types', () => {
  const source = fs.readFileSync('test/types/vtt-thumbnail-public.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    assert.equal(checkConsumer(compiler, mode, source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')).length, 10)
  }
})

test('VTT runtime CommonJS declaration supports direct and default calls without an interop cast', () => {
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', `import runtime = require('artplayer-plugin-vtt-thumbnail/runtime');
import legacy = require('artplayer-plugin-vtt-thumbnail');
import type Artplayer from 'artplayer'; declare const art: Artplayer;
const first = runtime({})(art); const second = runtime.default({})(art);
const promise: Promise<{name: 'artplayerPluginVttThumbnail'}> = first;
legacy.default({})(art).name; void [promise, second];`), [])
})

test('VTT all five historical declarations keep the same default-import consumers and replaceable old factory', async () => {
  const contract = await verifyVttThumbnailContract()
  const consumer = fs.readFileSync('refactor/fixtures/consumers/vtt-thumbnail-published.ts', 'utf8')
  for (const release of [contract.baseline.release, ...contract.baseline.previous]) {
    const old = readMember(contract.archives.get(release.version), `package/${release.manifest.types.replace(/^\.\//, '')}`).toString()
    for (const compiler of [ts, compat]) {
      const filename = path.resolve('test/types/vtt-historical-consumer.ts')
      const declaration = path.resolve('test/types/vtt-historical.d.ts')
      const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] }
      function historical(source) {
        const host = compiler.createCompilerHost(options)
        const read = host.getSourceFile.bind(host)
        host.getSourceFile = (file, language, ...rest) => path.resolve(file) === filename
          ? compiler.createSourceFile(file, source.replace('from \'artplayer-plugin-vtt-thumbnail\'', 'from \'./vtt-historical\''), language, true)
          : path.resolve(file) === declaration ? compiler.createSourceFile(file, old, language, true) : read(file, language, ...rest)
        const exists = host.fileExists.bind(host)
        host.fileExists = file => path.resolve(file) === declaration || exists(file)
        return compiler.getPreEmitDiagnostics(compiler.createProgram([filename, declaration], options, host)).map(error => error.code)
      }
      assert.deepEqual(historical(consumer), [])
      assert.deepEqual(historical(`${consumer}\nvtt();`), [2554])
      assert.deepEqual(historical(`${consumer}\nconst absent: Parameters<typeof vtt>[0] = undefined;`), [2322])
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', consumer), [])
    }
  }
})
