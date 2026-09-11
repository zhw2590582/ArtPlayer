import assert from 'node:assert/strict'
import process from 'node:process'
import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'

assert(process.env.ARTPLAYER_BROWSER_ARTIFACTS, 'Performance requires ARTPLAYER_BROWSER_ARTIFACTS from yarn test:package')

export default defineConfig({
  ...base,
  testDir: './test/performance',
  timeout: 180000,
  fullyParallel: false,
  workers: 1,
  outputDir: 'refactor/.cache/performance/browser/results',
  reporter: [
    ['list'],
    ['json', { outputFile: 'refactor/.cache/performance/browser/report.json' }],
  ],
  use: {
    ...base.use,
    trace: 'off',
    video: 'off',
    screenshot: 'only-on-failure',
  },
})
