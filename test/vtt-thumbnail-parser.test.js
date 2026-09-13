import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Pure parser regression runner.
import test from 'node:test'
import { loadModules } from './helpers/load.js'
import { vttThumbnailCandidate, vttThumbnailEnvironment } from './helpers/vtt-thumbnail.js'

const baseline = process.env.ARTPLAYER_VTT_PARSER_BASELINE === '1'
const module = baseline
  ? await import(`data:text/javascript,${encodeURIComponent(execFileSync('git', ['show', '524ddf784fdc143d3020040e4de1a9e0921698ce:packages/artplayer-plugin-vtt-thumbnail/src/parseVtt.js'], { encoding: 'utf8' }))}`)
  : await loadModules({ defaultParser: 'packages/artplayer-plugin-vtt-thumbnail/src/parseVtt' })
const parse = baseline ? module.default : module.defaultParser
const implementation = await vttThumbnailCandidate()
const cue = (time = '00:00.900 --> 00:05.900', image = 'sprite.jpg#xywh=10,20,80,45') => `${time}\n${image}`

test('VTT parser retains floored boundaries, raw xywh fields and lexical relative URL joining', () => {
  assert.deepEqual(parse(`WEBVTT\n\n${cue()}`, 'https://cdn.test/path/cues.vtt'), [{ start: 0, end: 5, url: 'https://cdn.test/path/sprite.jpg', x: '10', y: '20', w: '80', h: '45' }])
  assert.equal(parse(`WEBVTT\n${cue(undefined, '../sprite.jpg#yxhw=20,10,45,80')}`, '/folder/cues.vtt')[0].url, '/folder/../sprite.jpg')
})

test('VTT parser accepts BOM, CRLF, header annotations, cue IDs, timing settings and NOTE blocks', () => {
  const text = `\uFEFFWEBVTT thumbnails\r\n\r\nNOTE author\r\nignored comment\r\n\r\nfirst-id\r\n${cue('00:00.900\t-->\t00:05.900 align:start')}`
  assert.equal(parse(text)[0].w, '80')
  assert.equal(parse(text)[0].end, 5)
})

test('VTT parser ignores STYLE and REGION blocks without applying caption CSS', () => {
  const text = `WEBVTT\n\nSTYLE\n::cue { color: red }\n\nREGION\nid:region1\nwidth:50%\n\n${cue()}`
  assert.equal(parse(text).length, 1)
})

test('VTT parser preserves compact arrows, seconds-only legacy timestamps and dense cue pairs', () => {
  assert.deepEqual(parse(`WEBVTT\n${cue('00-->05')}\n${cue('05-->10')}`).map(item => [item.start, item.end]), [[0, 5], [5, 10]])
  assert.equal(parse(`WEBVTT\n${cue('00:70-->01:20')}`)[0].start, 70, 'Keep previously accepted numeric time arithmetic outside strict subtitle syntax')
})

test('VTT parser reads complete long-hour timestamps instead of truncating to their last two digits', () => {
  const parsed = parse(`WEBVTT\n${cue('123:00:00.100 --> 123:00:05.900')}`)
  assert.equal(parsed[0].start, 442800)
  assert.equal(parsed[0].end, 442805)
})

test('VTT parser keeps empty documents, empty header and comment-only documents empty', () => {
  for (const text of ['', ' \n\t', '\uFEFFWEBVTT', 'WEBVTT\n\nNOTE empty\ncomment\n'])
    assert.deepEqual(parse(text), [])
})

test('VTT parser retains valid decimal coordinates and all four-key permutations', () => {
  for (const keys of ['xywh', 'yxhw', 'whxy', 'hyxw']) {
    const values = { x: '0.5', y: '2.25', w: '80.5', h: '45.25' }
    const parsed = parse(`WEBVTT\n${cue(undefined, `sprite.jpg#${keys}=${[...keys].map(key => values[key]).join(',')}`)}`)[0]
    for (const key of keys)
      assert.equal(parsed[key], values[key])
  }
})

test('VTT parser preserves legacy zero-length cues and blank separators inside dense pairs', () => {
  const parsed = parse('WEBVTT\n00:05.000-->00:05.000\n\nsprite.jpg#xywh=0,0,80,45')
  assert.equal(parsed[0].start, 5)
  assert.equal(parsed[0].end, 5)
})

test('VTT parser refuses non-text and numeric overflow without returning partial cues', () => {
  for (const input of [null, undefined, 12, {}])
    assert.throws(() => parse(input), error => error instanceof TypeError && /line 1:/.test(error.message))
  const overflow = '9'.repeat(400)
  assert.throws(() => parse(`WEBVTT\n${cue(`${overflow}:00:00.000 --> ${overflow}:00:05.000`)}`), /numeric range/)
  assert.throws(() => parse(`WEBVTT\n${cue()}\n\n${cue(undefined, `sprite.jpg#xywh=0,0,${overflow},45`)}`), /finite/)
})

for (const [label, text, line] of [
  ['invalid header', `WRONG\n\n${cue()}`, 1],
  ['missing timing after cue id', 'WEBVTT\n\nfirst-id', 3],
  ['missing image', 'WEBVTT\n\n00:00.000 --> 00:05.000', 3],
  ['bad timestamp separator', `WEBVTT\n\n${cue('00:00x100 --> 00:05.000')}`, 3],
  ['bad fractional timestamp', `WEBVTT\n\n${cue('00:00.1 --> 00:05.000')}`, 3],
  ['reverse interval', `WEBVTT\n\n${cue('00:05.000 --> 00:00.000')}`, 3],
  ['missing rectangle', `WEBVTT\n\n${cue(undefined, 'sprite.jpg')}`, 4],
  ['duplicate rectangle keys', `WEBVTT\n\n${cue(undefined, 'sprite.jpg#xxwh=0,0,80,45')}`, 4],
  ['unknown rectangle keys', `WEBVTT\n\n${cue(undefined, 'sprite.jpg#abcd=0,0,80,45')}`, 4],
  ['missing coordinate', `WEBVTT\n\n${cue(undefined, 'sprite.jpg#xywh=0,0,80')}`, 4],
  ['extra coordinate', `WEBVTT\n\n${cue(undefined, 'sprite.jpg#xywh=0,0,80,45,5')}`, 4],
  ['negative position', `WEBVTT\n\n${cue(undefined, 'sprite.jpg#xywh=-1,0,80,45')}`, 4],
  ['non-finite width', `WEBVTT\n\n${cue(undefined, 'sprite.jpg#xywh=0,0,Infinity,45')}`, 4],
  ['zero width', `WEBVTT\n\n${cue(undefined, 'sprite.jpg#xywh=0,0,0,45')}`, 4],
  ['non-numeric width', `WEBVTT\n\n${cue(undefined, 'sprite.jpg#xywh=0,0,bad,45')}`, 4],
]) {
  test(`VTT parser reports ${label} as a TypeError with the original line`, async () => {
    assert.throws(() => parse(text), error => error instanceof TypeError && error.message.includes(`line ${line}:`))
    const env = vttThumbnailEnvironment(implementation, { text })
    await assert.rejects(env.factory({})(env.art), error => error.name === 'TypeError' && error.message.includes(`line ${line}:`))
    assert.equal(env.controls.length, 0)
    assert([...env.listeners.values()].every(items => items.length === 0))
  })
}

test('VTT parser handles every real demo cue identically to the frozen parser', async () => {
  const old = await import(`data:text/javascript,${encodeURIComponent(execFileSync('git', ['show', '524ddf784fdc143d3020040e4de1a9e0921698ce:packages/artplayer-plugin-vtt-thumbnail/src/parseVtt.js'], { encoding: 'utf8' }))}`)
  const text = fs.readFileSync('docs/assets/sample/bbb-thumbnails.vtt', 'utf8')
  const actual = parse(text, '/assets/sample/bbb-thumbnails.vtt')
  assert.equal(actual.length, 120)
  assert.deepEqual(actual, old.default(text, '/assets/sample/bbb-thumbnails.vtt'))
})

test('VTT candidate registers extended VTT and retains first-match selection for overlapping unsorted cues', async () => {
  const env = vttThumbnailEnvironment(implementation, { text: `WEBVTT\n\nNOTE comment\n\nlate\n${cue('00:04.100 --> 00:08.900', 'first.jpg#xywh=0,0,80,45')}\n\nearly\n${cue('00:00.900 --> 00:05.900', 'second.jpg#xywh=80,0,80,45')}` })
  await env.factory({})(env.art)
  await env.hover(0.4)
  assert.equal(env.styles.backgroundImage, 'url(first.jpg)')
  await env.hover(0.3)
  assert.equal(env.styles.backgroundImage, 'url(second.jpg)')
  await env.emit('destroy')
})
