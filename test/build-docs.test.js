import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Verify the CLI failure contract using a real child process.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))

test('documentation build forwards child failure and success exit codes', () => {
  const cache = path.join(root, 'refactor/.cache')
  fs.mkdirSync(cache, { recursive: true })
  const fixture = fs.mkdtempSync(path.join(cache, 'docs-exit-'))
  try {
    const pkg = path.join(fixture, 'packages/artplayer-vitepress')
    fs.mkdirSync(pkg, { recursive: true })
    for (const code of [23, 0]) {
      fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({
        private: true,
        scripts: { build: `node -e "process.exit(${code})"` },
      }))
      const result = spawnSync(process.execPath, [path.join(root, 'scripts/build-docs.js')], {
        cwd: fixture,
        encoding: 'utf8',
      })
      assert.equal(result.status, code, result.stderr)
    }
  }
  finally {
    const relative = path.relative(cache, fixture)
    assert(relative.startsWith('docs-exit-') && !relative.includes(path.sep))
    fs.rmSync(fixture, { recursive: true, force: true })
  }
})
