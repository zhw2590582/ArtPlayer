import assert from 'node:assert/strict'
import fs from 'node:fs'
import { transformSync } from 'esbuild'
import { hash } from './releases.mjs'

const base = 'refactor/baselines/multiple-subtitles-vendor'
export const vendorExports = 'export { WebVTTParser, WebVTTCueTimingsAndSettingsParser, WebVTTCueTextParser, WebVTTSerializer };'

export function adaptMultipleSubtitlesParser(upstream) {
  const start = '(function () {'
  const end = '  function exportify(object)'
  assert.equal(upstream.split(start).length, 2)
  assert.equal(upstream.split(end).length, 2)
  assert(upstream.slice(0, upstream.indexOf(start)).includes('http://creativecommons.org/publicdomain/zero/1.0/'))
  const footer = upstream.slice(upstream.indexOf(end)).replaceAll(/[\s;]/g, '')
  assert.equal(footer, 'functionexportify(object){object.WebVTTParser=WebVTTParserobject.WebVTTCueTimingsAndSettingsParser=WebVTTCueTimingsAndSettingsParserobject.WebVTTCueTextParser=WebVTTCueTextParserobject.WebVTTSerializer=WebVTTSerializer}if(typeofwindow!==\'undefined\')exportify(window)if(typeofexports!==\'undefined\')exportify(exports)})()')
  return upstream.slice(upstream.indexOf(start) + start.length, upstream.indexOf(end)) + vendorExports
}

export function checkMultipleSubtitlesVendor() {
  const provenance = JSON.parse(fs.readFileSync(`${base}/sources.json`, 'utf8'))
  for (const source of provenance.sources)
    assert.equal(hash(fs.readFileSync(source.file)), source.sha256, source.file)
  const upstream = fs.readFileSync(`${base}/parser.txt`, 'utf8')
  const local = fs.readFileSync('packages/artplayer-plugin-multiple-subtitles/src/parser.js', 'utf8')
  assert(local.startsWith('// Any copyright is dedicated to the Public Domain.'))
  const normalize = source => transformSync(source, { format: 'esm', target: 'es2020', minifyWhitespace: true, legalComments: 'none' }).code
  const expected = normalize(adaptMultipleSubtitlesParser(upstream))
  assert.equal(normalize(local), expected, 'Unreviewed WebVTT parser adaptation')
  const notices = fs.readFileSync('packages/artplayer-plugin-multiple-subtitles/THIRD_PARTY_NOTICES', 'utf8').replaceAll('\r\n', '\n')
  const license = fs.readFileSync(`${base}/license.txt`, 'utf8').replaceAll('\r\n', '\n').trim()
  assert(notices.includes(license), 'Complete upstream dedication must be distributed')
  assert(notices.includes(provenance.revision))
  return { provenance, normalizedSha256: hash(expected), localSha256LF: hash(local.replaceAll('\r\n', '\n')), noticesSha256LF: hash(notices) }
}
