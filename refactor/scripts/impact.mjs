import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { analyzeImpact, readImpactModel, validateImpactWorkflow } from './impact-model.mjs'
import { hash } from './releases.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))

export function changedFiles(directory, options = {}) {
  const git = args => execFileSync('git', args, { cwd: directory, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }).trimEnd()
  const head = git(['rev-parse', 'HEAD'])
  const split = text => text.split('\0').filter(Boolean)
  const local = [...split(git(['diff', '--name-only', '--no-renames', '-z', 'HEAD', '--'])), ...split(git(['ls-files', '--others', '--exclude-standard', '-z']))]
  let requested = options.base
  let origin = requested ? 'explicit-base' : 'worktree'
  if (!requested && options.eventName) {
    const event = options.eventPath ? JSON.parse(fs.readFileSync(options.eventPath, 'utf8')) : {}
    requested = options.eventName === 'pull_request' ? event.pull_request?.base?.sha : options.eventName === 'push' ? event.before : null
    if (requested && /^0+$/.test(requested))
      requested = null
    if (requested)
      assert(/^[a-f\d]{40}$/.test(requested), 'Invalid GitHub event base SHA')
    origin = requested ? `github-${options.eventName}` : 'full-repository-event-fallback'
  }
  let base = null
  let mergeBase = null
  let committed = []
  if (requested) {
    try {
      base = git(['rev-parse', '--verify', '--end-of-options', `${requested}^{commit}`])
      mergeBase = git(['merge-base', base, head])
    }
    catch (error) {
      if (options.base)
        throw error
      origin = 'full-repository-missing-event-base'
    }
    if (mergeBase)
      committed = split(git(['diff', '--name-only', '--no-renames', '-z', mergeBase, head, '--']))
  }
  if (origin.startsWith('full-repository-'))
    committed = split(git(['ls-files', '-z']))
  return { head, requestedBase: requested || null, base, mergeBase, origin, worktreeChanged: local.length > 0, files: [...new Set([...committed, ...local])].sort() }
}

export function createImpactReport(directory = root, options = {}) {
  const model = readImpactModel(directory)
  validateImpactWorkflow(fs.readFileSync(path.join(directory, '.github/workflows/nodejs.yml'), 'utf8'), model)
  const range = changedFiles(directory, options)
  const impact = analyzeImpact(model, range.files)
  const metadata = ['refactor/impact-policy.json', 'package.json', 'yarn.lock', ...model.packages.map(pkg => `packages/${pkg.name}/package.json`)]
  const inputs = [...new Set([...metadata, ...range.files])].map((file) => {
    const absolute = path.join(directory, file)
    if (!fs.existsSync(absolute))
      return { file, state: 'deleted-or-missing' }
    if (fs.lstatSync(absolute).isSymbolicLink())
      return { file, state: 'symlink', sha256: hash(fs.readlinkSync(absolute)) }
    return { file, state: 'file', sha256: hash(fs.readFileSync(absolute)) }
  })
  return {
    schemaVersion: 1,
    range,
    ...impact,
    packages: model.packages.map(pkg => ({ name: pkg.name, version: pkg.version })),
    edges: model.edges,
    unresolvedDynamicImports: model.dynamicImports,
    coveragePackages: model.coveragePackages,
    installedConsumerPackages: model.policy.installedConsumerPackages,
    inputs,
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let base
  let report = false
  const args = process.argv.slice(2)
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--report') {
      report = true
    }
    else if (args[index] === '--base') {
      base = args[++index]
      assert(base && !base.startsWith('--'), 'Missing --base commit/ref')
    }
    else {
      assert.fail('Use --report and/or --base <commit/ref>')
    }
  }
  const result = createImpactReport(root, { base, eventName: process.env.GITHUB_EVENT_NAME, eventPath: process.env.GITHUB_EVENT_PATH })
  if (report) {
    const directory = path.join(root, 'refactor/.cache/ci')
    fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(path.join(directory, 'impact.json'), `${JSON.stringify(result, null, 2)}\n`)
  }
  console.log(`Impact: ${result.files.length} changed paths, ${result.affectedPackages.length}/${result.packages.length} packages; ${result.range.origin}; required jobs ${result.requiredCIJobs.join(', ')}`)
  if (result.reviewRequired)
    console.warn(`Impact review: ${result.unknownPaths.length} unclassified paths and ${result.unresolvedDynamicImports.length} dynamic-import files conservatively require the full ecosystem`)
  console.log(`Installed-consumer gaps among affected packages: ${result.installedConsumerGaps.length}; impact mapping is not release acceptance`)
}
