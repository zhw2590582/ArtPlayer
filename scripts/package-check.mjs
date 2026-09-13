import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ensureArchive, hash, readMember } from '../refactor/scripts/releases.mjs'
import { consumerDirectory, names, readJson, removeConsumer, run, runtimeConsumer, typeConsumers, workspace, writeJson } from './package-consumer.mjs'

export function checkFiles(manifest, files, historical = []) {
  for (const field of ['main', 'module', 'types', 'legacy']) {
    assert(typeof manifest[field] === 'string', `Missing ${field}: ${manifest.name}`)
    assert(files.includes(`package/${manifest[field].replace(/^\.\//, '')}`), `Missing ${field} file: ${manifest.name}`)
  }
  function visit(value) {
    if (typeof value === 'string') {
      assert(value.startsWith('./') && !value.includes('..'), 'Invalid export target')
      const pattern = new RegExp(`^package/${value.slice(2).split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.+')}\$`)
      assert(files.some(file => pattern.test(file)), `Missing export target: ${value}`)
    }
    else if (value && typeof value === 'object') {
      for (const child of Object.values(value)) visit(child)
    }
  }
  visit(manifest.exports)
  for (const file of historical.filter(file => /^package\/(?:dist|types)\//.test(file)))
    assert(files.includes(file), `Historical distribution file removed: ${file}`)
  assert(!files.some(file => /^package\/(?:src|public|node_modules)\//.test(file)), 'Source/dependencies leaked into package')
  assert(!files.includes('package/tsconfig.json'), 'Implementation tsconfig leaked into package')
}

export function packedFiles(archive) {
  const args = { encoding: 'utf8', windowsHide: true }
  const names = execFileSync('tar', ['-tzf', archive], args).trim().split(/\r?\n/)
  const entries = execFileSync('tar', ['-tvzf', archive], args).trim().split(/\r?\n/)
  assert.equal(names.length, entries.length, 'Archive listing mismatch')
  assert.equal(new Set(names).size, names.length, 'Duplicate archive members')
  return names.filter((name, index) => {
    const type = entries[index][0]
    assert(['d', '-'].includes(type), 'Package links and special files are unsupported')
    assert((type === 'd' && name === 'package') || name.startsWith('package/'), 'Invalid package root')
    assert(!name.includes('\\') && !name.split('/').includes('..'), 'Unsafe package member')
    return type === '-'
  }).sort()
}

export async function publishedConsumer() {
  const dir = consumerDirectory()
  const releases = readJson(path.join(workspace, 'refactor/baselines/releases.json')).releases
  try {
    for (const release of releases) {
      const archive = await ensureArchive(release)
      for (const [member, digest] of Object.entries(release.files)) {
        const bytes = readMember(archive, member)
        assert.equal(hash(bytes), digest)
        const file = path.join(dir, 'node_modules', release.name, member.slice(8))
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, bytes)
      }
    }
    return { dir, releases }
  }
  catch (error) {
    removeConsumer(dir)
    throw error
  }
}

export async function checkPackages({ release = false } = {}) {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Run yarn test:package with the pinned Yarn')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn), 'Missing Yarn executable')
  const parent = path.join(workspace, 'refactor/.cache/packages')
  fs.mkdirSync(parent, { recursive: true })
  const output = fs.mkdtempSync(path.join(parent, 'run-'))
  const snapshot = path.join(output, 'build')
  fs.mkdirSync(snapshot)
  for (const file of ['package.json', 'yarn.lock', 'tsconfig.json', 'tsconfig.base.json', 'eslint.config.js']) fs.copyFileSync(path.join(workspace, file), path.join(snapshot, file))
  fs.cpSync(path.join(workspace, 'types'), path.join(snapshot, 'types'), { recursive: true })
  fs.cpSync(path.join(workspace, 'scripts'), path.join(snapshot, 'scripts'), { recursive: true })
  fs.symlinkSync(path.join(workspace, 'node_modules'), path.join(snapshot, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir')
  for (const name of names) {
    const source = path.join(workspace, 'packages', name)
    fs.cpSync(source, path.join(snapshot, 'packages', name), { recursive: true, filter: file => !['dist', 'node_modules'].includes(path.basename(file)) })
  }
  fs.writeFileSync(path.join(output, 'build.log'), run(['scripts/build-types.mjs', '--write'], snapshot) + run(['scripts/build.js', ...names], snapshot) + run(['scripts/build-i18n.js'], snapshot))
  const baseline = await publishedConsumer()
  const installed = consumerDirectory()
  try {
    const oldRuntime = runtimeConsumer(baseline.dir, { baseline: true })
    fs.cpSync(path.join(baseline.dir, 'node_modules'), path.join(output, 'published-artifacts'), { recursive: true })
    const packages = []
    for (const name of names) {
      const archive = path.join(output, `${name}.tgz`)
      fs.writeFileSync(path.join(output, `${name}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(snapshot, 'packages', name)))
      const files = packedFiles(archive)
      const manifest = JSON.parse(readMember(archive, 'package/package.json'))
      assert.equal(manifest.name, name)
      assert(!['preinstall', 'install', 'postinstall'].some(hook => manifest.scripts?.[hook]), 'Add lifecycle fixtures before accepting install hooks')
      checkFiles(manifest, files, Object.keys(baseline.releases.find(r => r.name === name).files))
      packages.push({ name, version: manifest.version, archive: path.basename(archive), sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(file => [file, hash(readMember(archive, file))])) })
    }
    writeJson(path.join(installed, 'package.json'), { private: true, name: 'artplayer-isolated-consumer', dependencies: Object.fromEntries(packages.map(pkg => [pkg.name, `file:${path.join(output, pkg.archive).replaceAll('\\', '/')}`])) })
    fs.copyFileSync(path.join(workspace, 'yarn.lock'), path.join(installed, 'yarn.lock'))
    fs.writeFileSync(path.join(output, 'install.log'), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], installed))
    const lock = fs.readFileSync(path.join(installed, 'yarn.lock'))
    fs.writeFileSync(path.join(output, 'frozen-install.log'), run([yarn, 'install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--non-interactive'], installed))
    assert.deepEqual(fs.readFileSync(path.join(installed, 'yarn.lock')), lock, 'Frozen consumer lock changed')
    fs.writeFileSync(path.join(output, 'consumer-yarn.lock'), lock)
    const artifacts = {}
    for (const pkg of packages) {
      const root = path.join(installed, 'node_modules', pkg.name)
      assert.equal(fs.realpathSync(root), root, 'Installed package must not be a workspace link')
      for (const [member, digest] of Object.entries(pkg.files))
        assert.equal(hash(fs.readFileSync(path.join(root, member.slice(8)))), digest, `Installed bytes differ: ${member}`)
      fs.cpSync(root, path.join(output, 'artifacts', pkg.name), { recursive: true })
      artifacts[pkg.name] = `./artifacts/${pkg.name}/dist/${pkg.name}.js`
    }
    const runtime = runtimeConsumer(installed)
    assert.deepEqual(runtime.observations.api, oldRuntime.observations.api, 'Published API shape/defaults changed')
    const types = typeConsumers(installed)
    const preciseTypes = typeConsumers(installed, { precise: true })
    const source = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: workspace, encoding: 'utf8' }).trim()
    const publishedPackages = baseline.releases.map(({ name, version, files }) => ({ name, version, files }))
    const report = { task: 'ENG-07', capturedAt: new Date().toISOString(), source, toolchain: { yarn: '1.22.22', yarnPath: yarn }, node: process.versions.node, packages, runtime, publishedPackages, publishedRuntime: oldRuntime, types, preciseTypes, knownRuntimeBlockers: runtime.observations.defaultsWithoutNavigator.resolved ? 0 : 1, knownTypeBlockers: [...types, ...preciseTypes].reduce((sum, result) => sum + result.diagnostics.length, 0) }
    writeJson(path.join(output, 'report.json'), report)
    writeJson(path.join(output, 'browser-artifacts.json'), artifacts)
    writeJson(path.join(parent, 'latest.json'), { output: path.relative(workspace, output).replaceAll('\\', '/') })
    console.log(`Installed tarball contracts passed: ${runtime.checks.length} runtime checks; ${types.filter(t => !t.diagnostics.length).length}/${types.length} legacy type modes; ${preciseTypes.filter(t => !t.diagnostics.length).length}/${preciseTypes.length} precise type modes. Report: ${output}`)
    if (release) {
      assert.equal(report.knownTypeBlockers, 0, 'Known type blockers remain; this candidate is not release-ready')
      assert.equal(report.knownRuntimeBlockers, 0, 'Known runtime blockers remain; this candidate is not release-ready')
    }
    return report
  }
  finally {
    removeConsumer(installed)
    removeConsumer(baseline.dir)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkPackages({ release: process.argv.includes('--release') }).catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
