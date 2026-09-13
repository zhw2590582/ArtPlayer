import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { verifyDanmukuContract } from './danmuku-contract.mjs'
import { hash, readMember } from './releases.mjs'

const publishedFixture = 'refactor/fixtures/consumers/danmuku-published.ts'
const rootFixture = 'test/types/danmuku-root.ts'
const runtimeFixture = 'test/types/danmuku-runtime.ts'

async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:danmuku-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/danmuku-package-types-'))
  console.log(`Danmuku isolated package evidence: ${output}`)
  const contract = await verifyDanmukuContract()
  assert.equal(contract.baseline.release.version, '5.3.0')
  const fixtures = Object.fromEntries([publishedFixture, rootFixture, runtimeFixture].map(file => [file, fs.readFileSync(path.join(workspace, file), 'utf8')]))
  const packages = []
  for (const name of ['artplayer', 'artplayer-plugin-danmuku']) {
    const archive = path.join(output, `${name}.tgz`)
    fs.writeFileSync(path.join(output, `${name}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', name)))
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    const files = packedFiles(archive)
    checkFiles(manifest, files, name === contract.baseline.release.name ? Object.keys(contract.baseline.release.files) : [])
    packages.push({ name, archive, sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) })
  }
  const published = { ...contract.baseline.release, archive: contract.archives.get('5.3.0'), label: 'published-5.3.0' }
  const declaration = 'package/types/artplayer-plugin-danmuku.d.ts'
  assert.equal(readMember(packages[1].archive, declaration).toString().replaceAll('\r\n', '\n'), readMember(published.archive, declaration).toString().replaceAll('\r\n', '\n'), 'Preserve the actual npm 5.3.0 root declaration')
  const matrix = []
  const historical = new Map()
  for (const plugin of [published, { ...packages[1], label: 'candidate' }]) {
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'danmuku-isolated-consumer', private: true, dependencies: Object.fromEntries([packages[0], plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
      fs.copyFileSync(path.join(workspace, 'yarn.lock'), path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-install.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
      const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-frozen-install.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--non-interactive'], consumer))
      assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
      fs.writeFileSync(path.join(output, `${plugin.label}-yarn.lock`), lock)
      for (const pkg of [packages[0], plugin]) {
        const root = path.join(consumer, 'node_modules', pkg.name)
        assert.equal(fs.realpathSync(root), root, 'Installed package must not be a workspace link')
        for (const [member, expected] of Object.entries(pkg.files))
          assert.equal(hash(fs.readFileSync(path.join(root, member.slice(8)))), expected, `Installed bytes differ: ${member}`)
      }
      const runtimeFile = path.join(consumer, 'exports.cjs')
      fs.writeFileSync(runtimeFile, `const assert = require('node:assert/strict');
const names = ${JSON.stringify(plugin.label === 'candidate' ? ['artplayer-plugin-danmuku', 'artplayer-plugin-danmuku/legacy', 'artplayer-plugin-danmuku/runtime'] : ['artplayer-plugin-danmuku', 'artplayer-plugin-danmuku/legacy'])};
for (const name of names) { const factory = require(name); assert.equal(typeof factory, 'function'); assert.equal(typeof factory({danmuku: []}), 'function'); assert.equal(typeof factory.icons, 'object'); }
${plugin.label === 'candidate' ? 'assert.equal(require(\'artplayer-plugin-danmuku/runtime\'), require(\'artplayer-plugin-danmuku\'));' : ''}
Promise.all(names.map(name => import(name))).then(modules => { for (const value of modules) assert.equal(typeof value.default, 'function'); assert.equal(modules[1].default, require(names[1])); ${plugin.label === 'candidate' ? 'assert.equal(modules[2].default, modules[0].default);' : ''} }).catch(error => { console.error(error); process.exitCode = 1; });`)
      fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([runtimeFile], consumer))
      const modes = [[ts, 'node10-commonjs'], [compat, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm']]
      if (plugin.label === 'candidate')
        modes.push([ts, 'node10-commonjs-no-interop'], [compat, 'node10-commonjs-no-interop'])
      for (const [compiler, mode] of modes) {
        const next = mode.startsWith('nodenext')
        const filename = path.join(consumer, `consumer.${next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'}`)
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: !mode.endsWith('-no-interop'), target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
        function compile(source) {
          fs.writeFileSync(filename, source)
          const program = compiler.createProgram([filename], options)
          for (const file of program.getSourceFiles()) {
            const actual = fs.realpathSync(file.fileName)
            assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(actual) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Types escaped installed consumer: ${actual}`)
          }
          return compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, line: item.file && item.start !== undefined ? item.file.getLineAndCharacterOfPosition(item.start).line + 1 : null, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n').replaceAll(consumer.replaceAll('\\', '/'), '<consumer>') }))
        }
        function checkedFixture(source, label) {
          const diagnostics = compile(source)
          assert.deepEqual(diagnostics, [], `${label}: ${compiler.version} ${mode}`)
          const lines = []
          let line = 1
          for (const text of source.split('\n')) {
            if (/^[ \t]*\/\/ @ts-expect-error/.test(text))
              lines.push(line)
            else line++
          }
          assert.equal(lines.length, label === 'root/legacy' ? 4 : 14, `Keep all negative ${label} fixtures`)
          const invalid = compile(source.replaceAll(/^[ \t]*\/\/ @ts-expect-error[^\n]*\n/gm, ''))
          assert.deepEqual([...new Set(invalid.map(item => item.line))].sort((a, b) => a - b), lines, `Every ${label} negative statement must fail at its own line`)
          return { diagnostics, invalid, negativeStatements: lines.length }
        }
        const direct = compile(fixtures[publishedFixture])
        const key = `${compiler.version}:${mode}`
        if (plugin.label === 'published-5.3.0') {
          if (mode === 'nodenext-esm') {
            assert(direct.length > 0, 'Preserve evidence of the existing NodeNext default namespace mismatch')
            assert(direct.every(item => [2322, 2344, 2349].includes(item.code)), 'Only the established callable namespace mismatch is expected')
          }
          else {
            assert.deepEqual(direct, [])
          }
          historical.set(key, direct.map(({ code, line }) => ({ code, line })))
        }
        else {
          assert.deepEqual(direct.map(({ code, line }) => ({ code, line })), historical.get(key) ?? [], 'Candidate must preserve exact npm root diagnostic codes and positions')
        }
        const namespace = mode === 'nodenext-esm' ? compile(fixtures[publishedFixture].replace('import danmuku from \'artplayer-plugin-danmuku\'', 'import danmukuModule from \'artplayer-plugin-danmuku\'\nconst danmuku = danmukuModule.default')) : []
        assert.deepEqual(namespace, [], 'Explicit published NodeNext namespace remains valid')
        let root = null
        let runtime = null
        let commonjs = []
        if (plugin.label === 'candidate') {
          const rootSource = mode === 'nodenext-esm'
            ? fixtures[rootFixture].replace('import danmuku from \'artplayer-plugin-danmuku\'', 'import danmukuModule from \'artplayer-plugin-danmuku\'\nconst danmuku = danmukuModule.default').replace('import legacy from \'artplayer-plugin-danmuku/legacy\'', 'import legacyModule from \'artplayer-plugin-danmuku/legacy\'\nconst legacy = legacyModule.default')
            : fixtures[rootFixture]
          root = checkedFixture(rootSource, 'root/legacy')
          const runtimeSource = mode.endsWith('-no-interop') ? fixtures[runtimeFixture].replace('import runtime from \'artplayer-plugin-danmuku/runtime\'', 'import runtime = require(\'artplayer-plugin-danmuku/runtime\')') : fixtures[runtimeFixture]
          runtime = checkedFixture(runtimeSource, 'runtime')
          if (mode !== 'nodenext-esm' && mode !== 'bundler-esm') {
            commonjs = compile(`import root = require('artplayer-plugin-danmuku'); import legacy = require('artplayer-plugin-danmuku/legacy'); import runtime = require('artplayer-plugin-danmuku/runtime');\nconst replacement: typeof root.default = (_option) => (_art) => { throw new Error('consumer'); }; const other: typeof legacy.default = replacement; root.default({danmuku: []}); legacy.default({danmuku: []}); runtime({danmuku: []}); void other;`)
            assert.deepEqual(commonjs, [], 'Installed require declarations preserve old factories and callable runtime')
          }
        }
        matrix.push({ plugin: plugin.label, compiler: compiler.version, mode, direct, namespace, root, runtime, commonjs })
        writeJson(path.join(output, 'matrix-progress.json'), matrix)
      }
    }
    finally {
      removeConsumer(consumer)
    }
  }
  writeJson(path.join(output, 'report.json'), { suite: 'danmuku-isolated-package-types', introducedBy: 'PKG-DANMUKU-06', scope: 'Actual npm 5.3.0 and packed candidate outside workspace; offline and frozen reinstall, exact installed bytes, unchanged root declaration, full factory replacement and extraction. Old synchronous emit and object points remain root typing only. Runtime types are checked separately. NodeNext root namespace failures are compared by exact codes and line positions. This is not real playback or complete publication acceptance.', fixtures: Object.fromEntries(Object.entries(fixtures).map(([file, source]) => [file, hash(source)])), packages, published: { archive: published.archive, sha256: published.sha256 }, matrix })
  console.log(`Danmuku installed types passed: ${matrix.length} cases; ${output}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
