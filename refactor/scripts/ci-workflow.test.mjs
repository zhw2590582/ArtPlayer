/* eslint-disable no-template-curly-in-string -- GitHub workflow expressions are literal contract data. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Workflow contract regression runner.
import test from 'node:test'
import YAML from 'yaml'
import { validateCIWorkflow } from './ci-workflow.mjs'

const source = fs.readFileSync('.github/workflows/nodejs.yml', 'utf8')
test('CI workflow preserves complete matrix jobs, pinned download caches and an unconditional summary', () => {
  assert.equal(validateCIWorkflow(source).summary, 'CI result')
})

for (const [name, mutate] of [
  ['missing required dependency', w => w.jobs['ci-result'].needs.pop()],
  ['success-only summary', w => w.jobs['ci-result'].if = 'success()'],
  ['conditional result gate', w => w.jobs['ci-result'].steps.find(s => s.run).if = 'success()'],
  ['softened gate', w => w.jobs['ci-result'].steps.find(s => s.run)['continue-on-error'] = true],
  ['untracked extra job', w => w.jobs.extra = w.jobs.coverage],
  ['matrix exclusion', w => w.jobs.checks.strategy.matrix.exclude = [{ os: 'windows-latest' }]],
  ['removed Windows build', w => w.jobs.checks.strategy.matrix.os.pop()],
  ['fail-fast cancellation', w => w.jobs.coverage.strategy['fail-fast'] = true],
  ['artifact name collision', w => w.jobs.checks.steps.find(s => s.uses?.startsWith('actions/upload-artifact@')).with.name = 'checks'],
  ['write permissions', w => w.permissions.contents = 'write'],
  ['mutable action ref', w => w.jobs.checks.steps.find(s => s.uses?.startsWith('actions/cache@')).uses = 'actions/cache@v5'],
  ['dependency installation cache', w => w.jobs.checks.steps.find(s => s.uses?.startsWith('actions/cache@')).with.path = 'node_modules'],
  ['cross-branch cache fallback', w => w.jobs.coverage.steps.find(s => s.uses?.startsWith('actions/cache@')).with['restore-keys'] = 'yarn-'],
  ['cache without runtime', w => w.jobs.coverage.steps.find(s => s.uses?.startsWith('actions/cache@')).with.key = '${{ runner.os }}-${{ github.ref }}'],
  ['skipped dependencies on browser cache hit', w => w.jobs['browser-smoke'].steps.find(s => s.run?.startsWith('yarn test:browser:install')).if = 'steps.cache.outputs.cache-hit != \'true\''],
  ['Windows pipeline without pipefail', w => w.jobs.checks.defaults.run.shell = 'sh'],
  ['conditional frozen install', w => w.jobs.checks.steps.find(s => s.run?.includes('yarn install --frozen-lockfile')).if = 'false'],
  ['commented frozen install', w => w.jobs.checks.steps.find(s => s.run?.includes('yarn install --frozen-lockfile')).run = '# yarn install --frozen-lockfile --non-interactive'],
  ['conditional Node setup', w => w.jobs.checks.steps.find(s => s.uses?.startsWith('actions/setup-node@')).if = 'false'],
  ['wrong consumer Node version', w => w.jobs['browser-smoke'].steps.find(s => s.id === 'consumer-node-20').with['node-version'] = '24'],
  ['skipped installed consumer', w => w.jobs['browser-smoke'].steps.find(s => s.run?.includes('--expected-node 22.12.0')).if = 'false'],
  ['browser runtime not restored', w => w.jobs['browser-smoke'].steps.find(s => s.id === 'restore-canonical-node').with = { 'node-version': '22.12.0', 'package-manager-cache': false }],
  ['Pages uploaded by both matrix legs', w => w.jobs.checks.steps.find(s => s.uses?.startsWith('actions/upload-pages-artifact@')).if = 'inputs.pages-artifact && github.ref == \'refs/heads/master\''],
]) {
  test(`CI rejects ${name}`, () => {
    const workflow = YAML.parse(source)
    mutate(workflow)
    assert.throws(() => validateCIWorkflow(YAML.stringify(workflow)), { name: 'AssertionError' })
  })
}
