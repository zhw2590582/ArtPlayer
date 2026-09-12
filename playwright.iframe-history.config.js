import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.ARTPLAYER_IFRAME_HISTORY_PORT || 8085)

export default defineConfig({
  testDir: './test/history',
  timeout: 20000,
  expect: { timeout: 7000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : 3,
  outputDir: 'refactor/.cache/iframe-history/results',
  reporter: [['list'], ['json', { outputFile: 'refactor/.cache/iframe-history/report.json' }]],
  use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chromium', launchOptions: { ignoreDefaultArgs: ['--disable-back-forward-cache'] } } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: { command: 'node test/history/server.mjs', url: `http://127.0.0.1:${port}/manifest.json`, reuseExistingServer: false, timeout: 60000, env: { ARTPLAYER_IFRAME_HISTORY_PORT: String(port) } },
})
