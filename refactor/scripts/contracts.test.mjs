import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Contract evidence validation uses real Node runner results and isolated files.
import test from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { candidateInputs, contractStatus, evaluateRun, localFile, pointer, readContractModel, renderContracts, sha256 } from './contracts-model.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const actual = readContractModel(root)
const cache = path.join(root, 'refactor/.cache')

function fixture(t) {
  fs.mkdirSync(cache, { recursive: true })
  const directory = fs.mkdtempSync(path.join(cache, 'contracts-test-'))
  t.after(() => {
    const relative = path.relative(cache, directory)
    assert(relative.startsWith('contracts-test-') && !relative.includes(path.sep))
    fs.rmSync(directory, { recursive: true, force: true })
  })
  const write = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(directory, file)), { recursive: true })
    fs.writeFileSync(path.join(directory, file), typeof value === 'string' ? value : JSON.stringify(value))
  }
  const policy = structuredClone(actual.policy)
  const save = () => write('refactor/contract-policy.json', policy)
  save()
  write('refactor/tasks.json', { tasks: actual.tasks.map(task => ({ ...task, evidence: [] })) })
  for (const file of new Set(['refactor/package-inventory.json', 'refactor/compatibility.md', ...policy.versions.map(version => version.file)]))
    write(file, fs.readFileSync(path.join(root, file), 'utf8'))
  for (const pkg of policy.packages) {
    write(`packages/${pkg.name}/package.json`, { name: pkg.name })
    write(`packages/${pkg.name}/src/index.ts`, 'export const value = 1')
  }
  for (const file of new Set(policy.cases.map(item => item.file)))
    write(file, `import test from 'node:test'\n${policy.cases.filter(item => item.file === file).map(item => `test(${JSON.stringify(item.title)}, () => {})`).join('\n')}`)
  for (const file of ['package.json', 'yarn.lock', '.node-version']) write(file, fs.readFileSync(path.join(root, file), 'utf8'))
  write('refactor/contract-runs.json', { schemaVersion: 1, runs: [] })
  return { directory, policy, save, write, model: () => readContractModel(directory) }
}

test('Actual contract model assigns all 264 family rows and separates exact published versions from workspace snapshots', () => {
  assert.equal(actual.policy.packages.length, 22)
  assert.equal(actual.families.length, 12)
  assert.equal(actual.policy.versions.filter(version => version.kind === 'published-baseline').length, 20)
  assert.deepEqual(actual.policy.versions.filter(version => version.kind === 'published-baseline' && version.package === 'artplayer-plugin-auto-thumbnail').map(version => version.version).sort(), ['1.0.0', '1.0.1', '1.1.0'])
  assert.deepEqual(actual.policy.versions.filter(version => version.kind === 'published-baseline' && version.package === 'artplayer-proxy-mediabunny').map(version => version.version).sort(), ['1.0.0', '1.2.0'])
  assert.equal(actual.policy.versions.filter(version => version.kind === 'workspace-baseline').length, 22)
  assert.equal(actual.policy.cases.length, 10)
  const markdown = renderContracts(actual)
  assert.equal(markdown.split('\n').filter(line => /^\| artplayer[^|]* \| API-/.test(line)).length, 264)
  assert.equal(pointer({ 'a/b': { '~': 2 } }, '/a~1b/~0'), 2)
})

test('Missing families, package owners, tasks and unsupported version claims cannot silently pass', (t) => {
  for (const edit of [
    (policy) => { policy.families.pop() },
    (policy) => { policy.packages.pop() },
    (policy) => { delete policy.packages[0].owners['API-01'] },
    (policy) => { policy.packages[0].owners['API-01'] = 'NONEXISTENT' },
    (policy) => { policy.packages[0].supportWindow = 'all-historical-versions' },
    (policy) => { policy.packages[0].versionIds = ['invented'] },
  ]) {
    const repo = fixture(t)
    edit(repo.policy)
    repo.save()
    assert.throws(repo.model)
  }
  const repo = fixture(t)
  const manifest = JSON.parse(fs.readFileSync(path.join(repo.directory, 'package.json'), 'utf8'))
  manifest.scripts['ci:check'] = manifest.scripts['ci:check'].replace('yarn test:contracts && ', '')
  repo.write('package.json', manifest)
  assert.throws(repo.model, /CI must run/)
})

test('Version evidence checks JSON pointer, package identity, exact version and archive integrity', (t) => {
  for (const edit of [
    (version) => { version.pointer = '/releases/99' },
    (version) => { version.version = '99.0.0' },
    (version) => { version.package = 'artplayer-plugin-chapter' },
    (version) => { version.archiveSha256 = 'a'.repeat(64) },
    (version) => { version.file = '../outside.json' },
  ]) {
    const repo = fixture(t)
    edit(repo.policy.versions.find(version => version.kind === 'published-baseline'))
    repo.save()
    assert.throws(repo.model)
  }
})

test('Stable IDs require an actual unique literal test and valid paths; comments, skips and renamed assertions are not enough', (t) => {
  for (const source of [
    title => `import test from 'node:test'; // test(${JSON.stringify(title)}, () => {})`,
    title => `import test from 'node:test'; test.skip(${JSON.stringify(title)}, () => {})`,
    () => `import test from 'node:test'; test('renamed', () => {})`,
    title => `import test from 'node:test'; test(${JSON.stringify(title)}, () => {}); test(${JSON.stringify(title)}, () => {})`,
  ]) {
    const repo = fixture(t)
    repo.write(repo.policy.cases[0].file, source(repo.policy.cases[0].title))
    assert.throws(repo.model, /exactly one literal/)
  }
  const repo = fixture(t)
  repo.policy.cases.push(repo.policy.cases[0])
  repo.save()
  assert.throws(repo.model, /Duplicate case/)
  repo.policy.cases[repo.policy.cases.length - 1] = { ...repo.policy.cases[0], id: 'CT-DUPLICATE-ASSERTION' }
  repo.save()
  assert.throws(repo.model, /Duplicate file\/title/)
  repo.policy.cases = []
  repo.save()
  assert.throws(repo.model, /requires explicit cases/)
  for (const file of ['../outside', 'D:/outside', '/absolute', 'test\\outside.js'])
    assert.throws(() => localFile(repo.directory, file))
})

function observation(model, candidate, item, status = 'passed') {
  const event = { type: status === 'failed' ? 'test:fail' : 'test:pass', name: item.title, file: item.file, ...(status === 'skipped' ? { skip: 'unsupported fixture' } : {}) }
  return { schemaVersion: 1, command: 'yarn test:contracts', head: 'a'.repeat(40), environment: { node: process.version, platform: process.platform }, candidate, outcome: status === 'failed' ? 'failed' : 'passed', events: [event, { type: 'test:summary', success: status !== 'failed' }], cases: [{ id: item.id, definition: item, definitionSha256: sha256(JSON.stringify(item)), status }] }
}

test('Evidence distinguishes current, stale, skipped and failed; wrong titles, fingerprints and process outcomes fail', (t) => {
  const repo = fixture(t)
  const model = repo.model()
  const candidate = candidateInputs(repo.directory, model)
  const item = model.policy.cases[0]
  const passed = observation(model, candidate, item)
  assert.equal(evaluateRun(model, passed, candidate.digest)[0].freshness, 'current-inputs')
  repo.write('packages/artplayer/src/index.ts', 'export const value = 2')
  assert.equal(evaluateRun(model, passed, candidateInputs(repo.directory, model).digest)[0].freshness, 'historical-inputs')
  for (const status of ['skipped', 'failed'])
    assert.equal(evaluateRun(model, observation(model, candidate, item, status), candidate.digest)[0].status, status)
  for (const edit of [
    (report) => { report.events[0].name = 'different assertion' },
    (report) => { report.cases[0].status = 'skipped' },
    (report) => { report.candidate.digest = 'a'.repeat(64) },
    (report) => { report.cases[0].definitionSha256 = 'b'.repeat(64) },
    (report) => { report.events.at(-1).success = false },
    (report) => { report.events.push(report.events[0]) },
  ]) {
    const report = structuredClone(passed)
    edit(report)
    assert.throws(() => evaluateRun(model, report, candidate.digest))
  }
  const modified = structuredClone(model)
  modified.policy.cases[0].scope = 'A revised assertion scope'
  assert.equal(evaluateRun(modified, passed, candidate.digest)[0].freshness, 'historical-definition')
})

test('Report registry checks immutable bytes and never upgrades individual observations into complete families', (t) => {
  const repo = fixture(t)
  const model = repo.model()
  const report = observation(model, candidateInputs(repo.directory, model), model.policy.cases[0])
  const file = 'refactor/observation.json'
  repo.write(file, report)
  const bytes = fs.readFileSync(path.join(repo.directory, file))
  repo.write('refactor/contract-runs.json', { schemaVersion: 1, runs: [{ file, sha256LF: sha256(bytes) }] })
  const result = contractStatus(repo.directory, model)
  assert.equal(result.rows.length, 264)
  assert.equal(result.rows.find(row => row.package === 'artplayer' && row.contract === 'API-01').state, 'partial-observations')
  assert(result.rows.some(row => row.state === 'planned-not-observed'))
  assert(result.rows.some(row => row.state === 'tests-not-indexed'))
  repo.policy.cases[0].contracts = ['API-09']
  repo.save()
  const revised = contractStatus(repo.directory, repo.model())
  assert.equal(revised.rows.find(row => row.package === 'artplayer' && row.contract === 'API-09').observations.length, 0)
  assert.equal(revised.rows.find(row => row.package === 'artplayer' && row.contract === 'API-01').observations[0].freshness, 'historical-definition')
  repo.write(file, { ...report, outcome: 'failed' })
  assert.throws(() => contractStatus(repo.directory, model), /Contract report changed/)
})

test('Real Node reporter retains exact file/name, failure, skip, todo and overall process failure', (t) => {
  const repo = fixture(t)
  repo.write('runner.test.mjs', 'import test from \'node:test\';test(\'passing\',()=>{});test(\'failure\',()=>{throw Error(\'fixture failure\')});test(\'skipped\',{skip:\'no environment\'},()=>{});test(\'todo\',{todo:\'pending\'},()=>{});')
  const env = { ...process.env }
  delete env.NODE_TEST_CONTEXT
  delete env.NODE_OPTIONS
  const result = spawnSync(process.execPath, ['--test', `--test-reporter=${pathToFileURL(path.join(root, 'refactor/scripts/contract-reporter.mjs')).href}`, 'runner.test.mjs'], { cwd: repo.directory, env, encoding: 'utf8' })
  assert.equal(result.status, 1, result.stderr)
  const events = result.stdout.trim().split(/\r?\n/).map(line => JSON.parse(line))
  assert(events.some(event => event.name === 'passing' && event.type === 'test:pass' && event.file === path.join(repo.directory, 'runner.test.mjs')))
  assert(events.some(event => event.name === 'failure' && event.type === 'test:fail'))
  assert(events.some(event => event.name === 'skipped' && event.skip))
  assert(events.some(event => event.name === 'todo' && event.todo))
  assert.equal(events.find(event => event.type === 'test:summary' && !event.file).success, false)
})
