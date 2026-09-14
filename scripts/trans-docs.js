import process from 'node:process'
import { runTranslation } from './documentation/cli.ts'

await runTranslation(process.argv.slice(2))
