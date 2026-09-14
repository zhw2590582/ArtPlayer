import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { generateConsole } from './site-vendor/console/build.ts'

assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use yarn build:console [--check]')
const candidate = await generateConsole(process.cwd())
const output = 'docs/assets/js/console.js'
if (process.argv.includes('--check'))
  assert.equal(fs.readFileSync(output, 'utf8'), candidate, 'Generated console drift')
else fs.writeFileSync(output, candidate)
console.log('Console TS entry and view generated/checked; 100 frozen vendor modules and Parcel runtime retained.')
