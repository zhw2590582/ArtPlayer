import process from 'node:process'
import { runEditorDeclarations } from './editor-declarations/generate.ts'

await runEditorDeclarations(process.argv.slice(2))
