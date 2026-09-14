import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { runEditorDeclarations } from './editor-declarations/generate.ts'

await runEditorDeclarations(process.argv.slice(2))
if (!process.argv.includes('--check')) {
  const child = spawnSync(process.execPath, ['scripts/build-site-assets.mjs'], { stdio: 'inherit', windowsHide: true })
  if (child.error)
    throw child.error
  process.exitCode = child.status ?? 1
}
