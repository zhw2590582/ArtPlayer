import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
export const commitPolicy = {
  bootstrapCommit: '570600d2f6ffd580a890e0b87dfa9843bf8dd8d0',
  bootstrapTask: 'DOC-05',
  bundledTasks: ['DOC-01', 'DOC-02', 'DOC-03', 'DOC-04'],
}

export function auditCommits(directory = root, policy = commitPolicy) {
  const git = args => execFileSync('git', args, { cwd: directory, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }).trimEnd()
  assert.equal(git(['rev-parse', '--is-shallow-repository']), 'false', 'Commit audit requires full Git history; use checkout fetch-depth: 0')
  const head = git(['rev-parse', 'HEAD'])
  const current = JSON.parse(fs.readFileSync(path.join(directory, 'refactor/tasks.json'), 'utf8'))
  git(['merge-base', '--is-ancestor', current.baselineCommit, head])
  git(['merge-base', '--is-ancestor', policy.bootstrapCommit, head])
  const snapshots = new Map()
  function snapshot(commit) {
    if (!snapshots.has(commit)) {
      const entry = git(['ls-tree', commit, '--', 'refactor/tasks.json'])
      const tasks = entry ? JSON.parse(git(['show', `${commit}:refactor/tasks.json`])).tasks : []
      snapshots.set(commit, new Map(tasks.map(task => [task.id, task])))
    }
    return snapshots.get(commit)
  }
  const history = git(['log', '--full-history', '--reverse', '--format=%H%x00%P%x00%s', head, '--', 'refactor/tasks.json']).split('\n').filter(Boolean)
  const completions = []
  for (const line of history) {
    const [commit, parentText, subject] = line.split('\0')
    const parents = parentText.split(' ').filter(Boolean).map(snapshot)
    const newlyDone = [...snapshot(commit).values()].filter(task => task.status === 'done' && parents.every(parent => parent.get(task.id)?.status !== 'done'))
    if (!newlyDone.length)
      continue
    const bootstrap = commit === policy.bootstrapCommit
    const exceptions = bootstrap ? policy.bundledTasks : []
    const dedicated = newlyDone.filter(task => !exceptions.includes(task.id))
    assert.equal(dedicated.length, 1, `${commit}: one completion commit must complete exactly one task; found ${dedicated.map(task => task.id).join(', ')}`)
    if (bootstrap) {
      assert.equal(dedicated[0].id, policy.bootstrapTask, 'Bootstrap exception is restricted to DOC-05')
      assert.deepEqual(newlyDone.map(task => task.id).sort(), [...policy.bundledTasks, policy.bootstrapTask].sort(), 'Bootstrap exception task set changed')
    }
    const id = dedicated[0].id
    assert(/^[A-Z]+(?:-[A-Z]+)*-\d{2}$/.test(id), 'Invalid task ID')
    // Older subjects use parentheses or plain tokens; punctuation does not erase a real task commit.
    assert(new RegExp(`(?:^|[^A-Z0-9-])${id}(?:$|[^A-Z0-9-])`).test(subject), `${commit}: completion subject does not identify exact task ${id}`)
    const changes = git(['diff-tree', '--root', '-m', '--no-commit-id', '--name-only', '-r', '-z', commit]).split('\0').filter(Boolean)
    assert(changes.includes('refactor/tasks.json'), `${commit}: missing task-state change`)
    assert(changes.includes('refactor/plan.md'), `${commit}: missing generated plan change`)
    const tree = new Set(git(['ls-tree', '-r', '--name-only', '-z', commit, '--', 'refactor']).split('\0').filter(Boolean))
    for (const task of newlyDone) {
      assert(task.evidence?.length, `${commit}: ${task.id} has no evidence`)
      const local = task.evidence.filter(file => !/^https?:\/\//.test(file)).map((file) => {
        const name = file.split('#')[0]
        const normalized = path.posix.normalize(name)
        assert(name && !name.includes('\\') && !path.posix.isAbsolute(name) && !/^[A-Z]:/i.test(name) && normalized !== '..' && !normalized.startsWith('../'), `${commit}: evidence escapes refactor`)
        return `refactor/${normalized}`
      })
      assert(local.length, `${commit}: ${task.id} needs durable local completion evidence`)
      for (const file of local) assert(tree.has(file), `${commit}: ${task.id} evidence missing at completion: ${file}`)
      if (!exceptions.includes(task.id))
        assert(local.some(file => changes.includes(file)), `${commit}: ${task.id} has no evidence updated in its completion commit`)
      completions.push({ task: task.id, commit, subject, bundledWith: exceptions.includes(task.id) ? policy.bootstrapTask : null, evidence: local, changedEvidence: local.filter(file => changes.includes(file)) })
    }
  }
  const currentTasks = new Map(current.tasks.map(task => [task.id, task]))
  const committed = snapshot(head)
  for (const completion of completions)
    assert(currentTasks.has(completion.task), `Historical completed task was removed: ${completion.task}`)
  for (const task of current.tasks.filter(task => task.status === 'done')) {
    assert.equal(committed.get(task.id)?.status, 'done', `Uncommitted completion: ${task.id}; commit this task before the final audit`)
    assert(completions.some(completion => completion.task === task.id), `No dedicated completion found for ${task.id}`)
  }
  return {
    schemaVersion: 1,
    head,
    baselineCommit: current.baselineCommit,
    policy,
    doneTasks: current.tasks.filter(task => task.status === 'done').length,
    dedicatedCommits: new Set(completions.filter(item => !item.bundledWith).map(item => item.commit)).size,
    completions,
    limitation: 'Verifies actual completion transitions, task identity and durable evidence co-committed with the plan; does not prove the semantic quality of implementation or tests.',
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert(process.argv.slice(2).every(arg => arg === '--report'), 'Use --report or no arguments')
  const report = auditCommits()
  if (process.argv.includes('--report')) {
    const directory = path.join(root, 'refactor/.cache/ci')
    fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(path.join(directory, 'commit-audit.json'), `${JSON.stringify(report, null, 2)}\n`)
  }
  console.log(`Commit audit: ${report.doneTasks} done tasks, ${report.dedicatedCommits} dedicated completion commits, ${report.policy.bundledTasks.length} documented bootstrap tasks; HEAD ${report.head}`)
}
