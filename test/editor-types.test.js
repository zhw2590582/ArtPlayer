import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Exercise the real standalone editor compiler and generator.
import { test } from 'node:test'
import { ESLint } from 'eslint'
import compat from 'typescript-compat'
import { asGlobalDeclaration, checkCoreEditorDeclaration, generateCoreEditorDeclaration } from '../scripts/editor-types.mjs'

test('editor declarations are reproducible, standalone and preserve constructor/named types in both compilers', async () => {
  const generated = generateCoreEditorDeclaration()
  const file = 'docs/assets/ts/artplayer.d.ts'
  const eslint = new ESLint({ fix: true, fixTypes: ['layout'] })
  const [formatted] = await eslint.lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated, 'Editor declarations are stale; run yarn build:ts')
  assert.deepEqual(checkCoreEditorDeclaration(formatted.output || generated, compat), [])
  const corrupted = generated.replace('export type OptionInput = ArtplayerDefinitions.OptionInput;', 'export type OptionInput = MissingEditorType;')
  assert.notEqual(corrupted, generated, 'Missing corruption target')
  assert(checkCoreEditorDeclaration(corrupted).some(diagnostic => diagnostic.code === 2304), 'Invalid output must not be hidden by skipLibCheck')
  assert.throws(() => asGlobalDeclaration('export { default } from "./missing"', 'Artplayer'), /unresolved exports/)
})
