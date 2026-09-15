import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkTypeFixture, typeMatrix } from './types.ts'

const fixtures: Record<string, string> = {
  'artplayer-plugin-audio-track': 'audio-track.ts',
  'artplayer-plugin-hls-control': 'hls-control.ts',
}

export function installedPluginTypes(directory: string, packages: string[]) {
  const results = []
  for (const name of packages) {
    const fixture = fixtures[name]
    if (!fixture)
      continue
    const source = fs.readFileSync(fileURLToPath(new URL(`../../test/types/${fixture}`, import.meta.url)), 'utf8')
    const modes = typeMatrix.map(({ compiler, mode }) => checkTypeFixture(directory, source, compiler, mode))
    for (const result of modes)
      assert(result.declarations.some(file => file.startsWith(`node_modules/${name}/`)), `Missing installed declaration for ${name}`)
    results.push({ name, fixture: path.posix.join('test/types', fixture), fixtureSha256: createHash('sha256').update(source).digest('hex'), modes })
  }
  return results
}
