import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { writeOrCheckNotices } from './site-vendor/notices.ts'

assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use yarn build:site-notices [--check]')
/** @type {import('./site-vendor/notices.ts').VendorManifest} */
const manifest = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
assert.deepEqual(manifest.groups.map(group => group.name).sort(), ['monaco-editor', 'vconsole'], 'Do not silently drop a verified site component')
const count = writeOrCheckNotices(process.cwd(), manifest, process.argv.includes('--check'))
console.log(`Verified site notices: ${count} outputs; Monaco/vConsole only, other provenance gates remain open.`)
