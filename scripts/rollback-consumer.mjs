import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { ensureArchive, hash } from '../refactor/scripts/releases.mjs'
import { consumerDirectory, names, readJson, removeConsumer, run, runtimeConsumer, workspace, writeJson } from './package-consumer.mjs'
import { verifyRollbackFiles } from './rollback-files.mjs'

assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use pinned Yarn')
assert.equal(process.versions.node, fs.readFileSync(path.join(workspace, '.node-version'), 'utf8').trim(), 'Use pinned Node')
const yarn = process.env.npm_execpath
assert(yarn && fs.existsSync(yarn), 'Missing Yarn executable')
assert.equal(run([yarn, '--version'], workspace).trim(), '1.22.22')
const source = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: workspace, encoding: 'utf8', windowsHide: true }).trim()
const builds = fs.realpathSync(path.join(workspace, 'refactor/.cache/packages'))
const build = fs.realpathSync(path.resolve(workspace, readJson(path.join(builds, 'latest.json')).output))
assert.equal(path.dirname(build), builds, 'Use a direct package-check output directory')
const candidate = readJson(path.join(build, 'report.json'))
assert.equal(candidate.source, source, 'Run yarn test:package on the current commit first')
assert.deepEqual(candidate.packages.map(pkg => pkg.name), names, 'This rehearsal covers core and Chapter')
const parent = path.join(workspace, 'refactor/.cache/rollback')
fs.mkdirSync(parent, { recursive: true })
const output = fs.mkdtempSync(path.join(parent, 'run-'))
const relative = file => path.relative(workspace, file).replaceAll('\\', '/')
const report = { task: 'REL-04', capturedAt: new Date().toISOString(), source, node: process.versions.node, yarn: '1.22.22', passed: false, build: relative(build), scope: names, profiles: {}, steps: [], limitations: ['Early rehearsal; not final next-major candidate acceptance.', 'Runtime imports and file restoration only; browser playback and other package rollbacks require separate evidence.'] }
const consumer = consumerDirectory()
try {
  const old = []
  for (const release of readJson(path.join(workspace, 'refactor/baselines/releases.json')).releases) {
    const archive = await ensureArchive(release)
    old.push({ ...release, archive })
  }
  assert.deepEqual(old.map(pkg => pkg.name), names, 'Historical package order must match the rehearsal profiles')
  const current = candidate.packages.map((pkg) => {
    assert.equal(path.basename(pkg.archive), pkg.archive)
    const archive = path.join(build, pkg.archive)
    assert.equal(hash(fs.readFileSync(archive)), pkg.sha256, 'Candidate archive changed')
    return { ...pkg, archive }
  })
  const profiles = { baseline: old, core: [current[0], old[1]], plugin: [old[0], current[1]], both: current }
  for (const [id, packages] of Object.entries(profiles)) {
    const dir = consumerDirectory()
    try {
      const manifest = { name: 'artplayer-rollback-consumer', private: true, dependencies: Object.fromEntries(packages.map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) }
      writeJson(path.join(dir, 'package.json'), manifest)
      fs.copyFileSync(path.join(workspace, 'yarn.lock'), path.join(dir, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${id}-prepare.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], dir))
      for (const pkg of packages) verifyRollbackFiles(dir, pkg)
      fs.copyFileSync(path.join(dir, 'package.json'), path.join(output, `${id}-package.json`))
      fs.copyFileSync(path.join(dir, 'yarn.lock'), path.join(output, `${id}-yarn.lock`))
      report.profiles[id] = { packages: packages.map(pkg => ({ name: pkg.name, version: pkg.version, archive: relative(pkg.archive), sha256: pkg.sha256 })), lockSha256: hash(fs.readFileSync(path.join(dir, 'yarn.lock'))) }
    }
    finally { removeConsumer(dir) }
  }
  const sequence = [
    ['baseline', 'install-old'],
    ['core', 'upgrade-core'],
    ['both', 'upgrade-plugin'],
    ['core', 'rollback-plugin'],
    ['both', 'restore-candidate'],
    ['plugin', 'rollback-core'],
    ['baseline', 'rollback-all'],
  ]
  for (const [id, action] of sequence) {
    fs.copyFileSync(path.join(output, `${id}-package.json`), path.join(consumer, 'package.json'))
    const lock = fs.readFileSync(path.join(output, `${id}-yarn.lock`))
    fs.writeFileSync(path.join(consumer, 'yarn.lock'), lock)
    fs.writeFileSync(path.join(output, `${action}-install.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--force', '--ignore-scripts', '--non-interactive'], consumer))
    assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock, 'Rollback changed the frozen lock')
    const packages = profiles[id].map(pkg => verifyRollbackFiles(consumer, pkg))
    const runtime = runtimeConsumer(consumer, { baseline: id === 'baseline' || id === 'plugin' })
    if (report.steps.length)
      assert.deepEqual(runtime.observations.api, report.steps[0].runtime.observations.api, 'Rollback public API shape changed')
    const artifacts = {}
    for (const name of names) {
      fs.cpSync(path.join(consumer, 'node_modules', name), path.join(output, action, 'node_modules', name), { recursive: true })
      artifacts[name] = `./${action}/node_modules/${name}/dist/${name}.js`
    }
    writeJson(path.join(output, `${action}-browser-artifacts.json`), artifacts)
    report.steps.push({ action, profile: id, lockSha256: hash(lock), packages, runtime, browserArtifacts: `${action}-browser-artifacts.json` })
    writeJson(path.join(output, 'report.json'), report)
    console.log(`${action}: exact installed files and ${runtime.checks.length} runtime checks passed`)
  }
  report.passed = true
}
catch (error) {
  report.error = { name: error.name, message: error.message }
  fs.writeFileSync(path.join(output, 'failure.log'), `${error.stack}\n${error.stdout || ''}\n${error.stderr || ''}`)
  throw error
}
finally {
  writeJson(path.join(output, 'report.json'), report)
  writeJson(path.join(parent, 'latest.json'), { output: relative(output), passed: report.passed })
  removeConsumer(consumer)
  console.log(`Rollback report: ${relative(output)}`)
}
