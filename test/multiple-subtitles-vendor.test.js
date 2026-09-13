import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Vendor parity uses the repository Node runner.
import test from 'node:test'
import vm from 'node:vm'
import { transformSync } from 'esbuild'
import { checkMultipleSubtitlesVendor } from '../refactor/scripts/multiple-subtitles-vendor.mjs'

test('Multiple-subtitles vendor retains pinned executable content and complete standalone distribution notices', () => {
  const result = checkMultipleSubtitlesVendor()
  const notices = fs.readFileSync('packages/artplayer-plugin-multiple-subtitles/THIRD_PARTY_NOTICES', 'utf8').trim()
  const block = notices.split(/\r?\n/).map(line => line.trimEnd() ? ` * ${line.trimEnd()}` : ' *').join('\n')
  for (const suffix of ['js', 'legacy.js', 'mjs']) {
    const built = fs.readFileSync(`packages/artplayer-plugin-multiple-subtitles/dist/artplayer-plugin-multiple-subtitles.${suffix}`, 'utf8').replaceAll('\r\n', '\n')
    assert(built.includes(block), `Missing complete notice in ${suffix}`)
    assert(built.startsWith('/*!'))
  }
  assert.equal(result.provenance.revision, '380cfcce34ba8b472d3a31474874eb72a0e5f460')
})

test('Multiple-subtitles vendor parser and serializer match the pinned upstream on metadata and malformed inputs', () => {
  const upstream = { exports: {}, Date: { now: () => 123 } }
  vm.runInNewContext(fs.readFileSync('refactor/baselines/multiple-subtitles-vendor/parser.txt', 'utf8'), upstream)
  const local = { exports: {}, Date: upstream.Date }
  local.module = { exports: local.exports }
  vm.runInNewContext(transformSync(fs.readFileSync('packages/artplayer-plugin-multiple-subtitles/src/parser.js', 'utf8'), { format: 'cjs' }).code, local)
  for (const input of [
    '',
    'WEBVTT\n\n0\n00:00.000 --> 00:01.000\nhello &amp; &lt;world&gt;\n',
    '\uFEFFWEBVTT\r\n\r\nNOTE ignored\r\n\r\n00:01.000 --> 00:04.000 align:start\r\n<c.red>日本語</c>\r\n',
    'WEBVTT\n\nSTYLE\n::cue {color: red}\n\n00:01.000 --> 00:03.000\nB\n\n00:00.000 --> 00:04.000\nA\n',
    'WEBVTT\n\nbad --> timing\ntext\n',
  ]) {
    const parse = exports => new exports.WebVTTParser().parse(input, 'metadata')
    const expected = parse(upstream.exports)
    const actual = parse(local.module.exports)
    assert.deepEqual(JSON.parse(JSON.stringify(actual)), JSON.parse(JSON.stringify(expected)))
    const serialize = (exports, tree) => new exports.WebVTTSerializer().serialize(tree.cues, tree.styles)
    assert.equal(serialize(local.module.exports, actual), serialize(upstream.exports, expected))
  }
})
