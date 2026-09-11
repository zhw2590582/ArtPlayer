import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { normalizeCoverageReports } from './coverage-maps.mjs'
import { analyzeCoverage, sourceInventory } from './coverage-report.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const require = createRequire(import.meta.url)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)

export function runCoverage() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Run yarn test:coverage with the pinned Yarn')
  const policy = read(path.join(root, 'scripts/coverage-policy.json'))
  const inventory = sourceInventory(root, policy)
  const unit = read(path.join(root, 'package.json')).scripts['test:unit']
  assert(unit.startsWith('node --test '), 'Coverage expects the shared explicit Node unit test list')
  const tests = unit.slice('node --test '.length).split(' ')
  assert(tests.length > 0 && tests.every(file => /^test\/[a-z-]+\.test\.js$/.test(file)), 'Unsupported unit test command; update the coverage runner with it')
  const cache = path.join(root, 'refactor/.cache/coverage')
  fs.mkdirSync(cache, { recursive: true })
  const output = fs.mkdtempSync(path.join(cache, 'run-'))
  const configFile = path.join(output, 'c8.json')
  const config = {
    'all': true,
    'exclude-after-remap': true,
    'include': policy.packages.map(name => `packages/${name}/src/**`),
    'exclude': inventory.excluded.map(item => item.file),
    'src': policy.packages.map(name => `packages/${name}/src`),
    'extension': ['.js', '.ts'],
    'reporter': ['json', 'json-summary', 'text-summary', 'html', 'lcovonly'],
    'reports-dir': path.join(output, 'report'),
    'temp-directory': path.join(output, 'normalized'),
  }
  write(configFile, config)
  write(path.join(output, 'inventory.json'), inventory)
  const started = new Date().toISOString()
  const moduleDirectory = path.join(output, 'modules')
  const rawDirectory = path.join(output, 'raw')
  const result = spawnSync(process.execPath, ['--test', ...tests], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, NODE_V8_COVERAGE: rawDirectory, ARTPLAYER_COVERAGE_DIR: moduleDirectory },
  })
  const report = { task: 'ENG-08', started, node: process.version, c8: read(require.resolve('c8/package.json')).version, output: path.relative(root, output).replaceAll('\\', '/'), tests, testExitCode: result.status, status: 'failed' }
  write(path.join(cache, 'latest.json'), { output: report.output })
  write(path.join(output, 'report.json'), report)
  if (result.error || result.status !== 0) {
    throw result.error || new Error(`Coverage unit tests failed: ${result.status}`)
  }
  report.maps = normalizeCoverageReports(rawDirectory, config['temp-directory'], { root, moduleDirectory, inventory })
  write(path.join(output, 'report.json'), report)
  const rendered = spawnSync(process.execPath, [require.resolve('c8/bin/c8.js'), 'report', '--config', configFile], { cwd: root, stdio: 'inherit' })
  assert(!rendered.error && rendered.status === 0, 'Coverage report generation failed')
  Object.assign(report, analyzeCoverage(root, read(path.join(output, 'report/coverage-summary.json')), inventory, policy))
  report.status = report.violations.length ? 'failed' : 'passed'
  write(path.join(output, 'report.json'), report)
  console.log(`Coverage: ${report.files.length} runtime files, ${report.excluded.length} documented/type-only exclusions; ${report.violations.length} gate violations. Report: ${report.output}/report/index.html`)
  assert.deepEqual(report.violations, [], 'Critical lifecycle coverage is below the configured gate')
  return report
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    assert.equal(process.argv.length, 2, 'Use yarn test:coverage')
    runCoverage()
  }
  catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}
