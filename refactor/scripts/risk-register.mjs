import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import lockfile from '@yarnpkg/lockfile'
import { hash, refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
const read = name => JSON.parse(fs.readFileSync(path.join(refactorDir, name), 'utf8'))
export function referencedFindings() {
  const files = ['baselines/lifecycle-coverage.md', 'baselines/dom-coverage.md', 'baselines/consumer-coverage.md', 'baselines/performance-coverage.md']
  return [...new Set(files.flatMap(name => fs.readFileSync(path.join(refactorDir, name), 'utf8').match(/BASE-(?:LIFE|DOM|DEMO|TYPE|DIST|PERF)-\d{2}/g) || []))].sort()
}
function evidenceExists(name) {
  const absolute = path.resolve(root, name)
  assert(absolute.startsWith(root + path.sep) && fs.existsSync(absolute), `Missing or invalid evidence: ${name}`)
}
export function validateRisks(register) {
  const tasks = new Set(read('tasks.json').tasks.map(task => task.id))
  const ids = new Set(register.items.map(item => item.id))
  assert.equal(ids.size, register.items.length, 'Duplicate risk ID')
  for (const id of referencedFindings()) assert(ids.has(id), `Unregistered baseline finding: ${id}`)
  for (const item of register.items) {
    assert(['reproduced', 'source-observed', 'unverified'].includes(item.confirmation))
    assert(['open', 'resolved', 'accepted-with-scope'].includes(item.status))
    assert(item.owners.length && item.owners.every(id => tasks.has(id)), `Unowned risk: ${item.id}`)
    assert(item.evidence.length && item.compatibleResolution && item.closureCriteria, `Incomplete risk: ${item.id}`)
    item.evidence.forEach(evidenceExists)
    if (item.status !== 'open') {
      assert(item.resolutionEvidence?.length && item.resolutionRationale, `Premature closure: ${item.id}`)
      item.resolutionEvidence.forEach(evidenceExists)
    }
  }
}
export function assetFingerprints(inputs) {
  const walk = name => {
    const absolute = path.resolve(root, name)
    evidenceExists(name)
    return fs.statSync(absolute).isDirectory() ? fs.readdirSync(absolute).flatMap(child => walk(`${name}/${child}`)) : [name]
  }
  return inputs.flatMap(walk).sort().map(name => {
    const bytes = fs.readFileSync(path.join(root, name))
    const text = /\.(?:[cm]?[jt]s|css|less|json|html|svg|txt|md)$/.test(name)
    return { path: name, algorithm: text ? 'sha256-lf' : 'sha256', sha256: hash(text ? bytes.toString('utf8').replaceAll('\r\n', '\n') : bytes) }
  })
}
export function validateThirdParty(inventory, register) {
  const tasks = new Set(read('tasks.json').tasks.map(task => task.id))
  const risks = new Set(register.items.map(item => item.id))
  const initial = read('package-inventory.json').packages.map(pkg => pkg.name).sort()
  assert.deepEqual(inventory.packages.map(pkg => pkg.name).sort(), initial, 'External dependency package coverage missing')
  const lock = lockfile.parse(fs.readFileSync(path.join(root, 'yarn.lock'), 'utf8')).object
  for (const pkg of inventory.packages) {
    const current = JSON.parse(fs.readFileSync(path.join(root, 'packages', pkg.name, 'package.json'), 'utf8'))
    assert.deepEqual(pkg.declaredRuntimeDependencies, current.dependencies || {}, `Update dependency inventory: ${pkg.name}`)
    assert.deepEqual(pkg.developmentDependencies, current.devDependencies || {}, `Update development dependency inventory: ${pkg.name}`)
    assert.deepEqual(pkg.resolvedRuntimeDependencies.map(dependency => dependency.name).sort(), Object.keys(current.dependencies || {}).sort(), 'Missing resolved dependency')
    for (const dependency of pkg.resolvedRuntimeDependencies) {
      assert.equal(dependency.range, current.dependencies[dependency.name], 'Dependency range changed')
      const installed = JSON.parse(fs.readFileSync(path.join(root, 'node_modules', dependency.name, 'package.json'), 'utf8'))
      assert.equal(dependency.lockedVersion, lock[`${dependency.name}@${dependency.range}`]?.version, 'Dependency lock changed; update provenance')
      assert.equal(dependency.installedVersion, installed.version, 'Installed dependency changed')
      assert.equal(dependency.manifestLicense, installed.license || null, 'Dependency license metadata changed')
    }
  }
  assert.deepEqual(inventory.vendored.map(vendor => vendor.riskId).sort(), [...risks].filter(id => id.startsWith('VENDOR-')).sort(), 'Missing vendored group')
  assert.deepEqual(inventory.integrations.map(sdk => sdk.riskId).sort(), [...risks].filter(id => id.startsWith('SDK-')).sort(), 'Missing SDK integration')
  for (const vendor of inventory.vendored) {
    assert(risks.has(vendor.riskId) && vendor.owners.length && vendor.owners.every(id => tasks.has(id)))
    assert(vendor.sourceStatus && vendor.licenseStatus && vendor.updatePolicy)
    assert.deepEqual(assetFingerprints(vendor.inputs), vendor.fingerprints, `Vendored files changed without reviewed provenance: ${vendor.id}`)
  }
  for (const sdk of inventory.integrations) {
    assert(risks.has(sdk.riskId) && sdk.owners.length && sdk.owners.every(id => tasks.has(id)))
    assert(sdk.sourceFiles.length && sdk.validationStatus && sdk.contract)
    sdk.sourceFiles.forEach(evidenceExists)
  }
}
export function renderRisks(register) {
  const labels = { reproduced: '已复现', 'source-observed': '源码/产物事实', unverified: '待取证' }
  const escape = text => text.replaceAll('|', '\\|').replaceAll('\n', ' ')
  return `# 重构风险与差异索引\n\n由 risks.json 生成；运行 node refactor/scripts/risk-register.mjs --write 更新。状态 open 表示尚缺关闭证据，不等于每项都是已复现缺陷。处理方案、关闭条件与证据见 [机器台账](risks.json)，来源与范围见 [维护说明](risk-guide.md)。\n\n| ID | 状态 / 证据等级 | 条目 | 后续任务 |\n| --- | --- | --- | --- |\n${register.items.map(item => `| ${item.id} | ${item.status} / ${labels[item.confirmation]} | ${escape(item.title)} | ${item.owners.join(', ')} |`).join('\n')}\n`
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert(process.argv.slice(2).every(arg => ['--check', '--write'].includes(arg)), 'Use --check or --write')
  const register = read('risks.json')
  const inventory = read('third-party.json')
  validateRisks(register)
  validateThirdParty(inventory, register)
  const rendered = renderRisks(register)
  if (process.argv.includes('--write')) fs.writeFileSync(path.join(refactorDir, 'risk-table.md'), rendered)
  else assert.equal(fs.readFileSync(path.join(refactorDir, 'risk-table.md'), 'utf8').replaceAll('\r\n', '\n'), rendered, 'Regenerate risk-table.md')
  console.log(`Risk register checked: ${register.items.length} items, ${inventory.vendored.length} vendored groups, ${inventory.integrations.length} integrations; no unresolved item is waived`)
}
