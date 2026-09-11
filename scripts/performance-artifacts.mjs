import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../refactor/scripts/releases.mjs'
import { measureBytes } from '../refactor/scripts/sizes.mjs'

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)])
function digest(file) {
  const bytes = fs.readFileSync(file)
  return hash(/\.(?:[cm]?[jt]s|json|css|less|html|svg|txt)$/.test(file) ? bytes.toString('utf8').replaceAll('\r\n', '\n') : bytes)
}

export function verifyPerformanceArtifacts(root, mapFile) {
  assert(mapFile, 'Run yarn test:package and set ARTPLAYER_BROWSER_ARTIFACTS to its browser-artifacts.json')
  const directory = path.dirname(path.resolve(mapFile))
  const artifacts = read(mapFile)
  const report = read(path.join(directory, 'report.json'))
  assert.equal(report.task, 'ENG-07', 'Performance requires isolated installation evidence')
  assert.equal(report.knownTypeBlockers, 0)
  assert.equal(report.node, process.versions.node, 'Build and benchmark Node versions differ')
  const toolchain = {}
  const currentManifest = read(path.join(root, 'package.json'))
  const buildManifest = read(path.join(directory, 'build/package.json'))
  for (const key of ['packageManager', 'devDependencies', 'resolutions'])
    assert.deepEqual(buildManifest[key], currentManifest[key], `Build toolchain changed: ${key}`)
  for (const file of ['yarn.lock', 'scripts/build.js', 'scripts/utils.js', 'scripts/projects.js']) {
    toolchain[file] = digest(path.join(root, file))
    assert.equal(digest(path.join(directory, 'build', file)), toolchain[file], `Stale build input: ${file}`)
  }
  const inputs = []
  for (const name of ['artplayer', 'artplayer-plugin-chapter']) {
    const pkg = report.packages.find(pkg => pkg.name === name)
    assert(pkg && artifacts[name], `Missing installed package: ${name}`)
    const file = path.resolve(directory, artifacts[name])
    const member = `package/dist/${path.basename(file)}`
    assert.equal(hash(fs.readFileSync(file)), pkg.files[member], `Installed performance artifact changed: ${name}`)
    const sourceHashes = {}
    for (const folder of ['src', 'public']) {
      const current = path.join(root, 'packages', name, folder)
      const snapshot = path.join(directory, 'build/packages', name, folder)
      if (!fs.existsSync(current)) {
        assert(!fs.existsSync(snapshot), `Source directory was removed: ${name}/${folder}`)
        continue
      }
      const inventory = location => Object.fromEntries(walk(location).map(file => [path.relative(location, file).replaceAll('\\', '/'), digest(file)]))
      const expected = inventory(current)
      assert.deepEqual(inventory(snapshot), expected, `Stale package source: ${name}/${folder}; rerun yarn test:package`)
      Object.assign(sourceHashes, Object.fromEntries(Object.entries(expected).map(([file, digest]) => [`${folder}/${file}`, digest])))
    }
    for (const file of ['package.json', 'THIRD_PARTY_NOTICES', 'tsconfig.json']) {
      const current = path.join(root, 'packages', name, file)
      const snapshot = path.join(directory, 'build/packages', name, file)
      assert.equal(fs.existsSync(current), fs.existsSync(snapshot), `Package input removed or added: ${name}/${file}`)
      if (fs.existsSync(current)) {
        sourceHashes[file] = digest(current)
        assert.equal(digest(snapshot), sourceHashes[file], `Stale package input: ${name}/${file}`)
      }
    }
    inputs.push({ name, file, member, sha256: pkg.files[member], archiveSha256: pkg.sha256, sourceHashes })
  }
  return { directory, inputs, toolchain, packages: report.packages }
}

export async function compareArtifactSizes(root, artifacts) {
  const releases = read(path.join(root, 'refactor/baselines/releases.json')).releases
  const comparisons = []
  for (const pkg of artifacts.packages) {
    const release = releases.find(release => release.name === pkg.name)
    const archive = await ensureArchive(release)
    for (const extension of ['js', 'legacy.js', 'mjs']) {
      const member = `package/dist/${pkg.name}.${extension}`
      assert(release.files[member] && pkg.files[member], `Missing matching size entry: ${member}`)
      const before = measureBytes(readMember(archive, member))
      const after = measureBytes(fs.readFileSync(path.join(artifacts.directory, 'artifacts', pkg.name, member.slice('package/'.length))))
      assert.equal(before.sha256, release.files[member])
      assert.equal(after.sha256, pkg.files[member])
      const reviewSignals = ['raw', 'gzip9', 'brotli6'].flatMap((metric) => {
        const deltaBytes = after[metric] - before[metric]
        const allowanceBytes = Math.max(before[metric] * 0.05, 1024)
        return deltaBytes > allowanceBytes ? [{ metric, deltaBytes, allowanceBytes }] : []
      })
      comparisons.push({ name: pkg.name, member, before, after, reviewSignals })
    }
  }
  return comparisons
}
