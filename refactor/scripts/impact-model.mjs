import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import semver from 'semver'
import ts from 'typescript'
import YAML from 'yaml'

export function repositoryPath(file) {
  assert(typeof file === 'string' && file.length && !file.includes('\\') && !file.includes('\0') && !path.posix.isAbsolute(file) && !/^[A-Z]:/i.test(file), `Invalid repository path: ${file}`)
  const normalized = path.posix.normalize(file)
  assert(normalized !== '..' && !normalized.startsWith('../'), `Path escapes repository: ${file}`)
  return normalized
}

export function analyzeImpact(model, changedFiles) {
  const names = model.packages.map(pkg => pkg.name)
  const affected = new Set()
  const reasons = []
  const unknownPaths = []
  function include(name, reason) {
    if (!affected.has(name)) {
      affected.add(name)
      reasons.push({ package: name, ...reason })
    }
  }
  const files = [...new Set(changedFiles.map(repositoryPath))].sort()
  const all = (file, rule) => names.forEach(name => include(name, { file, rule }))
  for (const file of files) {
    if (file.startsWith('packages/')) {
      const owner = file.split('/')[1]
      assert(names.includes(owner), `Changed package is not mapped: ${owner}`)
      include(owner, { file, rule: 'package-owner' })
    }
    else if (model.policy.sharedFiles.includes(file) || model.policy.sharedPrefixes.some(prefix => file.startsWith(prefix))) {
      all(file, 'shared-engineering')
    }
    else {
      const generated = names.find(name => file.startsWith(`docs/uncompiled/${name}/`) || file === `docs/compiled/${name}.js` || file === `docs/compiled/${name}.legacy.js` || file === `docs/compiled/${name}.mjs`)
      const examples = model.policy.examples.filter(example => example.file === file)
      if (generated) {
        include(generated, { file, rule: 'generated-package-artifact' })
      }
      else if (examples.length) {
        examples.forEach(example => include(example.owner, { file, rule: 'mapped-example' }))
      }
      else {
        unknownPaths.push(file)
        all(file, 'unclassified-conservative-fallback')
      }
    }
  }
  if (files.length && model.dynamicImports.length)
    all(model.dynamicImports[0], 'unresolved-dynamic-import-conservative-fallback')
  let previousSize = -1
  while (affected.size !== previousSize) {
    previousSize = affected.size
    for (const edge of model.edges) {
      if (affected.has(edge.dependency))
        include(edge.consumer, { rule: edge.kind, via: edge.dependency, evidence: edge.evidence, explanation: edge.reason })
    }
  }
  const affectedPackages = [...affected].sort()
  return {
    files,
    affectedPackages,
    reasons,
    unknownPaths,
    reviewRequired: Boolean(unknownPaths.length || model.dynamicImports.length),
    requiredChecks: model.policy.gates,
    requiredCIJobs: [...new Set(model.policy.gates.map(gate => gate.job))].sort(),
    installedConsumerGaps: affectedPackages.filter(name => name !== model.policy.site && !model.policy.installedConsumerPackages.includes(name)),
    limitation: 'CI gates remain unconditional. This dependency report selects no tests for omission and certifies neither missing package suites nor device/vendor acceptance.',
  }
}

function importsIn(file, text) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
  assert.equal(source.parseDiagnostics.length, 0, `Cannot reliably scan malformed dependency source: ${file}`)
  const imports = []
  const dynamic = []
  const add = (node) => {
    if (node && ts.isStringLiteralLike(node))
      imports.push(node.text)
    else
      dynamic.push(file)
  }
  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier)
        add(node.moduleSpecifier)
    }
    else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      add(node.argument.literal)
    }
    else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) {
      add(node.arguments[0])
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return { imports, dynamic }
}

export function readImpactModel(directory) {
  const read = file => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'))
  const policy = read('refactor/impact-policy.json')
  assert.equal(policy.schemaVersion, 1)
  const gateCommands = policy.gates.map(gate => gate.command)
  assert.equal(new Set(gateCommands).size, gateCommands.length, 'Duplicate impact gate')
  for (const command of ['yarn ci:check', 'yarn ci:build', 'yarn test:package', 'yarn test:browser', 'yarn test:coverage', 'yarn test:performance'])
    assert(gateCommands.includes(command), `Missing mandatory ecosystem gate: ${command}`)
  const names = policy.packages.map(pkg => pkg.name).sort()
  assert.equal(new Set(names).size, names.length, 'Duplicate mapped package')
  const actual = fs.readdirSync(path.join(directory, 'packages')).filter(name => fs.existsSync(path.join(directory, 'packages', name, 'package.json'))).sort()
  assert.deepEqual(actual, names, 'Workspace package inventory changed; update impact ownership explicitly')
  assert(names.includes(policy.core) && names.includes(policy.site), 'Missing core/site mapping')
  assert.deepEqual([...policy.coreValidationConsumers].sort(), names.filter(name => name !== policy.core), 'Core changes must trigger every ecosystem validation consumer')
  const packages = names.map((name) => {
    const manifest = read(`packages/${name}/package.json`)
    assert.equal(manifest.name, name, 'Package directory and manifest name disagree')
    return { name, version: manifest.version, manifest }
  })
  const edges = []
  const dynamicImports = []
  const exists = (file) => {
    repositoryPath(file)
    assert(fs.existsSync(path.join(directory, file)), `Impact evidence is missing: ${file}`)
  }
  const edge = (dependency, consumer, kind, evidence, reason) => {
    assert(names.includes(dependency) && names.includes(consumer), 'Unknown dependency or consumer in impact graph')
    evidence.forEach(exists)
    if (dependency !== consumer)
      edges.push({ dependency, consumer, kind, evidence, reason })
  }
  for (const consumer of policy.coreValidationConsumers)
    edge(policy.core, consumer, 'core-validation-contract', [policy.coreEvidence], 'Core API/DOM/type and media contracts require ecosystem validation, even without manifest dependencies')
  for (const name of names.filter(name => name !== policy.site))
    edge(name, policy.site, 'site-consumer-contract', [policy.siteEvidence], 'Library examples, generated declarations and docs consume the package')
  for (const item of policy.edges)
    edge(item.dependency, item.consumer, 'explicit-integration-contract', item.evidence, item.reason)
  for (const example of policy.examples) {
    assert(names.includes(example.owner), 'Example owner is not mapped')
    exists(example.file)
  }
  for (const pkg of packages) {
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const [declaredName, value] of Object.entries(pkg.manifest[field] || {})) {
        assert.equal(typeof value, 'string', `Invalid dependency declaration: ${pkg.name}/${declaredName}`)
        const alias = /^npm:(.+)@([^@]+)$/.exec(value)
        const name = alias?.[1] || declaredName
        const range = alias?.[2] || value
        if (!names.includes(name)) {
          assert(!/^artplayer(?:-|$)/.test(name), `Unknown workspace dependency: ${name}`)
          continue
        }
        const target = packages.find(candidate => candidate.name === name)
        assert(semver.validRange(range) && semver.satisfies(target.version, range), `Workspace dependency range mismatch: ${pkg.name} ${field} ${name}@${range}, current ${target.version}`)
        edge(name, pkg.name, `manifest-${field}`, [`packages/${pkg.name}/package.json`], `${declaredName}@${value}`)
      }
    }
    const walk = (relative) => {
      const absolute = path.join(directory, relative)
      if (!fs.existsSync(absolute))
        return
      for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
        const file = `${relative}/${entry.name}`
        assert(!entry.isSymbolicLink(), `Review redirected source before dependency scanning: ${file}`)
        if (entry.isDirectory()) {
          walk(file)
        }
        else if (/\.[cm]?[jt]sx?$/.test(file)) {
          const found = importsIn(file, fs.readFileSync(path.join(directory, file), 'utf8'))
          dynamicImports.push(...found.dynamic)
          for (const specifier of found.imports) {
            const resolved = specifier.startsWith('.') ? path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier)) : specifier
            const dependency = names.find(name => resolved === name || resolved.startsWith(`${name}/`) || resolved.startsWith(`packages/${name}/`))
            if (dependency)
              edge(dependency, pkg.name, 'static-source-import', [file], specifier)
            else
              assert(!/^artplayer(?:-|$)/.test(specifier), `Unknown workspace import ${specifier} in ${file}`)
          }
        }
      }
    }
    for (const folder of ['src', 'types', 'public']) walk(`packages/${pkg.name}/${folder}`)
  }
  const scripts = read('package.json').scripts
  for (const gate of policy.gates) {
    assert(/^yarn [a-z][\w:-]*$/.test(gate.command), 'Impact gates require an explicit repository script')
    assert(Object.hasOwn(scripts, gate.command.slice(5)), `Missing required command: ${gate.command}`)
  }
  const consumerSource = ts.createSourceFile('package-consumer.mjs', fs.readFileSync(path.join(directory, 'scripts/package-consumer.mjs'), 'utf8'), ts.ScriptTarget.Latest, true)
  const consumerNames = consumerSource.statements.filter(ts.isVariableStatement).flatMap(statement => [...statement.declarationList.declarations]).filter(node => ts.isIdentifier(node.name) && node.name.text === 'names')
  assert(consumerNames.length === 1 && consumerNames[0].initializer && ts.isArrayLiteralExpression(consumerNames[0].initializer), 'Review changed installed consumer scope extraction')
  const installed = consumerNames[0].initializer.elements.map((element) => {
    assert(ts.isStringLiteralLike(element), 'Installed consumer scope must be statically reviewable')
    return element.text
  })
  assert.deepEqual(installed.sort(), [...policy.installedConsumerPackages].sort(), 'Installed consumer coverage changed; update its reported scope')
  const coveragePackages = read('scripts/coverage-policy.json').packages
  assert(coveragePackages.every(name => names.includes(name)), 'Unknown coverage package')
  return { policy, packages, edges, dynamicImports: [...new Set(dynamicImports)].sort(), coveragePackages }
}

export function validateImpactWorkflow(text, model) {
  const workflow = YAML.parse(text, { uniqueKeys: true })
  assert(workflow.on && Object.hasOwn(workflow.on, 'pull_request') && Object.hasOwn(workflow.on, 'push'), 'Impact checks require both pull_request and push triggers')
  for (const event of ['pull_request', 'push']) {
    const config = workflow.on[event]
    assert(!config?.paths && !config?.['paths-ignore'], 'Path filters may skip required ecosystem gates')
  }
  for (const gate of model.policy.gates) {
    const job = workflow.jobs?.[gate.job]
    assert(job && !Object.hasOwn(job, 'if') && !job['continue-on-error'], `Required impact job must not be conditional or allowed to fail: ${gate.job}`)
    const steps = job.steps || []
    const command = gate.command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    assert(steps.some((step) => {
      if (Object.hasOwn(step, 'if') || step['continue-on-error'] || typeof step.run !== 'string')
        return false
      const shell = step.shell || job.defaults?.run?.shell || workflow.defaults?.run?.shell
      const defaultBash = !shell && /^(?:ubuntu|macos)-/.test(job['runs-on'])
      if (shell !== 'bash' && !defaultBash)
        return false
      const first = step.run.split(/\r?\n/).map(line => line.trim()).find(line => line && !line.startsWith('#'))
      return first === gate.command || (shell === 'bash' && new RegExp(`^${command} 2>&1 \\| tee refactor/\\.cache/ci/[a-z-]+\\.log$`).test(first))
    }), `Required unconditional command missing from ${gate.job}: ${gate.command}`)
    assert(steps.some(step => step.uses?.startsWith('actions/checkout@') && !Object.hasOwn(step, 'if') && !step['continue-on-error'] && step.with?.['fetch-depth'] === 0), `Impact and compatibility checks require full history: ${gate.job}`)
  }
}
