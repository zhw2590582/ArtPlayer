import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hash, refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
const filename = path.join(refactorDir, 'baselines/distribution.json')
function files(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
}
function targets(value, field) {
  if (typeof value === 'string') return [{ field, path: value }]
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, child]) => targets(child, `${field}.${key}`))
  return []
}
export function captureDistribution() {
  const initial = JSON.parse(fs.readFileSync(path.join(refactorDir, 'package-inventory.json'), 'utf8'))
  return { schemaVersion: 1, task: 'BASE-05', capturedAt: new Date().toISOString(), sourceCommit: '2b7054d8',
    note: 'Workspace manifest and observed resource inventory. Existing dist files may be stale; presence and hashes are not proof of a fresh build or npm publication. Only core/chapter published tarballs are verified in releases.json and consumers.json.',
    packages: initial.packages.map(pkg => {
      const dir = path.join(root, 'packages', pkg.name)
      const manifestBytes = fs.readFileSync(path.join(dir, 'package.json'))
      const manifest = JSON.parse(manifestBytes)
      const resources = ['dist', 'types'].flatMap(name => files(path.join(dir, name))).map(file => ({ path: path.relative(dir, file).replaceAll('\\', '/'), bytes: fs.statSync(file).size, sha256: hash(fs.readFileSync(file)) })).sort((a, b) => a.path.localeCompare(b.path))
      const declaredTargets = ['main', 'module', 'legacy', 'types', 'typings', 'exports', 'typesVersions', 'browser', 'unpkg', 'jsdelivr'].flatMap(field => targets(manifest[field], field)).map(target => {
        const normalized = target.path.replace(/^\.\//, '')
        const regex = new RegExp(`^${normalized.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`)
        return { ...target, observedMatches: resources.filter(resource => regex.test(resource.path)).map(resource => resource.path) }
      })
      const site = pkg.name === 'artplayer-vitepress'
      return { name: pkg.name, kind: site ? 'documentation-site' : 'npm-library', manifest, manifestSha256Lf: hash(manifestBytes.toString().replaceAll('\r\n', '\n')), declaredTargets, resources,
        sourceAssets: files(path.join(dir, 'src')).filter(file => !/\.[cm]?[jt]sx?$/.test(file)).map(file => path.relative(dir, file).replaceAll('\\', '/')).sort(),
        buildOutputs: site ? ['docs/document/** via vitepress outDir'] : [`dist/${pkg.name}.js`, `dist/${pkg.name}.legacy.js`, `dist/${pkg.name}.mjs`, `docs/compiled/${pkg.name}.{js,legacy.js,mjs} copied by root build`],
        distributionStatus: site ? 'Actual workflow builds a static site; no library entrypoints. Manifest lacks private:true; publication intent needs SITE/REL confirmation, not an automatic npm release.' : 'Workspace inventory; per-package published contract remains required unless listed in releases.json.',
      }
    }),
  }
}
export function validateDistribution(report) {
  const initial = JSON.parse(fs.readFileSync(path.join(refactorDir, 'package-inventory.json'), 'utf8'))
  assert.equal(report.schemaVersion, 1)
  assert.deepEqual(report.packages.map(pkg => pkg.name), initial.packages.map(pkg => pkg.name), 'Distribution package coverage changed')
  for (const pkg of report.packages) {
    assert.equal(pkg.manifest.name, pkg.name)
    if (pkg.kind === 'npm-library') assert(pkg.resources.length > 0 && pkg.declaredTargets.length > 0, `Missing library resources: ${pkg.name}`)
    for (const resource of pkg.resources) assert(!resource.path.startsWith('/') && !resource.path.split('/').includes('..') && /^[a-f0-9]{64}$/.test(resource.sha256), 'Invalid resource provenance')
  }
  assert.equal(report.packages.filter(pkg => pkg.kind === 'documentation-site').length, 1)
  const thumbnail = report.packages.find(pkg => pkg.name === 'artplayer-tool-thumbnail')
  assert(thumbnail.declaredTargets.some(target => target.path.endsWith('.esm.js') && !target.observedMatches.length), 'Missing thumbnail entrypoint discrepancy')
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--capture')) {
    assert(!fs.existsSync(filename), 'Do not overwrite the historical distribution inventory')
    const report = captureDistribution()
    validateDistribution(report)
    fs.writeFileSync(filename, `${JSON.stringify(report, null, 2)}\n`)
  }
  else {
    assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use --capture or --check')
    const report = JSON.parse(fs.readFileSync(filename, 'utf8'))
    validateDistribution(report)
    console.log(`Frozen distribution inventory: ${report.packages.length} packages; current build and npm contents are not revalidated by this command`)
  }
}
