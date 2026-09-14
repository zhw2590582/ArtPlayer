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
  const { jobs } = YAML.parse(source)
  const matrix = jobs['browser-smoke'].strategy.matrix
  const legs = matrix.os.flatMap(os => matrix.browser.map(browser => `${os}/${browser}`))
  assert.deepEqual(legs, ['ubuntu-latest', 'windows-latest', 'macos-latest'].flatMap(os => ['chromium', 'firefox', 'webkit'].map(browser => `${os}/${browser}`)))
  assert.equal(new Set(legs).size, 9)
  assert.deepEqual(jobs['browser-consumers'].strategy.matrix, { os: ['ubuntu-latest', 'windows-latest', 'macos-latest'] })
})

for (const [name, mutate] of [
  ['missing required dependency', w => w.jobs['ci-result'].needs.pop()],
  ['success-only summary', w => w.jobs['ci-result'].if = 'success()'],
  ['conditional result gate', w => w.jobs['ci-result'].steps.find(s => s.run).if = 'success()'],
  ['softened gate', w => w.jobs['ci-result'].steps.find(s => s.run)['continue-on-error'] = true],
  ['untracked extra job', w => w.jobs.extra = w.jobs.coverage],
  ['matrix exclusion', w => w.jobs.checks.strategy.matrix.exclude = [{ os: 'windows-latest' }]],
  ['removed Windows build', w => w.jobs.checks.strategy.matrix.os.pop()],
  ['removed playback engine', w => w.jobs['browser-smoke'].strategy.matrix.browser.pop()],
  ['engine matrix exclusion', w => w.jobs['browser-smoke'].strategy.matrix.exclude = [{ os: 'macos-latest', browser: 'webkit' }]],
  ['consumer engine duplication', w => w.jobs['browser-consumers'].strategy.matrix.browser = ['chromium', 'firefox', 'webkit']],
  ['browser waits on consumer success', w => w.jobs['browser-smoke'].needs = 'browser-consumers'],
  ['consumers wait on browser success', w => w.jobs['browser-consumers'].needs = 'browser-smoke'],
  ['unbounded playback concurrency', w => delete w.jobs['browser-smoke'].strategy['max-parallel']],
  ['browser artifact collision', w => w.jobs['browser-smoke'].steps.find(s => s.uses?.startsWith('actions/upload-artifact@')).with.name = 'browser-${{ matrix.os }}-${{ github.run_id }}-${{ github.run_attempt }}'],
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
  ['wrong consumer Node version', w => w.jobs['browser-consumers'].steps.find(s => s.id === 'consumer-node-20').with['node-version'] = '24'],
  ['skipped installed consumer', w => w.jobs['browser-consumers'].steps.find(s => s.run?.includes('--expected-node 22.12.0')).if = 'false'],
  ['missing browser plugin installation', w => w.jobs['browser-smoke'].steps.find(s => s.run?.startsWith('yarn test:package --browser')).run = 'echo omitted'],
  ['manual partial browser package roster', (w) => {
    const step = w.jobs['browser-smoke'].steps.find(s => s.run?.startsWith('yarn test:package --browser'))
    step.run = step.run.replace('--browser', '--include=artplayer-plugin-ambilight')
  }],
  ['skipped browser plugin installation', w => w.jobs['browser-smoke'].steps.find(s => s.run?.startsWith('yarn test:package --browser')).if = 'false'],
  ['missing source browser checks', w => w.jobs['browser-smoke'].steps.find(s => s.run?.startsWith('yarn test:browser:source ')).run = 'echo omitted'],
  ['filtered source browser checks', w => w.jobs['browser-smoke'].steps.find(s => s.run?.startsWith('yarn test:browser:source ')).run += ' --grep subset'],
  ['fixed engine silently repeated', w => w.jobs['browser-smoke'].steps.find(s => s.run?.startsWith('yarn test:browser:source ')).run = 'yarn test:browser:source --project=chromium 2>&1 | tee refactor/.cache/ci/browser-source.log'],
  ['installed engine selector removed', (w) => {
    const step = w.jobs['browser-smoke'].steps.find(s => s.run?.startsWith('yarn test:browser:installed '))
    step.run = step.run.replace(' --project=${{ matrix.browser }}', '')
  }],
  ['source failure prevents installed evidence', w => w.jobs['browser-smoke'].steps.find(s => s.run?.startsWith('yarn test:browser:installed ')).if = 'success()'],
  ['ignored installed failure', w => w.jobs['browser-smoke'].steps.find(s => s.run?.startsWith('yarn test:browser:installed '))['continue-on-error'] = true],
  ['missing separate source evidence', (w) => {
    const upload = w.jobs['browser-smoke'].steps.find(s => s.uses?.startsWith('actions/upload-artifact@'))
    upload.with.path = upload.with.path.replace('refactor/.cache/browser-source/\n', '')
  }],
  ['browser runtime not restored', w => w.jobs['browser-consumers'].steps.find(s => s.id === 'restore-canonical-node').with = { 'node-version': '22.12.0', 'package-manager-cache': false }],
  ['skipped React consumer', w => w.jobs['browser-consumers'].steps.find(s => s.run?.startsWith('yarn test:react-consumer')).if = 'false'],
  ['removed React consumer', w => w.jobs['browser-consumers'].steps = w.jobs['browser-consumers'].steps.filter(s => !s.run?.startsWith('yarn test:react-consumer'))],
  ['missing React evidence', w => w.jobs['browser-consumers'].steps.find(s => s.uses?.startsWith('actions/upload-artifact@')).with.path = 'refactor/.cache/ci/'],
  ['skipped Vue consumer', w => w.jobs['browser-consumers'].steps.find(s => s.run?.startsWith('yarn test:vue-consumer')).if = 'false'],
  ['removed Vue consumer', w => w.jobs['browser-consumers'].steps = w.jobs['browser-consumers'].steps.filter(s => !s.run?.startsWith('yarn test:vue-consumer'))],
  ['missing Vue evidence', w => w.jobs['browser-consumers'].steps.find(s => s.uses?.startsWith('actions/upload-artifact@')).with.path = w.jobs['browser-consumers'].steps.find(s => s.uses?.startsWith('actions/upload-artifact@')).with.path.replace('refactor/.cache/vue-consumer-*/', '')],
  ['Pages uploaded by both matrix legs', w => w.jobs.checks.steps.find(s => s.uses?.startsWith('actions/upload-pages-artifact@')).if = 'inputs.pages-artifact && github.ref == \'refs/heads/master\''],
  ['missing iframe history gate', w => w.jobs['browser-consumers'].steps = w.jobs['browser-consumers'].steps.filter(s => !s.run?.startsWith('yarn test:iframe-history'))],
  ['performance narrowed to one engine', (w) => {
    const step = w.jobs['browser-consumers'].steps.find(s => s.run?.startsWith('yarn test:performance'))
    step.run = step.run.replace('test:performance', 'test:performance --project=chromium')
  }],
  ['browser consumer cache-hit skips dependencies', w => w.jobs['browser-consumers'].steps.find(s => s.run?.startsWith('yarn test:browser:install')).if = 'false'],
  ['missing independent consumer artifact selection', (w) => {
    const step = w.jobs['browser-consumers'].steps.find(s => s.run?.startsWith('yarn test:package '))
    step.run = step.run.split('\n')[0]
  }],
]) {
  test(`CI rejects ${name}`, () => {
    const workflow = YAML.parse(source)
    mutate(workflow)
    assert.throws(() => validateCIWorkflow(YAML.stringify(workflow)), { name: 'AssertionError' })
  })
}
