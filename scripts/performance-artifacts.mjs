import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { ensureArchive, readMember } from '../refactor/scripts/releases.mjs'
import { measureBytes } from '../refactor/scripts/sizes.mjs'

export { verifyInstalledArtifacts as verifyPerformanceArtifacts } from './installed-artifacts.mjs'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))

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
