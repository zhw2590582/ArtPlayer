import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { generateVconsole } from './site-vendor/vconsole/build.ts'

assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use yarn build:vconsole [--check]')
const candidate = await generateVconsole(process.cwd())
const output = 'docs/assets/js/vconsole.min.js'
if (process.argv.includes('--check'))
  assert.equal(fs.readFileSync(output, 'utf8'), candidate, 'Generated vConsole lifecycle patch drift')
else fs.writeFileSync(output, candidate)
console.log('vConsole 3.15.0 lifecycle patch generated/checked; upstream code outside the six pinned insertion points is retained.')
