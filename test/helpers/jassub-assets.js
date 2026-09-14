import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { hash } from '../../refactor/scripts/releases.mjs'
import { verifyInstalledArtifacts } from '../../scripts/installed-artifacts.mjs'

export function jassubAssets(root, mapFile) {
  const name = 'artplayer-plugin-jassub'
  const baseline = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/jassub-release.json'), 'utf8'))
  const installed = mapFile ? verifyInstalledArtifacts(root, mapFile, ['artplayer', 'artplayer-plugin-chapter', name]) : null
  const input = installed?.inputs.find(item => item.name === name)
  const pkg = installed?.packages.find(item => item.name === name)
  return ['jassub-worker.js', 'jassub-worker.wasm', 'jassub-worker-modern.wasm', 'default.woff2'].map((filename) => {
    const worker = filename !== 'default.woff2'
    const relative = worker ? `packages/${name}/worker/${filename}` : `docs/assets/jassub/${filename}`
    const expected = baseline.assets.find(item => item.file === relative)
    assert(expected, `Missing JASSUB resource baseline: ${relative}`)
    const member = `package/worker/${filename}`
    const file = input && worker ? path.resolve(path.dirname(input.file), '../worker', filename) : path.join(root, relative)
    const bytes = fs.readFileSync(file)
    const sha256 = hash(bytes)
    assert.equal(sha256, expected.sha256, `JASSUB resource differs from baseline: ${relative}`)
    if (input && worker)
      assert.equal(sha256, pkg.files[member], `Installed JASSUB resource differs from archive: ${member}`)
    return { route: `/assets/jassub/${filename}`, bytes, source: { kind: input && worker ? 'installed-resource' : 'local-resource', file, sha256, baseline: relative, member: input && worker ? member : null, archiveSha256: input && worker ? input.archiveSha256 : null } }
  })
}
