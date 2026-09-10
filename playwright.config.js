import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.ARTPLAYER_BROWSER_PORT || 8084)
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './test/browser',
  timeout: 20000,
  expect: { timeout: 7000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : 3,
  outputDir: 'refactor/.cache/browser/results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'refactor/.cache/browser/html', open: 'never' }],
    ['json', { outputFile: 'refactor/.cache/browser/report.json' }],
  ],
  use: {
    baseURL,
    viewport: { width: 960, height: 720 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'node test/browser/server.mjs',
    url: `${baseURL}/test/manifest.json`,
    reuseExistingServer: false,
    timeout: 60000,
    env: { ARTPLAYER_BROWSER_PORT: String(port) },
  },
})
