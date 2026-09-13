import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercise actual CI exit codes and report files.
import test from 'node:test'
import { ciContext, writeContext } from '../scripts/ci-context.mjs'
import { evaluateJobs, renderSummary, requiredJobs } from '../scripts/ci-summary.mjs'

const success = () => Object.fromEntries(requiredJobs.map(job => [job, { result: 'success' }]))
test('CI summary requires every configured group and does not mutate provider results', () => {
  const needs = success()
  const copy = structuredClone(needs)
  const report = evaluateJobs(needs)
  assert.equal(report.passed, true)
  assert.deepEqual(needs, copy)
  assert.deepEqual(report.rows.map(row => row.job), requiredJobs)
})

for (const result of ['failure', 'cancelled', 'skipped', 'unknown', undefined]) {
  test(`CI summary fails when any required matrix group returns ${result}`, () => {
    for (const job of requiredJobs) {
      const needs = success()
      needs[job].result = result
      assert.equal(evaluateJobs(needs).passed, false)
      delete needs[job]
      assert.equal(evaluateJobs(needs).passed, false)
    }
  })
}

test('CI rejects malformed or additional job results and does not render arbitrary status text', () => {
  for (const input of [null, [], 'success', {}, { ...success(), extra: { result: 'success' } }])
    assert.equal(evaluateJobs(input).passed, false)
  const needs = success()
  needs.checks.result = '<img src=x onerror=alert(1)>'
  assert(!renderSummary(evaluateJobs(needs)).includes('<img'))
})

function fixture(t) {
  const root = fs.mkdtempSync(path.resolve('refactor/.cache/ci-summary-test-'))
  for (const file of ['package.json', '.node-version', 'yarn.lock']) fs.copyFileSync(file, path.join(root, file))
  t.after(() => {
    assert(path.dirname(root) === path.resolve('refactor/.cache') && path.basename(root).startsWith('ci-summary-test-'))
    fs.rmSync(root, { recursive: true, force: true })
  })
  return root
}

test('CI context uses exact source/tool/lock inputs and writes absolute cache paths via environment files', (t) => {
  const root = fixture(t)
  const output = path.join(root, 'outputs')
  const envFile = path.join(root, 'environment')
  const env = { GITHUB_OUTPUT: output, GITHUB_ENV: envFile, RUNNER_TEMP: path.join(root, 'runner temp') }
  const context = writeContext(root, env)
  assert.match(context.source, /^[a-f0-9]{40}$/)
  assert.equal(context.yarn, '1.22.22')
  assert(fs.readFileSync(output, 'utf8').includes(`playwright=${context.playwright}\n`))
  assert(fs.readFileSync(envFile, 'utf8').includes(`PLAYWRIGHT_BROWSERS_PATH=${context.browserCache}\n`))
  assert.equal(context.yarnCache, path.join(env.RUNNER_TEMP, 'artplayer-yarn-cache'))
  fs.appendFileSync(path.join(root, 'yarn.lock'), '\n')
  assert.notEqual(ciContext(root, env).lockSha256, context.lockSha256)
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  manifest.packageManager = 'npm@1.22.22'
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(manifest))
  assert.throws(() => ciContext(root, env), { name: 'AssertionError' })
})

test('CI command returns real failure codes and preserves reports for success, failure and invalid JSON', (t) => {
  const root = fixture(t)
  const stepSummary = path.join(root, 'step-summary.md')
  for (const [needs, expected] of [[JSON.stringify(success()), 0], [JSON.stringify({ ...success(), coverage: { result: 'cancelled' } }), 1], ['{bad', 1]]) {
    const result = spawnSync(process.execPath, [path.resolve('scripts/ci-summary.mjs')], { cwd: root, encoding: 'utf8', env: { ...process.env, ARTPLAYER_CI_NEEDS: needs, GITHUB_STEP_SUMMARY: stepSummary } })
    assert.equal(result.status, expected, result.stderr)
    const report = JSON.parse(fs.readFileSync(path.join(root, 'refactor/.cache/ci/summary.json'), 'utf8'))
    assert.equal(report.passed, expected === 0)
    assert(fs.readFileSync(path.join(root, 'refactor/.cache/ci/summary.md'), 'utf8').includes(expected === 0 ? '**passed**' : '**failed**'))
  }
  assert(fs.readFileSync(stepSummary, 'utf8').includes('cancelled'))
})
