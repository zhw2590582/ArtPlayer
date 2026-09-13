import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Published package contract runner.
import test from 'node:test'
import { transformSync } from 'esbuild'
import { multipleSubtitlesEnvironment, multipleSubtitlesHistorical } from '../../test/helpers/multiple-subtitles.js'
import { verifyMultipleSubtitlesContract } from './multiple-subtitles-contract.mjs'
import { adaptMultipleSubtitlesParser, checkMultipleSubtitlesVendor } from './multiple-subtitles-vendor.mjs'
import { hash, readMember } from './releases.mjs'

const contract = await verifyMultipleSubtitlesContract()
const implementations = await multipleSubtitlesHistorical()
const name = 'artplayer-plugin-multiple-subtitles'

test('Multiple-subtitles freezes three actual npm archives and Git inputs without inventing core support', () => {
  assert.deepEqual([contract.baseline.release, ...contract.baseline.previous].map(item => item.version), ['1.2.0', '1.1.0', '1.0.0'])
  assert.equal([...contract.archives].length, 3)
  assert.equal([contract.baseline.release, ...contract.baseline.previous].reduce((sum, item) => sum + Object.keys(item.files).length, 0), 20)
  assert.equal(contract.sources.size, 9)
  assert.deepEqual([contract.baseline.release, ...contract.baseline.previous].map(item => item.historicalCore.version), ['5.3.1', '5.1.7', '5.1.2'])
})

test('Multiple-subtitles published declarations keep required subtitles while omitting Promise and real methods', () => {
  for (const release of [contract.baseline.release, ...contract.baseline.previous]) {
    const source = readMember(contract.archives.get(release.version), `package/${release.manifest.types.replace(/^\.\//, '')}`).toString()
    assert.match(source, /subtitles: \{/)
    for (const field of ['url', 'name', 'encoding'])
      assert.match(source, new RegExp(`${field}\\?: string`))
    assert.match(source, /type\?: 'vtt' \| 'srt' \| 'ass'/)
    assert.match(source, /onParser\?(?::|\()/)
    assert.match(source, /name: 'multipleSubtitles'/)
    assert.doesNotMatch(source, /Promise<|tracks\(|reset\(/)
    assert.match(source, release.version === '1.2.0' ? /export default artplayerPluginMultipleSubtitles/ : /export = artplayerPluginMultipleSubtitles/)
  }
})

test('Multiple-subtitles historical CommonJS and globals load without fetching and preserve actual export shapes', () => {
  for (const implementation of implementations.filter(item => !item.name.includes('source'))) {
    const env = multipleSubtitlesEnvironment(implementation)
    assert.equal(typeof env.factory, 'function')
    assert.equal(typeof env.exported, ['1.0.0', '1.1.0'].includes(implementation.version) ? 'object' : 'function')
    if (typeof env.exported === 'object')
      assert.deepEqual(Object.keys(env.exported), ['default'])
    const browser = multipleSubtitlesEnvironment(implementation, { script: true })
    assert.equal(typeof browser.factory, 'function')
    assert.deepEqual(env.requests, [])
    assert.deepEqual(browser.requests, [])
  }
})

test('Multiple-subtitles latest native ESM exports only the factory and asynchronously registers named methods', async () => {
  const codes = [readMember(contract.archives.get('1.2.0'), 'package/dist/artplayer-plugin-multiple-subtitles.mjs').toString(), contract.sources.get(`packages/${name}/dist/${name}.mjs`)]
  for (const code of codes) {
    const exported = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
    assert.deepEqual(Object.keys(exported), ['default'])
    const env = multipleSubtitlesEnvironment(implementations[0])
    try {
      const pending = exported.default({ subtitles: [] })(env.art)
      assert.equal(pending.name, undefined)
      const result = await pending
      assert.deepEqual(Object.keys(result), ['name', 'tracks', 'reset'])
      assert.equal(result.tracks([]), undefined)
    }
    finally {
      for (const option of env.initialized)
        URL.revokeObjectURL(option.url)
    }
  }
})

test('Multiple-subtitles shipped source parsers match the pinned upstream adaptation', () => {
  const normalized = checkMultipleSubtitlesVendor().normalizedSha256
  for (const release of contract.baseline.previous) {
    const source = readMember(contract.archives.get(release.version), 'package/src/parser.js').toString()
    assert(source.startsWith('// Any copyright is dedicated to the Public Domain.'))
    assert.equal(hash(transformSync(adaptMultipleSubtitlesParser(source), { format: 'esm', target: 'es2020', minifyWhitespace: true, legalComments: 'none' }).code), normalized)
  }
})

test('Multiple-subtitles README and demo retain name-based switching, reset and per-language CSS hooks', () => {
  for (const release of [contract.baseline.release, ...contract.baseline.previous])
    assert.match(readMember(contract.archives.get(release.version), 'package/README.md').toString(), /example=multiple\.subtitles/)
  const source = contract.sources.get('docs/assets/example/multiple.subtitles.js')
  assert(source.includes('art.plugins.multipleSubtitles.tracks('))
  assert(source.includes('art.plugins.multipleSubtitles.reset()'))
  for (const language of ['chinese', 'japanese'])
    assert(source.includes(`.art-subtitle-${language}`))
  for (const file of ['video.mp4', 'subtitle.cn.srt', 'subtitle.jp.srt']) {
    assert(source.includes(`/assets/sample/${file}`))
    assert(fs.existsSync(`docs/assets/sample/${file}`))
  }
})
