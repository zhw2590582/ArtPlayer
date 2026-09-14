import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { hash } from '../../refactor/scripts/releases.mjs'

export function danmukuMaskAssets(root) {
  const baseline = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/danmuku-mask-release.json'), 'utf8'))
  return baseline.sdk.assets.map(({ file, sha256 }) => {
    assert(file.startsWith('docs/assets/@mediapipe/selfie_segmentation/') && !file.split('/').includes('..'), 'Unexpected model asset path')
    const absolute = path.join(root, file)
    const bytes = fs.readFileSync(absolute)
    const actual = hash(bytes)
    // Checkout newline conversion is allowed only for metadata, never executed assets.
    const normalizedLF = /\.(?:md|d\.ts|json)$/.test(file) && actual !== sha256
    assert.equal(normalizedLF ? hash(bytes.toString().replaceAll('\r\n', '\n')) : actual, sha256, `Model asset differs from fixed source: ${file}`)
    return { route: file.slice(4), bytes, source: { kind: 'local-model-resource', file: absolute, relativeFile: file, sha256: actual, baselineSha256: sha256, normalizedLF } }
  })
}
