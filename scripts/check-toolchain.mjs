import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import lockfile from '@yarnpkg/lockfile'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const manifest = read('package.json')
const parsed = lockfile.parse(fs.readFileSync(path.join(root, 'yarn.lock'), 'utf8'))
assert.equal(parsed.type, 'success', 'Yarn lock must parse without conflicts')
assert(!fs.existsSync(path.join(root, 'package-lock.json')), 'Maintain yarn.lock only')
assert.equal(manifest.packageManager, 'yarn@1.22.22', 'Use the agreed Yarn Classic version')
const lock = parsed.object
const nodeVersion = fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()
const [major, minor] = process.versions.node.split('.').map(Number)
assert((major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major >= 23, 'Build tooling requires Node ^20.19.0 || >=22.12.0')
for (const [name, version] of Object.entries(manifest.devDependencies)) {
  assert(/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version), `Unpinned development dependency: ${name}`)
  assert.equal(lock[`${name}@${version}`]?.version, version, `Lock resolution differs: ${name}`)
}

const checked = new Set()
function checkDependencies(pkg) {
  for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    for (const [name, range] of Object.entries(pkg[field] || {})) {
      const selector = `${name}@${range}`
      assert(lock[selector], `Dependency missing from Yarn lock: ${selector}`)
      if (checked.has(selector))
        continue
      checked.add(selector)
      assert(lock[selector].resolved && lock[selector].integrity, `Missing registry integrity: ${selector}`)
      checkDependencies(lock[selector])
    }
  }
}
checkDependencies(manifest)
let packages = 0
for (const dir of fs.readdirSync(path.join(root, 'packages'))) {
  const filename = `packages/${dir}/package.json`
  if (!fs.existsSync(path.join(root, filename)))
    continue
  checkDependencies(read(filename))
  packages += 1
}
if (process.argv.includes('--strict')) {
  assert.equal(process.versions.node, nodeVersion, 'Use the pinned .node-version runtime')
  const actualManager = process.env.npm_config_user_agent?.split(' ')[0]
  assert.equal(actualManager, manifest.packageManager.replace('@', '/'), 'Run yarn check:toolchain --strict with the pinned Yarn')
}
console.log(`Toolchain verified: ${packages} workspaces, ${Object.keys(manifest.devDependencies).length} pinned tools, ${checked.size} dependency selectors; Node ${process.versions.node} (canonical ${nodeVersion}), ${manifest.packageManager}`)
