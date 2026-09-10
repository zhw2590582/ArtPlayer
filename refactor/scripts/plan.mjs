import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('../', import.meta.url))
const root = path.resolve(dir, '..')
const data = JSON.parse(fs.readFileSync(path.join(dir, 'tasks.json'), 'utf8'))
const inventory = JSON.parse(fs.readFileSync(path.join(dir, 'package-inventory.json'), 'utf8'))
const states = new Set(['todo', 'doing', 'blocked', 'done', 'deferred'])
const ids = new Map()

assert.equal(data.schemaVersion, 1)
assert.equal(data.baselineCommit, inventory.baselineCommit)
assert.equal(data.qualityContract, 'quality-contract.md')
assert(fs.existsSync(path.join(dir, data.qualityContract)), 'Missing shared quality contract')
for (const task of data.tasks) {
  assert(typeof task.id === 'string' && /^[A-Z]+(?:-[A-Z]+)*-\d{2}$/.test(task.id), `Invalid ID: ${task.id}`)
  assert(!ids.has(task.id), `Duplicate ID: ${task.id}`)
  assert(states.has(task.status), `Invalid status: ${task.id}`)
  assert(['L', 'M', 'H'].includes(task.risk), `Invalid risk: ${task.id}`)
  for (const key of ['phase', 'title', 'deliverable', 'acceptance']) {
    assert(typeof task[key] === 'string' && task[key].trim(), `Missing ${key}: ${task.id}`)
  }
  for (const key of ['scope', 'dependsOn', 'evidence']) {
    assert(Array.isArray(task[key]), `Invalid ${key}: ${task.id}`)
  }
  assert(task.scope.length, `Missing scope: ${task.id}`)
  assert(new Set(task.dependsOn).size === task.dependsOn.length, `Duplicate dependency: ${task.id}`)
  if (task.status === 'done') {
    assert(task.evidence.length, `Missing evidence: ${task.id}`)
  }
  if (task.status === 'blocked' || task.status === 'deferred') {
    assert(typeof task.reason === 'string' && task.reason.trim(), `Missing reason: ${task.id}`)
  }
  for (const evidence of task.evidence) {
    assert(typeof evidence === 'string' && evidence.trim(), `Invalid evidence: ${task.id}`)
    if (/^https?:\/\//.test(evidence)) continue
    const resolved = path.resolve(dir, evidence.split('#')[0])
    const relative = path.relative(dir, resolved)
    assert(!relative.startsWith('..') && !path.isAbsolute(relative), `Evidence outside refactor: ${task.id}`)
    assert(fs.existsSync(resolved), `Missing evidence file: ${evidence}`)
    assert(!relative.replaceAll('\\', '/').endsWith('TEMPLATE.md'), `Template is not evidence: ${task.id}`)
  }
  ids.set(task.id, task)
}

const visited = new Set()
const visiting = new Set()
function visit(id) {
  assert(ids.has(id), `Unknown dependency: ${id}`)
  assert(!visiting.has(id), `Dependency cycle at ${id}`)
  if (visited.has(id)) return
  visiting.add(id)
  for (const dependency of ids.get(id).dependsOn) {
    visit(dependency)
    if (['doing', 'done'].includes(ids.get(id).status)) {
      assert.equal(ids.get(dependency).status, 'done', `Unfinished dependency ${dependency} for ${id}`)
    }
  }
  visiting.delete(id)
  visited.add(id)
}
for (const id of ids.keys()) visit(id)

function ancestors(id, found = new Set()) {
  for (const dependency of ids.get(id).dependsOn) {
    if (found.has(dependency)) continue
    found.add(dependency)
    ancestors(dependency, found)
  }
  return found
}
function requireAncestor(task, dependency) {
  assert(ancestors(task).has(dependency), `${task} must depend on ${dependency}`)
}
assert(![...ancestors('PILOT-01')].some(id => id.startsWith('CORE-')), 'Pilot must precede core migration')
requireAncestor('CORE-01', 'PILOT-01')
for (const device of ['PKG-CAST-05', 'PKG-VAST-05', 'PKG-DPIP-05', 'PKG-MASK-05']) {
  assert(!ancestors('REVIEW-01').has(device), `REVIEW-01 must not wait for ${device}`)
  requireAncestor('REVIEW-02', device)
}
requireAncestor('REL-02', 'REL-09')
for (const release of ['REL-05', 'REL-06']) {
  for (const gate of ['REVIEW-01', 'REVIEW-02', 'REVIEW-03', 'CI-04', 'REL-03', 'REL-04', 'REL-09']) {
    requireAncestor(release, gate)
  }
}
const finalDependencies = ancestors('REL-07')
for (const task of data.tasks) {
  if (task.id === 'REL-07' || task.id.startsWith('DOC-')) continue
  assert(finalDependencies.has(task.id), `Implementation task is disconnected from REL-07: ${task.id}`)
}

const packageNames = inventory.packages.map(pkg => pkg.name).sort()
const currentNames = fs.readdirSync(path.join(root, 'packages'))
  .filter(name => fs.existsSync(path.join(root, 'packages', name, 'package.json'))).sort()
assert.deepEqual(currentNames, packageNames, 'Package scope changed: record the scope decision and update the validator/baseline policy')
for (const name of packageNames) {
  assert(data.tasks.some(task => task.scope.includes(name)), `Package not planned: ${name}`)
}
const scopes = new Set([...packageNames, 'workspace', 'example/react.js', 'example/vue.js'])
for (const task of data.tasks) {
  for (const scope of task.scope) assert(scopes.has(scope), `Unknown scope ${scope}: ${task.id}`)
}

let localLinks = 0
const markdownFiles = fs.readdirSync(dir, { recursive: true })
  .filter(file => file.endsWith('.md')).map(file => path.join(dir, file))
for (const file of [...markdownFiles, path.join(root, 'AGENTS.md')]) {
  const content = fs.readFileSync(file, 'utf8')
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const href = match[1]
    if (/^(?:https?:|#)/.test(href)) continue
    localLinks += 1
    assert(fs.existsSync(path.resolve(path.dirname(file), href.split('#')[0])), `Broken local link in ${path.relative(root, file)}: ${href}`)
  }
}

const cell = value => String(value).replaceAll('|', '\\|').replaceAll('\n', '<br>')
const counts = Object.fromEntries([...states].map(state => [state, data.tasks.filter(task => task.status === state).length]))
const lines = [
  '# 完整重构执行计划表', '',
  '> 由 tasks.json 生成。请修改数据后运行 `node refactor/scripts/plan.mjs --write`，不要手改本表。', '',
  `基线：\`${data.baselineCommit}\`。总任务 ${data.tasks.length} 项，范围 ${packageNames.length} 个包及工作区/示例。`, '',
  `状态：${Object.entries(counts).map(([state, count]) => `${state} ${count}`).join(' / ')}。风险 L/M/H 表示兼容风险，不表示工期。`, '',
  '前置依赖是启动条件；验收是完成条件。任务可以继续拆分，但不能复用或悄悄删除旧 ID。', '',
  `每项实施任务同时适用[全项目质量要求](${data.qualityContract})：清晰拆分职责和依赖，主动改善不合理设计，以有效测试证明旧接口兼容，并同步维护后续 AI 可接续的包内文档。`, '',
  '## 包覆盖索引', '',
  '| 包 | 基线版本 | 任务 |', '| --- | --- | --- |',
  ...inventory.packages.map(pkg => `| ${pkg.name} | ${pkg.version} | ${data.tasks.filter(task => task.scope.includes(pkg.name)).map(task => task.id).join(', ')} |`), '',
]
for (const phase of new Set(data.tasks.map(task => task.phase))) {
  lines.push(`## ${phase}`, '', '| ID | 范围 / 步骤 | 前置依赖 | 交付物 | 验收条件 | 风险 | 状态 |', '| --- | --- | --- | --- | --- | --- | --- |')
  for (const task of data.tasks.filter(item => item.phase === phase)) {
    lines.push(`| ${[task.id, `${task.scope.join(', ')}<br>${task.title}`, task.dependsOn.join(', ') || '-', task.deliverable, task.acceptance, task.risk, task.status].map(cell).join(' | ')} |`)
  }
  lines.push('')
}
lines.push('## 完成证据与阻塞', '')
for (const task of data.tasks.filter(item => item.evidence.length || item.reason)) {
  lines.push(`- ${task.id}: ${task.evidence.map(link => `[记录](${link})`).join(' ')}${task.reason ? ` ${task.reason}` : ''}`)
}
lines.push('')
const output = `${lines.join('\n').trimEnd()}\n`
const target = path.join(dir, 'plan.md')
const mode = process.argv[2]
assert(['--write', '--check'].includes(mode), 'Use --write or --check')
if (mode === '--write') fs.writeFileSync(target, output)
else assert.equal(fs.readFileSync(target, 'utf8'), output, 'plan.md is stale; run --write')
console.log(`Plan ${mode}: ${data.tasks.length} tasks, ${packageNames.length} packages, ${localLinks} local links, no dependency cycles; ${JSON.stringify(counts)}`)
