import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { readImpactModel, repositoryPath } from './impact-model.mjs'
import { dependencyClosure, evaluatePackage, findingPackages, validateLedger } from './release-ledger-model.mjs'
import { archiveFiles, hash, readMember } from './releases.mjs'

export const root = fileURLToPath(new URL('../../', import.meta.url))

export function localFile(directory, relative) {
  const normalized = repositoryPath(relative)
  const resolved = fs.realpathSync(path.resolve(directory, normalized))
  assert(resolved.startsWith(fs.realpathSync(directory) + path.sep), `File escapes repository: ${relative}`)
  assert(fs.statSync(resolved).isFile(), `Not a file: ${relative}`)
  return resolved
}

function read(directory, relative) {
  return JSON.parse(fs.readFileSync(localFile(directory, relative), 'utf8'))
}

export function checkedReport(directory, binding) {
  if (!binding)
    return null
  const errors = []
  try {
    const bytes = fs.readFileSync(localFile(directory, binding.path))
    assert.equal(hash(bytes), binding.sha256, 'Report bytes changed')
    const report = JSON.parse(bytes)
    assert.equal(report.schemaVersion, 1, 'Unsupported evidence schema')
    assert(Array.isArray(report.artifacts) && report.artifacts.length, 'No underlying result artifacts')
    for (const artifact of report.artifacts) {
      assert.equal(hash(fs.readFileSync(localFile(directory, artifact.path))), artifact.sha256, `Underlying evidence changed: ${artifact.path}`)
    }
    return { ...report, errors }
  }
  catch (error) {
    return { errors: [error.message] }
  }
}

export function checkedCandidate(directory, row) {
  const binding = row.candidate
  if (!binding)
    return null
  const result = { ...binding, errors: [] }
  try {
    assert(/^[a-f\d]{40}$/.test(binding.sourceCommit), 'Missing candidate source commit')
    execFileSync('git', ['cat-file', '-e', `${binding.sourceCommit}^{commit}`], { cwd: directory, stdio: 'pipe' })
    const artifact = localFile(directory, binding.path)
    const bytes = fs.readFileSync(artifact)
    assert.equal(`sha512-${hash(bytes, 'sha512', 'base64')}`, binding.integrity, 'Candidate integrity mismatch')
    if (row.distribution === 'site') {
      assert.equal(binding.kind, 'site-manifest', 'Site requires a build-file manifest, not an inferred npm tarball')
      const manifest = JSON.parse(bytes)
      assert.equal(manifest.package, row.name)
      assert.equal(manifest.version, binding.version)
      assert(Array.isArray(manifest.files) && manifest.files.length, 'Empty site output')
      assert.equal(new Set(manifest.files.map(file => file.path)).size, manifest.files.length, 'Duplicate site outputs')
      const outputRoot = fs.realpathSync(path.resolve(directory, repositoryPath(manifest.outputRoot)))
      assert(outputRoot.startsWith(fs.realpathSync(directory) + path.sep), 'Site output escapes repository')
      const walk = folder => fs.readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
        assert(!entry.isSymbolicLink(), 'Site output contains a redirected file')
        const child = path.join(folder, entry.name)
        return entry.isDirectory() ? walk(child) : [path.relative(directory, child).replaceAll('\\', '/')]
      })
      assert.deepEqual(walk(outputRoot).sort(), manifest.files.map(file => repositoryPath(file.path)).sort(), 'Site output inventory differs')
      for (const file of manifest.files)
        assert.equal(hash(fs.readFileSync(localFile(directory, file.path))), file.sha256, `Site build changed: ${file.path}`)
    }
    else {
      assert.equal(binding.kind, 'npm-tarball')
      archiveFiles(artifact)
      const manifest = JSON.parse(readMember(artifact, 'package/package.json'))
      assert.equal(manifest.name, row.name, 'Tarball package name mismatch')
      assert.equal(manifest.version, binding.version, 'Tarball version mismatch')
    }
  }
  catch (error) {
    result.errors.push(error.message)
  }
  return result
}

function historyFor(directory, row) {
  const data = read(directory, row.history.file)
  const selected = row.history.selector?.split('.').reduce((object, key) => object?.[key], data)
  if (row.distribution === 'site')
    return { verified: true, kind: 'site-only', file: row.history.file, rationale: row.history.rationale, npmPublication: false }
  if (!selected?.integrity || !selected?.tarball || !selected?.sha256)
    return { verified: false, reason: 'Historical archive unavailable; recovered content is not a complete rollback tarball', file: row.history.file }
  const expectedName = row.history.publishedName || row.name
  assert.equal(selected.name, expectedName, `Wrong historical package: ${row.name}`)
  return { verified: true, kind: row.distribution, file: row.history.file, name: selected.name, version: selected.version, integrity: selected.integrity, sha256: selected.sha256, tarball: selected.tarball, rationale: row.history.rationale, limitation: 'Frozen historical distribution mapping; not a fresh registry/version-availability check or rollback rehearsal' }
}

export function fingerprintInputs(directory, files, dependencies, site) {
  const selected = files.filter(file => dependencies.some(name => file.startsWith(`packages/${name}/`))
    || /^(?:scripts\/|types\/|test\/|\.github\/workflows\/)/.test(file)
    || /^(?:package\.json|yarn\.lock|\.node-version|\.gitattributes|\.yarnrc|\.npmrc|tsconfig[^/]*\.json|playwright[^/]*\.js|eslint\.config\.js|lerna\.json)$/.test(file)
    || /^refactor\/(?:third-party\.json|scripts\/release-ledger[^/]*\.mjs)$/.test(file)
    || /^refactor\/(?:compatibility\.md|quality-contract\.md|environment-matrix\.md|release-reviews\.md|version-policy\.md|package-inventory\.json|impact-policy\.json)$/.test(file)
    || /^refactor\/baselines\/(?:releases|.*-release|.*-sdk(?:-matrix)?|.*-core)\.json$/.test(file)
    || (site && /^(?:docs\/|example\/)/.test(file)))
  return selected.sort().map((file) => {
    const bytes = fs.readFileSync(localFile(directory, file))
    const basename = path.basename(file)
    const text = /\.(?:[cm]?[jt]sx?|vue|json|md|txt|html|css|less|svg|ya?ml|lock)$/.test(file)
      || ['.node-version', '.npmignore', '.gitignore', '.yarnrc', '.npmrc', '.gitattributes'].includes(basename)
      || /^(?:LICENSE|NOTICE|README)(?:\..*)?$/i.test(basename)
    return { path: file, algorithm: text ? 'sha256-lf' : 'sha256', sha256: hash(text ? bytes.toString('utf8').replaceAll('\r\n', '\n') : bytes), rawSha256: hash(bytes) }
  })
}

export function fingerprintOf(inputs) {
  return hash(JSON.stringify(inputs.map(({ path, algorithm, sha256 }) => ({ path, algorithm, sha256 }))))
}

export function buildLedger(directory = root, selectedNames) {
  const ledger = read(directory, 'refactor/release-ledger.json')
  const inventory = read(directory, 'refactor/package-inventory.json').packages
  const tasks = new Map(read(directory, 'refactor/tasks.json').tasks.map(task => [task.id, task]))
  validateLedger(ledger, inventory, tasks)
  const names = inventory.map(pkg => pkg.name)
  const selected = selectedNames || names
  assert(selected.length && new Set(selected).size === selected.length && selected.every(name => names.includes(name)), 'Unknown, empty or duplicate batch package selection')
  const model = readImpactModel(directory)
  const risks = read(directory, 'refactor/risks.json').items
  const thirdParty = read(directory, 'refactor/third-party.json')
  const assets = [...thirdParty.vendored, ...thirdParty.integrations]
  const files = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: directory, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).split('\0').filter(file => file && fs.existsSync(path.join(directory, file))))]
  const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim()
  const inputFiles = {}
  const rows = selected.map((name) => {
    const row = ledger.packages.find(pkg => pkg.name === name)
    const dependencies = dependencyClosure(name, names, model.edges, model.dynamicImports)
    const applies = item => findingPackages(item, tasks, names).some(pkg => dependencies.includes(pkg))
    const relevantRisks = risks.filter(applies)
    const relevantAssets = [
      ...assets.filter(applies),
      ...thirdParty.packages.filter(pkg => dependencies.includes(pkg.name)).flatMap(pkg => pkg.resolvedRuntimeDependencies.map(dependency => ({ id: `dependency:${pkg.name}:${dependency.name}`, sourceStatus: `Locked ${dependency.lockedVersion}; declared ${dependency.range}`, licenseStatus: dependency.licenseEvidence }))),
    ]
    const inputs = fingerprintInputs(directory, files, dependencies, row.distribution === 'site')
    Object.assign(inputFiles, Object.fromEntries(inputs.map(({ path, ...input }) => [path, input])))
    const fingerprint = fingerprintOf(inputs)
    const taskGaps = [...tasks.values()].filter(task => (ledger.sharedTasks.includes(task.id)
      || (task.scope.some(scope => dependencies.includes(scope)) && /^(?:PKG-|CORE-|SITE-|EX-)/.test(task.id))) && task.status !== 'done').map(task => task.id)
    const evidence = Object.fromEntries(Object.entries(row.evidence).map(([gate, binding]) => [gate, checkedReport(directory, binding)]))
    const result = evaluatePackage({
      row,
      fingerprint,
      version: read(directory, `packages/${name}/package.json`).version,
      candidate: checkedCandidate(directory, row),
      evidence,
      taskGaps,
      risks: relevantRisks.map(({ id, status, owners, evidence, compatibleResolution, closureCriteria }) => ({ id, status, owners, evidence, compatibleResolution, closureCriteria })),
      assets: relevantAssets.map(({ id, riskId, sourceStatus, licenseStatus, validationStatus, reviewEvidence }) => ({ id, riskId, sourceStatus, licenseStatus, validationStatus, reviewEvidence })),
      history: historyFor(directory, row),
    })
    return { ...result, dependencies, inputs: inputs.map(input => input.path), historicalTaskEvidence: [...tasks.values()].filter(task => task.scope.includes(name)).map(({ id, status, evidence }) => ({ id, status, evidence })), historicalEvidenceAcceptedForCandidate: false }
  })
  return {
    schemaVersion: 1,
    sourceCommit: head,
    toolchain: {
      node: process.version,
      canonicalNode: fs.readFileSync(localFile(directory, '.node-version'), 'utf8').trim(),
      packageManager: read(directory, 'package.json').packageManager,
      observedUserAgent: process.env.npm_config_user_agent || null,
      declaredTools: read(directory, 'package.json').devDependencies,
      lock: { path: 'yarn.lock', sha256: hash(fs.readFileSync(localFile(directory, 'yarn.lock'))) },
    },
    ledger: { path: 'refactor/release-ledger.json', sha256: hash(fs.readFileSync(localFile(directory, 'refactor/release-ledger.json'))) },
    inputFiles,
    packages: rows,
    evidenceComplete: rows.every(row => row.status === 'evidence-complete'),
    publicationAuthorized: false,
    limitation: 'Mechanical evidence binding and blocking report. Report contents still require the three reviews; this tool neither executes tests nor verifies devices nor authorizes publishing.',
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { values } = parseArgs({ options: { packages: { type: 'string' }, report: { type: 'boolean' }, strict: { type: 'boolean' } } })
  const result = buildLedger(root, values.packages?.split(','))
  if (values.strict) {
    assert.equal(process.version, `v${result.toolchain.canonicalNode}`, 'Strict release preflight requires canonical Node')
    assert(process.env.npm_config_user_agent?.startsWith('yarn/1.22.22 '), 'Strict release preflight requires Yarn Classic1.22.22')
  }
  if (values.report) {
    const directory = fs.mkdtempSync(path.join(root, 'refactor/.cache/release-ledger-'))
    fs.writeFileSync(path.join(directory, 'report.json'), `${JSON.stringify(result, null, 2)}\n`)
    console.log(`Release ledger report: ${directory}`)
  }
  console.log(JSON.stringify({ packages: result.packages.map(({ name, status, blockers }) => ({ name, status, blockers: blockers.length })), publicationAuthorized: false }))
  if (values.strict && !result.evidenceComplete)
    process.exitCode = 1
}
