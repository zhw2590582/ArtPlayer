import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { verifyCanvasContract } from './canvas-contract.mjs'
import { hash, readMember } from './releases.mjs'

export function canvasConsumerSource(source, mode) {
  if (mode === 'nodenext-esm') {
    source = source.replace('import canvas from \'artplayer-proxy-canvas\'', 'import canvasModule from \'artplayer-proxy-canvas\'\nconst canvas = canvasModule.default')
      .replace('import legacy from \'artplayer-proxy-canvas/legacy\'', 'import legacyModule from \'artplayer-proxy-canvas/legacy\'\nconst legacy = legacyModule.default')
      .replace('namespace.default', 'namespace.default.default')
  }
  if (mode.endsWith('-no-interop'))
    source = source.replace('import runtime from \'artplayer-proxy-canvas/runtime\'', 'import runtime = require(\'artplayer-proxy-canvas/runtime\')')
  return source
}

export const canvasNamespaceConsumer = `import type Artplayer from 'artplayer';
import canvasModule from 'artplayer-proxy-canvas';
import * as canvasNamespace from 'artplayer-proxy-canvas';
import legacyModule from 'artplayer-proxy-canvas/legacy';
type Callback = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => void;
type Factory = (option?: Callback) => (art: Artplayer) => HTMLCanvasElement;
const replacement: Factory = (_option?: Callback) => (_art: Artplayer) => document.createElement('canvas');
canvasModule.default(); canvasNamespace.default.default(); legacyModule.default();
const fromOld: typeof canvasModule = { default: replacement };
const toOld: { default: Factory } = canvasModule;
const namespaceReplacement: typeof canvasNamespace.default = { default: replacement };
const oldNamespace: { default: Factory } = canvasNamespace.default;
const optional: Parameters<typeof canvasModule.default>[0] = undefined;
const result: ReturnType<ReturnType<typeof canvasModule.default>> = document.createElement('canvas');
void [fromOld, toOld, namespaceReplacement, oldNamespace, optional, result];`

export function checkInvalidCanvasStatements(source, diagnostics) {
  const expected = []
  let line = 1
  for (const text of source.split('\n')) {
    if (text.startsWith('// @ts-expect-error'))
      expected.push(line)
    else line++
  }
  assert.deepEqual(diagnostics.map(item => item.line).sort((a, b) => a - b), expected, 'Each invalid Canvas statement must fail at its own line')
}

async function main() {
  assert.equal(process.version.slice(1), fs.readFileSync(path.join(workspace, '.node-version'), 'utf8').trim(), 'Use the repository Node version')
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:canvas-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/canvas-package-types-'))
  console.log(`Canvas isolated package evidence: ${output}`)
  const contract = await verifyCanvasContract()
  const packages = []
  for (const name of ['artplayer', 'artplayer-proxy-canvas']) {
    const archive = path.join(output, `${name}.tgz`)
    fs.writeFileSync(path.join(output, `${name}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', name)))
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    const files = packedFiles(archive)
    checkFiles(manifest, files, name === contract.baseline.release.name ? Object.keys(contract.baseline.release.files) : [])
    packages.push({ name, archive, sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) })
  }
  const matrix = []
  const core = packages[0]
  const candidates = [
    ...[contract.baseline.previous[0], contract.baseline.release].map(release => ({ ...release, archive: contract.archives.get(release.version), label: `published-${release.version}` })),
    { ...packages[1], label: 'candidate' },
  ]
  for (const plugin of candidates) {
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'canvas-isolated-consumer', private: true, dependencies: Object.fromEntries([core, plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
      fs.copyFileSync(path.join(workspace, 'yarn.lock'), path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-install.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
      const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-frozen-install.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--non-interactive'], consumer))
      assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
      fs.writeFileSync(path.join(output, `${plugin.label}-yarn.lock`), lock)
      for (const pkg of [core, plugin]) {
        const root = path.join(consumer, 'node_modules', pkg.name)
        assert.equal(fs.realpathSync(root), root, 'Installed package must not be a workspace link')
        for (const [member, expected] of Object.entries(pkg.files))
          assert.equal(hash(fs.readFileSync(path.join(root, member.slice(8)))), expected, `Installed bytes differ: ${member}`)
      }
      const runtimeFile = path.join(consumer, 'exports.cjs')
      fs.writeFileSync(runtimeFile, plugin.label === 'candidate'
        ? `const assert = require('node:assert/strict');
for (const name of ['artplayer-proxy-canvas', 'artplayer-proxy-canvas/legacy', 'artplayer-proxy-canvas/runtime']) { const factory = require(name); assert.equal(typeof factory, 'function'); assert.equal(factory.default, factory); assert.equal(typeof factory(), 'function'); }
assert.equal(require('artplayer-proxy-canvas/runtime'), require('artplayer-proxy-canvas'));
Promise.all([import('artplayer-proxy-canvas'), import('artplayer-proxy-canvas/runtime')]).then(([module, runtime]) => { assert.deepEqual(Object.keys(module), ['default']); assert.equal(module.default.default, module.default); assert.equal(runtime.default, module.default); }).catch(error => { console.error(error); process.exitCode = 1; });`
        : `const assert = require('node:assert/strict'); const value = require('artplayer-proxy-canvas'); assert.equal(typeof value, '${plugin.version === '1.0.0' ? 'object' : 'function'}'); assert.equal(typeof (value.default || value)(() => {}), 'function');`)
      fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([runtimeFile], consumer))
      const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
      if (plugin.label === 'candidate')
        modes.push([ts, 'node10-commonjs-no-interop'], [compat, 'node10-commonjs-no-interop'])
      for (const [compiler, mode] of modes) {
        const next = mode.startsWith('nodenext')
        const extension = next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'
        const fixture = fs.readFileSync(path.join(workspace, plugin.label === 'candidate' ? 'test/types/canvas.ts' : 'refactor/fixtures/consumers/canvas-published.ts'), 'utf8')
        const source = plugin.label === 'candidate' ? canvasConsumerSource(fixture, mode) : fixture
        const filename = path.join(consumer, `consumer.${extension}`)
        const historical = path.join(consumer, `historical.${extension}`)
        fs.writeFileSync(historical, canvasConsumerSource(fs.readFileSync(path.join(workspace, 'refactor/fixtures/consumers/canvas-published.ts'), 'utf8'), mode))
        const files = plugin.label === 'candidate' ? [filename, historical] : [filename]
        if ((mode === 'nodenext-cjs' && plugin.label === 'published-1.0.0') || (plugin.label === 'candidate' && mode !== 'nodenext-esm' && mode !== 'bundler-esm')) {
          const commonjs = path.join(consumer, `commonjs.${extension}`)
          fs.writeFileSync(commonjs, plugin.label === 'candidate'
            ? `import canvas = require('artplayer-proxy-canvas'); import legacy = require('artplayer-proxy-canvas/legacy'); import runtime = require('artplayer-proxy-canvas/runtime');
canvas.default(); legacy.default(); runtime(); runtime.default();
const callback: runtime.Option = (ctx, video) => ctx.drawImage(video, 0, 0); runtime(callback);`
            : `import canvas = require('artplayer-proxy-canvas'); canvas((ctx, video) => ctx.drawImage(video, 0, 0));`)
          files.push(commonjs)
        }
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: !mode.endsWith('-no-interop'), target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
        function compile(code) {
          fs.writeFileSync(filename, code)
          const program = compiler.createProgram(files, options)
          for (const file of program.getSourceFiles()) {
            const actual = fs.realpathSync(file.fileName)
            assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(actual) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Types escaped installed consumer: ${actual}`)
          }
          return compiler.getPreEmitDiagnostics(program).map(item => ({ file: item.file && path.relative(consumer, item.file.fileName), line: item.file && item.start !== undefined ? item.file.getLineAndCharacterOfPosition(item.start).line + 1 : null, code: item.code, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n') }))
        }
        const diagnostics = compile(source)
        const historicalFailure = plugin.label === 'published-1.1.0' && mode === 'nodenext-esm'
        writeJson(path.join(output, `${plugin.label}-${compiler.version}-${mode}-diagnostics.json`), { diagnostics, historicalFailure })
        assert.deepEqual(diagnostics.map(item => item.code), historicalFailure ? [2349, 2349, 2322, 2344, 2344] : [], `${plugin.label} ${compiler.version} ${mode}`)
        const invalid = plugin.label === 'candidate' ? compile(source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')) : []
        if (plugin.label === 'candidate')
          checkInvalidCanvasStatements(source, invalid)
        const namespace = mode === 'nodenext-esm' && plugin.label !== 'published-1.0.0' ? compile(canvasNamespaceConsumer) : []
        assert.deepEqual(namespace, [], 'Latest published and candidate NodeNext ESM namespace shapes must accept plain module replacements')
        const exportAssignment = mode.includes('commonjs') || mode === 'nodenext-cjs'
          ? compile(`import canvas = require('artplayer-proxy-canvas'); canvas((context: CanvasRenderingContext2D, video: HTMLVideoElement) => context.drawImage(video, 0, 0));`)
          : null
        if (exportAssignment)
          assert.deepEqual(exportAssignment.map(item => item.code), plugin.label === 'published-1.0.0' ? [] : [2349], 'Preserve the approved 1.0 export= versus latest default-export distinction')
        matrix.push({ plugin: plugin.label, compiler: compiler.version, mode, historicalFailure, diagnostics, invalid, namespace, exportAssignment })
      }
    }
    finally {
      removeConsumer(consumer)
    }
  }
  writeJson(path.join(output, 'report.json'), { suite: 'canvas-isolated-package-types', introducedBy: 'PKG-CANVAS-04', updatedBy: 'PKG-FACTORY-01', node: process.version, scope: 'Two actual published proxies and packed candidate installed outside workspace with packed candidate core; offline and frozen reinstall, exact bytes and root/legacy/runtime contracts. Root preserves published 1.1.0 pure factory, optional Parameters, exact HTMLCanvasElement result and NodeNext ESM namespace shape. Runtime adds accurate self identity with CommonJS/ESM and old Node10 resolution. Published 1.0.0 required callback/export= differences and 1.1.0 direct NodeNext ESM errors remain recorded. No native media, device or complete distribution acceptance.', packages, published: candidates.slice(0, 2).map(pkg => ({ label: pkg.label, archive: pkg.archive, sha256: pkg.sha256 })), matrix })
  console.log(`Canvas installed types passed: ${matrix.length} cases; ${output}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
