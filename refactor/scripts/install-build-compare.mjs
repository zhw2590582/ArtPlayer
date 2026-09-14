import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { hash } from './releases.mjs'

const output = path.resolve(process.argv[2])
const snapshot = JSON.parse(fs.readFileSync(path.join(output, 'snapshot.json'), 'utf8'))
function inventory(root) {
  const files = {}
  function visit(relative) {
    const file = path.join(root, relative)
    const stat = fs.lstatSync(file)
    assert(!stat.isSymbolicLink(), `Unexpected generated link: ${relative}`)
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(file)) visit(`${relative}/${name}`)
    }
    else {
      files[relative] = { bytes: stat.size, sha256: hash(fs.readFileSync(file)) }
    }
  }
  for (const name of fs.readdirSync(path.join(root, 'packages'))) {
    for (const directory of ['dist', 'types']) {
      const relative = `packages/${name}/${directory}`
      if (fs.existsSync(path.join(root, relative)))
        visit(relative)
    }
  }
  for (const relative of ['docs/compiled', 'docs/document', 'docs/assets/ts', 'docs/assets/js']) visit(relative)
  return files
}
const yarn = inventory(snapshot.checkouts.yarn)
const bun = inventory(snapshot.checkouts['bun-migrate'])
const files = [...new Set([...Object.keys(yarn), ...Object.keys(bun)])].sort()
const differences = files.filter(file => yarn[file]?.sha256 !== bun[file]?.sha256).map(file => ({ file, yarn: yarn[file] || null, bun: bun[file] || null }))
const report = { task: 'MOD-01', source: snapshot.source, command: 'yarn ci:build under Node for both installed dependency sets', scope: 'All package dist/types and docs compiled/document/assets-ts/assets-js; exact bytes with no normalization', counts: { yarn: Object.keys(yarn).length, bun: Object.keys(bun).length, identical: files.length - differences.length }, differences, inventories: { yarn, bun } }
fs.writeFileSync(path.join(output, 'build-comparison.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ counts: report.counts, differences: differences.map(item => item.file) }, null, 2))
