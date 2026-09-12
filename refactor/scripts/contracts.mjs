import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { contractStatus, readContractModel, renderContracts } from './contracts-model.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const args = process.argv.slice(2)
assert(args.every(arg => ['--write', '--report'].includes(arg)), 'Use --write and/or --report')
const model = readContractModel(root)
const markdown = renderContracts(model)
const file = path.join(root, 'refactor/contract-index.md')
if (args.includes('--write'))
  fs.writeFileSync(file, markdown)
else assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), markdown, 'Contract index is stale; run yarn check:contracts --write')
const report = contractStatus(root, model)
if (args.includes('--report')) {
  fs.mkdirSync(path.join(root, 'refactor/.cache/ci'), { recursive: true })
  fs.writeFileSync(path.join(root, 'refactor/.cache/ci/contracts.json'), `${JSON.stringify(report, null, 2)}\n`)
}
console.log(`Contracts: ${model.policy.packages.length} packages, ${report.rows.length} assigned families, ${model.policy.cases.length} indexed cases, ${report.observations.length} structured runs`)
console.log(`${report.rows.filter(row => row.state === 'tests-not-indexed').length} family rows need test indexing; historical records are not auto-promoted to current acceptance`)
