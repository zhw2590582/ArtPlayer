import assert from 'node:assert/strict'
import process from 'node:process'
import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'

assert(!process.env.ARTPLAYER_BROWSER_ARTIFACTS, 'Native VAST source validation does not accept unrelated artifact maps')
export default defineConfig(base, {
  testMatch: ['**/vast.native.js', '**/vast-recovery.native.js', '**/vast-skip.native.js'],
  timeout: 30000,
  workers: 1,
  outputDir: 'refactor/.cache/vast-native/results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'refactor/.cache/vast-native/html', open: 'never' }],
    ['json', { outputFile: 'refactor/.cache/vast-native/report.json' }],
  ],
})
