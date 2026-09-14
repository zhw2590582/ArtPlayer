import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import { verifyIframeContract } from '../refactor/scripts/iframe-contract.mjs'
import { hash, readMember } from '../refactor/scripts/releases.mjs'
import { checkFiles, packedFiles } from './package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from './package-consumer.mjs'
import { verifyRollbackFiles } from './rollback-files.mjs'

assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use pinned Yarn')
assert.equal(process.versions.node, fs.readFileSync(path.join(workspace, '.node-version'), 'utf8').trim(), 'Use pinned Node')
const yarn = process.env.npm_execpath
assert(yarn && fs.existsSync(yarn))
const name = 'artplayer-tool-iframe'
const parent = path.join(workspace, 'refactor/.cache/iframe-rollback')
fs.mkdirSync(parent, { recursive: true })
const output = fs.mkdtempSync(path.join(parent, 'run-'))
const directory = consumerDirectory()
const source = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: workspace, encoding: 'utf8', windowsHide: true }).trim()
const report = { task: 'REL-04', capturedAt: new Date().toISOString(), source, node: process.versions.node, yarn: '1.22.22', passed: false, scope: 'Old package name and application imports restored together; independent renamed-package installation rehearsal', profiles: {}, steps: [] }
function checkTypes(consumer, source) {
  const file = path.join(consumer, 'consumer.ts')
  fs.writeFileSync(file, source)
  const program = ts.createProgram([file], { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, moduleResolution: ts.ModuleResolutionKind.NodeJs, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] })
  for (const input of program.getSourceFiles()) {
    const actual = fs.realpathSync(input.fileName)
    assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(input) && path.dirname(actual) === fs.realpathSync(path.dirname(ts.sys.getExecutingFilePath()))), 'Type resolution escaped isolated consumer')
  }
  const diagnostics = ts.getPreEmitDiagnostics(program).map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n'))
  assert.deepEqual(diagnostics, [])
  return { compiler: ts.version, mode: 'node10-commonjs', diagnostics }
}
try {
  const { baseline, archive } = await verifyIframeContract()
  const snapshot = path.join(output, 'build')
  fs.mkdirSync(snapshot)
  for (const file of ['package.json', 'yarn.lock', 'tsconfig.json', 'tsconfig.base.json']) fs.copyFileSync(path.join(workspace, file), path.join(snapshot, file))
  fs.cpSync(path.join(workspace, 'scripts'), path.join(snapshot, 'scripts'), { recursive: true })
  fs.symlinkSync(path.join(workspace, 'node_modules'), path.join(snapshot, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir')
  fs.cpSync(path.join(workspace, 'packages', name), path.join(snapshot, 'packages', name), { recursive: true, filter: file => !['dist', 'node_modules'].includes(path.basename(file)) })
  fs.writeFileSync(path.join(output, 'build.log'), run(['scripts/build.js', name], snapshot))
  const candidateArchive = path.join(output, 'candidate.tgz')
  fs.writeFileSync(path.join(output, 'pack.log'), run([yarn, 'pack', '--filename', candidateArchive], path.join(snapshot, 'packages', name)))
  const files = packedFiles(candidateArchive)
  const manifest = JSON.parse(readMember(candidateArchive, 'package/package.json'))
  checkFiles(manifest, files)
  assert.equal(manifest.name, name)
  assert(!['preinstall', 'install', 'postinstall'].some(hook => manifest.scripts?.[hook]), 'Installation hooks need a separate fixture')
  const profiles = {
    old: { ...baseline.release, archive },
    candidate: { name, version: manifest.version, archive: candidateArchive, sha256: hash(fs.readFileSync(candidateArchive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(candidateArchive, member))])) },
  }
  for (const [id, pkg] of Object.entries(profiles)) {
    const consumer = consumerDirectory()
    try {
      const application = id === 'old'
        ? `const assert = require('node:assert/strict');\nconst Iframe = require('${pkg.name}').default;\nconst Helper = require('${pkg.name}/dist/artplayer-helper-iframe.js').default;\nassert.equal(typeof Iframe, 'function');\nassert.equal(typeof Helper.destroy, 'function');\nconsole.log('old import and helper restored');\n`
        : `const assert = require('node:assert/strict');\nconst Iframe = require('${pkg.name}');\nassert.equal(typeof Iframe, 'function');\nassert.equal(typeof require('${pkg.name}/legacy'), 'function');\nconsole.log('candidate import and legacy verified');\n`
      writeJson(path.join(consumer, 'package.json'), { name: 'iframe-rollback-consumer', private: true, dependencies: { [pkg.name]: `file:${pkg.archive.replaceAll('\\', '/')}` } })
      fs.writeFileSync(path.join(output, `${id}-prepare.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
      verifyRollbackFiles(consumer, pkg)
      for (const file of ['package.json', 'yarn.lock']) fs.copyFileSync(path.join(consumer, file), path.join(output, `${id}-${file}`))
      fs.writeFileSync(path.join(output, `${id}-application.cjs`), application)
      report.profiles[id] = { name: pkg.name, version: pkg.version, archive: path.relative(workspace, pkg.archive).replaceAll('\\', '/'), sha256: pkg.sha256, lockSha256: hash(fs.readFileSync(path.join(consumer, 'yarn.lock'))), applicationSha256: hash(application), files: pkg.files }
    }
    finally { removeConsumer(consumer) }
  }
  for (const [id, action] of [['old', 'install-predecessor'], ['candidate', 'upgrade-renamed-package'], ['old', 'restore-predecessor']]) {
    const pkg = profiles[id]
    for (const file of ['package.json', 'yarn.lock']) fs.copyFileSync(path.join(output, `${id}-${file}`), path.join(directory, file))
    fs.copyFileSync(path.join(output, `${id}-application.cjs`), path.join(directory, 'application.cjs'))
    fs.writeFileSync(path.join(output, `${action}-install.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--force', '--ignore-scripts', '--non-interactive'], directory))
    assert.equal(hash(fs.readFileSync(path.join(directory, 'yarn.lock'))), report.profiles[id].lockSha256)
    const installed = verifyRollbackFiles(directory, pkg)
    assert(!fs.existsSync(path.join(directory, 'node_modules', id === 'old' ? name : baseline.release.name)), 'Renamed package remained after restoration')
    assert.equal(hash(fs.readFileSync(path.join(directory, 'application.cjs'))), report.profiles[id].applicationSha256)
    const runtime = run(['application.cjs'], directory).trim()
    const types = checkTypes(directory, `import Iframe from '${pkg.name}';\nconst iframe = new Iframe({ iframe: document.createElement('iframe'), url: '/child.html' });\niframe.commit(() => 42);\niframe.destroy();\n`)
    report.steps.push({ action, profile: id, installed, runtime, types, otherPackageRemoved: true, applicationRestored: true })
  }
  const aliasConsumer = consumerDirectory()
  try {
    writeJson(path.join(aliasConsumer, 'package.json'), { name: 'iframe-alias-negative', private: true, dependencies: { [name]: `file:${archive.replaceAll('\\', '/')}` } })
    fs.writeFileSync(path.join(output, 'alias-install.log'), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], aliasConsumer))
    const installed = path.join(aliasConsumer, 'node_modules', name)
    for (const [member, digest] of Object.entries(baseline.release.files)) assert.equal(hash(fs.readFileSync(path.join(installed, member.slice(8)))), digest)
    fs.writeFileSync(path.join(aliasConsumer, 'alias.cjs'), `const assert = require('node:assert/strict');\nconst Iframe = require('${name}');\nassert.equal(typeof Iframe, 'object');\nassert.equal(typeof Iframe.default, 'function');\nassert.throws(() => new Iframe({}), TypeError);\nassert.throws(() => require('${name}/legacy'), error => error.code === 'MODULE_NOT_FOUND');\nconsole.log('old tarball under new dependency key does not preserve candidate constructor/legacy');\n`)
    report.aliasNegative = { passed: true, result: run(['alias.cjs'], aliasConsumer).trim(), scope: 'Local file dependency key alias, not npm registry alias resolution' }
  }
  finally { removeConsumer(aliasConsumer) }
  report.passed = true
}
catch (error) {
  report.error = { name: error.name, message: error.message }
  fs.writeFileSync(path.join(output, 'failure.log'), `${error.stack}\n${error.stdout || ''}\n${error.stderr || ''}`)
  throw error
}
finally {
  writeJson(path.join(output, 'report.json'), report)
  writeJson(path.join(parent, 'latest.json'), { output: path.relative(workspace, output).replaceAll('\\', '/'), passed: report.passed })
  removeConsumer(directory)
  console.log(`Iframe rollback: ${path.relative(workspace, output)}; passed=${report.passed}`)
}
