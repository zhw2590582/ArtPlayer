import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { hash } from './releases.mjs'

export function installedGraph(checkout) {
  const root = fs.realpathSync(checkout)
  const packages = new Map()
  const requests = []
  const missing = []
  function manifestAt(location) {
    const actual = fs.realpathSync(location)
    assert(actual.startsWith(root + path.sep), 'Installed dependency escaped isolated checkout')
    return { directory: actual, manifest: JSON.parse(fs.readFileSync(path.join(actual, 'package.json'), 'utf8')) }
  }
  function resolve(from, name) {
    const require = createRequire(path.join(from, 'package.json'))
    // Audit npm packages even when their names also identify Node builtins.
    for (const location of require.resolve.paths('artplayer-install-audit-probe')) {
      const directory = path.join(location, name)
      if (fs.existsSync(path.join(directory, 'package.json')))
        return manifestAt(directory)
    }
    return null
  }
  function visit(directory, manifest, workspace = false) {
    const key = path.relative(root, directory).replaceAll('\\', '/') || '.'
    if (packages.has(key))
      return
    packages.set(key, { path: key, name: manifest.name, version: manifest.version, license: manifest.license || null, workspace, lifecycle: Object.fromEntries(Object.entries(manifest.scripts || {}).filter(([name]) => ['preinstall', 'install', 'postinstall', 'prepare'].includes(name))) })
    const fields = workspace ? ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'] : ['dependencies', 'optionalDependencies', 'peerDependencies']
    for (const field of fields) {
      for (const [name, range] of Object.entries(manifest[field] || {})) {
        const dependency = resolve(directory, name)
        const edge = { from: key, parent: `${manifest.name}@${manifest.version}`, field, name, range, optional: field === 'optionalDependencies' || (field === 'peerDependencies' && manifest.peerDependenciesMeta?.[name]?.optional === true) }
        if (!dependency) {
          missing.push(edge)
          continue
        }
        requests.push({ ...edge, resolved: `${dependency.manifest.name}@${dependency.manifest.version}`, to: path.relative(root, dependency.directory).replaceAll('\\', '/') })
        visit(dependency.directory, dependency.manifest)
      }
    }
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  visit(root, manifest, true)
  for (const name of fs.readdirSync(path.join(root, 'packages'))) {
    const directory = path.join(root, 'packages', name)
    if (fs.existsSync(path.join(directory, 'package.json'))) {
      const entry = manifestAt(directory)
      // A workspace first reached through a runtime dependency still needs its dev/peer audit.
      packages.delete(path.relative(root, directory).replaceAll('\\', '/'))
      visit(directory, entry.manifest, true)
    }
  }
  const resources = []
  for (const pkg of packages.values()) {
    if (pkg.workspace)
      continue
    const directory = path.join(root, pkg.path)
    function walk(folder) {
      for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.isSymbolicLink())
          continue
        const file = path.join(folder, entry.name)
        if (entry.isDirectory())
          walk(file)
        else if (entry.isFile() && /\.(?:node|wasm|exe)$|(?:worker|worklet)[^/\\]*\.[cm]?js$/i.test(entry.name))
          resources.push({ package: `${pkg.name}@${pkg.version}`, path: path.relative(directory, file).replaceAll('\\', '/'), bytes: fs.statSync(file).size, sha256: hash(fs.readFileSync(file)) })
      }
    }
    walk(directory)
  }
  return { node: process.versions.node, root, packages: [...packages.values()].sort((a, b) => a.path.localeCompare(b.path)), requests, missing, resources, rootTools: requests.filter(edge => edge.from === '.' && edge.field === 'devDependencies') }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.equal(process.argv.length, 4, 'Use <checkout> <report.json>')
  const graph = installedGraph(process.argv[2])
  fs.writeFileSync(process.argv[3], `${JSON.stringify(graph, null, 2)}\n`)
  console.log(`Installed graph: ${graph.packages.length} package instances, ${graph.requests.length} resolved edges, ${graph.resources.length} native/worker/WASM resources; ${graph.missing.length} absent optional/peer/required requests retained`)
}
