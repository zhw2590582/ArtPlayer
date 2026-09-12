import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Node baseline runner.
import test from 'node:test'
import vm from 'node:vm'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { verifyCanvasContract } from './canvas-contract.mjs'
import { readMember } from './releases.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

test('Canvas current types preserve optional Parameters and exact Canvas result, while rejecting eleven invalid uses', () => {
  const source = fs.readFileSync('test/types/canvas.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    assert.equal(checkConsumer(compiler, mode, source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')).length, 11)
  }
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', `import canvas = require('artplayer-proxy-canvas'); import legacy = require('artplayer-proxy-canvas/legacy');
const callback: canvas.Option = (ctx, video) => ctx.drawImage(video, 0, 0); canvas(callback); canvas.default(); legacy(); legacy.default(callback);`), [])
})

test('Canvas published declarations distinguish required 1.0.0 and optional 1.1.0 callbacks without changing Canvas return assignability', async () => {
  const contract = await verifyCanvasContract()
  const source = fs.readFileSync('refactor/fixtures/consumers/canvas-published.ts', 'utf8')
  const optional = `const omitted: Parameters<typeof canvas>[0] = undefined; canvas(); void omitted;`
  for (const version of ['1.0.0', '1.1.0']) {
    const old = readMember(contract.archives.get(version), 'package/types/artplayer-proxy-canvas.d.ts').toString()
    for (const compiler of [ts, compat]) {
      const filename = path.resolve('test/types/canvas-history.ts')
      const declaration = path.resolve('test/types/canvas-history.d.ts')
      function historical(code) {
        const host = compiler.createCompilerHost({})
        const original = host.getSourceFile.bind(host)
        host.getSourceFile = (file, language, ...rest) => path.resolve(file) === filename
          ? compiler.createSourceFile(file, code.replace('from \'artplayer-proxy-canvas\'', 'from \'./canvas-history\''), language, true)
          : path.resolve(file) === declaration ? compiler.createSourceFile(file, old, language, true) : original(file, language, ...rest)
        const exists = host.fileExists.bind(host)
        host.fileExists = file => path.resolve(file) === declaration || exists(file)
        const program = compiler.createProgram([filename, declaration], { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] }, host)
        assert(program.getSourceFile(declaration))
        return compiler.getPreEmitDiagnostics(program).map(item => item.code)
      }
      assert.deepEqual(historical(source), [])
      assert.deepEqual(historical(`${source}\n${optional}`), version === '1.0.0' ? [2322, 2554] : [])
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', `${source}\n${optional}`), [])
    }
  }
})

test('Canvas editor globals are generated from public types with optional callback, media view and negative checking', async () => {
  const source = fs.readFileSync('packages/artplayer-proxy-canvas/types/artplayer-proxy-canvas.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerProxyCanvas')
  const file = 'docs/assets/ts/artplayer-proxy-canvas.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `artplayerProxyCanvas(); artplayerProxyCanvas.default((ctx, video) => ctx.drawImage(video, 0, 0));
const result: artplayerProxyCanvas.Result = document.createElement('canvas');
const media = result as artplayerProxyCanvas.MediaCanvas; media.play();
// @ts-expect-error Callback must be a function in public types.
artplayerProxyCanvas(42);`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 1)
  }
})

test('Canvas production main, legacy, browser global and ESM preserve both callable and historical default identities', async () => {
  for (const suffix of ['js', 'legacy.js']) {
    const source = fs.readFileSync(`packages/artplayer-proxy-canvas/dist/artplayer-proxy-canvas.${suffix}`, 'utf8')
    const module = { exports: {} }
    vm.runInNewContext(source, { module, exports: module.exports, window: {} })
    assert.equal(typeof module.exports, 'function')
    assert.equal(module.exports.default, module.exports)
    assert.equal(typeof module.exports.default(), 'function')
    const global = { window: {} }
    vm.runInNewContext(source, global)
    const factory = global.artplayerProxyCanvas || global.window.artplayerProxyCanvas
    assert.equal(factory.default, factory)
  }
  const source = fs.readFileSync('packages/artplayer-proxy-canvas/dist/artplayer-proxy-canvas.mjs', 'utf8')
  const module = await import(`data:text/javascript,${encodeURIComponent(source)}`)
  assert.deepEqual(Object.keys(module), ['default'])
  assert.equal(module.default.default, module.default)
})
