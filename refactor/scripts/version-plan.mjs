import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(fileURLToPath(new URL('../../', import.meta.url)))
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const mode = process.argv[2]
assert(['--check', '--prepared'].includes(mode) && process.argv.length === 3, 'Use --check or --prepared')
const plan = read('refactor/version-plan.json')
const ledger = read('refactor/release-ledger.json')
const inventory = read('refactor/package-inventory.json').packages
const registry = read(plan.registrySnapshot)
assert.equal(plan.schemaVersion, 1)
assert.equal(plan.policy.publicationAuthorized, false)
assert.equal(plan.policy.siteNpmPublication, false)
assert.equal(plan.policy.prereleaseSuffix, null)
assert.deepEqual(plan.packages.map(item => item.name).sort(), ledger.packages.map(item => item.name).sort())
for (const item of plan.packages) {
  const original = inventory.find(pkg => pkg.name === item.name)
  const row = ledger.packages.find(pkg => pkg.name === item.name)
  const observation = registry.observations.find(pkg => pkg.name === item.name)
  const manifest = read(`packages/${item.name}/package.json`)
  assert.equal(item.sourceVersion, original.version)
  assert.equal(item.targetVersion, row.targetVersion)
  assert.equal(item.targetVersion, `${Number(original.version.split('.')[0]) + 1}.0.0`)
  assert.equal(item.distribution, row.distribution)
  assert.equal(observation.target, item.targetVersion)
  assert.equal(observation.targetState, 'not-observed', `Target was used: ${item.name}`)
  assert.deepEqual(observation.majorConflicts, [], `Registry major conflict: ${item.name}`)
  assert.equal(item.registry.ownershipVerified, false)
  assert(item.changelog.changes.length && item.maintenanceDocs.length)
  assert.equal(item.changelog.path, `packages/${item.name}/CHANGELOG.md`)
  assert.equal(item.changelog.heading, `${item.targetVersion} (unreleased)`)
  for (const file of item.maintenanceDocs)
    assert(fs.existsSync(path.join(root, file)), `Missing maintenance guide: ${file}`)
  for (const field of ['dependencies', 'optionalDependencies', 'peerDependencies', 'peerDependenciesMeta', 'devDependencies'])
    assert.deepEqual(manifest[field], item.dependencyPolicy.sourceFields[field], `Unplanned dependency change: ${item.name}/${field}`)
  assert([item.sourceVersion, item.targetVersion].includes(manifest.version), `Unplanned current version: ${item.name}`)
  if (mode === '--prepared') {
    assert.equal(manifest.version, item.targetVersion, `Version not prepared: ${item.name}`)
    assert(fs.readFileSync(path.join(root, item.changelog.path), 'utf8').includes(item.changelog.heading), `Missing target changelog: ${item.name}`)
  }
}
for (const example of plan.examples) {
  const manifest = read(example.manifest)
  assert.equal(manifest.private, true)
  for (const [name, range] of Object.entries(example.dependencies))
    assert((mode === '--prepared' ? [range.planned] : [range.before, range.planned]).includes(manifest.dependencies[name]), `Example dependency not prepared: ${example.manifest}/${name}`)
}
console.log(`Version plan ${mode}: ${plan.packages.length} independent major targets; registry snapshot checked, publication remains unauthorized`)
