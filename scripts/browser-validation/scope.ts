import type { PlaywrightTestConfig } from '@playwright/test'
import assert from 'node:assert/strict'

export type BrowserScope = 'source' | 'installed'
export const installedPackages = ['artplayer', 'artplayer-plugin-chapter', 'artplayer-plugin-ambilight', 'artplayer-proxy-canvas', 'artplayer-plugin-document-pip', 'artplayer-plugin-ads', 'artplayer-plugin-audio-track', 'artplayer-plugin-vtt-thumbnail', 'artplayer-plugin-multiple-subtitles', 'artplayer-plugin-hls-control', 'artplayer-plugin-dash-control', 'artplayer-plugin-auto-thumbnail']
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
  'canvas-subtitles.spec.js',
  'canvas-dpip.spec.js',
  'ads.spec.js',
  'ads-ui.spec.js',
  'audio-track.spec.js',
  'audio-combinations.spec.js',
  'audio-buffering.spec.js',
  'vtt-thumbnail-lifecycle.spec.js',
  'vtt-thumbnail-combinations.spec.js',
  'multiple-subtitles-lifecycle.spec.js',
  'multiple-subtitles-legacy.spec.js',
  'multiple-subtitles-history.spec.js',
  'multiple-subtitles-entities.spec.js',
  'multiple-subtitles-combinations.spec.js',
  'multiple-subtitles-ass.spec.js',
  'multiple-subtitles-switch.spec.js',
  'hls-control.spec.js',
  'hls-sdk.spec.js',
  'dash-control.spec.js',
  'dash-sdk.spec.js',
  'auto-thumbnail.spec.js',
  'auto-thumbnail-lifecycle.spec.js',
  'auto-thumbnail-pixels.spec.js',
]

export function browserInvocation(scope: string, args: string[], environment: NodeJS.ProcessEnv) {
  assert(scope === 'source' || scope === 'installed', 'Choose source or installed browser scope')
  assert(!args.some(arg => /^(?:--(?:config|reporter|output|pass-with-no-tests)(?:=|$)|-c)/.test(arg)), 'Do not override browser scope configuration or evidence output')
  const env: NodeJS.ProcessEnv = { ...environment, ARTPLAYER_BROWSER_SCOPE: scope }
  if (scope === 'source') {
    delete env.ARTPLAYER_BROWSER_ARTIFACTS
  }
  else {
    assert(env.ARTPLAYER_BROWSER_ARTIFACTS, 'Installed browser checks require ARTPLAYER_BROWSER_ARTIFACTS')
    assert(!env.ARTPLAYER_DASH_DIAGNOSTIC_SDK || env.ARTPLAYER_DASH_DIAGNOSTIC_SDK === 'none', 'Installed browser checks require the unchanged DASH SDK')
    assert(!['ARTPLAYER_DASH_DIAGNOSE_STALL', 'ARTPLAYER_DASH_DIAGNOSE_GETTER', 'ARTPLAYER_DASH_DIAGNOSE_METRICS'].some(name => env[name] === '1'), 'Installed browser checks cannot use DASH recovery diagnostics')
  }
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
