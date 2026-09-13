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
import { verifyChromecastContract } from './chromecast-contract.mjs'
import { readMember } from './releases.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

function publicSource(source, mode) {
  return mode === 'nodenext-esm'
    ? source.replace('import chromecast from \'artplayer-plugin-chromecast\'', 'import chromecastModule from \'artplayer-plugin-chromecast\'\nconst chromecast = chromecastModule.default')
        .replace('import legacy from \'artplayer-plugin-chromecast/legacy\'', 'import legacyModule from \'artplayer-plugin-chromecast/legacy\'\nconst legacy = legacyModule.default')
        .replace('namespace.default', 'namespace.default.default')
    : source
}

function negativeLines(source) {
  const expected = []
  let line = 1
  for (const text of source.split('\n')) {
    if (text.startsWith('// @ts-expect-error'))
      expected.push(line)
    else
      line++
  }
  return expected
}

test('Chromecast keeps the exact historical factory type and exposes accurate runtime callback and Promise types', () => {
  const source = fs.readFileSync('test/types/chromecast-public.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    const adapted = publicSource(source, mode)
    assert.deepEqual(checkConsumer(compiler, mode, adapted), [], `${compiler.version} ${mode}`)
    const invalid = checkConsumer(compiler, mode, adapted.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''))
    const expected = negativeLines(adapted)
    assert(expected.length >= 12, 'Keep callback, factory, Promise and old entry negative coverage')
    assert.deepEqual(invalid.map(item => item.line).sort((a, b) => a - b), expected, `${compiler.version} ${mode}: every invalid statement must fail independently`)
  }
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', `import chromecast = require('artplayer-plugin-chromecast'); import legacy = require('artplayer-plugin-chromecast/legacy');
import runtime = require('artplayer-plugin-chromecast/runtime');
const option: chromecast.Option = {}; chromecast.default(option); legacy.default(option); runtime(option); runtime.default(option);`), [])
})

test('Chromecast exact historical declarations retain required argument, optional field and pure factory substitution contracts', async () => {
  const contract = await verifyChromecastContract()
  const source = fs.readFileSync('refactor/fixtures/consumers/chromecast-published.ts', 'utf8')
  for (const version of ['1.0.0', '1.1.0']) {
    const old = readMember(contract.archives.get(version), 'package/types/artplayer-plugin-chromecast.d.ts').toString()
    assert.equal(old.includes('export = artplayerPluginChromecast'), version === '1.0.0')
    const checks = `
type OriginalOption = {url?: string; sdk?: string; icon?: string; mimeType?: string};
type OriginalResult = {name: 'artplayerPluginChromecast'};
type OriginalFactory = (option: OriginalOption) => (art: Artplayer) => OriginalResult;
type OriginalEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type OriginalAssert<T extends true> = T;
type FactoryCheck = OriginalAssert<OriginalEqual<typeof chromecast, OriginalFactory>>;
type ArgumentCheck = OriginalAssert<OriginalEqual<Parameters<typeof chromecast>, [option: OriginalOption]>>;
type ResultCheck = OriginalAssert<OriginalEqual<ReturnType<ReturnType<typeof chromecast>>, OriginalResult>>;
const plainReplacement: typeof chromecast = (_option) => (_art) => ({name: 'artplayerPluginChromecast'});
const reverse: OriginalFactory = chromecast;
void [plainReplacement, reverse];`
    for (const compiler of [ts, compat]) {
      const filename = path.resolve('test/types/chromecast-history.ts')
      const declaration = path.resolve('test/types/chromecast-history.d.ts')
      function historical(code) {
        const host = compiler.createCompilerHost({})
        const original = host.getSourceFile.bind(host)
        host.getSourceFile = (file, language, ...rest) => path.resolve(file) === filename
          ? compiler.createSourceFile(file, code.replace('from \'artplayer-plugin-chromecast\'', 'from \'./chromecast-history\''), language, true)
          : path.resolve(file) === declaration ? compiler.createSourceFile(file, old, language, true) : original(file, language, ...rest)
        const exists = host.fileExists.bind(host)
        host.fileExists = file => path.resolve(file) === declaration || exists(file)
        const program = compiler.createProgram([filename, declaration], { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] }, host)
        assert(program.getSourceFile(declaration))
        return compiler.getPreEmitDiagnostics(program).map(item => item.code)
      }
      assert.deepEqual(historical(`${source}\n${checks}`), [])
      const invalid = `${source}\nchromecast(); chromecast(undefined); const url: string = ({} as Parameters<typeof chromecast>[0]).url;`
      assert.deepEqual(historical(invalid), [2554, 2345, 2322])
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', `${source}\n${checks}`), [])
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', invalid).map(item => item.code), [2554, 2345, 2322])
    }
  }
})

test('Chromecast editor global remains a required-argument pure historical factory', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-chromecast/types/artplayer-plugin-chromecast.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginChromecast')
  const file = 'docs/assets/ts/artplayer-plugin-chromecast.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `const option: artplayerPluginChromecast.Option = {}; artplayerPluginChromecast(option);
const replacement: typeof artplayerPluginChromecast = (_option) => (_art) => ({name: 'artplayerPluginChromecast'});
// @ts-expect-error The published factory argument is required.
artplayerPluginChromecast();
// @ts-expect-error Self alias typing belongs to the runtime module.
artplayerPluginChromecast.default(option);
// @ts-expect-error URL remains a string.
artplayerPluginChromecast({url: 2});
// @ts-expect-error Runtime callbacks are available from the runtime module.
artplayerPluginChromecast({onCastStart() {}});`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 4)
  }
})

test('Chromecast actual old CJS forms and candidate main, legacy, global and ESM identities remain explicit', async () => {
  const contract = await verifyChromecastContract()
  for (const version of ['1.0.0', '1.1.0']) {
    for (const suffix of ['js', 'legacy.js']) {
      const code = readMember(contract.archives.get(version), `package/dist/artplayer-plugin-chromecast.${suffix}`).toString()
      const module = { exports: {} }
      vm.runInNewContext(code, { module, exports: module.exports, window: {} })
      assert.equal(typeof module.exports, version === '1.0.0' ? 'object' : 'function')
      assert.deepEqual(Object.keys(module.exports), version === '1.0.0' ? ['default'] : [])
      const factory = version === '1.0.0' ? module.exports.default : module.exports
      assert.equal(typeof factory({}), 'function')
    }
  }
  for (const suffix of ['js', 'legacy.js']) {
    const code = fs.readFileSync(`packages/artplayer-plugin-chromecast/dist/artplayer-plugin-chromecast.${suffix}`, 'utf8')
    const module = { exports: {} }
    vm.runInNewContext(code, { module, exports: module.exports, window: {} })
    assert.equal(typeof module.exports, 'function')
    assert.equal(module.exports.default, module.exports)
    assert.equal(typeof module.exports({}), 'function')
    const global = { window: {} }
    vm.runInNewContext(code, global)
    const factory = global.artplayerPluginChromecast || global.window.artplayerPluginChromecast
    assert.equal(factory.default, factory)
  }
  const source = fs.readFileSync('packages/artplayer-plugin-chromecast/dist/artplayer-plugin-chromecast.mjs', 'utf8')
  const module = await import(`data:text/javascript,${encodeURIComponent(source)}`)
  assert.deepEqual(Object.keys(module), ['default'])
  assert.equal(module.default.default, module.default)
})
