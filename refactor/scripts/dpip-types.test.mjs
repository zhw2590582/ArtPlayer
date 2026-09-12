import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Node compatibility baseline runner.
import test from 'node:test'
import vm from 'node:vm'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { verifyDpipContract } from './dpip-contract.mjs'
import { readMember } from './releases.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

test('Document PiP types retain required extraction and assignable void results alongside an opt-in precise view', () => {
  const source = fs.readFileSync('test/types/dpip.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    assert.equal(checkConsumer(compiler, mode, source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')).length, 14)
  }
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', `import dpip = require('artplayer-plugin-document-pip'); import legacy = require('artplayer-plugin-document-pip/legacy');
const options: dpip.Option = { width: 640 }; dpip.default(options); legacy.default(options);`), [])
})

test('Document PiP all four published declarations accept the same old result replacements and required Parameters', async () => {
  const contract = await verifyDpipContract()
  const source = fs.readFileSync('refactor/fixtures/consumers/dpip-published.ts', 'utf8')
  for (const version of ['1.0.0', '1.0.1', '1.0.2', '1.1.0']) {
    const old = readMember(contract.archives.get(version), 'package/types/artplayer-plugin-document-pip.d.ts').toString()
    for (const compiler of [ts, compat]) {
      const filename = path.resolve('test/types/dpip-history.ts')
      const declaration = path.resolve('test/types/dpip-history.d.ts')
      function historical(code) {
        const host = compiler.createCompilerHost({})
        const original = host.getSourceFile.bind(host)
        host.getSourceFile = (file, language, ...rest) => path.resolve(file) === filename
          ? compiler.createSourceFile(file, code.replace('from \'artplayer-plugin-document-pip\'', 'from \'./dpip-history\''), language, true)
          : path.resolve(file) === declaration ? compiler.createSourceFile(file, old, language, true) : original(file, language, ...rest)
        const exists = host.fileExists.bind(host)
        host.fileExists = file => path.resolve(file) === declaration || exists(file)
        const program = compiler.createProgram([filename, declaration], { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] }, host)
        assert(program.getSourceFile(declaration))
        return compiler.getPreEmitDiagnostics(program).map(item => item.code)
      }
      const replacements = `${source}\nconst replacement: typeof dpip = (_option: Parameters<typeof dpip>[0]) => (_art: Artplayer) => fake;`
      assert.deepEqual(historical(replacements), [])
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', replacements), [])
      assert.deepEqual(historical(`${source}\ndpip();`), [2554])
      assert.deepEqual(historical(`${source}\nconst missing: Parameters<typeof dpip>[0] = undefined;`), [2322])
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', `${source}\ndpip();`).map(item => item.code), [2554])
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', `${source}\nconst missing: Parameters<typeof dpip>[0] = undefined;`).map(item => item.code), [2322])
    }
  }
})

test('Document PiP editor globals preserve legacy results and explicitly expose readonly async actions', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-document-pip/types/artplayer-plugin-document-pip.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginDocumentPip')
  const file = 'docs/assets/ts/artplayer-plugin-document-pip.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `artplayerPluginDocumentPip({ width: 640 });
const factory = artplayerPluginDocumentPip as artplayerPluginDocumentPip.RuntimeFactory; factory(); factory.default();
declare const runtime: artplayerPluginDocumentPip.AsyncResult;
const opening: Promise<void> = runtime.open(); const old: artplayerPluginDocumentPip.Result = runtime;
old.open = () => {};
// @ts-expect-error Precise runtime capability is readonly.
runtime.isSupported = false;
// @ts-expect-error Dimensions remain numeric.
artplayerPluginDocumentPip({ width: '640' });`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 2)
  }
})

test('Document PiP production main, legacy, globals and native ESM preserve callable and default identities', async () => {
  for (const suffix of ['js', 'legacy.js']) {
    const source = fs.readFileSync(`packages/artplayer-plugin-document-pip/dist/artplayer-plugin-document-pip.${suffix}`, 'utf8')
    const module = { exports: {} }
    vm.runInNewContext(source, { module, exports: module.exports, window: {} })
    assert.equal(typeof module.exports, 'function')
    assert.equal(module.exports.default, module.exports)
    assert.equal(typeof module.exports.default(), 'function')
    const global = { window: {} }
    vm.runInNewContext(source, global)
    const factory = global.artplayerPluginDocumentPip || global.window.artplayerPluginDocumentPip
    assert.equal(factory.default, factory)
  }
  const source = fs.readFileSync('packages/artplayer-plugin-document-pip/dist/artplayer-plugin-document-pip.mjs', 'utf8')
  const module = await import(`data:text/javascript,${encodeURIComponent(source)}`)
  assert.deepEqual(Object.keys(module), ['default'])
  assert.equal(module.default.default, module.default)
})
