import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { candidateInputs, currentHead, evaluateRun, readContractModel, sha256 } from './contracts-model.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
assert.equal(process.argv.length, 2, 'Contract runner does not accept filters or alternate artifacts')
const model = readContractModel(root)
const candidate = candidateInputs(root, model)
const head = currentHead(root)
const directory = path.join(root, 'refactor/.cache/contracts')
fs.mkdirSync(directory, { recursive: true })
const output = fs.mkdtempSync(path.join(directory, 'run-'))
const files = [...new Set(model.policy.cases.map(item => item.file))]
const env = { ...process.env }
for (const key of Object.keys(env)) {
  if (key.startsWith('ARTPLAYER_') || ['NODE_OPTIONS', 'NODE_TEST_CONTEXT', 'NODE_V8_COVERAGE'].includes(key))
    delete env[key]
}
const command = ['--test', '--test-reporter=./refactor/scripts/contract-reporter.mjs', ...files]
const executed = spawnSync(process.execPath, command, { cwd: root, env, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024 })
fs.writeFileSync(path.join(output, 'events.jsonl'), executed.stdout || '')
fs.writeFileSync(path.join(output, 'stderr.log'), executed.stderr || '')
assert(!executed.error, `Contract process failed: ${executed.error?.message}; evidence ${output}`)
assert.equal(candidateInputs(root, model).digest, candidate.digest, 'Contract inputs changed during execution')
const events = executed.stdout.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)).map(event => ({ ...event, ...(event.file ? { file: path.relative(root, event.file).split(path.sep).join('/') } : {}) }))
const report = {
  schemaVersion: 1,
  command: 'yarn test:contracts',
  invocation: [process.execPath, ...command],
  head,
  capturedAt: new Date().toISOString(),
  environment: { node: process.version, platform: process.platform, arch: process.arch, artifactOverrides: 'cleared' },
  candidate,
  events,
  outcome: executed.status === 0 ? 'passed' : 'failed',
  cases: model.policy.cases.map((item) => {
    const matches = events.filter(event => ['test:pass', 'test:fail'].includes(event.type) && event.file === item.file && event.name === item.title)
    assert.equal(matches.length, 1, `Missing or ambiguous runner result: ${item.id}; evidence ${output}`)
    const event = matches[0]
    return { id: item.id, definition: item, definitionSha256: sha256(JSON.stringify(item)), status: event.skip || event.todo ? 'skipped' : event.type === 'test:pass' ? 'passed' : 'failed' }
  }),
  limitations: 'Selected source/controlled-host assertions only; not full family, package tarball, browser, device, SDK or support-range acceptance',
}
evaluateRun(model, report, candidate.digest)
fs.writeFileSync(path.join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
fs.mkdirSync(path.join(root, 'refactor/.cache/ci'), { recursive: true })
fs.writeFileSync(path.join(root, 'refactor/.cache/ci/contracts-run.json'), `${JSON.stringify(report, null, 2)}\n`)
fs.writeFileSync(path.join(directory, 'latest.json'), `${JSON.stringify({ output: path.relative(root, output).split(path.sep).join('/') }, null, 2)}\n`)
console.log(`Contract observations: ${report.cases.length} indexed cases; process ${report.outcome}; ${path.relative(root, output)}`)
process.exitCode = executed.status === 0 && report.cases.every(item => item.status === 'passed') ? 0 : 1
