import type { PlaywrightTestConfig } from '@playwright/test'
import assert from 'node:assert/strict'

export type BrowserScope = 'source' | 'installed'
export const installedPackages = ['artplayer', 'artplayer-plugin-chapter', 'artplayer-plugin-ambilight', 'artplayer-proxy-canvas', 'artplayer-plugin-document-pip', 'artplayer-plugin-ads', 'artplayer-plugin-audio-track', 'artplayer-plugin-vtt-thumbnail', 'artplayer-plugin-multiple-subtitles', 'artplayer-plugin-hls-control', 'artplayer-plugin-dash-control', 'artplayer-plugin-auto-thumbnail', 'artplayer-plugin-asr', 'artplayer-plugin-chromecast', 'artplayer-proxy-mediabunny', 'artplayer-plugin-jassub', 'artplayer-plugin-danmuku', 'artplayer-plugin-danmuku-mask', 'artplayer-tool-iframe', 'artplayer-plugin-vast']
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
  'asr-audio.spec.js',
  'asr-playback.spec.js',
  'asr-fallback.spec.js',
  'asr-cors.spec.js',
  'asr-capture-cors.spec.js',
  'asr-no-audio.spec.js',
  'asr-media-error.spec.js',
  'asr-audio-track.spec.js',
  'chromecast-lifecycle.spec.js',
  'mediabunny-audio.spec.js',
  'mediabunny-capability.spec.js',
  'mediabunny-dpip.spec.js',
  'mediabunny-entry.spec.js',
  'mediabunny-hls.spec.js',
  'mediabunny-inputs.spec.js',
  'mediabunny-load.spec.js',
  'mediabunny-shim.spec.js',
  'mediabunny-video.spec.js',
  'mediabunny.spec.js',
  'jassub-native.spec.js',
  'jassub-lifecycle.spec.js',
  'jassub-hybrid.spec.js',
  'jassub-render-failure.spec.js',
  'jassub-platform.spec.js',
  'danmuku-baseline.spec.js',
  'danmuku-dpip.spec.js',
  'danmuku-fullscreen.spec.js',
  'danmuku-heatmap-density.spec.js',
  'danmuku-input.spec.js',
  'danmuku-lifetime.spec.js',
  'danmuku-load-baseline.spec.js',
  'danmuku-mask-boundary.spec.js',
  'danmuku-mask-native.spec.js',
  'danmuku-resources.spec.js',
  'danmuku-scheduler.spec.js',
  'danmuku-stability.spec.js',
  'danmuku-timing-diagnostic.spec.js',
  'iframe.spec.js',
  'iframe-boundaries.spec.js',
  'iframe-navigation.spec.js',
  'iframe-player.spec.js',
  'iframe-editor.spec.js',
  'vast-package.spec.js',
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
    assert(env.ARTPLAYER_MB_BROWSER_CANDIDATE !== '1', 'Installed browser checks must retain MediaBunny historical controls')
    assert(env.ARTPLAYER_MASK_PROFILE !== '1', 'Installed browser checks cannot enable Mask CPU profiling')
    assert(!['ARTPLAYER_IFRAME_BASELINE', 'ARTPLAYER_IFRAME_LIFECYCLE_ONLY', 'ARTPLAYER_IFRAME_BOUNDARIES_ONLY'].some(name => env[name] === '1'), 'Installed browser checks must retain Iframe candidate and historical controls')
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
