import process from 'node:process'
import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'
import { soakOptions } from './test/helpers/soak-options.js'

export default defineConfig({
  ...base,
  testDir: './test/soak',
  timeout: soakOptions(process.env.ARTPLAYER_MB_SOAK_SECONDS).timeoutMs,
  workers: 2,
  outputDir: 'refactor/.cache/soak/results',
  reporter: [
    ['list'],
    ['json', { outputFile: 'refactor/.cache/soak/report.json' }],
  ],
  use: { ...base.use, trace: 'off', video: 'off' },
})
