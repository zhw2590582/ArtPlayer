import process from 'node:process'
import { buildDocumentation, BuildExitError } from './site-build/docs.ts'

await buildDocumentation(process.cwd()).catch((error) => {
  console.error(error.message)
  process.exitCode = error instanceof BuildExitError ? error.code : 1
})
