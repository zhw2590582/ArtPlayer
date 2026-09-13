import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Exercise actual Vite library output on disk.
import test from 'node:test'
import { build } from 'vite'
import { getViteBuildConfig } from '../scripts/utils.js'

test('Library builds never copy declaration sources or unrelated public resources into dist', async () => {
  const parent = fs.realpathSync('refactor/.cache')
  const root = fs.mkdtempSync(path.join(parent, 'library-build-'))
  try {
    fs.mkdirSync(path.join(root, 'src'))
    fs.mkdirSync(path.join(root, 'public'))
    fs.writeFileSync(path.join(root, 'src/index.ts'), 'export default function answer() { return 42 }\n')
    fs.writeFileSync(path.join(root, 'public/internal.ts'), 'export type PrivateImplementation = { secret: number }\n')
    fs.writeFileSync(path.join(root, 'public/unrelated.txt'), 'must not ship\n')
    for (const [format, fileName, target] of [['umd', 'index.js', 'es2020'], ['umd', 'index.legacy.js', 'es2015'], ['es', 'index.mjs', 'es2020']]) {
      const config = getViteBuildConfig({ entry: path.join(root, 'src/index.ts'), outDir: path.join(root, 'dist'), name: 'Fixture', format, fileName, target })
      await build({ root, ...config })
      assert(!fs.existsSync(path.join(root, 'dist/internal.ts')), 'Private declaration source was copied')
      assert(!fs.existsSync(path.join(root, 'dist/unrelated.txt')), 'Unrelated public asset was copied')
    }
    assert.deepEqual(fs.readdirSync(path.join(root, 'dist')).sort(), ['index.js', 'index.legacy.js', 'index.mjs'])
  }
  finally {
    assert.equal(path.dirname(fs.realpathSync(root)), parent)
    assert(path.basename(root).startsWith('library-build-'))
    fs.rmSync(root, { recursive: true, force: true })
  }
})
