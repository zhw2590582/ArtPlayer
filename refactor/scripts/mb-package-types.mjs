import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { verifyMbContract } from './mb-contract.mjs'
import { hash, readMember } from './releases.mjs'

async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:mediabunny-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/mb-package-types-'))
  console.log(`MediaBunny isolated package evidence: ${output}`)
  const contract = await verifyMbContract()
  const packages = []
  for (const name of ['artplayer', 'artplayer-proxy-mediabunny']) {
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
    ...contract.baseline.previous.concat(contract.baseline.release).map(release => ({ ...release, archive: contract.archives.get(release.version), label: `published-${release.version}` })),
    { ...packages[1], label: 'candidate' },
  ]
  for (const plugin of candidates) {
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'mediabunny-isolated-consumer', private: true, dependencies: Object.fromEntries([core, plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
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
      fs.writeFileSync(runtimeFile, `const assert = require('node:assert/strict');
for (const name of ['artplayer-proxy-mediabunny', 'artplayer-proxy-mediabunny/legacy']) {
  const value = require(name);
  assert.equal(typeof value, '${plugin.version === '1.0.0' ? 'object' : 'function'}');
  assert.equal(typeof (value.default || value)(), 'function');
  ${plugin.label === 'candidate' ? 'assert.equal(value.default, value); assert.equal(typeof value.default(), "function"); assert.deepEqual(Object.keys(value), []);' : plugin.version === '1.2.0' ? 'assert.equal(value.default, undefined);' : 'assert.equal(typeof value.default, "function");'}
}
Promise.all(['artplayer-proxy-mediabunny', 'artplayer-proxy-mediabunny/legacy'].map(async name => {
  const module = await import(name);
  const value = module.default;
  assert.equal(typeof (value.default || value)(), 'function');
  if (name === 'artplayer-proxy-mediabunny') assert.deepEqual(Object.keys(module), ['default']);
})).catch(error => { console.error(error); process.exitCode = 1; });`)
      fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([runtimeFile], consumer))
      const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
      if (plugin.label === 'candidate')
        modes.push([ts, 'node10-commonjs-no-interop'], [compat, 'node10-commonjs-no-interop'])
      for (const [compiler, mode] of modes) {
        const next = mode.startsWith('nodenext')
        const extension = next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'
        const fixture = plugin.label === 'candidate' ? 'test/types/mediabunny.ts' : plugin.version === '1.0.0' ? 'refactor/fixtures/consumers/mediabunny-1.0.ts' : 'refactor/fixtures/consumers/mediabunny-published.ts'
        const source = fs.readFileSync(path.join(workspace, fixture), 'utf8')
        const filename = path.join(consumer, `consumer.${extension}`)
        const files = [filename]
        if (plugin.label === 'candidate') {
          for (const generation of ['1.0', 'published']) {
            const historical = path.join(consumer, `historical-${generation}.${extension}`)
            fs.copyFileSync(path.join(workspace, `refactor/fixtures/consumers/mediabunny-${generation}.ts`), historical)
            files.push(historical)
          }
          // Compare complete factories against the actual frozen declaration bytes.
          for (const release of contract.baseline.previous.concat(contract.baseline.release)) {
            const name = `frozen-${release.version}`
            fs.writeFileSync(path.join(consumer, `${name}.d.ts`), readMember(contract.archives.get(release.version), `package/${release.manifest.types.replace(/^\.\//, '')}`))
            const assignment = path.join(consumer, `${name}-assignment.cts`)
            fs.writeFileSync(assignment, `import current from 'artplayer-proxy-mediabunny'; import frozen from './${name}'; const forward: typeof frozen = current; const backward: typeof current = frozen; void [forward, backward];`)
            // TS 4.3 predates .cts. Use an ordinary .ts for classic resolution.
            const actual = next ? assignment : assignment.replace(/\.cts$/, '.ts')
            if (actual !== assignment)
              fs.renameSync(assignment, actual)
            files.push(actual)
          }
          if (mode === 'nodenext-cjs') {
            const commonjs = path.join(consumer, 'commonjs.cts')
            fs.writeFileSync(commonjs, `import factory = require('artplayer-proxy-mediabunny'); import legacy = require('artplayer-proxy-mediabunny/legacy'); factory.default(); legacy.default({ volume: 0.5 });`)
            files.push(commonjs)
          }
        }
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: !mode.endsWith('-no-interop'), target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
        function compile(code) {
          fs.writeFileSync(filename, code)
          const program = compiler.createProgram(files, options)
          for (const file of program.getSourceFiles()) {
            const actual = fs.realpathSync(file.fileName)
            assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(actual) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Types escaped installed consumer: ${actual}`)
            assert(!/[\\/]node_modules[\\/]mediabunny[\\/]/.test(actual), 'Public declarations must not pull modern SDK types into older compilers')
          }
          return compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n') }))
        }
        const diagnostics = compile(source)
        const historicalFailure = plugin.label !== 'candidate' && mode === 'nodenext-esm'
        writeJson(path.join(output, `${plugin.label}-${compiler.version}-${mode}-diagnostics.json`), { diagnostics, historicalFailure })
        if (historicalFailure) {
          assert.deepEqual(diagnostics.map(item => item.code), plugin.version === '1.0.0'
            ? [2344, 2349, 2322, 2344, 2349, 2349, 2349]
            : [2349, 2344, 2322, 2322, 2344, 2344, 2322, 7006, 7006, 2349, 2349, 2349, 2349, 2349], 'Unexpected historical NodeNext failure')
        }
        else {
          assert.deepEqual(diagnostics, [], `${plugin.label} ${compiler.version} ${mode}`)
        }
        const invalid = plugin.label === 'candidate' ? compile(source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')) : []
        if (plugin.label === 'candidate')
          assert.equal(invalid.length, 15, 'Installed declarations must reject all invalid uses')
        matrix.push({ plugin: plugin.label, compiler: compiler.version, mode, historicalFailure, diagnostics, invalid })
      }
    }
    finally {
      removeConsumer(consumer)
    }
  }
  writeJson(path.join(output, 'report.json'), { suite: 'mediabunny-isolated-package-types', introducedBy: 'PKG-MB-08', scope: 'Two frozen published packages and packed candidate with packed candidate core, installed outside workspace; offline/frozen reinstall, exact bytes, default/legacy CJS/ESM runtime and compiler matrices. Exact optional whole-factory assignments checked against actual historical declaration bytes. New shim types are opt-in, without SDK declaration leakage. Historical NodeNext ESM failures remain explicit negative controls. Not native decoding, old-core runtime combinations or full distribution/license acceptance.', packages, published: candidates.slice(0, 2).map(pkg => ({ label: pkg.label, archive: pkg.archive, sha256: hash(fs.readFileSync(pkg.archive)) })), matrix })
  console.log(`MediaBunny installed types passed: ${matrix.length} cases; ${output}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
