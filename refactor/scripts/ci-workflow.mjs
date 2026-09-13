/* eslint-disable no-template-curly-in-string -- GitHub workflow expressions are literal contract data. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'
import { requiredJobs } from '../../scripts/ci-summary.mjs'

const systems = {
  'checks': ['ubuntu-latest', 'windows-latest'],
  'coverage': ['ubuntu-latest', 'windows-latest'],
  'browser-smoke': ['ubuntu-latest', 'windows-latest', 'macos-latest'],
}

export function validateCIWorkflow(source) {
  const workflow = YAML.parse(source, { uniqueKeys: true })
  assert.deepEqual(workflow.permissions, { contents: 'read' }, 'CI permissions must remain read-only')
  assert.deepEqual(Object.keys(workflow.jobs).sort(), [...requiredJobs, 'ci-result'].sort(), 'Every job must participate in the summary policy')
  const summary = workflow.jobs['ci-result']
  assert.equal(summary.name, 'CI result', 'Keep the required-check name stable')
  assert.equal(summary.if, 'always()', 'Summary must run after failed or cancelled dependencies')
  assert.deepEqual([...summary.needs].sort(), [...requiredJobs].sort(), 'Summary must depend on every required job')
  const gate = summary.steps.find(step => step.run === 'node scripts/ci-summary.mjs')
  assert(gate && !Object.hasOwn(gate, 'if'), 'Final gate must execute unconditionally')
  assert.deepEqual(gate.env, { ARTPLAYER_CI_NEEDS: '${{ toJSON(needs) }}' }, 'Pass results as structured data, not shell interpolation')
  for (const [id, job] of Object.entries(workflow.jobs)) {
    assert(!job['continue-on-error'], 'Jobs cannot allow failure')
    assert(job['timeout-minutes'] > 0 && job['timeout-minutes'] <= 60, 'Every job needs a bounded timeout')
    if (job.permissions)
      assert.deepEqual(job.permissions, { contents: 'read' }, 'Job permissions must remain read-only')
    const checkout = job.steps.find(step => step.uses?.startsWith('actions/checkout@'))
    assert(checkout && !Object.hasOwn(checkout, 'if') && checkout.with?.['fetch-depth'] === 0 && checkout.with['persist-credentials'] === false, 'Every job needs unconditional full-history checkout without saved credentials')
    const setup = job.steps.find(step => step.uses?.startsWith('actions/setup-node@'))
    assert(setup && !Object.hasOwn(setup, 'if') && setup.with?.['node-version-file'] === '.node-version' && setup.with['package-manager-cache'] === false && !setup.with.cache, 'Use the canonical Node and explicit download caches')
    for (const step of job.steps) {
      assert(!step['continue-on-error'], 'Steps cannot hide failures')
      if (step.uses)
        assert(/^[\w.-]+\/[\w./-]+@[a-f0-9]{40}$/.test(step.uses), 'Actions require immutable commit pins')
    }
    const upload = job.steps.find(step => step.uses?.startsWith('actions/upload-artifact@'))
    assert(upload?.if === 'always()' && upload.with?.['include-hidden-files'] === true, 'Always preserve available hidden-cache reports')
    assert(upload.with.path.includes('refactor/.cache/ci/'), 'Every job must preserve source and execution logs')
    for (const part of ['github.run_id', 'github.run_attempt']) assert(upload.with.name.includes(part), 'Artifacts must be distinct across runs and attempts')
    if (id === 'ci-result')
      continue
    assert(!Object.hasOwn(job, 'if'), 'Required matrix jobs must not be skipped')
    assert.equal(job['runs-on'], '${{ matrix.os }}')
    assert.deepEqual(job.strategy.matrix, { os: systems[id] }, 'Do not silently narrow the OS matrix or exclude combinations')
    assert.equal(job.strategy['fail-fast'], false, 'Do not cancel other matrix evidence after a failure')
    assert.equal(job.defaults?.run?.shell, 'bash', 'Tee pipelines require the explicit Actions bash pipefail shell')
    assert(upload.with.name.includes('matrix.os'), 'Matrix artifacts must have distinct names')
    const contextIndex = job.steps.findIndex(step => step.id === 'context' && step.run === 'node scripts/ci-context.mjs' && !Object.hasOwn(step, 'if'))
    assert(contextIndex >= 0, 'Cache inputs must come from the checked source')
    const caches = job.steps.filter(step => step.uses?.startsWith('actions/cache@'))
    assert.equal(caches.length, id === 'browser-smoke' ? 2 : 1, 'Only explicit Yarn and browser download caches are expected')
    for (const cache of caches) {
      assert(job.steps.indexOf(cache) > contextIndex, 'Record context before restoring caches')
      assert(!cache.with['restore-keys'] && !cache.with.enableCrossOsArchive, 'Do not restore loosely matched or cross-OS downloads')
      assert(['${{ steps.context.outputs.yarn_cache }}', '${{ steps.context.outputs.browser_cache }}'].includes(cache.with.path), 'Do not cache node_modules or generated artifacts')
      for (const part of ['runner.os', 'runner.arch', 'steps.context.outputs.node', 'steps.context.outputs.yarn', 'github.ref', 'hashFiles(\'yarn.lock\')'])
        assert(cache.with.key.includes(part), `Cache key must isolate ${part}`)
      if (cache.with.path.includes('browser_cache'))
        assert(cache.with.key.includes('steps.context.outputs.playwright'), 'Browser cache must follow the exact Playwright version')
    }
    const installIndex = job.steps.findIndex(step => step.run?.split('\n').some(line => /^yarn install --frozen-lockfile --non-interactive(?: 2>&1 \| tee refactor\/\.cache\/ci\/install\.log)?$/.test(line)) && !Object.hasOwn(step, 'if'))
    assert(installIndex > contextIndex && caches.filter(cache => cache.with.path.includes('yarn_cache')).every(cache => job.steps.indexOf(cache) < installIndex), 'Always perform a frozen install after Yarn cache restore')
  }
  const browser = workflow.jobs['browser-smoke']
  assert(browser.steps.some(step => step.run?.startsWith('yarn test:browser:install --with-deps') && !Object.hasOwn(step, 'if')), 'Browser dependencies must install even on cache hits')
  let consumerIndex = browser.steps.findIndex(step => step.run?.startsWith('yarn test:package'))
  for (const [id, version, command] of [
    ['consumer-node-20', '20.19.0', 'node scripts/package-runtime.mjs --expected-node 20.19.0 2>&1 | tee refactor/.cache/ci/consumer-node-20.log'],
    ['consumer-node-22', '22.12.0', 'node scripts/package-runtime.mjs --expected-node 22.12.0 2>&1 | tee refactor/.cache/ci/consumer-node-22.log'],
    ['restore-canonical-node', null, 'node scripts/package-runtime.mjs --canonical 2>&1 | tee refactor/.cache/ci/consumer-node-canonical.log'],
  ]) {
    const index = browser.steps.findIndex(step => step.id === id)
    assert(index > consumerIndex, 'Build once before each ordered consumer runtime switch')
    const step = browser.steps[index]
    assert(step.uses?.startsWith('actions/setup-node@') && !Object.hasOwn(step, 'if'), 'Consumer Node setup cannot be skipped')
    assert.deepEqual(step.with, version ? { 'node-version': version, 'package-manager-cache': false } : { 'node-version-file': '.node-version', 'package-manager-cache': false }, 'Use exact consumer versions and restore the canonical browser runtime')
    const probe = browser.steps[index + 1]
    assert(probe?.run === command && !Object.hasOwn(probe, 'if'), 'Run the installed consumer on the selected Node')
    consumerIndex = index + 1
  }
  assert(browser.steps.findIndex(step => step.run?.startsWith('yarn test:browser ')) > consumerIndex, 'Browser tools must run after canonical Node restoration')
  const pages = workflow.jobs.checks.steps.find(step => step.uses?.startsWith('actions/upload-pages-artifact@'))
  assert.equal(pages?.if, 'inputs.pages-artifact && github.ref == \'refs/heads/master\' && matrix.os == \'ubuntu-latest\'', 'Only one trusted matrix leg can prepare Pages')
  return { jobs: requiredJobs, systems, summary: summary.name }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  console.log(JSON.stringify(validateCIWorkflow(fs.readFileSync('.github/workflows/nodejs.yml', 'utf8'))))
