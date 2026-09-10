import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validatePublishedCapture } from './api.mjs'
import { hash, refactorDir } from './releases.mjs'

export function validateSsr(report) {
  assert.equal(report.kind, 'ssr')
  validatePublishedCapture(report, 'ssr')
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.unhandled, [])
  assert.deepEqual(report.checks, ['SSR.browser-reuses-player', 'SSR.browser-reuses-video', 'SSR.browser-ready', 'SSR.browser-plugin', 'SSR.browser-cleanup'].map(id => ({ id, passed: true })))
  assert.equal(report.capture.media['video.mp4'], hash(fs.readFileSync(path.resolve(refactorDir, '../docs/assets/sample/video.mp4'))))
  assert(report.observations.videoWidth > 0 && report.observations.duration > 0)
  assert.equal(report.observations.serverMarker, 'preserved')
}
export function ssrProfile(report) {
  return { checks: report.checks, observations: report.observations }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const frozen = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/ssr.json'), 'utf8'))
  validateSsr(frozen.report)
  const index = process.argv.indexOf('--compare')
  if (index !== -1) {
    assert(process.argv[index + 1], '--compare requires a report path')
    const report = JSON.parse(fs.readFileSync(process.argv[index + 1], 'utf8'))
    validateSsr(report)
    assert.deepEqual(ssrProfile(report), ssrProfile(frozen.report))
    console.log('Published browser template reuse matches SSR baseline')
  }
  else {
    assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use --check or --compare <report>')
    console.log('Frozen browser SSR evidence verified; browser was not rerun')
  }
}
