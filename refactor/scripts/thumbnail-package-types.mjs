import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { verifyThumbnailContract } from './thumbnail-contract.mjs'
import { hash, readMember } from './releases.mjs'

async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:thumbnail-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/thumbnail-package-types-'))
  console.log(`Thumbnail installed package evidence: ${output}`)
  const contract = verifyThumbnailContract()
  const frozen = path.join(output, 'frozen-workspace')
  fs.mkdirSync(frozen)
  const prefix = 'packages/artplayer-tool-thumbnail/'
  for (const [file, text] of contract.source) {
    if (!file.startsWith(prefix)) continue
    const target = path.join(frozen, file.slice(prefix.length))
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, text)
  }
  const packages = []
  const matrix = []
  const runtime = []
  for (const [label, folder] of [['workspace-fixture', frozen], ['candidate', path.join(workspace, 'packages/artplayer-tool-thumbnail')]]) {
    const archive = path.join(output, `${label}.tgz`)
    fs.writeFileSync(path.join(output, `${label}-pack.log`), run([yarn, 'pack', '--filename', archive], folder))
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    const files = packedFiles(archive)
    if (label === 'candidate') {
      checkFiles(manifest, files, [...contract.source.keys()].filter(file => file.startsWith(`${prefix}dist/`)).map(file => `package/${file.slice(prefix.length)}`))
      assert(files.includes('package/THIRD_PARTY_NOTICES'))
      assert.equal(readMember(archive, 'package/THIRD_PARTY_NOTICES').toString(), fs.readFileSync(path.join(folder, 'THIRD_PARTY_NOTICES'), 'utf8'))
    }
    else {
      assert.equal(manifest.main, undefined)
      assert(!files.includes(`package/${manifest.module}`))
      assert(!files.includes(`package/${manifest.types}`))
    }
    const pkg = { label, name: manifest.name, archive, sha256: hash(fs.readFileSync(archive)), manifest, files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) }
    packages.push(pkg)
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'thumbnail-isolated-consumer', private: true, dependencies: { [pkg.name]: `file:${archive.replaceAll('\\', '/')}` } })
      fs.writeFileSync(path.join(output, `${label}-install.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
      const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${label}-frozen-install.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--non-interactive'], consumer))
      assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
      fs.writeFileSync(path.join(output, `${label}-yarn.lock`), lock)
      const installed = path.join(consumer, 'node_modules', pkg.name)
      assert.equal(fs.realpathSync(installed), installed, 'Consumer must not use workspace links')
      for (const [member, expected] of Object.entries(pkg.files))
        assert.equal(hash(fs.readFileSync(path.join(installed, member.slice(8)))), expected, member)
      const runtimeFile = path.join(consumer, 'runtime.cjs')
      fs.writeFileSync(runtimeFile, `const assert = require('node:assert/strict');
const value = require('${pkg.name}');
assert.equal(typeof value, 'function');
assert.equal(value.default, undefined);
assert.equal(value.DEFAULTS.number, 60);
${label === 'candidate' ? `const legacy = require('${pkg.name}/legacy'); assert.equal(typeof legacy, 'function'); assert.equal(legacy.default, undefined);` : ''}
(async () => {
  let imported;
  try { imported = await import('${pkg.name}'); }
  catch (error) { ${label === 'candidate' ? 'throw error;' : `assert.equal(error.code, 'ERR_MODULE_NOT_FOUND'); console.log(JSON.stringify({ commonjs: 'function', esm: error.code, typesMissing: true })); return;`} }
  ${label === 'candidate' ? `assert.equal(typeof imported.default, 'function'); assert.deepEqual(Object.keys(imported), ['default']); const legacy = await import('${pkg.name}/legacy'); assert.equal(typeof legacy.default, 'function'); console.log(JSON.stringify({ commonjs: 'function', esm: 'function', legacy: 'function', ssrImport: true }));` : `throw new Error('Frozen missing ESM unexpectedly loaded');`}
})().catch(error => { console.error(error); process.exitCode = 1; });`)
      const observation = run([runtimeFile], consumer)
      fs.writeFileSync(path.join(output, `${label}-runtime.log`), observation)
      runtime.push({ package: label, ...JSON.parse(observation.trim()) })
      const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
      if (label === 'candidate') modes.push([ts, 'nodenext-cjs-no-interop'], [compat, 'node10-commonjs-no-interop'])
      for (const [compiler, mode] of modes) {
        const next = mode.startsWith('nodenext')
        const noInterop = mode.endsWith('no-interop')
        const filename = path.join(consumer, `consumer.${next ? mode.includes('-cjs') ? 'cts' : 'mts' : 'ts'}`)
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: !noInterop, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
        const source = label === 'candidate' ? fs.readFileSync(path.join(workspace, noInterop ? 'test/types/thumbnail-commonjs.cts' : 'test/types/thumbnail.ts'), 'utf8') : `import Thumbnail from '${pkg.name}'; new Thumbnail({ fileInput: document.createElement('input') });`
        function compile(code) {
          fs.writeFileSync(filename, code)
          const program = compiler.createProgram([filename], options)
          for (const file of program.getSourceFiles()) {
            const real = fs.realpathSync(file.fileName)
            assert(real.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(real) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Type escaped installed consumer: ${real}`)
          }
          return compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n').replaceAll(consumer.replaceAll('\\', '/'), '<consumer>') }))
        }
        const diagnostics = compile(source)
        writeJson(path.join(output, `${label}-${compiler.version}-${mode}.json`), diagnostics)
        if (label === 'candidate') assert.deepEqual(diagnostics, [], `${compiler.version} ${mode}`)
        else {
          assert.deepEqual(diagnostics.map(item => item.code), [mode === 'node10-commonjs' ? 2307 : 7016], 'Only the exact frozen missing entry/declaration diagnostic is expected')
        }
        const negative = label === 'candidate' ? compile(source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')) : []
        if (label === 'candidate') assert.equal(negative.length, noInterop ? 1 : 10)
        matrix.push({ package: label, compiler: compiler.version, mode, diagnostics, negative })
      }
      if (label === 'candidate') fs.cpSync(installed, path.join(output, 'installed-artifacts'), { recursive: true })
    }
    finally { removeConsumer(consumer) }
  }
  writeJson(path.join(output, 'report.json'), { task: 'PKG-TOOL-THUMB-04', scope: 'Frozen Git input fixture and candidate Yarn pack installed outside workspace. The frozen fixture is not an original npm archive; no recovered 3.5.31 complete archive is claimed. Candidate root/legacy runtime, offline frozen install, all files and strict consumers verified.', packages, matrix, runtime })
  console.log(`Thumbnail installed types verified: ${matrix.length} compiler cases; ${output}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
