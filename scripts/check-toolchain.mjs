import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const manifest = read('package.json')
const lock = read('package-lock.json')
const nodeVersion = fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()
const [major, minor] = process.versions.node.split('.').map(Number)
assert((major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major >= 23, 'Build tooling requires Node ^20.19.0 || >=22.12.0')
assert.equal(lock.lockfileVersion, 3)
assert.deepEqual(lock.packages[''].devDependencies, manifest.devDependencies, 'Root dependencies differ from lock')
for (const [name, version] of Object.entries(manifest.devDependencies)) {
  assert(/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version), `Unpinned development dependency: ${name}`)
  assert.equal(lock.packages[`node_modules/${name}`]?.version, version, `Lock resolution differs: ${name}`)
}
let packages = 0
for (const dir of fs.readdirSync(path.join(root, 'packages'))) {
  const filename = `packages/${dir}/package.json`
  if (!fs.existsSync(path.join(root, filename))) continue
  const workspace = read(filename)
  const locked = lock.packages[`packages/${dir}`]
  assert(locked, `Workspace missing from lock: ${dir}`)
  for (const field of ['version', 'dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    assert.deepEqual(locked[field], workspace[field], `Workspace lock differs: ${dir}.${field}`)
  }
  packages += 1
}
if (process.argv.includes('--strict')) {
  assert.equal(process.versions.node, nodeVersion, 'Use the pinned .node-version runtime')
  const actualNpm = process.env.npm_config_user_agent?.split(' ')[0]
  assert.equal(actualNpm, manifest.packageManager.replace('@', '/'), 'Run with the pinned npm through npm run check:toolchain -- --strict')
}
console.log(`Toolchain verified: ${packages} workspaces, ${Object.keys(manifest.devDependencies).length} pinned tools; Node ${process.versions.node} (canonical ${nodeVersion}), ${manifest.packageManager}`)
