import assert from 'node:assert/strict'

export const libraryGates = ['build', 'runtime', 'types', 'combinations', 'browser', 'devices', 'licenses', 'rollback', 'remote-ci', 'review-01', 'review-02', 'review-03']
export const siteGates = ['build', 'site-urls', 'site-assets', 'editor', 'devices', 'licenses', 'rollback', 'remote-ci', 'review-01', 'review-02', 'review-03']
export const sharedTasks = ['CI-01', 'CI-03', 'CI-04', 'REL-01', 'REL-09', 'REL-02', 'REL-03', 'REL-04', 'REVIEW-01', 'REVIEW-02', 'REVIEW-03']

export function dependencyClosure(name, names, edges, dynamicImports = []) {
  if (dynamicImports.length)
    return [...names].sort()
  const dependencies = new Set([name])
  let count = -1
  while (count !== dependencies.size) {
    count = dependencies.size
    for (const edge of edges) {
      if (dependencies.has(edge.consumer))
        dependencies.add(edge.dependency)
    }
  }
  return [...dependencies].sort()
}

export function findingPackages(item, tasks, names) {
  const explicit = new Set(item.owners.flatMap(id => tasks.get(id)?.scope || []).filter(scope => names.includes(scope)))
  // A generic review owner must not turn a package-specific finding into a global one.
  return explicit.size ? [...explicit] : [...names]
}

export function validateLedger(ledger, inventory, tasks) {
  assert.equal(ledger.schemaVersion, 1)
  const expected = inventory.map(pkg => pkg.name).sort()
  assert.deepEqual(ledger.packages.map(pkg => pkg.name).sort(), expected, 'Ledger must cover exactly every workspace package once')
  assert.deepEqual(ledger.libraryGates, libraryGates, 'Missing mandatory library gate')
  assert.deepEqual(ledger.siteGates, siteGates, 'Missing mandatory site gate')
  assert.deepEqual(ledger.sharedTasks, sharedTasks, 'Missing mandatory shared release/review task')
  for (const row of ledger.packages) {
    const initial = inventory.find(pkg => pkg.name === row.name)
    assert.equal(row.targetVersion, `${Number(initial.version.split('.')[0]) + 1}.0.0`, `Unexpected next major: ${row.name}`)
    assert(['npm', 'renamed-npm', 'recovered-npm', 'site'].includes(row.distribution), `Unknown distribution: ${row.name}`)
    assert.equal(row.distribution === 'site', initial.kind === 'docs', 'A site must not become a new npm publication implicitly')
    assert(row.history?.file && row.history.rationale, `Missing distribution basis: ${row.name}`)
    assert(row.rollback?.basis && row.rollback.strategy, `Missing rollback mapping: ${row.name}`)
    assert(Array.isArray(row.extraRequirements) && row.extraRequirements.length, `Missing capability requirements: ${row.name}`)
    assert(row.extraRequirements.every(item => typeof item === 'string' && item.trim()), 'Invalid capability requirement')
    assert(new Set(row.extraRequirements).size === row.extraRequirements.length, 'Duplicate requirement')
    assert(row.evidence && !Array.isArray(row.evidence) && typeof row.evidence === 'object')
    assert(Object.keys(row.evidence).every(gate => (row.distribution === 'site' ? siteGates : libraryGates).includes(gate)), 'Unknown evidence gate')
    assert(row.candidate === null || typeof row.candidate === 'object', 'Invalid candidate')
  }
  for (const id of ledger.sharedTasks)
    assert(tasks.has(id), `Unknown release task: ${id}`)
}

export function evaluatePackage({ row, fingerprint, version, candidate, evidence, taskGaps, risks, assets, history }) {
  const gates = row.distribution === 'site' ? siteGates : libraryGates
  const blockers = []
  const add = (kind, detail) => blockers.push({ kind, detail })
  if (version !== row.targetVersion)
    add('version', `${version} must be prepared as ${row.targetVersion} before final candidate validation`)
  if (!history.verified)
    add('distribution-history', history.reason)
  if (!candidate) {
    add('candidate', 'No candidate artifact is bound')
  }
  else {
    for (const error of candidate.errors)
      add('candidate', error)
    if (candidate.inputFingerprint !== fingerprint)
      add('stale-candidate', 'Source, dependencies, tooling or test inputs changed')
    if (candidate.version !== version)
      add('candidate-version', 'Artifact version differs from current manifest')
  }
  for (const id of taskGaps) add('task', id)
  for (const risk of risks.filter(risk => risk.status === 'open')) add('risk', risk.id)
  const checks = {}
  for (const gate of gates) {
    const report = evidence[gate]
    const errors = []
    if (!report) {
      errors.push('Missing candidate-bound evidence')
    }
    else {
      errors.push(...report.errors)
      if (report.result !== 'pass')
        errors.push(`Result is ${report.result}`)
      if (report.package !== row.name || report.gate !== gate)
        errors.push('Package/gate scope mismatch')
      if (report.version !== version)
        errors.push('Evidence version mismatch')
      if (!candidate || report.candidateIntegrity !== candidate.integrity)
        errors.push('Candidate integrity mismatch')
      if (report.inputFingerprint !== fingerprint)
        errors.push('Evidence input fingerprint is stale')
      if (!report.checks?.length || report.checks.some(check => check.result !== 'pass'))
        errors.push('Required checks contain missing, failed, skipped or unknown results')
      if (!report.environment?.length || !report.command || !report.reviewedBy)
        errors.push('Missing environment, command or review attribution')
      if (gate === 'devices' && report.environment?.some(env => env.emulated !== false || !env.device || !env.os || !env.browser))
        errors.push('Device evidence must explicitly identify real devices, OS and browser')
      if (gate === 'devices' && report.checks?.some(check => check.mode !== 'native'))
        errors.push('Device/capability checks cannot use mocks or emulation')
      if (gate === 'remote-ci' && !report.environment?.some(env => env.remote === true && /^https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/runs\/\d+$/.test(env.runUrl)))
        errors.push('Remote CI evidence needs an actual GitHub Actions run reference')
      const required = gate === 'devices' ? row.extraRequirements : gate === 'licenses' ? assets.map(asset => asset.id) : []
      const covered = new Set(report.checks?.filter(check => check.result === 'pass').map(check => check.id))
      for (const requirement of required) {
        if (!covered.has(requirement))
          errors.push(`Missing coverage: ${requirement}`)
      }
    }
    checks[gate] = errors.length ? { status: 'blocked', errors } : { status: 'evidence-recorded' }
    for (const error of errors) add(`evidence:${gate}`, error)
  }
  return { name: row.name, version, targetVersion: row.targetVersion, distribution: row.distribution, fingerprint, candidate, history, rollback: row.rollback, risks, assets, checks, blockers, status: blockers.length ? 'blocked' : 'evidence-complete', publicationAuthorized: false }
}
