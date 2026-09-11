import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { hash, readMember } from './releases.mjs'

async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:dash-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/dash-package-types-'))
  console.log(`DASH isolated package type evidence: ${output}`)
  const consumer = consumerDirectory()
  try {
    const packages = []
    const published = JSON.parse(fs.readFileSync(path.join(workspace, 'refactor/baselines/dash-control-release.json'))).release
    for (const name of ['artplayer', 'artplayer-plugin-dash-control']) {
      const archive = path.join(output, `${name}.tgz`)
      fs.writeFileSync(path.join(output, `${name}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', name)))
      const files = packedFiles(archive)
      const manifest = JSON.parse(readMember(archive, 'package/package.json'))
      checkFiles(manifest, files, name === published.name ? Object.keys(published.files) : [])
      packages.push({ name, archive, sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) })
    }
    writeJson(path.join(consumer, 'package.json'), { name: 'dash-isolated-type-consumer', private: true, dependencies: Object.fromEntries(packages.map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
    fs.copyFileSync(path.join(workspace, 'yarn.lock'), path.join(consumer, 'yarn.lock'))
    fs.writeFileSync(path.join(output, 'install.log'), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
    const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
    fs.writeFileSync(path.join(output, 'frozen-install.log'), run([yarn, 'install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--non-interactive'], consumer))
    assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
    fs.writeFileSync(path.join(output, 'yarn.lock'), lock)
    for (const pkg of packages) {
      const root = path.join(consumer, 'node_modules', pkg.name)
      assert.equal(fs.realpathSync(root), root, 'Installed package is a workspace link')
      for (const [member, expected] of Object.entries(pkg.files))
        assert.equal(hash(fs.readFileSync(path.join(root, member.slice(8)))), expected, `Installed bytes differ: ${member}`)
    }
    const matrix = []
    for (const [compiler, mode] of [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]) {
      const next = mode.startsWith('nodenext')
      const extension = next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'
      const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
      const source = fs.readFileSync(path.join(workspace, 'test/types/dash-control.ts'), 'utf8')
      const filename = path.join(consumer, `current.${extension}`)
      const legacy = path.join(consumer, `legacy.${extension}`)
      fs.copyFileSync(path.join(workspace, 'refactor/fixtures/consumers/dash-control-legacy.ts'), legacy)
      const files = [filename, legacy]
      if (mode === 'nodenext-cjs') {
        const commonjs = path.join(consumer, 'commonjs.cts')
        fs.writeFileSync(commonjs, `import dash = require('artplayer-plugin-dash-control'); import legacy = require('artplayer-plugin-dash-control/legacy');
const option: dash.Option = { quality: { getName: level => String(level.height) } }; dash(option); legacy();`)
        files.push(commonjs)
      }
      function compile(code) {
        fs.writeFileSync(filename, code)
        const program = compiler.createProgram(files, options)
        for (const file of program.getSourceFiles()) {
          const actual = fs.realpathSync(file.fileName)
          assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(actual) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Types escaped isolated consumer: ${actual}`)
        }
        return compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n') }))
      }
      const diagnostics = compile(source)
      assert.deepEqual(diagnostics, [], `${compiler.version} ${mode}`)
      const invalid = compile(source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''))
      assert.equal(invalid.length, 8, 'Installed package must reject all invalid uses')
      matrix.push({ compiler: compiler.version, mode, diagnostics, invalid })
    }
    const report = { suite: 'dash-isolated-package-types', introducedBy: 'PKG-DASH-04', scope: 'Packed current core and DASH, offline Yarn install and frozen reinstall outside workspace; isolated public type acceptance only, not complete package runtime/SDK/media release validation.', packages, matrix }
    writeJson(path.join(output, 'report.json'), report)
    console.log(`DASH installed type matrix passed: ${matrix.length} modes, eight invalid uses rejected in each; ${output}`)
  }
  finally {
    removeConsumer(consumer)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
