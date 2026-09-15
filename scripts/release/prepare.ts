import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import { buildLedger, root } from '../../refactor/scripts/release-ledger.mjs'
import { prepareReleaseBundle } from './bundle.ts'

export function assertCleanSource(directory: string): void {
  const status = execFileSync('git', ['status', '--porcelain', '-z', '--untracked-files=normal'], { cwd: directory, encoding: 'utf8' })
  assert(status.length === 0, 'Commit source and evidence changes before preparing a release bundle')
}

export function prepareRelease(args = process.argv.slice(2)): void {
  const { values } = parseArgs({ args, options: { packages: { type: 'string' }, tag: { type: 'string' } }, strict: true })
  assert(values.packages && values.tag, 'Explicit --packages and --tag are required')
  const expectedNode = fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()
  assert.equal(process.version, `v${expectedNode}`, 'Use the canonical Node version')
  assert(process.env.npm_config_user_agent?.startsWith('yarn/1.22.22 '), 'Use yarn release:bundle')
  function inspect(directory: string, names: string[]) {
    assertCleanSource(directory)
    return buildLedger(directory, names)
  }
  const result = prepareReleaseBundle(root, values.packages.split(','), values.tag, inspect)
  console.log(JSON.stringify({ directory: result.directory, packages: result.manifest.packages.map(({ name, version, integrity }) => ({ name, version, integrity })), publicationAuthorized: false }))
}
