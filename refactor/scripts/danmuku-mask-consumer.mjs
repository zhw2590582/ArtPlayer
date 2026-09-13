import fs from 'node:fs'

export const maskInvalidStatements = [
  'mask({ modelSelection: "general" })',
  'mask({ smoothSegmentation: 1 })',
  'mask({ solutionPath: 42 })',
  'mask({ opacity: "1" })',
  'const invalidName: "other" = result.name',
  'const invalidStart: void = result.start()',
  'const invalidStop: Promise<void> = result.stop()',
  'mask().then(() => {})',
]

export function maskConsumerSource(mode, raw = false) {
  let source = fs.readFileSync(new URL('../../test/types/danmuku-mask-public.ts', import.meta.url), 'utf8')
  if (mode === 'nodenext-esm' && !raw) {
    source = source
      .replace('import mask from \'artplayer-plugin-danmuku-mask\'', 'import maskModule from \'artplayer-plugin-danmuku-mask\'\nconst mask = maskModule.default')
      .replace('import legacy from \'artplayer-plugin-danmuku-mask/legacy\'', 'import legacyModule from \'artplayer-plugin-danmuku-mask/legacy\'\nconst legacy = legacyModule.default')
  }
  return source
}
