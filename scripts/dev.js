import process from 'node:process'
import { runDevelop } from './library/development.ts'

runDevelop().catch((error) => {
  console.error('❌ Development server failed:', error)
  process.exitCode = 1
})
