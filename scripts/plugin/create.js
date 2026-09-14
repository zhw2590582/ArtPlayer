import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createPlugin } from './cli.ts'

try {
  createPlugin(fileURLToPath(new URL('../../', import.meta.url)), process.argv.slice(2))
}
catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
