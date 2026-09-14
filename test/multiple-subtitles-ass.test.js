import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Frozen converter regressions use the repository Node runner.
import test from 'node:test'
import vm from 'node:vm'
import { parseHTML } from 'linkedom'
import { ensureArchive, hash, readMember } from '../refactor/scripts/releases.mjs'
import { loadModules } from './helpers/load.js'
import { multipleSubtitlesCandidate, multipleSubtitlesEnvironment } from './helpers/multiple-subtitles.js'

const release = JSON.parse(fs.readFileSync('refactor/baselines/multiple-subtitles-cores.json')).releases.find(item => item.version === '5.1.2')
const archive = await ensureArchive(release)
function read(member) {
  const bytes = readMember(archive, member)
  assert.equal(hash(bytes), release.files[member])
  return bytes.toString()
}
const published = ['main', 'legacy'].map((name) => {
  const module = { exports: {} }
  vm.runInNewContext(read(`package/dist/artplayer${name === 'main' ? '' : '.legacy'}.js`), { module, exports: module.exports }, { timeout: 5000 })
  return { name, utils: (module.exports.default || module.exports).utils }
})
const oldSource = await import(`data:text/javascript;base64,${Buffer.from(read('package/src/utils/subtitle.js')).toString('base64')}`)
const candidate = await multipleSubtitlesCandidate()
const { parseTracks, assToVtt, convertAss } = await loadModules({
  parseTracks: { file: 'packages/artplayer-plugin-multiple-subtitles/src/merge', name: 'parseTracks' },
  assToVtt: { file: 'packages/artplayer/src/utils/subtitle', name: 'assToVtt' },
  convertAss: 'packages/artplayer-plugin-multiple-subtitles/src/ass-conversion',
})
const dialogue = (text, start = '0:00:01.25', end = '0:00:03.75') => `Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`
const html = text => parseHTML(`<html><body>${text}</body></html>`).document.body.innerHTML
const samples = [
  dialogue('Plain'),
  dialogue('漢字 café & <b>bold</b>'),
  dialogue('{\\i1}Italic{\\i0}\\N Second line '),
  `${dialogue('First, comma')}\r\n${dialogue('Second', '0:00:02.50', '0:00:04.25')}`,
  dialogue('Hour', '123:04:05.67', '124:05:06.78'),
  `[Events]\nComment: not a caption\n${dialogue('Literal 2 00:00:02.000 --> 00:00:03.000 payload')}\n`,
]

test('Multiple subtitles ASS adapter preserves custom, valid, empty and nonmatching converter output exactly', () => {
  for (const converted of [
    '',
    'WEBVTT ',
    'WEBVTT\n\n',
    'Custom result',
    oldSource.assToVtt(samples[0]),
    'WEBVTT 1 00:00:01.250 --> 00:00:03.750 Changed by user',
    'WEBVTT 1 00:00:01.250 --> 00:00:03.750 Plain\n\n',
  ]) {
    let calls = 0
    const actual = convertAss(samples[0], (input) => {
      calls++
      assert.equal(input, samples[0])
      return converted
    })
    assert.equal(calls, 1)
    assert.equal(actual, converted)
  }
  for (const text of ['', '[Events]\nComment: no dialogue', dialogue('Invalid decimal', '0:00:01x25')]) {
    const converted = published[0].utils.assToVtt(text)
    assert.equal(convertAss(text, published[0].utils.assToVtt), converted)
  }
})

test('Multiple subtitles ASS adapter propagates converter failure without mounting resources', async () => {
  const error = new Error('Custom conversion failed')
  let calls = 0
  const env = multipleSubtitlesEnvironment(candidate, {
    responses: { 'a.ass': samples[0] },
    coreUtils: { assToVtt() {
      calls++
      throw error
    } },
  })
  await assert.rejects(env.factory({ subtitles: [{ name: 'ass', url: 'a.ass' }] })(env.art), value => value === error)
  assert.equal(calls, 1)
  assert.equal(env.initialized.length, 0)
  assert.equal(env.liveBlobs.size, 0)
  assert.equal(env.listeners.get('destroy').size, 0)
})

test('Multiple subtitles frozen5.1.2 main loses VTT line breaks while legacy and source retain them', () => {
  assert.equal(published[0].utils.assToVtt(dialogue('Plain')), 'WEBVTT 1 00:00:01.250 --> 00:00:03.750 Plain')
  for (const sample of samples) {
    assert.equal(published[1].utils.assToVtt(sample), oldSource.assToVtt(sample))
    assert.equal(assToVtt(sample), oldSource.assToVtt(sample))
  }
})

for (const { name, utils } of published) {
  for (const [index, sample] of samples.entries()) {
    test(`Multiple subtitles ASS5.1.2 ${name} sample${index}: preserve source cue times and text`, async () => {
      const env = multipleSubtitlesEnvironment(candidate, { coreUtils: utils, responses: { 'a.ass': sample } })
      const result = await env.factory({ subtitles: [{ name: 'ass', url: 'a.ass' }] })(env.art)
      const expected = parseTracks([oldSource.assToVtt(sample)], [{ name: 'ass' }])[0].cues.map(cue => [cue.startTime, cue.endTime, html(cue.text)])
      const actual = () => env.latestText().then(vtt => parseTracks([env.utils.unescape(vtt)], [{ name: 'ass' }])[0].cues.map(cue => [cue.startTime, cue.endTime, html(cue.text.replace(/<div class="art-subtitle-ass">|<\/div>/g, ''))]))
      assert.deepEqual(await actual(), expected)
      result.tracks(['ass'])
      assert.deepEqual(await actual(), expected)
      result.reset()
      assert.deepEqual(await actual(), expected)
      assert.equal(env.requests.length, 1)
      env.emit('destroy')
      assert.equal(env.liveBlobs.size, 0)
    })
  }
}
