import process from 'node:process'
import { buildLanguages } from './site-build/i18n.ts'

await buildLanguages(process.cwd()).catch((error) => {
  console.error(error)
  process.exitCode = 1
})
