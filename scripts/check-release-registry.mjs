import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import { buildLedger, root } from '../refactor/scripts/release-ledger.mjs'
import { assertCleanSource } from './release/prepare.ts'
import { checkReleaseRegistry } from './release/registry-check.ts'

try {
  const { values } = parseArgs({ options: { 'directory': { type: 'string' }, 'packages': { type: 'string' }, 'tag': { type: 'string' }, 'source-commit': { type: 'string' }, 'manifest-sha256': { type: 'string' } }, strict: true })
  assert(values.directory && values.packages && values.tag && values['source-commit'] && values['manifest-sha256'], 'Explicit --directory, --packages, --tag, --source-commit and --manifest-sha256 are required')
  assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use the canonical Node version')
  assert(process.env.npm_config_user_agent?.startsWith('yarn/1.22.22 '), 'Use yarn release:registry')
  const result = await checkReleaseRegistry(root, values.directory, { names: values.packages.split(','), tag: values.tag, sourceCommit: values['source-commit'], manifestSha256: values['manifest-sha256'] }, (directory, names) => {
    assertCleanSource(directory)
    return buildLedger(directory, names)
  })
  console.log(JSON.stringify(result, null, 2))
  if (result.conflicts.length)
    process.exitCode = 1
}
catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
