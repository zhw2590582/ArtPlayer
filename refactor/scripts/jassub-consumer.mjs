import fs from 'node:fs'

export const jassubInvalidStatements = [
  'jassub()',
  'jassub(undefined)',
  'jassub({ workerUrl: "/worker.js", wasmUrl: "/worker.wasm" })',
  'jassub({ workerUrl: 1, wasmUrl: "/worker.wasm", modernWasmUrl: "/modern.wasm" })',
  'instance.resize(640)',
  'const synchronousDestroy: void = instance.destroy()',
  'const wrongName: "other" = result.name',
]

export function jassubConsumerSource(mode, raw = false) {
  let source = fs.readFileSync(new URL('../../test/types/jassub-public.ts', import.meta.url), 'utf8')
  if (mode === 'nodenext-esm' && !raw) {
    source = source
      .replace('import jassub from \'artplayer-plugin-jassub\'', 'import jassubModule from \'artplayer-plugin-jassub\'\nconst jassub = jassubModule.default')
      .replace('import legacy from \'artplayer-plugin-jassub/legacy\'', 'import legacyModule from \'artplayer-plugin-jassub/legacy\'\nconst legacy = legacyModule.default')
  }
  return source
}

export function jassubRuntimeSource(mode) {
  const source = fs.readFileSync(new URL('../../test/types/jassub-runtime.ts', import.meta.url), 'utf8')
  return mode.endsWith('-no-interop')
    ? source
        .replace('import runtime from \'artplayer-plugin-jassub/runtime\'', 'import runtime = require(\'artplayer-plugin-jassub/runtime\')')
        .replace('import type Artplayer from \'artplayer\'', 'type Core = typeof import(\'artplayer\'); type Artplayer = Core extends { default: { prototype: infer I } } ? I : Core extends { prototype: infer I } ? I : never')
    : source
}
