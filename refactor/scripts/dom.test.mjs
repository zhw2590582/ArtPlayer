import assert from 'node:assert/strict'
import test from 'node:test'
import { domProfile, validateDomReport, verifyFrozenDom } from './dom.mjs'

test('DOM baseline rejects absent interaction, fake input and wrong media', () => {
  const frozen = verifyFrozenDom().report
  for (const mutate of [
    report => report.checks.pop(),
    report => report.interactions.find(item => item.code === 'ArrowRight').trusted = false,
    report => report.interactions.find(item => item.code === 'ArrowRight').afterTime = 0,
    report => report.interactions.find(item => item.code === 'ArrowRight' && item.target === 'INPUT').afterHotkeys++,
    report => report.capture.media['video.mp4'] = 'wrong',
    report => report.unhandled.push('unexpected'),
  ]) {
    const changed = structuredClone(frozen)
    mutate(changed)
    assert.throws(() => validateDomReport(changed))
  }
})

test('DOM comparison detects class, variable and layout changes without freezing subpixel widths', () => {
  const frozen = verifyFrozenDom().report
  const expected = domProfile(frozen)
  const jitter = structuredClone(frozen)
  jitter.observations.wide.controls[0].width += 0.01
  assert.deepEqual(domProfile(jitter), expected)
  for (const mutate of [
    report => report.snapshot.tree.attributes.class = 'renamed',
    report => report.snapshot.cssVariables.pop(),
    report => report.snapshot.controlAttributes[0].role = 'button',
    report => report.observations.narrow.controls[0].withinPlayer = false,
  ]) {
    const changed = structuredClone(frozen)
    mutate(changed)
    assert.notDeepEqual(domProfile(changed), expected)
  }
})
