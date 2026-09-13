import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { publicInvalid, publicSource, runtimeInvalid, runtimeSource } from './auto-thumbnail-consumer.mjs'
import { verifyAutoThumbnailContract } from './auto-thumbnail-contract.mjs'
import { hash, readMember } from './releases.mjs'

const name = 'artplayer-plugin-auto-thumbnail'
assert.equal(process.version.slice(1), fs.readFileSync(path.join(workspace, '.node-version'), 'utf8').trim())
assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22')
const yarn = process.env.npm_execpath
assert(yarn && fs.existsSync(yarn))
const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/auto-thumbnail-package-types-'))
console.log(`Auto Thumbnail installed consumer evidence: ${output}`)
const contract = await verifyAutoThumbnailContract()
const packages = []
for (const packageName of ['artplayer', name]) {
  const archive = path.join(output, `${packageName}.tgz`)
  fs.writeFileSync(path.join(output, `${packageName}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', packageName)))
  const manifest = JSON.parse(readMember(archive, 'package/package.json'))
  const files = packedFiles(archive)
  checkFiles(manifest, files, packageName === name ? Object.keys(contract.baseline.release.files) : [])
  packages.push({ name: packageName, manifest, archive, sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) })
}
const [core, candidate] = packages
const declaration = `package/types/${name}.d.ts`
const normalize = value => value.toString().replaceAll('\r\n', '\n')
assert.equal(normalize(readMember(candidate.archive, declaration)), normalize(readMember(contract.archives.get('1.1.0'), declaration)))
const matrix = []
const olderRuntime = []
function report() {
  return writeJson(path.join(output, 'report.json'), {
    task: 'PKG-AUTO-THUMB-09',
    node: process.version,
    packages,
    matrix,
    olderRuntime,
    scope: 'Actual npm 1.1.0 and packed candidate installed outside the workspace. Root historical type shape and conditional runtime entry are checked with exact negative lines. Registration and module identities use installed artifacts; no native extraction or device acceptance is implied.',
  })
}

for (const release of contract.baseline.previous) {
  const consumer = consumerDirectory()
  const archive = contract.archives.get(release.version)
  const label = `published-${release.version}`
  try {
    writeJson(path.join(consumer, 'package.json'), { name: 'auto-thumbnail-old-exports', private: true, dependencies: { [name]: `file:${archive.replaceAll('\\', '/')}` } })
    fs.writeFileSync(path.join(output, `${label}-install.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
    const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
    fs.writeFileSync(path.join(output, `${label}-frozen.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--force', '--ignore-scripts', '--non-interactive'], consumer))
    assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
    for (const member of packedFiles(archive))
      assert.deepEqual(fs.readFileSync(path.join(consumer, 'node_modules', name, member.replace(/^package\//, ''))), readMember(archive, member))
    const missing = Boolean(release.missingEntrypoints.main)
    const legacyPath = `${name}/${release.manifest.legacy.replace(/^\.\//, '')}`
    const probe = path.join(consumer, 'historical.cjs')
    fs.writeFileSync(probe, missing
      ? `const assert = require('node:assert/strict');
assert.throws(() => require('${name}'), {code: 'MODULE_NOT_FOUND'});
assert.throws(() => require('${legacyPath}'), {code: 'MODULE_NOT_FOUND'});
console.log('Historical 1.0.0 missing main/legacy confirmed; not runnable distribution.');`
      : `const assert = require('node:assert/strict');
(async () => {
  for (const id of ['${name}', '${legacyPath}']) {
    const namespace = require(id);
    assert.deepEqual(Object.keys(namespace), ['default']);
    assert.throws(() => namespace({}), TypeError);
    const factory = namespace.default;
    assert.equal(typeof factory, 'function'); assert.equal(factory.default, undefined);
    const module = await import(id); assert.equal(module.default, namespace);
    let subscribed = 0;
    const result = factory({width: 80, height: 45})({on(name, callback) { assert.equal(name, 'video:loadedmetadata'); assert.equal(typeof callback, 'function'); subscribed++; }});
    assert(result instanceof Promise);
    assert.deepEqual(await result, {name: 'artplayerPluginAutoThumbnail'}); assert.equal(subscribed, 1);
  }
  console.log('Historical 1.0.1 actual installed default calls and Promise registration passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });`)
    const log = run([probe], consumer)
    fs.writeFileSync(path.join(output, `${label}-runtime.log`), log)
    olderRuntime.push({ version: release.version, archive, sha256: hash(fs.readFileSync(archive)), missingRuntime: missing, passed: true, log })
  }
  finally {
    report()
    removeConsumer(consumer)
  }
}

for (const plugin of [{ ...contract.baseline.release, archive: contract.archives.get('1.1.0'), label: 'published-1.1.0' }, { ...candidate, label: 'candidate' }]) {
  const consumer = consumerDirectory()
  try {
    writeJson(path.join(consumer, 'package.json'), { name: 'auto-thumbnail-isolated-consumer', private: true, dependencies: Object.fromEntries([core, plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
    fs.copyFileSync(path.join(workspace, 'yarn.lock'), path.join(consumer, 'yarn.lock'))
    fs.writeFileSync(path.join(output, `${plugin.label}-install.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
    const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
    fs.writeFileSync(path.join(output, `${plugin.label}-frozen.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--force', '--ignore-scripts', '--non-interactive'], consumer))
    assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
    for (const pkg of [core, plugin]) {
      for (const member of packedFiles(pkg.archive)) {
        assert.deepEqual(fs.readFileSync(path.join(consumer, 'node_modules', pkg.name, member.replace(/^package\//, ''))), readMember(pkg.archive, member), member)
      }
    }
    fs.writeFileSync(path.join(output, `${plugin.label}-yarn.lock`), lock)
    for (const [compiler, mode] of [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]) {
      const next = mode.startsWith('nodenext')
      const filename = path.join(consumer, `consumer.${next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'}`)
      const options = {
        strict: true,
        noEmit: true,
        skipLibCheck: false,
        types: [],
        esModuleInterop: true,
        target: compiler.ScriptTarget.ES2020,
        lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'],
        module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS,
        moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs,
      }
      let declarations = []
      const compile = (source, interop = true) => {
        fs.writeFileSync(filename, source)
        const program = compiler.createProgram([filename], { ...options, esModuleInterop: interop })
        for (const file of program.getSourceFiles()) {
          const actual = fs.realpathSync(file.fileName)
          assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(actual) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Type escaped consumer: ${actual}`)
        }
        declarations = program.getSourceFiles().filter(file => !program.isSourceFileDefaultLibrary(file)).map(file => path.relative(consumer, file.fileName).replaceAll('\\', '/')).sort()
        return compiler.getPreEmitDiagnostics(program).map(item => ({
          file: item.file ? path.relative(consumer, item.file.fileName).replaceAll('\\', '/') : null,
          code: item.code,
          line: item.file && item.start !== undefined ? item.file.getLineAndCharacterOfPosition(item.start).line + 1 : null,
          message: compiler.flattenDiagnosticMessageText(item.messageText, '\n'),
        }))
      }
      const entry = { plugin: plugin.label, compiler: compiler.version, mode }
      matrix.push(entry)
      let source = publicSource(mode)
      entry.public = compile(source)
      if (plugin.label === 'published-1.1.0' && mode === 'node10-commonjs') {
        const lines = source.split('\n')
        assert.deepEqual(entry.public.map(item => ({ code: item.code, line: item.line })), [
          { code: 2307, line: lines.findIndex(line => line.includes('from \'artplayer-plugin-auto-thumbnail/legacy\'')) + 1 },
          ...(compiler === compat ? [{ code: 2344, line: lines.findIndex(line => line.startsWith('type ExactLegacy')) + 1 }] : []),
        ], 'Preserve the historical Node10 legacy subpath failure')
        source = source.replace('from \'artplayer-plugin-auto-thumbnail/legacy\'', 'from \'artplayer-plugin-auto-thumbnail\'')
        entry.rootOnly = compile(source)
        assert.deepEqual(entry.rootOnly, [])
      }
      else {
        assert.deepEqual(entry.public, [], `${plugin.label} ${compiler.version} ${mode}`)
      }
      entry.publicInvalid = compile(`${source}\n${publicInvalid.join('\n')}`)
      assert.deepEqual(entry.publicInvalid.map(item => item.line), publicInvalid.map((_, index) => source.split('\n').length + 1 + index))
      if (plugin.label === 'candidate') {
        const runtime = runtimeSource(mode)
        entry.runtime = compile(runtime)
        entry.runtimeDeclarations = declarations
        assert.deepEqual(entry.runtime, [], `${compiler.version} ${mode}`)
        assert(declarations.includes(`node_modules/${name}/types/runtime.${next ? mode.endsWith('-cjs') ? 'd.cts' : 'd.mts' : mode === 'bundler-esm' ? 'd.mts' : 'd.ts'}`))
        entry.runtimeInvalid = compile(`${runtime}\n${runtimeInvalid.join('\n')}`)
        assert.deepEqual(entry.runtimeInvalid.map(item => item.line), runtimeInvalid.map((_, index) => runtime.split('\n').length + 1 + index))
        if (mode === 'node10-commonjs' || mode === 'nodenext-cjs') {
          entry.noInterop = compile(runtimeSource(`${mode}-no-interop`), false)
          assert.deepEqual(entry.noInterop, [])
        }
      }
      report()
    }
    const probe = path.join(consumer, 'runtime.cjs')
    fs.writeFileSync(probe, `const assert = require('node:assert/strict');
(async () => {
  const names = ${JSON.stringify([name, `${name}/legacy`, ...(plugin.label === 'candidate' ? [`${name}/runtime`] : [])])};
  const commonjs = names.map(name => require(name));
  const modules = await Promise.all(names.map(name => import(name)));
  for (const factory of [...commonjs, ...modules.map(module => module.default)]) {
    assert.equal(typeof factory, 'function'); assert.equal(factory.default, ${plugin.label === 'candidate' ? 'factory' : 'undefined'});
    const callbacks = new Map();
    const art = { option: {url: '/never-loaded.mp4'}, on(name, callback) { callbacks.set(name, callback); }, off(name, callback) { if (callbacks.get(name) === callback) callbacks.delete(name); } };
    const pending = ${plugin.label === 'candidate' ? 'factory.default' : 'factory'}({})(art);
    assert(pending instanceof Promise); assert.equal(pending.name, undefined);
    assert.deepEqual(await pending, {name: 'artplayerPluginAutoThumbnail'});
    assert(callbacks.has('video:loadedmetadata'));
    ${plugin.label === 'candidate' ? 'callbacks.get(\'destroy\')(); assert.equal(callbacks.size, 0);' : ''}
  }
  ${plugin.label === 'candidate' ? 'assert.equal(commonjs[2], commonjs[0]); assert.equal(modules[2].default, modules[0].default);' : ''}
  console.log('Installed root/legacy/runtime module shapes and Promise registration verified; no native extraction.');
})().catch(error => { console.error(error); process.exitCode = 1; });`)
    fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([probe], consumer))
  }
  finally {
    report()
    removeConsumer(consumer)
  }
}
console.log(`Passed ${matrix.length} installed compiler profiles; ${output}`)
