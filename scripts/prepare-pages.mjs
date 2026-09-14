import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { preparePages } from './pages/prepare.ts'

assert.equal(process.argv.length, 2, 'Use yarn prepare:pages without arguments')
const result = await preparePages(process.cwd())
if (process.env.GITHUB_OUTPUT)
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `site=${result.site}\n`)
console.log(`Pages artifact validated: ${result.site}; ${Object.keys(result.report.files).length} files. No deployment was performed.`)
