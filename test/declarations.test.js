import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Declaration generation must reject drift and invalid public sources.
import { test } from 'node:test'
import { generateCoreDeclarations } from '../scripts/build-types.mjs'

test('declaration checks reject stale output without overwriting it and recover through explicit generation', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-declarations-'))
  const folder = path.join(root, 'packages/artplayer')
  fs.mkdirSync(path.join(folder, 'public'), { recursive: true })
  fs.mkdirSync(path.join(folder, 'types'), { recursive: true })
  const source = path.join(folder, 'public/contract.ts')
  const output = path.join(folder, 'types/contract.d.ts')
  try {
    fs.writeFileSync(source, 'export interface Contract { name: string }\n')
    await assert.rejects(generateCoreDeclarations({ root }), /stale/)
    assert.equal(fs.existsSync(output), false)
    await generateCoreDeclarations({ root, write: true })
    const generated = fs.readFileSync(output, 'utf8')
    assert.match(generated, /Generated from public\/contract.ts/)
    assert.deepEqual((await generateCoreDeclarations({ root })).changed, [])
    fs.writeFileSync(source, 'export interface Contract { name: string, enabled: boolean }\n')
    await assert.rejects(generateCoreDeclarations({ root }), /stale/)
    assert.equal(fs.readFileSync(output, 'utf8'), generated)
    await generateCoreDeclarations({ root, write: true })
    assert.match(fs.readFileSync(output, 'utf8'), /enabled: boolean/)
    assert.equal(fs.existsSync(path.join(folder, 'types/contract.js')), false)
    fs.writeFileSync(source, 'export interface Contract { name: MissingPublicType }\n')
    const valid = fs.readFileSync(output, 'utf8')
    await assert.rejects(generateCoreDeclarations({ root, write: true }), /MissingPublicType/)
    assert.equal(fs.readFileSync(output, 'utf8'), valid)
    fs.mkdirSync(path.join(folder, 'src'))
    fs.writeFileSync(path.join(folder, 'src/private.ts'), 'export interface Private { internal: boolean }\n')
    fs.writeFileSync(source, 'export type { Private } from "../src/private.js"\n')
    await assert.rejects(generateCoreDeclarations({ root, write: true }), /rootDir|non-public/)
    assert.equal(fs.readFileSync(output, 'utf8'), valid)
  }
  finally {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()))
    assert(path.basename(root).startsWith('artplayer-declarations-'))
    fs.rmSync(root, { recursive: true, force: true })
  }
})
