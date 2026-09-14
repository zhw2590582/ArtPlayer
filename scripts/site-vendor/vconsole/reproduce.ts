import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

interface Module {
  name?: string
  nameForCondition?: string
  moduleType?: string
  filteredChildren?: number
  modules?: Module[]
}
interface Stats {
  hasErrors: () => boolean
  toJson: (options: Record<string, unknown>) => { modules: Module[], errors: unknown[], warnings: unknown[] }
}
interface Provenance {
  upstream: { bundleSha256: string }
  reconstruction: { sources: { path: string, sha256: string }[] }
  dependencies: { name: string, version: string, runtimeResources: string[] }[]
}

const repository = fileURLToPath(new URL('../../../', import.meta.url))
const cache = fs.realpathSync(path.join(repository, 'refactor/.cache'))
assert.equal(process.argv.length, 3, 'Pass a prepared upstream checkout inside refactor/.cache')
const checkout = fs.realpathSync(process.argv[2]!)
assert(checkout.startsWith(`${cache}${path.sep}`), 'Reconstruction must stay inside the ignored cache')
const provenance: Provenance = JSON.parse(fs.readFileSync(path.join(repository, 'refactor/baselines/vconsole-notices-provenance.json'), 'utf8'))
const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex')
for (const source of provenance.reconstruction.sources) {
  const filename = fs.realpathSync(path.join(checkout, source.path))
  assert(filename.startsWith(`${checkout}${path.sep}`), 'Source must stay in the prepared checkout')
  assert.equal(hash(fs.readFileSync(filename)), source.sha256, `Frozen source changed: ${source.path}`)
}
for (const dependency of provenance.dependencies) {
  const manifest = JSON.parse(fs.readFileSync(path.join(checkout, 'node_modules', dependency.name, 'package.json'), 'utf8'))
  assert.equal(manifest.version, dependency.version, `Installed version changed: ${dependency.name}`)
}

// The verified upstream config resolves aliases and compiler targets from cwd.
process.chdir(checkout)
const require = createRequire(path.join(checkout, 'package.json'))
const config = require('./webpack.config.js')({ target: 'web' }, { mode: 'production' })

const stats = await new Promise<Stats>((resolve, reject) => {
  require('webpack')(config, (error: Error | null, result: Stats) => error ? reject(error) : resolve(result))
})
const report = stats.toJson({
  all: true,
  groupModulesByAttributes: false,
  groupModulesByType: false,
  groupModulesByPath: false,
  groupModulesByCacheStatus: false,
  groupModulesByExtension: false,
  groupModulesByLayer: false,
  modulesSpace: Infinity,
  nestedModulesSpace: Infinity,
  chunkModulesSpace: Infinity,
})
assert(!stats.hasErrors(), JSON.stringify(report.errors))
assert.equal(hash(fs.readFileSync('dist/vconsole.min.js')), provenance.upstream.bundleSha256, 'Rebuilt bundle differs from the frozen npm bundle')
const resources = new Set<string>()
function visit(module: Module) {
  assert(!module.filteredChildren, 'Webpack hid modules; this is incomplete provenance')
  const resource = module.nameForCondition?.replaceAll('\\', '/')
  if (resource?.includes('/node_modules/'))
    resources.add(`node_modules/${resource.split('/node_modules/').pop()}`)
  if (module.moduleType === 'runtime') {
    assert(module.name)
    resources.add(module.name)
  }
  module.modules?.forEach(visit)
}
report.modules.forEach(visit)
assert.deepEqual([...resources].sort(), [...new Set(provenance.dependencies.flatMap(dependency => dependency.runtimeResources))].sort(), 'Bundled component resources differ from the reviewed notice set')
console.log(JSON.stringify({ exactBundle: true, sha256: provenance.upstream.bundleSha256, resources: resources.size, notices: provenance.dependencies.length, warnings: report.warnings }))
