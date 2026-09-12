import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { verifyIframeContract } from './iframe-contract.mjs'
import { hash, readMember } from './releases.mjs'

async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:iframe-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/iframe-package-types-'))
  console.log(`Iframe installed package evidence: ${output}`)
  const contract = await verifyIframeContract()
  const frozen = path.join(output, 'frozen-workspace')
  fs.mkdirSync(frozen)
  const prefix = 'packages/artplayer-tool-iframe/'
  for (const [file, bytes] of contract.sources) {
    if (!file.startsWith(prefix))
      continue
    const target = path.join(frozen, file.slice(prefix.length))
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, bytes)
  }
  const packages = [{ label: 'published', name: contract.baseline.release.name, archive: contract.archive, sha256: contract.baseline.release.sha256, files: contract.baseline.release.files }]
  for (const [label, folder] of [['workspace', frozen], ['candidate', path.join(workspace, 'packages/artplayer-tool-iframe')]]) {
    const archive = path.join(output, `${label}.tgz`)
    fs.writeFileSync(path.join(output, `${label}-pack.log`), run([yarn, 'pack', '--filename', archive], folder))
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    const files = packedFiles(archive)
    checkFiles(manifest, files)
    packages.push({ label, name: manifest.name, archive, sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) })
  }
  const matrix = []
  const runtime = []
  for (const pkg of packages) {
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'iframe-isolated-consumer', private: true, dependencies: { [pkg.name]: `file:${pkg.archive.replaceAll('\\', '/')}` } })
      fs.writeFileSync(path.join(output, `${pkg.label}-install.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
      const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${pkg.label}-frozen-install.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--non-interactive'], consumer))
      assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
      fs.writeFileSync(path.join(output, `${pkg.label}-yarn.lock`), lock)
      const installed = path.join(consumer, 'node_modules', pkg.name)
      assert.equal(fs.realpathSync(installed), installed, 'Consumer must not use workspace links')
      for (const [member, expected] of Object.entries(pkg.files))
        assert.equal(hash(fs.readFileSync(path.join(installed, member.slice(8)))), expected, member)
      const runtimeFile = path.join(consumer, 'runtime.cjs')
      fs.writeFileSync(runtimeFile, `const assert = require('node:assert/strict');
const value = require('${pkg.name}');
assert.equal(typeof value, '${pkg.label === 'published' ? 'object' : 'function'}');
assert.equal(typeof value.default, '${pkg.label === 'published' ? 'function' : 'undefined'}');
${pkg.label === 'published' ? `for (const suffix of ['js', 'legacy.js']) { const helper = require('${pkg.name}/dist/artplayer-helper-iframe.' + suffix); assert.equal(typeof helper.default, 'function'); assert.equal(typeof helper.default.destroy, 'function'); assert.equal(typeof value.default.destroy, 'undefined'); }` : `const legacy = require('${pkg.name}/legacy'); assert.equal(typeof legacy, 'function'); assert.equal(legacy.default, undefined);`}
import('${pkg.name}').then(module => {
  assert.equal(typeof module.default, '${pkg.label === 'published' ? 'object' : 'function'}');
  ${pkg.label === 'published' ? '' : 'assert.deepEqual(Object.keys(module), [\'default\']);'}
  console.log(JSON.stringify({ commonjs: typeof value, commonjsDefault: typeof value.default, esmDefault: typeof module.default, helperIsDistinct: ${pkg.label === 'published'}, ssrImport: true }));
}).catch(error => { console.error(error); process.exitCode = 1; });`)
      const observation = run([runtimeFile], consumer)
      fs.writeFileSync(path.join(output, `${pkg.label}-runtime.log`), observation)
      runtime.push({ package: pkg.label, ...JSON.parse(observation.trim()) })
      const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
      if (pkg.label === 'candidate')
        modes.push([ts, 'nodenext-cjs-no-interop'])
      for (const [compiler, mode] of modes) {
        const next = mode.startsWith('nodenext')
        const noInterop = mode.endsWith('no-interop')
        const filename = path.join(consumer, `consumer.${next ? mode.includes('-cjs') ? 'cts' : 'mts' : 'ts'}`)
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: !noInterop, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
        let source = fs.readFileSync(path.join(workspace, pkg.label === 'candidate' ? noInterop ? 'test/types/iframe-commonjs.cts' : 'test/types/iframe.ts' : 'refactor/fixtures/consumers/iframe-workspace.ts'), 'utf8')
        const files = [filename]
        if (pkg.label === 'published')
          source = source.replaceAll('artplayer-tool-iframe', pkg.name).replace('Record<number, { resove: (...args: any[]) => any, reject: (...args: any[]) => any }>', 'Record<number, { resove: Function, reject: Function }>')
        if (pkg.label === 'candidate' && !noInterop) {
          const oldFile = path.join(consumer, path.basename(filename).replace('consumer', 'historical'))
          fs.copyFileSync(path.join(workspace, 'refactor/fixtures/consumers/iframe-workspace.ts'), oldFile)
          files.push(oldFile)
        }
        function compile(code) {
          fs.writeFileSync(filename, code)
          const program = compiler.createProgram(files, options)
          for (const file of program.getSourceFiles()) {
            const real = fs.realpathSync(file.fileName)
            assert(real.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(real) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Type escaped installed consumer: ${real}`)
          }
          return compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n').replaceAll(consumer.replaceAll('\\', '/'), '<consumer>') }))
        }
        const diagnostics = compile(source)
        const expected = pkg.label === 'workspace' && mode === 'nodenext-esm' ? [2344, 2344, 2344, 2709, 2339, 2344, 2709, 2344, 2709, 2709, 2351, 2339, 2339, 2339, 7006, 7006, 2339, 2339] : []
        writeJson(path.join(output, `${pkg.label}-${compiler.version}-${mode}.json`), diagnostics)
        assert.deepEqual(diagnostics.map(item => item.code), expected, `${pkg.label} ${compiler.version} ${mode}`)
        const negative = pkg.label === 'candidate' ? compile(source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')) : []
        if (pkg.label === 'candidate')
          assert.equal(negative.length, noInterop ? 1 : 16)
        matrix.push({ package: pkg.label, compiler: compiler.version, mode, diagnostics, negative })
      }
    }
    finally { removeConsumer(consumer) }
  }
  writeJson(path.join(output, 'report.json'), { task: 'PKG-IFRAME-04', scope: 'Actual npm archive, frozen Git workspace pack and candidate Yarn tarball installed outside workspace; byte verification, offline/frozen lock and strict positive/negative consumers. Old npm CJS namespace and distinct helper are preserved observations, not claims the candidate provides old package-name/helper aliases. Native player and distribution migration remain 05/06.', packages, matrix, runtime })
  console.log(`Iframe installed types verified: ${matrix.length} compiler cases; ${output}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
