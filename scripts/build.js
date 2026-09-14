import process from 'node:process'
import { runBuild } from './library/production.ts'

runBuild().catch((error) => {
  console.error('❌ Build failed:', error)
  process.exitCode = 1
})
