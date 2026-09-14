import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const baseline = '28c7abb2bb8dfb7c84acfc7c5ec05c5882623069'
const directory = fs.mkdtempSync(path.join(root, 'refactor/.cache/library-comparison-'))
const names = fs.readdirSync(path.join(root, 'packages')).filter(name => name !== 'artplayer-vitepress' && fs.existsSync(path.join(root, 'packages', name, 'package.json'))).sort()
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
fs.mkdirSync(path.join(directory, 'scripts'))
fs.writeFileSync(path.join(directory, 'package.json'), '{"type":"module"}\n')
for (const file of ['build.js', 'utils.js', 'projects.js', 'build-analysis.mjs'])
  fs.writeFileSync(path.join(directory, 'scripts', file), execFileSync('git', ['show', `${baseline}:scripts/${file}`], { cwd: root }))
for (const name of names) {
  const target = path.join(directory, 'packages', name)
  fs.mkdirSync(target, { recursive: true })
  for (const file of ['src', 'public', 'package.json', 'THIRD_PARTY_NOTICES']) {
    const source = path.join(root, 'packages', name, file)
    if (fs.existsSync(source))
      fs.cpSync(source, path.join(target, file), { recursive: true })
  }
}
const artifacts = () => names.flatMap(name => ['.js', '.legacy.js', '.mjs'].map(extension => {
  const relative = `packages/${name}/dist/${name}${extension}`
  return { path: relative, sha256: sha(path.join(directory, relative)) }
}))
function build(script, label) {
  const log = fs.openSync(path.join(directory, `${label}.log`), 'w')
  try {
    execFileSync(process.execPath, [script, 'all'], { cwd: directory, stdio: ['ignore', log, log], timeout: 300000 })
  }
  finally {
    fs.closeSync(log)
  }
}
console.log(`Library comparison fixture: ${directory}`)
build(path.join(directory, 'scripts/build.js'), 'before')
const before = artifacts()
fs.writeFileSync(path.join(directory, 'before.json'), `${JSON.stringify(before, null, 2)}\n`)
build(path.join(root, 'scripts/build.js'), 'candidate')
const candidate = artifacts()
const differences = candidate.filter((item, index) => item.sha256 !== before[index].sha256)
const report = { task: 'MOD-02', baseline, node: process.version, names, before, candidate, differences }
fs.writeFileSync(path.join(directory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
assert.deepEqual(differences, [], 'Production bytes changed across the tooling migration')
console.log(`Compared ${names.length} libraries / ${candidate.length} artifacts: identical SHA-256. Report: ${directory}/report.json`)
