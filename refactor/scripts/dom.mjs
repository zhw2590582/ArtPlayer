import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validatePublishedCapture } from './api.mjs'
import { hash, refactorDir } from './releases.mjs'

export const domChecks = [
  'DOM.chapter-markup', 'DOM.control-click', 'DOM.control-remove', 'DOM.control-update',
  'DOM.destroy', 'DOM.fullscreen-web-enter', 'DOM.fullscreen-web-exit', 'DOM.input-ignores-hotkey',
  'DOM.keyboard-seek', 'DOM.layer-remove', 'DOM.narrow-container', 'DOM.setting-remove',
  'DOM.setting-select', 'DOM.setting-update', 'DOM.user-style', 'DOM.version-template',
]

export function validateDomReport(report) {
  assert.equal(report.kind, 'dom')
  assert.deepEqual(report.errors, [], 'DOM capture failed')
  assert.deepEqual(report.unhandled, [], 'Unexpected DOM rejection')
  assert.deepEqual(report.checks, domChecks.map(id => ({ id, passed: true })), 'Missing DOM checks')
  validatePublishedCapture(report, 'dom')
  assert.equal(report.capture.media['video.mp4'], hash(fs.readFileSync(path.resolve(refactorDir, '../docs/assets/sample/video.mp4'))), 'DOM media changed')
  const s = report.snapshot
  assert(s.template.includes('art-video-player') && s.tree.children.length && s.cssVariables.length > 0 && s.cssClasses.length > 0, 'Incomplete DOM/CSS snapshot')
  assert.equal(s.chapterStylePresent, true)
  assert(s.controlAttributes.length >= 8)
  assert.deepEqual(report.observations.selected, { html: 'High', defaults: [false, true] })
  for (const [name, width, height] of [['wide', 640, 360], ['narrow', 320, 180]]) {
    assert.equal(report.observations[name].width, width)
    assert.equal(report.observations[name].height, height)
    assert(report.observations[name].controls.length >= 8, 'Missing layout measurement')
  }
  const keys = report.interactions.filter(item => item.code)
  assert(keys.every(item => item.trusted), 'Input was not trusted browser interaction')
  const seek = keys.find(item => item.code === 'ArrowRight' && item.target !== 'INPUT')
  assert(seek?.focused && seek.afterTime === seek.time + 5 && seek.afterHotkeys === seek.hotkeys + 1, 'Missing real keyboard seek')
  const input = keys.find(item => item.code === 'ArrowRight' && item.target === 'INPUT')
  assert(input?.focused && input.afterTime === input.time && input.afterHotkeys === input.hotkeys, 'Input consumed a player hotkey')
  assert(keys.some(item => item.code === 'Escape' && item.focused && item.afterHotkeys === item.hotkeys + 1), 'Missing Escape interaction')
  assert.equal(keys.filter(item => item.code === 'Tab').length, 2, 'Missing Tab traversal')
  const focus = report.interactions.filter(item => item.focus).slice(0, 3)
  assert.deepEqual(focus, [{ focus: 'BUTTON', label: null, id: 'tab-start' }, { focus: 'INPUT', label: 'Typing probe', id: '' }, { focus: 'BUTTON', label: null, id: 'narrow' }], 'Published focus traversal changed; assess accessibility improvements explicitly')
}

export function domProfile(report) {
  return {
    snapshot: report.snapshot,
    checks: report.checks,
    selected: report.observations.selected,
    layouts: Object.fromEntries(['wide', 'narrow'].map(name => {
      const { width, height, controls } = report.observations[name]
      return [name, { width, height, controls: controls.map(({ class: className, withinPlayer, display }) => ({ class: className, withinPlayer, display })) }]
    })),
  }
}

export function verifyFrozenDom() {
  const frozen = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/dom.json'), 'utf8'))
  assert.equal(frozen.schemaVersion, 1)
  validateDomReport(frozen.report)
  assert.equal(hash(JSON.stringify(domProfile(frozen.report))), frozen.verification.profileSha256, 'Frozen DOM profile changed')
  return frozen
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const frozen = verifyFrozenDom()
  const index = process.argv.indexOf('--compare')
  if (index !== -1) {
    assert(process.argv[index + 1], '--compare requires a report path')
    const captured = JSON.parse(fs.readFileSync(process.argv[index + 1], 'utf8'))
    validateDomReport(captured)
    assert.deepEqual(domProfile(captured), domProfile(frozen.report), 'Published DOM profile differs; review the change')
    console.log('Published DOM capture matches baseline; this comparison is not a candidate accessibility gate')
  }
  else {
    assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use --check or --compare <report>')
    console.log(`Frozen DOM verified: ${domChecks.length} checks; this command does not rerun the browser`)
  }
}
