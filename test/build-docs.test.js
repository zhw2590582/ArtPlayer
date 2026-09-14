import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Verify the CLI failure contract using a real child process.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))

test('documentation build uses pinned Yarn, forwards exit codes and retains old output until success', () => {
  assert(process.env.npm_execpath, 'Run this test through Yarn')
  const cache = path.join(root, 'refactor/.cache')
  fs.mkdirSync(cache, { recursive: true })
  const fixture = fs.mkdtempSync(path.join(cache, 'docs-exit-'))
  try {
    const pkg = path.join(fixture, 'packages/artplayer-vitepress')
    fs.mkdirSync(pkg, { recursive: true })
    const output = path.join(fixture, 'docs/document')
    fs.mkdirSync(output, { recursive: true })
    fs.writeFileSync(path.join(output, 'index.html'), 'Old site')
    fs.writeFileSync(
      path.join(pkg, 'fixture.cjs'),
      `
const fs = require('node:fs'); const path = require('node:path');
if (!process.env.npm_config_user_agent.startsWith('yarn/1.22.22')) process.exit(91);
const outDir = process.argv[process.argv.indexOf('--outDir') + 1];
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), 'New site');
process.exit(Number(process.env.DOCS_TEST_EXIT));
`,
    )
    for (const code of [23, 0]) {
      fs.writeFileSync(
        path.join(pkg, 'package.json'),
        JSON.stringify({
          private: true,
          scripts: { build: 'node fixture.cjs' },
        }),
      )
      const result = spawnSync(
        process.execPath,
        [path.join(root, 'scripts/build-docs.js')],
        {
          cwd: fixture,
          encoding: 'utf8',
          env: { ...process.env, DOCS_TEST_EXIT: String(code) },
        },
      )
      assert.equal(result.status, code, result.stderr)
      assert.equal(
        fs.readFileSync(path.join(output, 'index.html'), 'utf8'),
        code ? 'Old site' : 'New site',
      )
    }
  }
  finally {
    const relative = path.relative(cache, fixture)
    assert(relative.startsWith('docs-exit-') && !relative.includes(path.sep))
    fs.rmSync(fixture, { recursive: true, force: true })
  }
})
