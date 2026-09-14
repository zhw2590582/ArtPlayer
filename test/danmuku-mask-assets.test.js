import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Verify fixed browser resource inputs without starting the model.
import test from 'node:test'
import { hash } from '../refactor/scripts/releases.mjs'
import { danmukuMaskAssets } from './helpers/danmuku-mask-assets.js'

test('Model assets preserve executed bytes and allow only metadata newline conversion', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-mask-assets-'))
  const prefix = 'docs/assets/@mediapipe/selfie_segmentation/'
  const files = ['worker.js', 'model.wasm', 'package.json']
  const write = (file, bytes) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), bytes)
  }
  try {
    for (const file of files) write(prefix + file, 'fixture\n')
    write('refactor/baselines/danmuku-mask-release.json', JSON.stringify({ sdk: { assets: files.map(file => ({ file: prefix + file, sha256: hash('fixture\n') })) } }))
    const original = danmukuMaskAssets(root)
    assert(original.every(item => item.source.kind === 'local-model-resource' && !item.source.normalizedLF))
    assert.equal(original[0].route, '/assets/@mediapipe/selfie_segmentation/worker.js')
    for (const file of files.slice(0, 2)) {
      write(prefix + file, 'fixture\r\n')
      assert.throws(() => danmukuMaskAssets(root), /Model asset differs/)
      write(prefix + file, 'fixture\n')
    }
    write(`${prefix}package.json`, 'fixture\r\n')
    assert.equal(danmukuMaskAssets(root)[2].source.normalizedLF, true)
    fs.unlinkSync(path.join(root, `${prefix}model.wasm`))
    assert.throws(() => danmukuMaskAssets(root), { code: 'ENOENT' })
  }
  finally {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()))
    assert(path.basename(root).startsWith('artplayer-mask-assets-'))
    fs.rmSync(root, { recursive: true, force: true })
  }
})
