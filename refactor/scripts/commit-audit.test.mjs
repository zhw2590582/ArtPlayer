import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercise real isolated Git histories, not mocked command output.
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { auditCommits } from './commit-audit.mjs'

const cache = fileURLToPath(new URL('../.cache/', import.meta.url))
function repository(t) {
  fs.mkdirSync(cache, { recursive: true })
  const directory = fs.mkdtempSync(path.join(cache, 'commit-audit-test-'))
  t.after(() => {
    const relative = path.relative(cache, directory)
    assert(relative.startsWith('commit-audit-test-') && !relative.includes(path.sep))
    fs.rmSync(directory, { recursive: true, force: true })
  })
  const git = args => execFileSync('git', args, {
    cwd: directory,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_AUTHOR_NAME: 'Audit Fixture', GIT_AUTHOR_EMAIL: 'audit@example.test', GIT_COMMITTER_NAME: 'Audit Fixture', GIT_COMMITTER_EMAIL: 'audit@example.test', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null' },
  }).trim()
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(directory, file)), { recursive: true })
    fs.writeFileSync(path.join(directory, file), text)
  }
  const commit = (subject) => {
    git(['add', '.'])
    git(['-c', 'core.hooksPath=', '-c', 'commit.gpgSign=false', 'commit', '-m', subject])
    return git(['rev-parse', 'HEAD'])
  }
  git(['init', '-b', 'main'])
  write('README.md', 'Test-only Git repository\n')
  const baselineCommit = commit('Baseline')
  const bundledTasks = ['DOC-01', 'DOC-02', 'DOC-03', 'DOC-04']
  const data = { baselineCommit, tasks: [...bundledTasks, 'DOC-05'].map(id => ({ id, status: 'done', evidence: ['changes/bootstrap.md'] })) }
  for (const id of ['TEST-01', 'TEST-02']) data.tasks.push({ id, status: 'doing', evidence: [] })
  const save = (plan = true) => {
    write('refactor/tasks.json', JSON.stringify(data))
    if (plan)
      write('refactor/plan.md', data.tasks.map(task => `${task.id}: ${task.status}`).join('\n'))
  }
  write('refactor/changes/bootstrap.md', 'Initial documentation and the per-task rule\n')
  save()
  const bootstrapCommit = commit('docs: [DOC-05] establish initial documentation')
  const policy = { bootstrapCommit, bootstrapTask: 'DOC-05', bundledTasks }
  const finish = (ids = ['TEST-01'], options = {}) => {
    for (const id of ids) {
      const task = data.tasks.find(task => task.id === id)
      task.status = 'done'
      task.evidence = options.evidence || [`changes/${id}.md`]
      if (options.writeEvidence !== false)
        write(`refactor/changes/${id}.md`, `${id}: tested completion\n`)
    }
    save(options.plan !== false)
    if (options.commit !== false)
      return commit(options.subject || `test: [${ids[0]}] completed work`)
  }
  return { directory, git, write, commit, save, finish, data, policy, audit: () => auditCommits(directory, policy) }
}

test('Commit audit proves dedicated transitions and only the pinned bootstrap bundling', (t) => {
  const repo = repository(t)
  const first = repo.finish()
  const second = repo.finish(['TEST-02'], { subject: 'test(TEST-02): historical punctuation remains traceable' })
  const report = repo.audit()
  assert.equal(report.doneTasks, 7)
  assert.equal(report.dedicatedCommits, 3)
  assert.deepEqual(report.completions.filter(item => item.bundledWith).map(item => item.task), repo.policy.bundledTasks)
  assert.equal(report.completions.find(item => item.task === 'TEST-01').commit, first)
  assert.equal(report.completions.find(item => item.task === 'TEST-02').commit, second)
  assert.throws(() => auditCommits(repo.directory, { ...repo.policy, bundledTasks: [...repo.policy.bundledTasks, 'TEST-01'] }), /Bootstrap exception task set changed/)
})

test('Commit audit rejects combined task completion, misleading subjects and missing co-committed evidence', (t) => {
  for (const [ids, options, expected] of [
    [['TEST-01', 'TEST-02'], {}, /exactly one task/],
    [['TEST-01'], { subject: 'test: [TEST-010] not the completed task' }, /exact task TEST-01/],
    [['TEST-01'], { plan: false }, /missing generated plan change/],
    [['TEST-01'], { writeEvidence: false }, /evidence missing at completion/],
    [['TEST-01'], { evidence: ['changes/bootstrap.md'], writeEvidence: false }, /no evidence updated/],
    [['TEST-01'], { evidence: ['../README.md'] }, /evidence escapes refactor/],
  ]) {
    const repo = repository(t)
    repo.finish(ids, options)
    assert.throws(repo.audit, expected)
  }
})

test('Commit audit rejects uncommitted done state and shallow or removed completion history', (t) => {
  const repo = repository(t)
  repo.finish(['TEST-01'], { commit: false })
  assert.throws(repo.audit, /Uncommitted completion: TEST-01/)
  repo.commit('test: [TEST-01] finish with proof')
  repo.data.tasks = repo.data.tasks.filter(task => task.id !== 'TEST-01')
  repo.save()
  assert.throws(repo.audit, /Historical completed task was removed/)
  repo.write('.git/shallow', `${repo.git(['rev-parse', 'HEAD'])}\n`)
  assert.throws(repo.audit, /requires full Git history/)
})

test('Commit audit finds feature-branch completion through a real merge without calling the merge a second completion', (t) => {
  const repo = repository(t)
  repo.git(['checkout', '-b', 'feature'])
  const completed = repo.finish()
  repo.git(['checkout', 'main'])
  repo.write('notes.md', 'Unrelated main branch work\n')
  repo.commit('docs: independent work')
  repo.git(['-c', 'core.hooksPath=', '-c', 'commit.gpgSign=false', 'merge', '--no-ff', 'feature', '-m', 'Merge feature branch'])
  const report = repo.audit()
  assert.equal(report.doneTasks, 6)
  assert.equal(report.dedicatedCommits, 2)
  assert.equal(report.completions.filter(item => item.task === 'TEST-01').length, 1)
  assert.equal(report.completions.find(item => item.task === 'TEST-01').commit, completed)
})
