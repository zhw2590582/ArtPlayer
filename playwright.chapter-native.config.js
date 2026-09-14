import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'

export default defineConfig(base, {
  testMatch: '**/chapter-native-media.native.js',
  outputDir: 'refactor/.cache/chapter-native/results',
  reporter: [['list'], ['json', { outputFile: 'refactor/.cache/chapter-native/report.json' }]],
})
