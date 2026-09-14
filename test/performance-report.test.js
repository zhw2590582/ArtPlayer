import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Verify evidence rejection without synthetic benchmark claims.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { hash } from '../refactor/scripts/releases.mjs'
import { verifyPerformanceArtifacts } from '../scripts/performance-artifacts.mjs'
import { performanceHtml, performanceScript, waitForObservation } from '../scripts/performance-fixture.mjs'
import { validatePairedPerformance } from '../scripts/performance-report.mjs'

const baseline = JSON.parse(fs.readFileSync(new URL('../refactor/baselines/performance.json', import.meta.url), 'utf8')).runs[0]
function fixture() {
  return {
    schemaVersion: 1,
    environment: { browser: 'fixture', version: '1', platform: 'fixture' },
    runs: Array.from({ length: 3 }, (_, group) => (group % 2 ? ['candidate', 'published'] : ['published', 'candidate']).map((variant) => {
      const measurements = structuredClone(baseline)
      measurements.scripts = [`/${variant}/artplayer.js`, `/${variant}/artplayer-plugin-chapter.js`, '/test/performance.js']
      if (variant === 'candidate') {
        for (const resource of measurements.resources) {
          resource.immediatelyAfter = []
          resource.after.timers = []
          resource.after.lateCallbacks = []
          resource.after.lateResizeEvents = 0
        }
      }
      return { group, variant, measurements }
    })).flat(),
  }
}

test('paired performance requires comparable cohorts, real playback and strict candidate cleanup', () => {
  assert.equal(validatePairedPerformance(fixture()).reviewRequired, false)
  for (const mutate of [
    report => report.runs.pop(),
    report => report.runs.reverse(),
    report => report.runs[1].measurements.environment.hardwareConcurrency++,
    report => report.runs[1].measurements.samples[2].mediaProgress = 0,
    report => report.runs[1].measurements.visibilityChanges.push('hidden'),
    report => report.runs[1].measurements.scripts[0] = '/published/artplayer.js',
    report => report.runs[1].measurements.resources[0].immediatelyAfter.push({ kind: 'timeout' }),
    report => report.runs[1].measurements.resources[0].after.timers.push({ kind: 'interval' }),
    report => report.runs[1].measurements.resources[0].after.lateCallbacks.push({ kind: 'timeout' }),
    report => report.runs[1].measurements.resources[0].after.lateResizeEvents++,
    report => report.runs[1].measurements.resources[0].after.observedMs = 349,
  ]) {
    const report = fixture()
    mutate(report)
    assert.throws(() => validatePairedPerformance(report))
  }
  const slow = fixture()
  for (const run of slow.runs.filter(run => run.variant === 'candidate')) {
    for (const sample of run.measurements.samples) {
      sample.constructorMs += 20
      sample.readyMs += 20
    }
  }
  const comparison = validatePairedPerformance(slow)
  assert(comparison.reviewRequired && comparison.groups.every(group => group.reviewSignals.some(signal => signal.metric === 'constructorMs')))
})

test('performance adapter preserves frozen measurements except delivery and enforcing the observation minimum', () => {
  const frozen = fs.readFileSync(new URL('../refactor/fixtures/performance.js', import.meta.url), 'utf8')
  const adapted = performanceScript()
  const before = 'const response = await fetch(\'/reports/performance\', { method: \'POST\', headers: { \'Content-Type\': \'application/json\' }, body: JSON.stringify(report) })'
  const after = 'window.artplayerPerformanceReport = report; const response = { ok: true }'
  const prefix = `${waitForObservation.toString()}\n`
  assert(adapted.startsWith(prefix))
  assert.equal(adapted.slice(prefix.length).replace(after, before).replace('await waitForObservation(probe.wait, now, waitStarted, 350)', 'await probe.wait(350)'), frozen)
  assert.match(performanceHtml('candidate'), /src="\/candidate\/artplayer.js"/)
  assert.match(performanceHtml('published'), /src="\/published\/artplayer-plugin-chapter.js"/)
  assert.throws(() => performanceHtml('../uncompiled'))
})

test('resource observation re-arms after an early timer without rounding up evidence', async () => {
  let clock = 1000
  const delays = []
  await waitForObservation(async (delay) => {
    delays.push(delay)
    clock += delays.length === 1 ? 349 : 1
  }, () => clock, 1000, 350)
  assert.deepEqual(delays, [350, 1])
  assert.equal(clock - 1000, 350)
})

test('resource observation retains overshoot and does not wait again after the minimum', async () => {
  let clock = 1000
  const delays = []
  const wait = async (delay) => {
    delays.push(delay)
    clock += 364
  }
  await waitForObservation(wait, () => clock, 1000, 350)
  assert.deepEqual(delays, [350])
  assert.equal(clock - 1000, 364)
  await waitForObservation(wait, () => clock, 1000, 350)
  assert.deepEqual(delays, [350])
})

test('resource observation propagates timer failures rather than certifying an incomplete window', async () => {
  const failure = new Error('timer unavailable')
  await assert.rejects(waitForObservation(async () => {
    throw failure
  }, () => 0, 0, 350), error => error === failure)
})

test('performance refuses stale sources, build tools and altered installed bundles', () => {
  const cache = fileURLToPath(new URL('../refactor/.cache/performance/', import.meta.url))
  fs.mkdirSync(cache, { recursive: true })
  const root = fs.mkdtempSync(path.join(cache, 'guard-'))
  const output = path.join(root, 'candidate')
  const snapshot = path.join(output, 'build')
  const write = (file, content) => {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }
  const toolchain = {
    'package.json': JSON.stringify({ packageManager: 'yarn@1.22.22', devDependencies: {}, resolutions: {} }),
    'yarn.lock': '# fixture\n',
    'scripts/build.js': 'build fixture\n',
    'scripts/utils.js': 'utils fixture\n',
    'scripts/projects.js': 'projects fixture\n',
    'scripts/library/config.ts': 'typed build fixture\n',
  }
  for (const [file, content] of Object.entries(toolchain)) {
    write(path.join(root, file), content)
    write(path.join(snapshot, file), content)
  }
  const names = ['artplayer', 'artplayer-plugin-chapter']
  const packages = names.map((name) => {
    const entry = `packages/${name}/src/index.ts`
    write(path.join(root, entry), 'export default 1\n')
    write(path.join(snapshot, entry), 'export default 1\r\n')
    const manifest = `packages/${name}/package.json`
    write(path.join(root, manifest), JSON.stringify({ name, version: '1.0.0' }))
    write(path.join(snapshot, manifest), JSON.stringify({ name, version: '1.0.0' }))
    const bytes = 'installed fixture\n'
    write(path.join(output, `artifacts/${name}/dist/${name}.js`), bytes)
    return { name, sha256: 'archive fixture', files: { [`package/dist/${name}.js`]: hash(bytes) } }
  })
  const map = path.join(output, 'browser-artifacts.json')
  write(map, JSON.stringify(Object.fromEntries(names.map(name => [name, `artifacts/${name}/dist/${name}.js`]))))
  write(path.join(output, 'report.json'), JSON.stringify({ task: 'ENG-07', knownTypeBlockers: 0, node: process.versions.node, packages }))
  assert.equal(verifyPerformanceArtifacts(root, map).inputs.length, 2)
  const source = path.join(root, 'packages/artplayer/src/index.ts')
  write(source, 'export default 2\n')
  assert.throws(() => verifyPerformanceArtifacts(root, map), /Stale package source/)
  write(source, 'export default 1\n')
  write(path.join(root, 'scripts/build.js'), 'changed compiler\n')
  assert.throws(() => verifyPerformanceArtifacts(root, map), /Stale build input/)
  write(path.join(root, 'scripts/build.js'), toolchain['scripts/build.js'])
  write(path.join(root, 'scripts/library/config.ts'), 'changed TS config\n')
  assert.throws(() => verifyPerformanceArtifacts(root, map), /Stale library build inputs/)
  write(path.join(root, 'scripts/library/config.ts'), toolchain['scripts/library/config.ts'])
  write(path.join(snapshot, 'scripts/library/removed.ts'), 'stale module\n')
  assert.throws(() => verifyPerformanceArtifacts(root, map), /Stale library build inputs/)
  fs.unlinkSync(path.join(snapshot, 'scripts/library/removed.ts'))
  write(path.join(output, 'artifacts/artplayer/dist/artplayer.js'), 'changed bundle\n')
  assert.throws(() => verifyPerformanceArtifacts(root, map), /Installed performance artifact changed/)
})
