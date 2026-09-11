import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercise the real V8 collection and remapping pipeline.
import { test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { normalizeCoverageReports } from '../scripts/coverage-maps.mjs'
import { analyzeCoverage, sourceInventory } from '../scripts/coverage-report.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const require = createRequire(import.meta.url)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value)}\n`)

test('real TS source maps retain unexecuted branches and files across both test loaders', () => {
  const cache = path.join(root, 'refactor/.cache/coverage')
  fs.mkdirSync(cache, { recursive: true })
  const fixture = fs.mkdtempSync(path.join(cache, 'canary-'))
  const source = path.join(fixture, 'packages/artplayer/src')
  fs.mkdirSync(source, { recursive: true })
  fs.writeFileSync(path.join(source, 'probe.ts'), `export default function probe(value: boolean): string {
  if (value) {
    return 'taken'
  }
  return 'missed'
}
`)
  fs.writeFileSync(path.join(source, 'support.ts'), 'export default function support(): number { return 42 }\n')
  fs.writeFileSync(path.join(source, 'index.ts'), 'export { default } from \'./probe\'\n')
  fs.writeFileSync(path.join(source, 'never.ts'), 'export default function never(): number { return 99 }\n')
  fs.writeFileSync(path.join(source, 'types.ts'), 'export interface Example { value: boolean }\n')
  const entry = path.join(fixture, 'run.mjs')
  const loader = pathToFileURL(path.join(root, 'test/helpers/load.js')).href
  fs.writeFileSync(entry, `import assert from 'node:assert/strict'
import { loadModules, loadPackage } from ${JSON.stringify(loader)}
const { probe, support } = await loadModules({ probe: 'packages/artplayer/src/probe', support: 'packages/artplayer/src/support' }, ${JSON.stringify(fixture)})
assert.equal(support(), 42)
const packaged = (await loadPackage('artplayer', ${JSON.stringify(fixture)})).default
for (const fn of [probe, packaged]) {
  assert.equal(fn(true), 'taken')
  if (process.argv[2] === 'complete') assert.equal(fn(false), 'missed')
}
`)
  const policy = { schemaVersion: 1, packages: ['artplayer'], exclude: {}, minimum: { 'packages/artplayer/src/probe.ts': { lines: 100, branches: 100, functions: 100 } } }
  const inventory = sourceInventory(fixture, policy)
  assert.deepEqual(inventory.excluded.map(item => item.file), ['packages/artplayer/src/types.ts'])
  for (const mode of ['incomplete', 'complete']) {
    const output = path.join(fixture, mode)
    const rawDirectory = path.join(output, 'raw')
    const moduleDirectory = path.join(output, 'modules')
    const mappedDirectory = path.join(output, 'normalized')
    const collected = spawnSync(process.execPath, [entry, mode], {
      cwd: fixture,
      encoding: 'utf8',
      env: { ...process.env, NODE_V8_COVERAGE: rawDirectory, ARTPLAYER_COVERAGE_DIR: moduleDirectory },
    })
    assert.equal(collected.status, 0, collected.stderr)
    const maps = normalizeCoverageReports(rawDirectory, mappedDirectory, { root: fixture, moduleDirectory, inventory })
    assert(maps.modules >= 2 && maps.reports.some(item => item.normalizedSources > 0))
    const config = path.join(output, 'c8.json')
    write(config, {
      'all': true,
      'exclude-after-remap': true,
      'include': ['packages/artplayer/src/**'],
      'exclude': inventory.excluded.map(item => item.file),
      'src': ['packages/artplayer/src'],
      'extension': ['.ts'],
      'reporter': ['json', 'json-summary'],
      'temp-directory': mappedDirectory,
      'reports-dir': path.join(output, 'report'),
    })
    const rendered = spawnSync(process.execPath, [require.resolve('c8/bin/c8.js'), 'report', '--config', config], { cwd: fixture, encoding: 'utf8' })
    assert.equal(rendered.status, 0, rendered.stderr)
    const summary = read(path.join(output, 'report/coverage-summary.json'))
    const analyzed = analyzeCoverage(fixture, summary, inventory, policy)
    const probe = analyzed.files.find(item => item.file.endsWith('/probe.ts'))
    assert(probe.metrics.functions.total > 0 && probe.metrics.branches.total > 0)
    assert.equal(analyzed.files.find(item => item.file.endsWith('/never.ts')).metrics.lines.covered, 0, 'Never imported file must remain in the denominator with zero coverage')
    if (mode === 'complete') {
      assert.deepEqual(analyzed.violations, [])
    }
    else {
      assert(analyzed.violations.some(item => item.metric === 'branches'))
      const full = read(path.join(output, 'report/coverage-final.json'))[path.join(source, 'probe.ts')]
      const missed = Object.entries(full.statementMap).filter(([, location]) => location.start.line === 5)
      assert(missed.length > 0 && missed.every(([id]) => full.s[id] === 0), 'Unexecuted TS return must not become 100% covered')
      const reportFile = maps.reports.find(item => item.modules > 0).file
      const original = read(path.join(rawDirectory, reportFile))
      const module = original.result.find(item => item.url.startsWith(pathToFileURL(moduleDirectory).href))
      const mutated = structuredClone(original)
      const mapped = mutated['source-map-cache'][module.url].data
      const index = mapped.sources.findIndex(item => item.endsWith('/probe.ts'))
      assert(index >= 0)
      mapped.sourcesContent[index] += '\n// stale source'
      const corrupt = path.join(output, 'corrupt')
      fs.mkdirSync(corrupt)
      write(path.join(corrupt, reportFile), mutated)
      assert.throws(() => normalizeCoverageReports(corrupt, path.join(output, 'stale'), { root: fixture, moduleDirectory, inventory }), /Stale mapped source/)
      delete mutated['source-map-cache'][module.url]
      write(path.join(corrupt, reportFile), mutated)
      assert.throws(() => normalizeCoverageReports(corrupt, path.join(output, 'missing'), { root: fixture, moduleDirectory, inventory }), /Missing source map/)
    }
  }
})

test('coverage gates reject missing files, empty branch counts and ignored counters', () => {
  const file = 'packages/artplayer/src/lifecycle/scope.ts'
  const inventory = { files: [{ file, sha256: 'test' }], excluded: [] }
  const policy = { minimum: { [file]: { branches: 90 } } }
  const counters = () => Object.fromEntries(['lines', 'branches', 'functions', 'statements'].map(metric => [metric, { covered: 10, total: 10, skipped: 0, pct: 100 }]))
  const key = path.join(root, file)
  assert.deepEqual(analyzeCoverage(root, { [key]: counters() }, inventory, policy).violations, [])
  assert.throws(() => analyzeCoverage(root, {}, inventory, policy), /source inventory differs/)
  const empty = counters()
  empty.branches = { covered: 0, total: 0, skipped: 0, pct: 100 }
  assert.equal(analyzeCoverage(root, { [key]: empty }, inventory, policy).violations.length, 1)
  const ignored = counters()
  ignored.lines.skipped = 1
  assert.throws(() => analyzeCoverage(root, { [key]: ignored }, inventory, policy), /Invalid or ignored lines/)
  const low = counters()
  low.branches.covered = 1
  assert.equal(analyzeCoverage(root, { [key]: low }, inventory, policy).violations[0].actual, 10, 'Recompute percentage instead of trusting a stale pct field')
})
