import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercises the repository's isolated compiler runner.
import { test } from 'node:test'
import { checkTypeFixture, typeMatrix } from '../scripts/consumers/types.ts'
import { consumerDirectory, removeConsumer } from '../scripts/package-consumer.mjs'

const source = `import { update } from 'fixture'
update('video.mp4')
// @ts-expect-error URL must stay a string.
update(123)
`

function setup(declaration = 'export declare function update(url: string): void') {
  const dir = consumerDirectory()
  const pkg = path.join(dir, 'node_modules/fixture')
  fs.mkdirSync(pkg, { recursive: true })
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({ name: 'fixture', types: 'index.d.ts' }))
  fs.writeFileSync(path.join(pkg, 'index.d.ts'), declaration)
  return { dir, pkg }
}

test('Isolated consumer validates real declarations and each negative call in all five compiler modes', () => {
  const { dir } = setup()
  try {
    for (const { compiler, mode } of typeMatrix) {
      const result = checkTypeFixture(dir, source, compiler, mode)
      assert.deepEqual(result.declarations, ['node_modules/fixture/index.d.ts'])
      assert.deepEqual(result.negativeDiagnostics, [{ code: 2345, line: 4 }])
      assert.equal(result.negativeStatements, 1)
    }
  }
  finally { removeConsumer(dir) }
})

test('Missing declarations and accidental any widening fail installed consumer validation', () => {
  const { dir, pkg } = setup()
  const { compiler, mode } = typeMatrix[0]
  try {
    fs.rmSync(path.join(pkg, 'index.d.ts'))
    assert.throws(() => checkTypeFixture(dir, source, compiler, mode), /Valid installed consumer failed/)
    fs.writeFileSync(path.join(pkg, 'index.d.ts'), 'export declare function update(url: any): void')
    assert.throws(() => checkTypeFixture(dir, source, compiler, mode), /Valid installed consumer failed/)
  }
  finally { removeConsumer(dir) }
})

test('A declaration reached through an external package link cannot silently satisfy the consumer', () => {
  const { dir } = setup()
  const external = consumerDirectory()
  const { compiler, mode } = typeMatrix[0]
  try {
    fs.writeFileSync(path.join(external, 'index.d.ts'), 'export declare const value: string')
    fs.symlinkSync(external, path.join(dir, 'node_modules/external'), process.platform === 'win32' ? 'junction' : 'dir')
    assert.throws(() => checkTypeFixture(dir, `import { value } from 'external'\n${source}\nvoid value`, compiler, mode), /escaped installation/)
  }
  finally {
    fs.unlinkSync(path.join(dir, 'node_modules/external'))
    removeConsumer(dir)
    removeConsumer(external)
  }
})
