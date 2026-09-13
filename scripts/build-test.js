import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { generateDocumentationSmoke } from './docs-smoke/generator.ts'

assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use yarn build:test [--check]')
const outputs = await generateDocumentationSmoke(process.cwd())
for (const [file, content] of outputs) {
  if (process.argv.includes('--check'))
    assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), content, `Generated documentation smoke drift: ${file}`)
  else fs.writeFileSync(file, content)
}
console.log(`Documentation readiness smoke ${process.argv.includes('--check') ? 'checked' : 'generated'}: ${outputs.size} outputs; complete demo acceptance remains separate`)
