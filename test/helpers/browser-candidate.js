import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { hash } from '../../refactor/scripts/releases.mjs'
import { verifyInstalledArtifacts } from '../../scripts/installed-artifacts.mjs'
import { compilePackage } from './load.js'

const root = fileURLToPath(new URL('../../', import.meta.url))

export async function browserCandidate(name, artifact) {
  const map = process.env.ARTPLAYER_BROWSER_ARTIFACTS
  if (map) {
    assert(!artifact, `Installed browser checks cannot override ${name} artifact`)
    const { inputs } = verifyInstalledArtifacts(root, map, ['artplayer', 'artplayer-plugin-chapter', name])
    const input = inputs.find(input => input.name === name)
    const code = fs.readFileSync(input.file, 'utf8')
    return { code, provenance: { kind: 'installed', ...input } }
  }
  const code = artifact ? fs.readFileSync(artifact, 'utf8') : await compilePackage(name, 'umd')
  return { code, provenance: { kind: artifact ? 'explicit-artifact' : 'source-build', file: artifact || null, sha256: hash(code) } }
}
