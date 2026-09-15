import process from 'node:process'
import { prepareRelease } from './release/prepare.ts'

try {
  prepareRelease()
}
catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
