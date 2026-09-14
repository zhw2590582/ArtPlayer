import assert from 'node:assert/strict'
import process from 'node:process'
import { buildCorpus } from './corpus.ts'
import { atomicWrite, ownedPath, read } from './files.ts'
import { translateChunk } from './remote.ts'
import {
  applyTranslationDraft,
  createTranslationDraft,
  translationPlan,
  validateTranslationDraft,
} from './translation.ts'

export function runCorpus(args: string[], root = process.cwd()): void {
  assert(
    args.every(arg => arg === '--check'),
    'Use yarn build:llm [--check]; generation is offline',
  )
  const outputs = buildCorpus(root)
  for (const [relative, text] of outputs) {
    const file = ownedPath(root, relative)
    if (args.includes('--check'))
      assert.equal(read(file), text, `LLM source bundle drift: ${relative}`)
    else atomicWrite(file, text)
  }
  console.log(
    `Offline LLM source bundle ${args.includes('--check') ? 'checked' : 'generated'}: ${outputs.size} outputs`,
  )
}

export async function runTranslation(
  args: string[],
  root = process.cwd(),
): Promise<void> {
  if (!args.length || (args.length === 1 && args[0] === '--plan')) {
    console.log(
      JSON.stringify(
        {
          mode: 'plan-only',
          files: translationPlan(root),
          next: 'Use --remote to create a reviewable draft; --apply <draft-directory> applies validated files. No network or English writes occurred.',
        },
        null,
        2,
      ),
    )
    return
  }
  if (args.length === 2 && args[0] === '--validate' && args[1]) {
    validateTranslationDraft(root, args[1])
    console.log(
      'Draft structure and source/target fingerprints validated; English files unchanged',
    )
    return
  }
  if (args.length === 2 && args[0] === '--apply' && args[1]) {
    applyTranslationDraft(root, args[1])
    console.log(
      'Validated translation draft applied; rebuild site assets and LLM bundle before checking generated output',
    )
    return
  }
  assert(
    args.length === 1 && args[0] === '--remote',
    'Use yarn trans:docs [--plan | --remote | --validate <draft-directory> | --apply <draft-directory>]',
  )
  const dotenv = await import('dotenv')
  dotenv.config({ path: ownedPath(root, '.env'), quiet: true })
  const key = process.env.DEEPSEEK_API_KEY
  assert(key, 'Missing DEEPSEEK_API_KEY; no translation requests were made')
  const directory = await createTranslationDraft(root, (content, signal) =>
    translateChunk(content, { key, signal }))
  console.log(
    `Translation draft ready: ${directory}. Review files before using --apply.`,
  )
}
