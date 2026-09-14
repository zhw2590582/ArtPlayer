import assert from 'node:assert/strict'
import fs from 'node:fs'

export function vastConsumer(kind, { legacy = false, requireImport = false } = {}) {
  let source = fs.readFileSync(kind === 'runtime' ? 'test/types/vast-runtime.ts' : 'refactor/fixtures/consumers/vast-published.ts', 'utf8')
  const entry = kind === 'runtime' ? 'artplayer-plugin-vast/runtime' : legacy ? 'artplayer-plugin-vast/legacy' : 'artplayer-plugin-vast'
  if (legacy)
    source = source.replaceAll('\'artplayer-plugin-vast\'', `'${entry}'`)
  if (requireImport)
    source = source.replace(`import vast from '${entry}'`, `import vast = require('${entry}')`)
  return source
}

export function runtimeNegatives(source) {
  const lines = source.split('\n')
  const expected = []
  const invalid = lines.map((line, index) => {
    if (!/^[ \t]*\/\/ @ts-expect-error/.test(line))
      return line
    assert(lines[index + 1]?.trim() && !lines[index + 1].trim().startsWith('//'))
    expected.push(index + 2)
    return ''
  }).join('\n')
  assert.equal(expected.length, 14, 'Keep every runtime misuse independently observable')
  return { invalid, expected }
}
