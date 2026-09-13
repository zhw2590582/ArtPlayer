import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const workspace = fileURLToPath(new URL('../', import.meta.url))
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const run = (args, cwd) => execFileSync(process.execPath, args, { cwd, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024, windowsHide: true, env: { ...process.env, NODE_PATH: '' } })

export function runtimeConsumer(dir, { baseline = false } = {}) {
  fs.copyFileSync(path.join(workspace, 'test/package/runtime.cjs'), path.join(dir, 'runtime.cjs'))
  fs.copyFileSync(path.join(workspace, 'test/contracts/emitter.js'), path.join(dir, 'emitter.mjs'))
  write(path.join(dir, 'expected.json'), { version: read(path.join(dir, 'node_modules/artplayer/package.json')).version, baseline })
  const result = JSON.parse(run(['runtime.cjs'], dir))
  assert.equal(result.node, process.versions.node, 'Consumer must run on the selected Node')
  return result
}

export function verifyInstalledFiles(directory, packages) {
  assert.deepEqual(packages.map(pkg => pkg.name).sort(), ['artplayer', 'artplayer-plugin-chapter'], 'Runtime probe scope must match the actual package fixture')
  for (const pkg of packages) {
    const root = path.join(directory, 'node_modules', pkg.name)
    assert.equal(fs.realpathSync(root), root, 'Consumer cannot resolve workspace links')
    for (const [member, digest] of Object.entries(pkg.files)) {
      assert(member.startsWith('package/') && !member.includes('\\') && !member.split('/').includes('..'), 'Unsafe package member')
      assert.equal(hash(path.join(root, member.slice(8))), digest, `Installed package bytes differ: ${pkg.name}/${member}`)
    }
    assert.equal(read(path.join(root, 'package.json')).version, pkg.version)
  }
}

export function checkPackageRuntime({ expectedNode, output } = {}) {
  assert.equal(process.versions.node, expectedNode, 'Select the requested exact Node before running consumers')
  const parent = fs.realpathSync(path.join(workspace, 'refactor/.cache/packages'))
  const selected = output || read(path.join(parent, 'latest.json')).output
  const directory = fs.realpathSync(path.resolve(workspace, selected))
  assert.equal(path.dirname(directory), parent, 'Use a direct package-check run directory')
  assert(path.basename(directory).startsWith('run-'))
  const built = read(path.join(directory, 'report.json'))
  assert.equal(built.source, execFileSync('git', ['rev-parse', 'HEAD'], { cwd: workspace, encoding: 'utf8' }).trim(), 'Package build belongs to another commit')
  assert.equal(built.toolchain?.yarn, '1.22.22', 'Use the recorded pinned package manager')
  const yarn = built.toolchain.yarnPath
  assert.equal(run([yarn, '--version'], workspace).trim(), '1.22.22')
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-consumer-'))
  const report = { task: 'CI-01', node: process.versions.node, source: built.source, buildNode: built.node, passed: false, packages: built.packages.map(pkg => ({ name: pkg.name, version: pkg.version, sha256: pkg.sha256 })) }
  const prefix = path.join(directory, `runtime-node-${expectedNode}`)
  try {
    const baseline = path.join(temporary, 'published')
    fs.mkdirSync(baseline)
    fs.cpSync(path.join(directory, 'published-artifacts'), path.join(baseline, 'node_modules'), { recursive: true })
    verifyInstalledFiles(baseline, built.publishedPackages)
    report.publishedRuntime = runtimeConsumer(baseline, { baseline: true })
    const dependencies = {}
    for (const pkg of built.packages) {
      assert.equal(path.basename(pkg.archive), pkg.archive, 'Archive must stay in the build directory')
      const archive = path.join(directory, pkg.archive)
      assert.equal(hash(archive), pkg.sha256, 'Candidate archive changed after package checks')
      dependencies[pkg.name] = `file:${archive.replaceAll('\\', '/')}`
    }
    write(path.join(temporary, 'package.json'), { name: 'artplayer-isolated-consumer', private: true, dependencies })
    const lock = fs.readFileSync(path.join(directory, 'consumer-yarn.lock'))
    fs.writeFileSync(path.join(temporary, 'yarn.lock'), lock)
    fs.writeFileSync(`${prefix}-install.log`, run([yarn, 'install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--non-interactive'], temporary))
    assert.deepEqual(fs.readFileSync(path.join(temporary, 'yarn.lock')), lock, 'Frozen consumer lock changed')
    verifyInstalledFiles(temporary, built.packages)
    report.runtime = runtimeConsumer(temporary)
    assert.deepEqual(report.runtime.observations.api, report.publishedRuntime.observations.api, 'Published API shape/defaults changed on this Node')
    assert.deepEqual(report.runtime.checks, built.runtime.checks, 'Runtime check coverage changed across Node versions')
    report.knownRuntimeBlockers = report.runtime.observations.defaultsWithoutNavigator.resolved ? 0 : 1
    report.passed = true
    return report
  }
  catch (error) {
    report.error = { name: error.name, message: error.message }
    fs.writeFileSync(`${prefix}-failure.log`, `${error.stack}\n${error.stdout || ''}\n${error.stderr || ''}`)
    throw error
  }
  finally {
    write(`${prefix}.json`, report)
    assert.equal(path.dirname(fs.realpathSync(temporary)), fs.realpathSync(os.tmpdir()))
    assert(path.basename(temporary).startsWith('artplayer-consumer-'))
    fs.rmSync(temporary, { recursive: true, force: true })
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  assert((args.length === 1 && args[0] === '--canonical') || (args.length === 2 && args[0] === '--expected-node' && /^\d+\.\d+\.\d+$/.test(args[1])), 'Use --canonical or --expected-node <exact version>')
  const expectedNode = args[0] === '--canonical' ? fs.readFileSync(path.join(workspace, '.node-version'), 'utf8').trim() : args[1]
  const result = checkPackageRuntime({ expectedNode })
  console.log(`Installed runtime passed on Node ${result.node}: ${result.runtime.checks.length} candidate and ${result.publishedRuntime.checks.length} published checks`)
}
