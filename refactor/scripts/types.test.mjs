import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkConsumer, checkProject } from '../../scripts/typecheck.mjs'
import { refactorDir } from './releases.mjs'

test('Current and compatibility compilers reject invalid old public calls and unused error assertions', () => {
  const original = fs.readFileSync(path.join(refactorDir, '../test/types/public.ts'), 'utf8')
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkConsumer(compiler, 'node10-commonjs'), [])
    const invalid = "import Artplayer from 'artplayer'; new Artplayer({ container: '#player', url: 42 });"
    assert(checkConsumer(compiler, 'node10-commonjs', invalid).some(d => d.code === 2322))
    const unused = original.replace('url: 42', "url: 'valid.mp4'")
    assert(checkConsumer(compiler, 'node10-commonjs', unused).some(d => d.code === 2578))
  }
})

test('Browser implementation configuration catches source errors without emitting JavaScript', () => {
  const parent = path.join(refactorDir, '.cache')
  fs.mkdirSync(parent, { recursive: true })
  const directory = fs.mkdtempSync(path.join(parent, 'types-check-'))
  try {
    const config = path.join(directory, 'tsconfig.json')
    fs.writeFileSync(config, JSON.stringify({ extends: path.join(refactorDir, '../tsconfig.base.json'), include: ['source.ts'] }))
    fs.writeFileSync(path.join(directory, 'source.ts'), 'export const title: string = 42;\n')
    assert.deepEqual(checkProject(config).diagnostics.map(d => d.code), [2322])
    assert(!fs.existsSync(path.join(directory, 'source.js')))
  }
  finally {
    const relative = path.relative(parent, directory)
    assert(relative.startsWith('types-check-') && !relative.includes(path.sep))
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

test('Chapter optional factory parameters preserve strict update and data types in new and old compilers', () => {
  const source = fs.readFileSync(path.join(refactorDir, '../test/types/chapter-options.ts'), 'utf8')
  for (const mode of ['node10-commonjs', 'nodenext-cjs', 'bundler-esm']) {
    assert.deepEqual(checkConsumer(ts, mode, source), [])
  }
  assert.deepEqual(checkConsumer(compat, 'node10-commonjs', source), [])
  const unguarded = source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')
  const diagnostics = checkConsumer(ts, 'bundler-esm', unguarded)
  assert.equal(diagnostics.length, 3, 'Invalid update, title and null option must each fail')
})

test('Chapter named types and legacy aliases remain strict in modern and old consumers', () => {
  const source = fs.readFileSync(path.join(refactorDir, '../test/types/chapter-exports.ts'), 'utf8')
  const language = fs.readFileSync(path.join(refactorDir, '../test/types/language-value.ts'), 'utf8')
  for (const [compiler, mode] of [[ts, 'nodenext-esm'], [ts, 'nodenext-cjs'], [compat, 'node10-commonjs']]) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [])
    const invalid = source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')
    assert.equal(checkConsumer(compiler, mode, invalid).length, 3)
    assert.deepEqual(checkConsumer(compiler, mode, language), [])
    assert.equal(checkConsumer(compiler, mode, language.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')).length, 2)
  }
  const commonjs = fs.readFileSync(path.join(refactorDir, '../test/types/commonjs.cts'), 'utf8')
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', commonjs), [])
  assert.equal(checkConsumer(ts, 'nodenext-cjs', commonjs.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')).length, 1)
})
