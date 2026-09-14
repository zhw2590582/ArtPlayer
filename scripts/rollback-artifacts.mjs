import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { hash } from '../refactor/scripts/releases.mjs'
import { verifyInstalledArtifacts } from './installed-artifacts.mjs'
import { verifyRollbackFiles } from './rollback-files.mjs'

export function verifyRollbackArtifacts(root, mapFile) {
  assert(mapFile, 'Set ARTPLAYER_BROWSER_ARTIFACTS to a rollback step map')
  const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
  const directory = path.dirname(fs.realpathSync(mapFile))
  assert.equal(path.dirname(directory), fs.realpathSync(path.join(root, 'refactor/.cache/rollback')))
  const report = read(path.join(directory, 'report.json'))
  assert.equal(report.task, 'REL-04')
  assert.equal(report.passed, true, 'Rollback installation must pass first')
  assert.equal(report.node, process.versions.node)
  assert.equal(report.source, execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', windowsHide: true }).trim())
  const step = report.steps.find(item => item.browserArtifacts === path.basename(mapFile))
  assert(step, 'Unknown rollback step map')
  const candidate = verifyInstalledArtifacts(root, path.join(root, report.build, 'browser-artifacts.json'))
  const historical = read(path.join(root, 'refactor/baselines/releases.json')).releases
  const map = read(mapFile)
  const expectedNames = ['artplayer', 'artplayer-plugin-chapter']
  assert.deepEqual(Object.keys(map), expectedNames)
  const packages = report.profiles[step.profile].packages.map((pkg) => {
    const recorded = [...candidate.packages, ...historical].find(item => item.name === pkg.name && item.sha256 === pkg.sha256)
    assert(recorded, 'Rollback package is not a verified candidate or frozen historical archive')
    assert.equal(hash(fs.readFileSync(path.resolve(root, pkg.archive))), recorded.sha256)
    assert.equal(map[pkg.name], `./${step.action}/node_modules/${pkg.name}/dist/${pkg.name}.js`)
    return verifyRollbackFiles(path.join(directory, step.action), recorded)
  })
  assert.deepEqual(packages, step.packages)
  assert.equal(hash(fs.readFileSync(path.join(directory, `${step.profile}-yarn.lock`))), step.lockSha256)
  return { directory, action: step.action, packages }
}
