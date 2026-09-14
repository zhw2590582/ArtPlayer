import type { PlaywrightTestConfig } from '@playwright/test'
import assert from 'node:assert/strict'

export type BrowserScope = 'source' | 'installed'
export const installedPackages = ['artplayer', 'artplayer-plugin-chapter', 'artplayer-plugin-ambilight', 'artplayer-proxy-canvas']
export const installedTests = [
  'playback.spec.js',
  'lifecycle.spec.js',
  'initialization.spec.js',
  'chapter.spec.js',
  'chapter-combinations.spec.js',
  'chapter-hover.spec.js',
  'ambilight-lifecycle.spec.js',
  'ambilight-proxy.spec.js',
  'canvas-lifecycle.spec.js',
]

export function browserInvocation(scope: string, args: string[], environment: NodeJS.ProcessEnv) {
  assert(scope === 'source' || scope === 'installed', 'Choose source or installed browser scope')
  assert(!args.some(arg => /^(?:--(?:config|reporter|output|pass-with-no-tests)(?:=|$)|-c)/.test(arg)), 'Do not override browser scope configuration or evidence output')
  const env: NodeJS.ProcessEnv = { ...environment, ARTPLAYER_BROWSER_SCOPE: scope }
  if (scope === 'source')
    delete env.ARTPLAYER_BROWSER_ARTIFACTS
  else
    assert(env.ARTPLAYER_BROWSER_ARTIFACTS, 'Installed browser checks require ARTPLAYER_BROWSER_ARTIFACTS')
  return { scope, env, args: ['test', `--config=playwright.${scope}.config.js`, ...args], directory: `refactor/.cache/browser-${scope}` }
}

export function browserScopeConfig(scope: BrowserScope): PlaywrightTestConfig {
  const directory = `refactor/.cache/browser-${scope}`
  return {
    testMatch: scope === 'source' ? ['**/*.spec.js'] : installedTests.map(file => `**/${file}`),
    outputDir: `${directory}/results`,
    reporter: [
      ['list'],
      ['html', { outputFolder: `${directory}/html`, open: 'never' }],
      ['json', { outputFile: `${directory}/report.json` }],
    ],
  }
}
