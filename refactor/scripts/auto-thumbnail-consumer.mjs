import fs from 'node:fs'

export const publicInvalid = [
  'thumbnail()',
  'thumbnail(undefined)',
  'thumbnail({ width: "80" })',
  'thumbnail({ height: 90 })',
  'const asynchronous: Promise<{name: "artplayerPluginAutoThumbnail"}> = result',
  'thumbnail.default({})',
]

export const runtimeInvalid = [
  'runtime()',
  'runtime(undefined)',
  'runtime({ url: 1 })',
  'runtime({ width: "80" })',
  'runtime({ number: false })',
  'runtime({ scale: "1" })',
  'runtime({ height: "90" })',
  'runtime({ unknown: true })',
  'runtime({})()',
  'pending.name',
  'runtime.default({ width: false })',
  'const synchronous: Result = pending',
  'const wrong: Factory = (_option) => (_art) => ({name: "artplayerPluginAutoThumbnail"})',
  'const missingAlias: RuntimeFactory = replacement',
]

export function publicSource(mode, raw = false) {
  let source = fs.readFileSync(new URL('../../test/types/auto-thumbnail-public.ts', import.meta.url), 'utf8')
  if (mode === 'nodenext-esm' && !raw) {
    source = source.replace('import thumbnail from \'artplayer-plugin-auto-thumbnail\'', 'import thumbnailModule from \'artplayer-plugin-auto-thumbnail\'\nconst thumbnail = thumbnailModule.default')
      .replace('import legacy from \'artplayer-plugin-auto-thumbnail/legacy\'', 'import legacyModule from \'artplayer-plugin-auto-thumbnail/legacy\'\nconst legacy = legacyModule.default')
  }
  return source
}

export function runtimeSource(mode) {
  const source = fs.readFileSync(new URL('../../test/types/auto-thumbnail-runtime.ts', import.meta.url), 'utf8')
  return mode.endsWith('-no-interop')
    ? source.replace('import runtime from \'artplayer-plugin-auto-thumbnail/runtime\'', 'import runtime = require(\'artplayer-plugin-auto-thumbnail/runtime\')')
        .replace('import type Artplayer from \'artplayer\'', 'type Core = typeof import(\'artplayer\'); type Artplayer = Core extends { default: { prototype: infer I } } ? I : Core extends { prototype: infer I } ? I : never')
    : source
}
