import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Frozen historical failure characterization.
import test from 'node:test'
import { acceptedVttText, vttText, vttThumbnailEnvironment, vttThumbnailHistorical } from './helpers/vtt-thumbnail.js'

for (const implementation of await vttThumbnailHistorical()) {
  const text = acceptedVttText(implementation)
  test(`VTT-thumbnail ${implementation.name} historical: pending fetch creates controls after destroy without cancellation`, async () => {
    const env = vttThumbnailEnvironment(implementation, { text, deferred: true })
    const pending = env.factory({ vtt: '/old.vtt' })(env.art)
    await env.emit('destroy')
    assert.equal(env.requests[0].length, 1, 'No AbortSignal or request options')
    env.resolve()
    assert.equal((await pending).name, 'artplayerPluginVttThumbnail')
    assert.equal(env.controls.length, 1)
    await env.hover(0.3)
    assert.equal(env.styles.backgroundImage, 'url(/sheet.jpg)')
    assert.equal(env.listeners.get('destroy'), undefined)
  })

  test(`VTT-thumbnail ${implementation.name} historical: network and response-body failures preserve the original rejection`, async () => {
    for (const phase of ['fetch', 'text']) {
      const env = vttThumbnailEnvironment(implementation, { text, deferred: phase === 'fetch' })
      const failure = new Error(`${phase} failed`)
      if (phase === 'text')
        env.box.fetch = async () => ({ text: async () => { throw failure } })
      const pending = env.factory({ vtt: '/cues.vtt' })(env.art)
      if (phase === 'fetch')
        env.reject(failure)
      await assert.rejects(pending, error => error === failure)
      assert.equal(env.controls.length, 0)
      assert.equal(env.listeners.size, 0)
      assert.equal(env.timers.size, 0)
    }
  })

  test(`VTT-thumbnail ${implementation.name} historical: HTTP failure status is ignored when its body parses`, async () => {
    const env = vttThumbnailEnvironment(implementation)
    env.box.fetch = async () => ({ ok: false, status: 404, text: async () => text })
    await env.factory({ vtt: '/missing.vtt' })(env.art)
    await env.hover(0.3)
    assert.equal(env.styles.backgroundImage, 'url(/sheet.jpg)')
  })

  test(`VTT-thumbnail ${implementation.name} historical: empty and header-only responses create an empty hidden preview`, async () => {
    for (const source of ['', 'WEBVTT\r\n\r\n']) {
      const env = vttThumbnailEnvironment(implementation, { text: source })
      await env.factory({ vtt: '/empty.vtt' })(env.art)
      assert.equal(env.controls.length, 1)
      await env.hover(0.3)
      assert.equal(env.styles.display, 'none')
    }
  })

  test(`VTT-thumbnail ${implementation.name} historical: unmatched timestamps, missing payload, cue IDs and NOTE reject before mounting`, async () => {
    for (const source of [
      'WEBVTT\n\nnot a timestamp\nsheet.jpg#xywh=0,0,80,45',
      'WEBVTT\n\n00:00.000 --> 00:05.000',
      'WEBVTT\n\n00:00.000 --> 00:05.000\nsheet.jpg',
      'WEBVTT\n\ncue-id\n00:00.000 --> 00:05.000\nsheet.jpg#xywh=0,0,80,45',
      'WEBVTT\n\nNOTE comment\n\n00:00.000 --> 00:05.000\nsheet.jpg#xywh=0,0,80,45',
    ]) {
      const env = vttThumbnailEnvironment(implementation, { text: acceptedVttText(implementation, source) })
      await assert.rejects(env.factory({ vtt: '/invalid.vtt' })(env.art), error => error.name === 'TypeError')
      assert.equal(env.controls.length, 0)
    }
  })

  test(`VTT-thumbnail ${implementation.name} historical: raw reordered xywh keys and malformed coordinate values reach styling`, async () => {
    for (const [coordinates, expected] of [
      ['yxhw=20,10,45,80', { width: '80px', height: '45px', backgroundPosition: '-10px -20px' }],
      ['xywh=bad,-2,80', { width: '80px', height: 'undefinedpx', backgroundPosition: '-badpx --2px' }],
    ]) {
      const env = vttThumbnailEnvironment(implementation, { text: acceptedVttText(implementation, `WEBVTT\n\n00:00.000 --> 00:10.000\nsheet.jpg#${coordinates}`) })
      await env.factory({ vtt: '/cues.vtt' })(env.art)
      await env.hover(0.3)
      for (const [key, value] of Object.entries(expected)) assert.equal(env.styles[key], value)
    }
  })

  test(`VTT-thumbnail ${implementation.name} historical: restart retains the original cue list without another request`, async () => {
    const env = vttThumbnailEnvironment(implementation, { text })
    const options = { vtt: '/old/cues.vtt' }
    await env.factory(options)(env.art)
    options.vtt = '/new/cues.vtt'
    await env.emit('restart', '/new-video.mp4')
    await env.hover(0.7)
    assert.equal(env.requests.length, 1)
    assert.equal(env.styles.backgroundImage, 'url(/old/second.jpg)')
  })

  test(`VTT-thumbnail ${implementation.name} historical: gaps and non-finite percentages hide without selecting another cue`, async () => {
    const env = vttThumbnailEnvironment(implementation, { text: acceptedVttText(implementation, vttText.replace('00:00:05.100', '00:00:07.100')) })
    await env.factory({ vtt: '/cues.vtt' })(env.art)
    await env.hover(0.3)
    assert.equal(env.styles.backgroundImage, 'url(/sheet.jpg)')
    await env.hover(0.6)
    assert.equal(env.styles.display, 'none')
    await env.hover(Number.NaN)
    assert.equal(env.styles.display, 'none')
  })

  if (implementation.profile !== 'mouse-source-only') {
    test(`VTT-thumbnail ${implementation.name} historical: destroy leaves the mobile timer and setBar callback active`, async () => {
      const env = vttThumbnailEnvironment(implementation, { text, mobile: true })
      await env.factory({ vtt: '/cues.vtt' })(env.art)
      await env.hover(0.3, 'played', {})
      const timer = [...env.timers.values()][0]
      await env.emit('destroy')
      assert.equal(env.timers.size, 1)
      assert.equal(env.listeners.get('setBar').length, 1)
      env.styles.display = 'sentinel'
      timer.callback()
      assert.equal(env.styles.display, 'none', 'A stale callback still writes the old element')
      await env.hover(0.7)
      assert.equal(env.styles.backgroundImage, 'url(/second.jpg)')
    })
  }
}

test('VTT-thumbnail frozen current implementation parses every cue in the real local demo VTT', async () => {
  const implementation = (await vttThumbnailHistorical()).find(item => item.name === 'frozen-workspace-source')
  const text = fs.readFileSync('docs/assets/sample/bbb-thumbnails.vtt', 'utf8')
  const rows = text.match(/bbb-sprite\.jpg#xywh=[^\r\n]+/g)
  assert(rows.length > 100)
  const env = vttThumbnailEnvironment(implementation, { text })
  await env.factory({ vtt: '/assets/sample/bbb-thumbnails.vtt' })(env.art)
  env.art.duration = rows.length * 5
  for (const [index, row] of rows.entries()) {
    await env.hover((index * 5 + 2.5) / env.art.duration)
    const [x, y, width, height] = row.split('=')[1].split(',')
    assert.equal(env.styles.backgroundImage, 'url(/assets/sample/bbb-sprite.jpg)')
    assert.equal(env.styles.backgroundPosition, `-${x}px -${y}px`)
    assert.equal(env.styles.width, `${width}px`)
    assert.equal(env.styles.height, `${height}px`)
  }
})
