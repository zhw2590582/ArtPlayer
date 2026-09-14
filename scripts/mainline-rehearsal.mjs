import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { consumerDirectory, removeConsumer, workspace, writeJson } from './package-consumer.mjs'

assert.equal(process.versions.node, fs.readFileSync(path.join(workspace, '.node-version'), 'utf8').trim(), 'Use pinned Node')
const parent = path.join(workspace, 'refactor/.cache/mainline-rehearsal')
fs.mkdirSync(parent, { recursive: true })
const output = fs.mkdtempSync(path.join(parent, 'run-'))
const directory = consumerDirectory()
const source = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: workspace, encoding: 'utf8', windowsHide: true }).trim()
const report = { task: 'REL-04', capturedAt: new Date().toISOString(), source, node: process.versions.node, passed: false, scope: 'Synthetic isolated JS-to-TS modify/delete conflict; no production fix or remote mutation', steps: [] }
function command(executable, args, expected = 0) {
  const result = spawnSync(executable, args, { cwd: directory, encoding: 'utf8', timeout: 30000, windowsHide: true, env: { ...process.env, NODE_PATH: '', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null', GIT_TERMINAL_PROMPT: '0' } })
  report.steps.push({ executable: executable === process.execPath ? 'node' : executable, args, status: result.status, stdout: result.stdout, stderr: result.stderr })
  assert(!result.error, result.error?.message)
  assert.equal(result.status, expected, `${executable} ${args.join(' ')}: ${result.stderr}`)
  if (executable === process.execPath && expected === 1)
    assert(result.stderr.includes('ERR_ASSERTION') && result.stderr.includes('actual: -2') && result.stderr.includes('expected: 0'), 'Expected the negative-limit regression, not an unrelated Node failure')
  return result.stdout.trim()
}
const git = (...args) => command('git', args)
function write(file, text) {
  const target = path.join(directory, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, text)
}
try {
  git('init', '--initial-branch=master')
  git('config', 'user.name', 'ArtPlayer isolated rehearsal')
  git('config', 'user.email', 'rehearsal@example.invalid')
  git('config', 'commit.gpgsign', 'false')
  git('config', 'core.autocrlf', 'false')
  write('package.json', '{"private":true,"type":"module"}\n')
  const original = 'export default function retryLimit(value) {\n  return Math.trunc(value);\n}\n'
  write('src/retry.js', original)
  const consumer = extension => `import assert from 'node:assert/strict';\nimport retryLimit from './src/retry.${extension}';\nassert.equal(retryLimit(2.9), 2);\nassert.equal(retryLimit(-2.9), 0);\nconsole.log('retry limit regression passed');\n`
  write('consumer.mjs', consumer('js'))
  git('add', '.')
  git('commit', '-m', 'fixture: original JavaScript implementation')
  const base = git('rev-parse', 'HEAD')
  command(process.execPath, ['consumer.mjs'], 1)
  git('switch', '-c', 'codex/rehearsal')
  // This fixture deliberately moves the calculation into another responsibility.
  fs.unlinkSync(path.join(directory, 'src/retry.js'))
  write('src/retry.ts', 'import { normalizeLimit } from \'./normalize.ts\';\nexport default (value: number): number => normalizeLimit(value);\n')
  write('src/normalize.ts', 'export const normalizeLimit = (value: number): number => Math.trunc(value);\n')
  write('consumer.mjs', consumer('ts'))
  git('add', '.')
  git('commit', '-m', 'fixture: split retry policy into TypeScript modules')
  const migrated = git('rev-parse', 'HEAD')
  command(process.execPath, ['consumer.mjs'], 1)
  git('switch', 'master')
  write('src/retry.js', original.replace('Math.trunc(value)', 'Math.max(0, Math.trunc(value))'))
  git('add', 'src/retry.js')
  git('commit', '-m', 'fixture: clamp negative retry limits')
  const fix = git('rev-parse', 'HEAD')
  command(process.execPath, ['consumer.mjs'])
  git('switch', 'codex/rehearsal')
  assert.equal(git('status', '--porcelain'), '')
  const beforeTree = git('rev-parse', 'HEAD^{tree}')
  command('git', ['cherry-pick', '-x', fix], 1)
  const conflict = git('ls-files', '--unmerged')
  assert(conflict.includes('src/retry.js'), 'Expected the removed JavaScript file to conflict')
  assert.equal(git('rev-parse', 'CHERRY_PICK_HEAD'), fix)
  git('cherry-pick', '--abort')
  assert.equal(git('rev-parse', 'HEAD'), migrated)
  assert.equal(git('rev-parse', 'HEAD^{tree}'), beforeTree)
  assert.equal(git('status', '--porcelain'), '')
  assert(!fs.existsSync(path.join(directory, 'src/retry.js')), 'Abort left an obsolete JavaScript file')
  command('git', ['cherry-pick', '-x', fix], 1)
  git('rm', 'src/retry.js')
  write('src/normalize.ts', 'export const normalizeLimit = (value: number): number => Math.max(0, Math.trunc(value));\n')
  git('add', 'src/normalize.ts')
  command(process.execPath, ['consumer.mjs'])
  git('-c', 'core.editor=true', 'cherry-pick', '--continue')
  const resolved = git('rev-parse', 'HEAD')
  assert(git('log', '-1', '--format=%B').includes(fix), 'Resolved commit must retain upstream attribution')
  assert.equal(git('status', '--porcelain'), '')
  assert.equal(git('ls-files', 'src/retry.js'), '')
  command(process.execPath, ['consumer.mjs'])
  report.commits = { base, migrated, fix, resolved }
  report.abort = { restoredCommit: migrated, restoredTree: beforeTree, clean: true }
  report.resolution = { source: 'src/retry.js', destination: 'src/normalize.ts', obsoleteFileAbsent: true, regressionPassed: true, attributed: true }
  fs.writeFileSync(path.join(output, 'resolved.patch'), `${git('show', '--format=fuller', '--binary', resolved)}\n`)
  command('git', ['bundle', 'create', path.join(output, 'rehearsal.bundle'), '--all'])
  git('bundle', 'verify', path.join(output, 'rehearsal.bundle'))
  report.passed = true
}
catch (error) {
  report.error = { name: error.name, message: error.message }
  throw error
}
finally {
  writeJson(path.join(output, 'report.json'), report)
  writeJson(path.join(parent, 'latest.json'), { output: path.relative(workspace, output).replaceAll('\\', '/'), passed: report.passed })
  removeConsumer(directory)
  console.log(`Mainline rehearsal: ${path.relative(workspace, output)}; passed=${report.passed}`)
}
