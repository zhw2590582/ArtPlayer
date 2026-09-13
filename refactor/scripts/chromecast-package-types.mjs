import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { verifyChromecastContract } from './chromecast-contract.mjs'
import { hash, readMember } from './releases.mjs'

async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:chromecast-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/chromecast-package-types-'))
  console.log(`Chromecast isolated package evidence: ${output}`)
  const contract = await verifyChromecastContract()
  const fixtures = Object.fromEntries(['test/types/chromecast-public.ts', 'refactor/fixtures/consumers/chromecast-published.ts'].map(file => [file, fs.readFileSync(path.join(workspace, file), 'utf8')]))
  const packages = []
  for (const name of ['artplayer', 'artplayer-plugin-chromecast']) {
    const archive = path.join(output, `${name}.tgz`)
    fs.writeFileSync(path.join(output, `${name}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', name)))
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    const files = packedFiles(archive)
    checkFiles(manifest, files, name === contract.baseline.release.name ? Object.keys(contract.baseline.release.files) : [])
    packages.push({ name, archive, sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) })
  }
  const matrix = []
  const publishedDiagnostics = new Map()
  const oldNamespaceCodes = [2344, 2344, 2344, 2344, 2322, 2322, 2349, 2349]
  const core = packages[0]
  const candidates = [
    ...[contract.baseline.previous[0], contract.baseline.release].map(release => ({ ...release, archive: contract.archives.get(release.version), label: `published-${release.version}` })),
    { ...packages[1], label: 'candidate' },
  ]
  for (const plugin of candidates) {
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'chromecast-isolated-consumer', private: true, dependencies: Object.fromEntries([core, plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
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
for (const name of ['artplayer-plugin-chromecast', 'artplayer-plugin-chromecast/legacy', 'artplayer-plugin-chromecast/runtime']) { const factory = require(name); assert.equal(typeof factory, 'function'); assert.equal(factory.default, factory); assert.equal(Object.getOwnPropertyDescriptor(factory, 'default').writable, true); assert.equal(typeof factory({}), 'function'); }
assert.equal(require('artplayer-plugin-chromecast/runtime'), require('artplayer-plugin-chromecast'));
Promise.all(['artplayer-plugin-chromecast', 'artplayer-plugin-chromecast/runtime', 'artplayer-plugin-chromecast/legacy'].map(name => import(name))).then(([root, runtime, legacy]) => { assert.deepEqual(Object.keys(root), ['default']); assert.deepEqual(Object.keys(runtime), ['default']); assert.equal(runtime.default, root.default); assert.equal(root.default.default, root.default); assert.equal(legacy.default, require('artplayer-plugin-chromecast/legacy')); }).catch(error => { console.error(error); process.exitCode = 1; });`
        : `const assert = require('node:assert/strict'); global.window = {}; const value = require('artplayer-plugin-chromecast'); assert.equal(typeof value, '${plugin.version === '1.0.0' ? 'object' : 'function'}'); assert.equal(typeof (value.default || value)({}), 'function');`)
      fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([runtimeFile], consumer))
      const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
      if (plugin.label === 'candidate')
        modes.push([ts, 'node10-commonjs-no-interop'], [compat, 'node10-commonjs-no-interop'])
      for (const [compiler, mode] of modes) {
        const next = mode.startsWith('nodenext')
        const extension = next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'
        let source = fixtures[plugin.label === 'candidate' ? 'test/types/chromecast-public.ts' : 'refactor/fixtures/consumers/chromecast-published.ts']
        if (plugin.label === 'candidate' && mode === 'nodenext-esm') {
          source = source
            .replace('import chromecast from \'artplayer-plugin-chromecast\'', 'import chromecastModule from \'artplayer-plugin-chromecast\'\nconst chromecast = chromecastModule.default')
            .replace('import legacy from \'artplayer-plugin-chromecast/legacy\'', 'import legacyModule from \'artplayer-plugin-chromecast/legacy\'\nconst legacy = legacyModule.default')
            .replace('namespace.default', 'namespace.default.default')
        }
        if (mode.endsWith('-no-interop'))
          source = source.replace('import runtime from \'artplayer-plugin-chromecast/runtime\'', 'import runtime = require(\'artplayer-plugin-chromecast/runtime\')')
        const filename = path.join(consumer, `consumer.${extension}`)
        const files = [filename]
        if (plugin.label === 'candidate' && mode !== 'bundler-esm' && mode !== 'nodenext-esm') {
          const commonjs = path.join(consumer, `commonjs.${extension}`)
          fs.writeFileSync(commonjs, `import chromecast = require('artplayer-plugin-chromecast'); import legacy = require('artplayer-plugin-chromecast/legacy'); import runtime = require('artplayer-plugin-chromecast/runtime');
import type Artplayer from 'artplayer';
const replacement: typeof chromecast.default = (_option) => (_art: Artplayer) => ({name: 'artplayerPluginChromecast'});
const legacyReplacement: typeof legacy.default = replacement;
chromecast.default({}); legacy.default({}); runtime({}); runtime.default({});
const option: runtime.RuntimeOption = { onError(error) { const self: runtime.RuntimeOption = this; const value: unknown = error; void [self, value]; } }; runtime(option); void legacyReplacement;`)
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
          return compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, line: item.file && item.start !== undefined ? item.file.getLineAndCharacterOfPosition(item.start).line + 1 : null, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n').replaceAll(consumer.replaceAll('\\', '/'), '<consumer>') }))
        }
        const diagnostics = compile(source)
        const historicalFailure = plugin.label === 'published-1.1.0' && mode === 'nodenext-esm'
        assert.deepEqual(diagnostics.map(item => item.code), historicalFailure ? oldNamespaceCodes : [], `${plugin.label} ${compiler.version} ${mode}`)
        const invalid = plugin.label === 'candidate' ? compile(source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')) : []
        if (plugin.label === 'candidate') {
          const expectedLines = []
          let line = 1
          for (const text of source.split('\n')) {
            if (text.startsWith('// @ts-expect-error'))
              expectedLines.push(line)
            else line++
          }
          assert.equal(expectedLines.length, 17, 'Keep all callback, Promise, state and historical factory rejection fixtures')
          assert.deepEqual(invalid.map(item => item.line).sort((a, b) => a - b), expectedLines, 'Each invalid statement must fail at its own line')
        }
        const published = plugin.label === 'candidate' ? compile(fixtures['refactor/fixtures/consumers/chromecast-published.ts']) : diagnostics
        assert.deepEqual(published.map(item => item.code), (plugin.label === 'candidate' || plugin.label === 'published-1.1.0') && mode === 'nodenext-esm' ? oldNamespaceCodes : [], 'Preserve exact historical direct-consumer diagnostic codes')
        const diagnosticsKey = `${compiler.version}:${mode}`
        if (plugin.label === 'published-1.1.0')
          publishedDiagnostics.set(diagnosticsKey, published.map(({ code, line }) => ({ code, line })))
        if (plugin.label === 'candidate' && publishedDiagnostics.has(diagnosticsKey))
          assert.deepEqual(published.map(({ code, line }) => ({ code, line })), publishedDiagnostics.get(diagnosticsKey), 'Candidate retains the latest published diagnostic codes and source positions')
        const namespace = plugin.label !== 'published-1.0.0' && mode === 'nodenext-esm'
          ? compile(`import chromecast from 'artplayer-plugin-chromecast'; import type Artplayer from 'artplayer';
const replacement: typeof chromecast.default = (_option) => (_art: Artplayer) => ({name: 'artplayerPluginChromecast'});
chromecast.default({}); void replacement;`)
          : []
        assert.deepEqual(namespace, [], 'Latest published NodeNext namespace remains valid')
        const olderRequire = mode !== 'bundler-esm' && mode !== 'nodenext-esm'
          ? compile(`import chromecast = require('artplayer-plugin-chromecast'); chromecast({url: '/movie.mp4', sdk: '/sender.js', icon: '<b>cast</b>', mimeType: 'video/mp4'});`)
          : []
        assert.deepEqual(olderRequire.map(item => item.code), mode !== 'bundler-esm' && mode !== 'nodenext-esm' && plugin.label !== 'published-1.0.0' ? [2349] : [], 'Earlier export-assignment typing conflicts are retained and documented')
        matrix.push({ plugin: plugin.label, compiler: compiler.version, mode, historicalFailure, diagnostics, invalid, published, namespace, olderRequire })
      }
    }
    finally {
      removeConsumer(consumer)
    }
  }
  writeJson(path.join(output, 'report.json'), { suite: 'chromecast-isolated-package-types', introducedBy: 'PKG-CAST-04', scope: 'Two actual published plugins and packed candidate installed outside workspace with packed candidate core; offline and frozen reinstall, exact bytes, full factory replacements and required root argument. Runtime adds precise callbacks, asynchronous registration and self alias. Published 1.1.0 NodeNext ESM namespace and eight original direct-consumer diagnostics are retained. Published 1.0.0 export-assignment typing conflicts are recorded separately; both versions had four optional option fields. This is not real SDK, device or complete distribution acceptance.', fixtures: Object.fromEntries(Object.entries(fixtures).map(([file, source]) => [file, hash(source)])), packages, published: candidates.slice(0, 2).map(pkg => ({ label: pkg.label, archive: pkg.archive, sha256: pkg.sha256 })), matrix })
  console.log(`Chromecast installed types passed: ${matrix.length} cases; ${output}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
