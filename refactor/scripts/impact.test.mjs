import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Dependency and real Git change-selection contracts use the baseline runner.
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'
import { analyzeImpact, readImpactModel, validateImpactWorkflow } from './impact-model.mjs'
import { changedFiles } from './impact.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const actual = readImpactModel(root)
const cache = path.join(root, 'refactor/.cache')

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(cache, 'impact-test-'))
  t.after(() => {
    const relative = path.relative(cache, directory)
    assert(relative.startsWith('impact-test-') && !relative.includes(path.sep))
    fs.rmSync(directory, { recursive: true, force: true })
  })
  const write = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(directory, file)), { recursive: true })
    fs.writeFileSync(path.join(directory, file), typeof value === 'string' ? value : JSON.stringify(value))
  }
  const names = ['artplayer', 'artplayer-plugin-a', 'artplayer-plugin-b', 'artplayer-vitepress']
  const policy = { ...structuredClone(actual.policy), packages: names.map(name => ({ name })), coreValidationConsumers: names.slice(1), edges: [], examples: [], installedConsumerPackages: ['artplayer'] }
  write('refactor/impact-policy.json', policy)
  write('refactor/compatibility.md', 'Explicit core validation contract')
  write('scripts/build-ts.js', '// Shared docs declaration consumer')
  write('scripts/package-consumer.mjs', 'export const names = ["artplayer"]')
  write('scripts/coverage-policy.json', { packages: ['artplayer'] })
  write('package.json', { scripts: Object.fromEntries(policy.gates.map(gate => [gate.command.slice(5), 'echo fixture'])) })
  for (const name of names) {
    write(`packages/${name}/package.json`, { name, version: '1.0.0' })
    write(`packages/${name}/src/index.ts`, 'export default function example() {}')
  }
  const git = args => execFileSync('git', args, { cwd: directory, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_AUTHOR_NAME: 'Impact Fixture', GIT_AUTHOR_EMAIL: 'impact@example.test', GIT_COMMITTER_NAME: 'Impact Fixture', GIT_COMMITTER_EMAIL: 'impact@example.test', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null' } }).trim()
  const commit = (message) => {
    git(['add', '.'])
    git(['-c', 'core.hooksPath=', '-c', 'commit.gpgSign=false', 'commit', '-m', message])
    return git(['rev-parse', 'HEAD'])
  }
  return { directory, names, policy, write, git, commit, model: () => readImpactModel(directory) }
}

test('Actual impact graph covers core ecosystem and real plugin/DOM/example consumers without inventing installed coverage', () => {
  assert.equal(actual.packages.length, 22)
  const core = analyzeImpact(actual, ['packages/artplayer/src/index.ts'])
  assert.equal(core.affectedPackages.length, 22)
  assert.equal(core.installedConsumerGaps.length, 19)
  const ads = analyzeImpact(actual, ['packages/artplayer-plugin-ads/src/session.ts'])
  assert.deepEqual(ads.affectedPackages, ['artplayer-plugin-ads', 'artplayer-vitepress'])
  const danmuku = analyzeImpact(actual, ['packages/artplayer-plugin-danmuku/src/danmuku.js'])
  assert(danmuku.affectedPackages.includes('artplayer-plugin-danmuku-mask'))
  assert(danmuku.reasons.some(reason => reason.rule === 'explicit-integration-contract'))
  for (const file of ['docs/compiled/artplayer-plugin-ads.legacy.js', 'docs/uncompiled/artplayer-plugin-ads/index.js', 'docs/assets/example/ads.js'])
    assert.deepEqual(analyzeImpact(actual, [file]).affectedPackages, ads.affectedPackages)
  validateImpactWorkflow(fs.readFileSync(path.join(root, '.github/workflows/nodejs.yml'), 'utf8'), actual)
})

test('Static imports and manifest aliases propagate transitively; contradictory ranges and unknown packages fail', (t) => {
  const repo = fixture(t)
  repo.write('packages/artplayer-plugin-a/src/index.ts', 'export { default } from "../../artplayer-plugin-b/src/index"')
  repo.write('packages/artplayer-plugin-b/package.json', { name: 'artplayer-plugin-b', version: '1.0.0', dependencies: { alias: 'npm:artplayer@^1.0.0' } })
  const model = repo.model()
  assert(model.edges.some(edge => edge.consumer === 'artplayer-plugin-b' && edge.dependency === 'artplayer' && edge.kind === 'manifest-dependencies'))
  assert.deepEqual(analyzeImpact(model, ['packages/artplayer-plugin-b/src/index.ts']).affectedPackages, ['artplayer-plugin-a', 'artplayer-plugin-b', 'artplayer-vitepress'])
  repo.write('packages/artplayer-plugin-b/package.json', { name: 'artplayer-plugin-b', version: '1.0.0', peerDependencies: { artplayer: '^2.0.0' } })
  assert.throws(repo.model, /range mismatch/)
  repo.write('packages/artplayer-plugin-b/package.json', { name: 'artplayer-plugin-b', version: '1.0.0' })
  repo.write('packages/artplayer-plugin-a/src/index.ts', 'import unknown from "artplayer-plugin-missing"')
  assert.throws(repo.model, /Unknown workspace import/)
  repo.write('packages/artplayer-plugin-new/package.json', { name: 'artplayer-plugin-new', version: '1.0.0' })
  assert.throws(repo.model, /inventory changed/)
})

test('Policy cannot omit core consumers or claim stale installed-package coverage', (t) => {
  const missingGate = fixture(t)
  missingGate.policy.gates = []
  missingGate.write('refactor/impact-policy.json', missingGate.policy)
  assert.throws(missingGate.model, /Missing mandatory ecosystem gate/)
  const repo = fixture(t)
  repo.policy.coreValidationConsumers.pop()
  repo.write('refactor/impact-policy.json', repo.policy)
  assert.throws(repo.model, /every ecosystem validation consumer/)
  repo.policy.coreValidationConsumers = repo.names.slice(1)
  repo.write('refactor/impact-policy.json', repo.policy)
  repo.write('scripts/package-consumer.mjs', 'export const names = ["artplayer", "artplayer-plugin-a"]')
  assert.throws(repo.model, /consumer coverage changed/)
  repo.write('scripts/package-consumer.mjs', 'export const names = computeNames()')
  assert.throws(repo.model, /scope extraction/)
})

test('Shared/unknown files and computed imports conservatively expand; unsafe or unmapped package paths are rejected', (t) => {
  for (const file of ['yarn.lock', 'scripts/new-build-stage.mjs', 'types/new-boundary.d.ts'])
    assert.equal(analyzeImpact(actual, [file]).affectedPackages.length, 22)
  const unknown = analyzeImpact(actual, ['new-shared-config.toml'])
  assert.equal(unknown.affectedPackages.length, 22)
  assert.equal(unknown.reviewRequired, true)
  for (const file of ['../outside', '/absolute', 'C:/absolute', 'packages\\artplayer\\src\\index.ts'])
    assert.throws(() => analyzeImpact(actual, [file]), /path|Path/)
  assert.throws(() => analyzeImpact(actual, ['packages/unmapped/src/index.js']), /not mapped/)
  const repo = fixture(t)
  repo.write('packages/artplayer-plugin-a/src/index.ts', 'export const load = (name: string) => import(name)')
  const model = repo.model()
  assert.deepEqual(model.dynamicImports, ['packages/artplayer-plugin-a/src/index.ts'])
  assert.equal(analyzeImpact(model, ['packages/artplayer-plugin-b/src/index.ts']).affectedPackages.length, 4)
  repo.write('packages/artplayer-plugin-a/src/index.ts', 'export { from')
  assert.throws(repo.model, /malformed dependency source/)
})

test('CI workflow cannot silently skip or soften required impact gates', () => {
  const source = fs.readFileSync(path.join(root, '.github/workflows/nodejs.yml'), 'utf8')
  for (const edit of [
    (workflow) => { workflow.on.pull_request = { paths: ['packages/artplayer/**'] } },
    (workflow) => { workflow.jobs.coverage.if = 'false' },
    (workflow) => { workflow.jobs.coverage.if = false },
    (workflow) => { workflow.jobs.coverage['continue-on-error'] = true },
    (workflow) => { workflow.jobs.checks.steps.find(step => step.run?.startsWith('yarn ci:check')).if = 'false' },
    (workflow) => { workflow.jobs.checks.steps.find(step => step.run?.startsWith('yarn ci:check')).run = 'echo yarn ci:check' },
    (workflow) => { workflow.jobs.checks.steps.find(step => step.run?.startsWith('yarn ci:check')).run = 'if false; then\nyarn ci:check\nfi' },
    (workflow) => { workflow.jobs.checks.steps.find(step => step.run?.startsWith('yarn ci:check')).run = 'yarn ci:check || true' },
    (workflow) => { workflow.jobs.checks.defaults.run.shell = 'sh' },
    (workflow) => { workflow.jobs.checks.steps.find(step => step.run?.startsWith('yarn ci:check')).if = false },
    (workflow) => { workflow.jobs['browser-smoke'].steps.find(step => step.uses?.startsWith('actions/checkout@')).if = false },
    (workflow) => { workflow.jobs['browser-smoke'].steps.find(step => step.uses?.startsWith('actions/checkout@')).with['fetch-depth'] = 1 },
  ]) {
    const workflow = YAML.parse(source)
    edit(workflow)
    assert.throws(() => validateImpactWorkflow(YAML.stringify(workflow), actual), /Path filters|Required|full history/)
  }
})

test('Real Git selection includes both sides of renames, staged/unstaged/untracked paths and deletions', (t) => {
  const repo = fixture(t)
  repo.git(['init', '-b', 'main'])
  repo.write('packages/artplayer-plugin-a/src/old.ts', 'old content')
  repo.write('packages/artplayer-plugin-a/src/deleted.ts', 'delete later')
  const base = repo.commit('base')
  repo.git(['mv', 'packages/artplayer-plugin-a/src/old.ts', 'packages/artplayer-plugin-b/src/renamed.ts'])
  repo.commit('rename across packages')
  repo.write('packages/artplayer-plugin-a/src/staged.ts', 'staged')
  repo.git(['add', 'packages/artplayer-plugin-a/src/staged.ts'])
  repo.write('packages/artplayer-plugin-a/src/space name.ts', 'untracked')
  repo.write('packages/artplayer-plugin-b/src/index.ts', 'unstaged edit')
  fs.unlinkSync(path.join(repo.directory, 'packages/artplayer-plugin-a/src/deleted.ts'))
  const range = changedFiles(repo.directory, { base })
  assert.equal(range.origin, 'explicit-base')
  assert.equal(range.mergeBase, base)
  assert.deepEqual(range.files, [
    'packages/artplayer-plugin-a/src/deleted.ts',
    'packages/artplayer-plugin-a/src/old.ts',
    'packages/artplayer-plugin-a/src/space name.ts',
    'packages/artplayer-plugin-a/src/staged.ts',
    'packages/artplayer-plugin-b/src/index.ts',
    'packages/artplayer-plugin-b/src/renamed.ts',
  ])
  assert.equal(range.worktreeChanged, true)
  assert(!changedFiles(repo.directory).files.includes('packages/artplayer-plugin-a/src/old.ts'))
  assert.throws(() => changedFiles(repo.directory, { base: 'missing-ref' }))
})

test('GitHub event base is read as data; absent, zero and unavailable event bases require full repository checks', (t) => {
  const repo = fixture(t)
  repo.git(['init', '-b', 'main'])
  const base = repo.commit('base')
  repo.write('packages/artplayer-plugin-a/src/index.ts', 'changed source')
  repo.commit('change')
  const eventPath = path.join(repo.directory, '.git/event.json')
  const event = data => fs.writeFileSync(eventPath, JSON.stringify(data))
  event({ pull_request: { base: { sha: base } } })
  assert.deepEqual(changedFiles(repo.directory, { eventName: 'pull_request', eventPath }).files, ['packages/artplayer-plugin-a/src/index.ts'])
  for (const before of ['0'.repeat(40), 'a'.repeat(40), undefined]) {
    event({ before })
    const range = changedFiles(repo.directory, { eventName: 'push', eventPath })
    assert(range.origin.startsWith('full-repository-'))
    assert(range.files.includes('packages/artplayer-plugin-b/src/index.ts'))
  }
  event({ before: '--not-a-sha' })
  assert.throws(() => changedFiles(repo.directory, { eventName: 'push', eventPath }), /Invalid GitHub event base/)
})
