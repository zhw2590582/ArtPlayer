import assert from 'node:assert/strict'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Historical contracts use the repository Node runner.
import test from 'node:test'
import { multipleSubtitlesCandidate, multipleSubtitlesEnvironment, multipleSubtitlesHistorical, subtitleVtt } from './helpers/multiple-subtitles.js'

const implementations = process.env.ARTPLAYER_MULTIPLE_SUBTITLES_CANDIDATE === '1' || process.env.ARTPLAYER_MULTIPLE_SUBTITLES_ARTIFACT
  ? [await multipleSubtitlesCandidate()]
  : await multipleSubtitlesHistorical()
const plain = value => JSON.parse(JSON.stringify(value))

for (const implementation of implementations) {
  const create = options => multipleSubtitlesEnvironment(implementation, options)
  test(`Multiple-subtitles ${implementation.name}: required factory input and async named methods remain explicit`, async () => {
    const env = create()
    assert.throws(() => env.factory(), { name: 'TypeError' })
    const register = env.factory({})
    assert.equal(typeof register, 'function')
    const pending = register(env.art)
    assert.equal(typeof pending.then, 'function')
    assert.equal(pending.name, undefined)
    assert.equal(env.initialized.length, 0)
    const result = await pending
    assert.deepEqual(Object.keys(result), ['name', 'tracks', 'reset'])
    assert.equal(result.name, 'multipleSubtitles')
    assert.equal(result.tracks(), undefined)
    assert.equal(result.reset(), undefined)
    assert.equal(await env.latestText(), 'WEBVTT\n\n')
  })

  test(`Multiple-subtitles ${implementation.name}: all tracks load concurrently and retain historical merge topology`, async () => {
    const env = create({ responses: { 'en.vtt': subtitleVtt('English'), 'jp.vtt': subtitleVtt('Japanese') } })
    const pending = env.factory({ subtitles: [{ url: 'en.vtt', name: 'en' }, { url: 'jp.vtt', name: 'jp' }] })(env.art)
    assert.deepEqual(env.requests, ['en.vtt', 'jp.vtt'])
    await pending
    const text = env.utils.unescape(await env.latestText())
    assert(text.includes('<div class="art-subtitle-en">English</div>'))
    assert(text.includes('<div class="art-subtitle-jp">Japanese</div>'))
    assert.equal(text.match(/-->/g).length, implementation.version === '1.0.0' ? 1 : 2)
    assert(text.indexOf('art-subtitle-en') < text.indexOf('art-subtitle-jp'))
  })

  test(`Multiple-subtitles ${implementation.name}: tracks select named entries, reorder, clear and reset without another fetch`, async () => {
    const env = create({ responses: { 'en.vtt': subtitleVtt('English'), 'jp.vtt': subtitleVtt('Japanese') } })
    const result = await env.factory({ subtitles: [{ url: 'en.vtt', name: 'en' }, { url: 'jp.vtt', name: 'jp' }] })(env.art)
    result.tracks(['jp'])
    assert(!env.utils.unescape(await env.latestText()).includes('art-subtitle-en'))
    result.tracks(['jp', 'en'])
    const reversed = env.utils.unescape(await env.latestText())
    assert(reversed.indexOf('art-subtitle-jp') < reversed.indexOf('art-subtitle-en'))
    result.tracks([])
    assert.equal(await env.latestText(), 'WEBVTT\n\n')
    result.reset()
    const reset = env.utils.unescape(await env.latestText())
    assert(reset.indexOf('art-subtitle-en') < reset.indexOf('art-subtitle-jp'))
    assert.equal(reset.match(/<div/g).length, 2, 'Wrapper must not accumulate on reset')
    assert.deepEqual(env.requests, ['en.vtt', 'jp.vtt'])
  })

  test(`Multiple-subtitles ${implementation.name}: subtitle init replaces object URLs and retains live configuration`, async () => {
    const env = create()
    const result = await env.factory({ subtitles: [] })(env.art)
    assert.equal(env.art.option.subtitle.escape, false)
    assert.equal(env.initialized[0].onVttLoad, env.utils.unescape)
    assert.equal(env.initialized[0].style, env.art.option.subtitle.style)
    assert.equal(env.initialized[0].type, 'vtt')
    assert.deepEqual(env.revoked, implementation.version === 'candidate' ? [] : [''])
    env.art.option.subtitle.encoding = 'utf-16le'
    result.reset()
    assert.equal(env.initialized[1].encoding, 'utf-16le')
    assert.deepEqual(env.revoked, implementation.version === 'candidate' ? ['blob:subtitle-1'] : ['', 'blob:subtitle-1'])
    assert.equal(env.blobs.get('blob:subtitle-2').type, 'text/vtt')
  })

  test(`Multiple-subtitles ${implementation.name}: type selection dispatches existing core converters and ignores onParser`, async () => {
    let parsed = 0
    const env = create({ responses: { 'a.srt': 'source srt', 'b.ass': 'source ass', 'c.bin': subtitleVtt('Override') } })
    const onParser = () => {
      parsed++
      return {}
    }
    await env.factory({ subtitles: [{ url: 'a.srt', name: 'srt', onParser }, { url: 'b.ass', name: 'ass' }, { url: 'c.bin', name: 'override', type: 'vtt' }] })(env.art)
    assert.deepEqual(plain(env.converted), [['srt', 'source srt'], ['ass', 'source ass']])
    const text = env.utils.unescape(await env.latestText())
    for (const value of ['SRT', 'ASS', 'Override'])
      assert(text.includes(value))
    assert.equal(parsed, 0)
  })
}
