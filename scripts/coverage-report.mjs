import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)])
const relative = (root, file) => path.relative(root, file).split(path.sep).join('/')

export function sourceInventory(root, policy) {
  assert.equal(policy.schemaVersion, 1)
  assert(policy.packages.length > 0)
  const files = []
  const excluded = []
  for (const name of policy.packages) {
    assert(/^artplayer(?:-[a-z-]+)?$/.test(name), `Invalid coverage package: ${name}`)
    for (const file of walk(path.join(root, 'packages', name, 'src')).filter(file => /\.[jt]s$/.test(file))) {
      const name = relative(root, file)
      const source = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n')
      const sha256 = createHash('sha256').update(source).digest('hex')
      const emitted = file.endsWith('.d.ts') ? '' : ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext } }).outputText.trim()
      const reason = policy.exclude[name] || (/^(?:export\s*\{\s*\}\s*;?)?$/.test(emitted) ? 'Type-only module; no emitted runtime code.' : undefined)
      if (reason) {
        excluded.push({ file: name, sha256, reason })
      }
      else {
        assert(!/\b(?:c8|v8|istanbul)\s+ignore\b/i.test(source), `Undocumented coverage suppression: ${name}`)
        files.push({ file: name, sha256 })
      }
    }
  }
  for (const name of Object.keys(policy.exclude))
    assert(excluded.some(item => item.file === name), `Stale coverage exclusion: ${name}`)
  for (const name of Object.keys(policy.minimum))
    assert(files.some(item => item.file === name), `Critical coverage file is absent or excluded: ${name}`)
  return { files: files.sort((a, b) => a.file.localeCompare(b.file)), excluded }
}

export function analyzeCoverage(root, summary, inventory, policy) {
  const normalized = new Map(Object.entries(summary).filter(([file]) => file !== 'total').map(([file, value]) => [relative(root, file), value]))
  assert.deepEqual([...normalized.keys()].sort(), inventory.files.map(item => item.file).sort(), 'Coverage source inventory differs; a source map or zero-coverage file is missing')
  const violations = []
  const files = inventory.files.map((source) => {
    const metrics = normalized.get(source.file)
    const values = {}
    for (const metric of ['lines', 'branches', 'functions', 'statements']) {
      const { covered, total, skipped } = metrics[metric]
      assert(Number.isInteger(total) && total >= 0 && Number.isInteger(covered) && covered >= 0 && covered <= total && skipped === 0, `Invalid or ignored ${metric}: ${source.file}`)
      const percent = total ? covered * 100 / total : 100
      values[metric] = { covered, total, percent }
      const minimum = policy.minimum[source.file]?.[metric]
      if (minimum !== undefined && (total === 0 || percent < minimum))
        violations.push({ file: source.file, metric, minimum, actual: percent, total })
    }
    return { ...source, metrics: values }
  })
  return { files, excluded: inventory.excluded, minimum: policy.minimum, violations }
}
