import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { repositoryPath } from './impact-model.mjs'

export const sha256 = value => createHash('sha256').update(value).digest('hex')
export const readJson = (directory, file) => JSON.parse(fs.readFileSync(localFile(directory, file), 'utf8'))

export function localFile(directory, file) {
  assert.equal(repositoryPath(file), file, `Noncanonical contract path: ${file}`)
  const absolute = path.join(directory, file)
  const relative = path.relative(fs.realpathSync(directory), fs.realpathSync(absolute))
  assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), `Redirected contract path: ${file}`)
  assert(fs.statSync(absolute).isFile(), `Contract evidence is not a file: ${file}`)
  return absolute
}

export function pointer(document, value) {
  assert(/^\//.test(value), 'Expected a JSON pointer')
  return value.slice(1).split('/').reduce((item, part) => {
    const key = part.replaceAll('~1', '/').replaceAll('~0', '~')
    assert(item && Object.hasOwn(item, key), `Missing version evidence pointer: ${value}`)
    return item[key]
  }, document)
}

export function candidateInputs(directory, model) {
  const files = new Set(['package.json', 'yarn.lock', 'refactor/contract-policy.json', '.node-version'])
  const walk = (folder) => {
    if (!fs.existsSync(path.join(directory, folder)))
      return
    for (const entry of fs.readdirSync(path.join(directory, folder), { withFileTypes: true })) {
      const file = `${folder}/${entry.name}`
      assert(!entry.isSymbolicLink(), `Review redirected contract input: ${file}`)
      if (entry.isDirectory())
        walk(file)
      else files.add(file)
    }
  }
  for (const pkg of model.policy.packages) {
    files.add(`packages/${pkg.name}/package.json`)
    for (const folder of ['src', 'types', 'public']) walk(`packages/${pkg.name}/${folder}`)
  }
  for (const folder of ['scripts', 'test', 'types', 'refactor/scripts', 'refactor/fixtures']) walk(folder)
  for (const version of model.policy.versions) files.add(version.file)
  const inputs = [...files].sort().map(file => ({ file, sha256: sha256(fs.readFileSync(localFile(directory, file))) }))
  return { digest: sha256(JSON.stringify(inputs)), inputs }
}

function validateTest(directory, item) {
  assert(/^CT-[A-Z0-9-]+$/.test(item.id), 'Invalid stable contract test ID')
  assert(item.command === 'yarn test:contracts' && item.runner === 'node', 'Unsupported contract runner/command')
  const source = ts.createSourceFile(item.file, fs.readFileSync(localFile(directory, item.file), 'utf8'), ts.ScriptTarget.Latest, true)
  assert.equal(source.parseDiagnostics.length, 0, `Malformed contract test: ${item.file}`)
  const imported = source.statements.some(statement => ts.isImportDeclaration(statement) && statement.moduleSpecifier.text === 'node:test'
    && (statement.importClause?.name?.text === 'test' || statement.importClause?.namedBindings?.elements?.some(element => element.name.text === 'test' && (!element.propertyName || element.propertyName.text === 'test'))))
  assert(imported, `Contract case requires the Node test binding: ${item.id}`)
  const matches = []
  function visit(node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'test' && node.arguments[0] && ts.isStringLiteralLike(node.arguments[0]) && node.arguments[0].text === item.title)
      matches.push(node)
    ts.forEachChild(node, visit)
  }
  visit(source)
  assert.equal(matches.length, 1, `Contract test title must identify exactly one literal test: ${item.id}`)
  assert(item.scope?.length && item.limitations?.length, `Missing assertion scope/limits: ${item.id}`)
}

export function readContractModel(directory) {
  const policy = readJson(directory, 'refactor/contract-policy.json')
  assert.equal(policy.schemaVersion, 1)
  const scripts = readJson(directory, 'package.json').scripts
  assert.equal(scripts?.['test:contracts'], 'node refactor/scripts/run-contracts.mjs', 'Contract runner command changed; review its evidence adapter')
  assert.equal(scripts?.['check:contracts'], 'node refactor/scripts/contracts.mjs', 'Contract index command changed')
  const stages = scripts['ci:check']?.split(' && ') || []
  assert(stages.includes('yarn test:contracts') && stages.indexOf('yarn check:contracts --report') > stages.indexOf('yarn test:contracts'), 'CI must run contract observations before checking their report')
  const tasks = readJson(directory, 'refactor/tasks.json').tasks
  const inventory = readJson(directory, 'refactor/package-inventory.json').packages
  const families = [...fs.readFileSync(localFile(directory, 'refactor/compatibility.md'), 'utf8').matchAll(/^\| (API-\d{2}) \| ([^|]+) \|/gm)].map(match => ({ id: match[1], name: match[2].trim() }))
  assert(families.length > 0)
  assert.deepEqual(policy.families, families, 'Public contract families changed; update their coverage ownership')
  const names = inventory.map(pkg => pkg.name).sort()
  assert.deepEqual(policy.packages.map(pkg => pkg.name).sort(), names, 'Contract package ownership is incomplete or duplicated')
  const actual = fs.readdirSync(path.join(directory, 'packages')).filter(name => fs.existsSync(path.join(directory, 'packages', name, 'package.json'))).sort()
  assert.deepEqual(actual, names, 'New package must be registered in inventory and contracts')
  const unique = (items, label) => assert.equal(new Set(items.map(item => item.id)).size, items.length, `Duplicate ${label} ID`)
  unique(policy.versions, 'version')
  unique(policy.cases, 'case')
  assert(policy.cases.length > 0, 'Contract runner requires explicit cases; empty selection must not discover unrelated tests')
  assert.equal(new Set(policy.cases.map(item => JSON.stringify([item.file, item.title]))).size, policy.cases.length, 'Duplicate file/title under different contract IDs')
  for (const version of policy.versions) {
    assert(names.includes(version.package), 'Version references unknown package')
    const origin = pointer(readJson(directory, version.file), version.pointer)
    assert.equal(origin.name, version.package, `Wrong package in version evidence: ${version.id}`)
    assert.equal(origin.version, version.version, `Wrong version evidence: ${version.id}`)
    if (version.kind === 'published-baseline') {
      assert(/^[a-f\d]{64}$/.test(origin.sha256) && origin.integrity?.startsWith('sha512-'), `Published version needs archived integrity: ${version.id}`)
      assert.equal(version.archiveSha256, origin.sha256, `Published archive identity changed: ${version.id}`)
    }
    else {
      assert.equal(version.kind, 'workspace-baseline')
      assert.equal(version.file, 'refactor/package-inventory.json', 'Workspace version must use the frozen inventory')
    }
  }
  for (const pkg of policy.packages) {
    assert.deepEqual(Object.keys(pkg.owners).sort(), families.map(family => family.id).sort(), `Missing contract owner: ${pkg.name}`)
    for (const owner of Object.values(pkg.owners)) {
      const task = tasks.find(task => task.id === owner)
      assert(task && (task.scope.includes(pkg.name) || task.scope.includes('workspace')), `Invalid contract responsibility: ${pkg.name}/${owner}`)
    }
    assert(pkg.versionIds.length && pkg.versionIds.every(id => policy.versions.some(version => version.id === id && version.package === pkg.name)), `Missing package version basis: ${pkg.name}`)
    assert.equal(pkg.supportWindow, 'not-inferred-from-baseline', 'A baseline must not become an invented supported version range')
    assert(pkg.scopeReview?.length, 'Contract applicability must remain explicit')
  }
  for (const item of policy.cases) {
    const pkg = policy.packages.find(pkg => pkg.name === item.package)
    assert(pkg && item.contracts.length && item.contracts.every(id => families.some(family => family.id === id)), 'Unknown case package/contract')
    assert(item.versionIds.length && item.versionIds.every(id => policy.versions.some(version => version.id === id && version.package === item.package)), 'Unknown test version basis')
    validateTest(directory, item)
  }
  const historical = tasks.flatMap(task => task.evidence.filter(file => /\.json$/.test(file)).map(file => ({ task: task.id, scope: task.scope, file: `refactor/${file}` })))
  for (const item of historical) localFile(directory, item.file)
  return { policy, families, tasks, historical }
}

export function evaluateRun(model, report, currentDigest) {
  assert.equal(report.schemaVersion, 1)
  assert.equal(report.command, 'yarn test:contracts')
  assert(/^[a-f\d]{40}$/.test(report.head) && report.environment?.node && report.environment?.platform, 'Run lacks candidate/environment provenance')
  assert.equal(report.candidate.digest, sha256(JSON.stringify(report.candidate.inputs)), 'Candidate input fingerprint mismatch')
  assert(report.candidate.inputs.length && report.candidate.inputs.every(input => /^[a-f\d]{64}$/.test(input.sha256)), 'Invalid candidate inputs')
  for (const input of report.candidate.inputs) repositoryPath(input.file)
  assert.equal(new Set(report.cases.map(item => item.id)).size, report.cases.length, 'Duplicate run case identity')
  assert(report.events.length && ['passed', 'failed'].includes(report.outcome), 'Run is missing test events/outcome')
  const summaries = report.events.filter(event => event.type === 'test:summary' && !event.file)
  assert.equal(summaries.length, 1, 'Run requires one process summary')
  assert.equal(report.outcome === 'passed', summaries[0].success === true, 'Run outcome contradicts process summary')
  if (report.outcome === 'passed')
    assert(!report.events.some(event => event.type === 'test:fail' && !event.todo), 'Passed run contains a failed test')
  return report.cases.map((item) => {
    const defined = model.policy.cases.find(candidate => candidate.id === item.id)
    assert(defined, `Unknown reported test ID: ${item.id}`)
    assert.equal(item.definition?.id, item.id, `Wrong recorded definition: ${item.id}`)
    assert.equal(item.definitionSha256, sha256(JSON.stringify(item.definition)), `Reported test definition fingerprint changed: ${item.id}`)
    assert.equal(item.definition.package, defined.package, `Stable test ID was reassigned to another package: ${item.id}`)
    const matches = report.events.filter(event => ['test:pass', 'test:fail'].includes(event.type) && event.file === item.definition.file && event.name === item.definition.title)
    assert.equal(matches.length, 1, `Missing or ambiguous executed test: ${item.id}`)
    const event = matches[0]
    const status = event.skip || event.todo ? 'skipped' : event.type === 'test:fail' ? 'failed' : 'passed'
    assert.equal(item.status, status, `Reported test outcome mismatch: ${item.id}`)
    return { id: item.id, package: item.definition.package, contracts: item.definition.contracts, versionIds: item.definition.versionIds, status, freshness: item.definitionSha256 !== sha256(JSON.stringify(defined)) ? 'historical-definition' : report.candidate.digest === currentDigest ? 'current-inputs' : 'historical-inputs', scope: item.definition.scope }
  })
}

export function contractStatus(directory, model) {
  const current = candidateInputs(directory, model)
  const registry = readJson(directory, 'refactor/contract-runs.json')
  assert.equal(registry.schemaVersion, 1)
  assert.equal(new Set(registry.runs.map(run => run.file)).size, registry.runs.length, 'Duplicate registered report')
  const observations = []
  for (const ref of registry.runs) {
    const bytes = fs.readFileSync(localFile(directory, ref.file))
    assert.equal(sha256(bytes.toString('utf8').replaceAll('\r\n', '\n')), ref.sha256LF, `Contract report changed: ${ref.file}`)
    const report = JSON.parse(bytes)
    observations.push({ file: ref.file, outcome: report.outcome, cases: evaluateRun(model, report, current.digest) })
  }
  const latest = 'refactor/.cache/ci/contracts-run.json'
  if (fs.existsSync(path.join(directory, latest))) {
    const report = readJson(directory, latest)
    observations.push({ file: latest, outcome: report.outcome, cases: evaluateRun(model, report, current.digest) })
  }
  const rows = model.policy.packages.flatMap(pkg => model.families.map((family) => {
    const cases = model.policy.cases.filter(item => item.package === pkg.name && item.contracts.includes(family.id))
    const results = observations.flatMap(run => run.cases.filter(item => item.package === pkg.name && item.contracts.includes(family.id)).map(item => ({ ...item, report: run.file, runOutcome: run.outcome })))
    return { package: pkg.name, contract: family.id, owner: pkg.owners[family.id], versionIds: pkg.versionIds, supportWindow: pkg.supportWindow, state: results.length ? 'partial-observations' : cases.length ? 'planned-not-observed' : 'tests-not-indexed', cases: cases.map(item => item.id), observations: results, remaining: 'Family-wide acceptance, version combinations and environment scope are not implied by individual test observations' }
  }))
  return { schemaVersion: 1, candidateDigest: current.digest, rows, observations, historicalRecords: model.historical.map(item => ({ ...item, state: 'recorded-not-normalized' })), limitation: 'Index status is not package compatibility or npm release approval' }
}

export function renderContracts(model) {
  const lines = ['# 公开契约覆盖索引', '', '> 由 contract-policy.json 生成；`yarn check:contracts --write` 更新。动态候选/报告状态见 `yarn check:contracts --report`。', '', '覆盖12类兼容契约与22包的验证归属；不是每个公开成员的穷尽测试证明。没有固定测试ID的行仍需逐成员补齐。', '版本均为精确冻结对照点，不能推导连续支持区间。历史报告保留原状态，只有精确用例和候选指纹对应时才列为观察结果。', '', '| 包 | 契约 | 责任任务 | 固定测试ID |', '| --- | --- | --- | --- |']
  for (const pkg of model.policy.packages) {
    for (const family of model.families) {
      const cases = model.policy.cases.filter(item => item.package === pkg.name && item.contracts.includes(family.id))
      lines.push(`| ${pkg.name} | ${family.id} ${family.name} | ${pkg.owners[family.id]} | ${cases.map(item => item.id).join(', ') || '待索引；不代表没有历史测试'} |`)
    }
  }
  lines.push('', '## 精确测试及限制', '')
  for (const item of model.policy.cases)
    lines.push(`- ${item.id}: [${item.file}](../${item.file}) — ${item.title}。${item.scope}。限制：${item.limitations}。命令：\`${item.command}\`。版本依据：${item.versionIds.join(', ')}。`)
  lines.push('', '## 版本依据', '')
  for (const version of model.policy.versions)
    lines.push(`- ${version.id}: ${version.package}@${version.version} (${version.kind})；[来源](../${version.file}) JSON pointer \`${version.pointer}\`。`)
  return `${lines.join('\n')}\n`
}

export const currentHead = directory => execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim()
