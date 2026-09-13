import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Merge and decoder regressions use the repository Node runner.
import test from 'node:test'
import { loadModules } from './helpers/load.js'
import { multipleSubtitlesCandidate, multipleSubtitlesEnvironment, multipleSubtitlesHistorical, subtitleVtt } from './helpers/multiple-subtitles.js'

const { parseTracks, serializeTracks, ...coreUtils } = await loadModules({
  parseTracks: { file: 'packages/artplayer-plugin-multiple-subtitles/src/merge', name: 'parseTracks' },
  serializeTracks: { file: 'packages/artplayer-plugin-multiple-subtitles/src/merge', name: 'serializeTracks' },
  getExt: { file: 'packages/artplayer/src/utils/file', name: 'getExt' },
  srtToVtt: { file: 'packages/artplayer/src/utils/subtitle', name: 'srtToVtt' },
  assToVtt: { file: 'packages/artplayer/src/utils/subtitle', name: 'assToVtt' },
})
const candidate = await multipleSubtitlesCandidate()
const historical = (await multipleSubtitlesHistorical()).find(item => item.name === 'published-1.2.0-main')
function freeze(value) {
  if (value && typeof value === 'object') {
    Object.freeze(value)
    for (const child of Object.values(value)) freeze(child)
  }
  return value
}

test('Multiple subtitles merge: repeated selection serializes frozen trees without accumulating wrappers', () => {
  const trees = freeze(parseTracks([subtitleVtt('A'), subtitleVtt('B')], [{ name: 'a' }, { name: 'b' }]))
  const original = JSON.stringify(trees)
  const first = serializeTracks(trees)
  serializeTracks([trees[1], trees[0], trees[1]])
  assert.equal(serializeTracks(trees), first)
  assert.equal(JSON.stringify(trees), original)
})

test('Multiple subtitles merge: actual released serializer output is preserved for text, markup and timing cases', async () => {
  const samples = [
    subtitleVtt('A & B < C > D'),
    subtitleVtt('<b>bold</b> tail'),
    subtitleVtt('<c.red>color</c> <i>italic</i>'),
    subtitleVtt('<v Speaker>voice</v>'),
    subtitleVtt('<ruby>text<rt>note</rt></ruby>'),
    subtitleVtt('line one\nline two'),
    'WEBVTT\n\n00:02.000 --> 00:05.000\nLater\n\n00:00.000 --> 00:03.000\nEarlier\n',
    subtitleVtt('best effort').replace('WEBVTT', 'BAD HEADER'),
    'WEBVTT\n\n',
  ]
  for (const body of samples) {
    const environments = [historical, candidate].map(implementation => multipleSubtitlesEnvironment(implementation, { responses: { 'a.vtt': body, 'b.vtt': subtitleVtt('second') } }))
    const results = await Promise.all(environments.map(env => env.factory({ subtitles: [{ url: 'a.vtt', name: 'a' }, { url: 'b.vtt', name: 'b' }] })(env.art)))
    for (const selection of [null, ['b', 'a', 'b'], [], ['a']]) {
      if (selection)
        results.forEach(result => result.tracks(selection))
      assert.equal(await environments[1].latestText(), await environments[0].latestText(), body)
    }
    results.forEach(result => result.reset())
    assert.equal(await environments[1].latestText(), await environments[0].latestText(), body)
    environments[1].emit('destroy')
  }
})

test('Multiple subtitles request: real core SRT/ASS conversion and encoded text retain released output', async () => {
  const responses = {
    'a.SRT?track=1': '1\n00:00:00,000 --> 00:00:02,000\nSRT text\n',
    'b.ass': 'Dialogue: 0,0:00:00.00,0:00:02.00,Default,,0,0,0,,ASS text',
    'c.vtt': Buffer.from(subtitleVtt('café'), 'latin1'),
    'd.vtt': Buffer.from(subtitleVtt('日本語'), 'utf16le'),
  }
  const options = { subtitles: [{ url: 'a.SRT?track=1', name: 'srt' }, { url: 'b.ass', name: 'ass' }, { url: 'c.vtt', name: 'latin', encoding: 'windows-1252' }, { url: 'd.vtt', name: 'utf16', encoding: 'utf-16le' }] }
  const old = multipleSubtitlesEnvironment(historical, { responses, coreUtils })
  const current = multipleSubtitlesEnvironment(candidate, { responses, coreUtils })
  await old.factory(options)(old.art)
  await current.factory(options)(current.art)
  const text = await current.latestText()
  assert.equal(text, await old.latestText())
  for (const value of ['SRT text', 'ASS text', 'café', '日本語']) assert(text.includes(value))
  current.emit('destroy')
})
