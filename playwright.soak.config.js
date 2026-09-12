import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'

export default defineConfig({
  ...base,
  testDir: './test/soak',
  timeout: 270000,
  workers: 2,
  outputDir: 'refactor/.cache/soak/results',
  reporter: [
    ['list'],
    ['json', { outputFile: 'refactor/.cache/soak/report.json' }],
  ],
  use: { ...base.use, trace: 'off', video: 'off' },
})
