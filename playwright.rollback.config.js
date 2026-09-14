import process from 'node:process'
import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'
import { verifyRollbackArtifacts } from './scripts/rollback-artifacts.mjs'

verifyRollbackArtifacts(process.cwd(), process.env.ARTPLAYER_BROWSER_ARTIFACTS)
export default defineConfig(base, {
  testMatch: ['**/playback.spec.js'],
  grep: /candidate: real playback/,
  retries: 0,
  workers: 2,
  outputDir: 'refactor/.cache/rollback-browser/results',
  reporter: [
    ['list'],
    ['json', { outputFile: 'refactor/.cache/rollback-browser/report.json' }],
    ['html', { outputFolder: 'refactor/.cache/rollback-browser/html', open: 'never' }],
  ],
})
