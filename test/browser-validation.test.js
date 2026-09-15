import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Validate real runner exit codes and scope boundaries.
import test from 'node:test'
import { browserInvocation, browserScopeConfig, installedTests } from '../scripts/browser-validation/scope.ts'

test('Source invocation clears inherited artifact selection without changing caller environment', () => {
  const environment = { ARTPLAYER_BROWSER_ARTIFACTS: '/installed/map.json', KEEP: 'value' }
  const source = browserInvocation('source', ['--project=chromium'], environment)
  assert.equal(source.env.ARTPLAYER_BROWSER_ARTIFACTS, undefined)
  assert.equal(source.env.KEEP, 'value')
  assert.equal(environment.ARTPLAYER_BROWSER_ARTIFACTS, '/installed/map.json')
  assert.deepEqual(browserScopeConfig('source').testMatch, ['**/*.spec.js'])
  const installed = browserInvocation('installed', [], environment)
  assert.equal(installed.env.ARTPLAYER_BROWSER_ARTIFACTS, environment.ARTPLAYER_BROWSER_ARTIFACTS)
  assert.notEqual(source.directory, installed.directory)
  assert(installedTests.includes('ambilight-proxy.spec.js'))
  assert(installedTests.includes('canvas-lifecycle.spec.js'))
  assert(installedTests.includes('asr-no-audio.spec.js'))
  for (const file of installedTests)
    assert(fs.existsSync(path.resolve('test/browser', file)))
})

test('Native VAST keeps its source default and rejects an invalid explicit installation before browser launch', () => {
  const env = { ...process.env }
  delete env.ARTPLAYER_BROWSER_ARTIFACTS
  const command = 'const { default: config } = await import("./playwright.vast-native.config.js"); if (config.timeout !== 30000 || config.workers !== 1) throw new Error("Native execution policy changed");'
  const source = spawnSync(process.execPath, ['--input-type=module', '-e', command], { encoding: 'utf8', env, windowsHide: true })
  assert.equal(source.status, 0, source.stderr)
  const missing = path.resolve('refactor/.cache/absent-vast-native-artifact-map.json')
  assert(!fs.existsSync(missing))
  const installed = spawnSync(process.execPath, ['--input-type=module', '-e', command], { encoding: 'utf8', env: { ...env, ARTPLAYER_BROWSER_ARTIFACTS: missing }, windowsHide: true })
  assert.equal(installed.status, 1)
  assert.match(installed.stderr, /ENOENT/)
})

test('Browser invocation rejects ambiguous scopes and output/configuration overrides', () => {
  assert.throws(() => browserInvocation('unknown', [], {}), /Choose/)
  assert.throws(() => browserInvocation('installed', [], {}), /require ARTPLAYER/)
  for (const flag of ['--config=other.js', '--config', '-c', '-cother.js', '--reporter=json', '--output=elsewhere', '--pass-with-no-tests'])
    assert.throws(() => browserInvocation('source', [flag], {}), /Do not override/)
})

test('Installed validation rejects diagnostic SDK substitutions and recovery probes', () => {
  const base = { ARTPLAYER_BROWSER_ARTIFACTS: '/installed/map.json' }
  const candidateOnly = { ...base, ARTPLAYER_MB_BROWSER_CANDIDATE: '1' }
  assert.throws(() => browserInvocation('installed', [], candidateOnly), /retain MediaBunny historical controls/)
  assert.equal(browserInvocation('source', [], candidateOnly).env.ARTPLAYER_MB_BROWSER_CANDIDATE, '1')
  const profile = { ...base, ARTPLAYER_MASK_PROFILE: '1' }
  assert.throws(() => browserInvocation('installed', [], profile), /Mask CPU profiling/)
  assert.equal(browserInvocation('source', [], profile).env.ARTPLAYER_MASK_PROFILE, '1')
  for (const name of ['ARTPLAYER_IFRAME_BASELINE', 'ARTPLAYER_IFRAME_LIFECYCLE_ONLY', 'ARTPLAYER_IFRAME_BOUNDARIES_ONLY']) {
    const env = { ...base, [name]: '1' }
    assert.throws(() => browserInvocation('installed', [], env), /retain Iframe candidate and historical controls/)
    assert.equal(browserInvocation('source', [], env).env[name], '1')
  }
  for (const mode of ['upstream4', 'bufferlevel4']) {
    const env = { ...base, ARTPLAYER_DASH_DIAGNOSTIC_SDK: mode }
    assert.throws(() => browserInvocation('installed', [], env), /unchanged DASH SDK/)
    assert.equal(browserInvocation('source', [], env).env.ARTPLAYER_DASH_DIAGNOSTIC_SDK, mode)
  }
  for (const name of ['ARTPLAYER_DASH_DIAGNOSE_STALL', 'ARTPLAYER_DASH_DIAGNOSE_GETTER', 'ARTPLAYER_DASH_DIAGNOSE_METRICS'])
    assert.throws(() => browserInvocation('installed', [], { ...base, [name]: '1' }), /recovery diagnostics/)
  assert.equal(browserInvocation('installed', [], { ...base, ARTPLAYER_DASH_DIAGNOSTIC_SDK: 'none' }).env.ARTPLAYER_DASH_DIAGNOSTIC_SDK, 'none')
})

for (const code of [0, 17]) {
  test(`Browser runner preserves actual child exit ${code} and source input identity`, () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-browser-runner-'))
    try {
      const cli = path.join(root, 'node_modules/@playwright/test/cli.js')
      fs.mkdirSync(path.dirname(cli), { recursive: true })
      fs.writeFileSync(cli, `require('node:assert/strict').equal(process.env.ARTPLAYER_BROWSER_ARTIFACTS, undefined); process.exit(${code});`)
      const run = spawnSync(process.execPath, [path.resolve('scripts/browser-check.mjs'), 'source'], { cwd: root, env: { ...process.env, ARTPLAYER_BROWSER_ARTIFACTS: '/unwanted/map.json' }, encoding: 'utf8', windowsHide: true, timeout: 10000 })
      assert.equal(run.status, code, run.stderr)
      const directory = path.join(root, 'refactor/.cache/browser-source')
      const invocation = JSON.parse(fs.readFileSync(path.join(directory, 'invocation.json')))
      const result = JSON.parse(fs.readFileSync(path.join(directory, 'result.json')))
      assert.equal(invocation.artifactMap, null)
      assert.equal(result.exitCode, code)
      assert.equal(result.scope, 'source')
      assert(!fs.existsSync(path.join(root, 'refactor/.cache/browser-installed')))
    }
    finally {
      assert.equal(path.dirname(root), path.resolve(os.tmpdir()))
      assert(path.basename(root).startsWith('artplayer-browser-runner-'))
      fs.rmSync(root, { recursive: true, force: true })
    }
  })
}
