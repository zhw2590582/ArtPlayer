import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import less from 'less'
import ts from 'typescript'

const base = new URL('../baselines/core-vendor/', import.meta.url)
const root = new URL('../../', import.meta.url)
const read = name => fs.readFileSync(new URL(name, root), 'utf8')
const sha = text => crypto.createHash('sha256').update(text).digest('hex')
const print = source => ts.createPrinter({ removeComments: true }).printFile(ts.createSourceFile('vendor.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS))

export async function checkCoreVendors() {
  const sources = JSON.parse(fs.readFileSync(new URL('sources.json', base), 'utf8'))
  for (const source of sources)
    assert.equal(sha(read(source.file)), source.sha256, `Upstream reference changed: ${source.file}`)

  const reference = fs.readFileSync(new URL('screenfull-6.0.2.txt', base), 'utf8')
  const adapted = reference
    .replace('methodList?.[1]', 'methodList[1]')
    .replace('let screenfull =', 'const screenfull =')
    .replace('document[nativeAPI.fullscreenElement] ?? undefined', 'document[nativeAPI.fullscreenElement]')
    .replace(/if \(!nativeAPI\) \{\s*screenfull = \{isEnabled: false\};\s*\}/, '')
  assert.equal(print(read('packages/artplayer/src/libs/screenfull.js')), print(adapted), 'Unreviewed screenfull changes')

  const hint = read('packages/artplayer/src/style/hint.less')
  assert(hint.startsWith('.art-video-player {'))
  const body = hint.slice(hint.indexOf('{') + 1, hint.lastIndexOf('}'))
  const upstream = fs.readFileSync(new URL('hint-2.7.0.txt', base), 'utf8')
  const render = async source => (await less.render(source, { compress: true })).css.replace(/\/\*[\s\S]*?\*\//g, '').replaceAll('"', '\'').trim()
  const expected = (await render(upstream)).replaceAll('#383838', '#000000').replace('display:inline-block}', 'display:inline-block;font-style:normal}')
  assert.equal(await render(body), expected, 'Unreviewed Hint.css changes')

  const notices = read('packages/artplayer/THIRD_PARTY_NOTICES').replaceAll('\r\n', '\n')
  for (const name of ['screenfull-license.txt', 'hint-license.txt'])
    assert(notices.includes(fs.readFileSync(new URL(name, base), 'utf8').replaceAll('\r\n', '\n').trim()), `Incomplete bundled license: ${name}`)
  return { sources, local: Object.fromEntries(['packages/artplayer/src/libs/screenfull.js', 'packages/artplayer/src/style/hint.less', 'packages/artplayer/THIRD_PARTY_NOTICES'].map(name => [name, sha(read(name).replaceAll('\r\n', '\n'))])) }
}
