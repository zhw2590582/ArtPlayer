import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const directory = path.resolve(process.argv[2])
const read = name => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'))
const yarn = read('yarn-graph.json')
const bun = read('bun-graph.json')
const unique = values => [...new Set(values)].sort()
function differences(left, right) {
  const a = new Set(left)
  const b = new Set(right)
  return { yarnOnly: [...a].filter(value => !b.has(value)).sort(), bunOnly: [...b].filter(value => !a.has(value)).sort() }
}
const tools = graph => Object.fromEntries(graph.rootTools.map(edge => [edge.name, edge.resolved]))
const leftTools = tools(yarn)
const rightTools = tools(bun)
assert.deepEqual(Object.keys(leftTools).sort(), Object.keys(rightTools).sort())
const rootToolChanges = Object.keys(leftTools).filter(name => leftTools[name] !== rightTools[name]).map(name => ({ name, yarn: leftTools[name], bun: rightTools[name] }))
const edges = graph => unique(graph.requests.map(edge => `${edge.parent} ${edge.field} ${edge.name}@${edge.range} -> ${edge.resolved}`))
const resources = graph => unique(graph.resources.map(item => `${item.package} ${item.path} ${item.bytes} ${item.sha256}`))
const missing = graph => unique(graph.missing.map(edge => `${edge.parent} ${edge.field} ${edge.name}@${edge.range} optional=${edge.optional}`))
const report = {
  task: 'MOD-01',
  source: read('snapshot.json').source,
  counts: Object.fromEntries([['yarn', yarn], ['bun', bun]].map(([name, graph]) => [name, { packageInstances: graph.packages.length, uniquePackages: unique(graph.packages.map(pkg => `${pkg.name}@${pkg.version}`)).length, resolvedEdges: graph.requests.length, uniqueResources: resources(graph).length }])),
  rootToolChanges,
  packages: differences(yarn.packages.map(pkg => `${pkg.name}@${pkg.version}`), bun.packages.map(pkg => `${pkg.name}@${pkg.version}`)),
  requests: differences(edges(yarn), edges(bun)),
  missing: differences(missing(yarn), missing(bun)),
  resources: differences(resources(yarn), resources(bun)),
  missingRequired: Object.fromEntries([['yarn', yarn], ['bun', bun]].map(([name, graph]) => [name, graph.missing.filter(edge => !edge.optional && edge.field !== 'peerDependencies')])),
  note: 'Physical hoisting differences are excluded from semantic comparisons. Missing optional/platform and peer requests remain explicit; this report alone does not determine build compatibility.',
}
fs.writeFileSync(path.join(directory, 'comparison.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ counts: report.counts, rootToolChanges, resources: report.resources, missingRequired: report.missingRequired }, null, 2))
