import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules, loadPackage, loadPublishedCore } from './helpers/load.js'

const { I18n, html } = await loadModules({
  I18n: 'packages/artplayer/src/i18n/index',
  html: 'packages/artplayer/src/template/html',
})

test('language selection, extension and fallback preserve case and truthy semantics', () => {
  const host = { option: { lang: 'ZH-CN', i18n: { 'zh-cn': { Play: 'custom' }, 'extension': { Play: 'extension', Empty: '' } } } }
  const i18n = new I18n(host)
  assert.equal(i18n.get('Play'), 'custom')
  assert.equal(i18n.get('Pause'), '暂停')
  assert.equal(i18n.get('Missing'), 'Missing')
  host.option.lang = 'EXTENSION'
  assert.equal(i18n.update({ extension: { Pause: 'pause' } }), undefined)
  assert.equal(i18n.get('Play'), 'extension')
  assert.equal(i18n.get('Pause'), 'pause')
  assert.equal(i18n.get('Empty'), 'Empty')
  assert.deepEqual(host.option.i18n.extension, { Play: 'extension', Empty: '' })
  host.option.lang = 'UNKNOWN'
  i18n.init()
  assert.equal(i18n.get('Play'), 'Play')
})

test('prototype names fall back as strings and explicit own translations remain usable', () => {
  const host = { option: { lang: 'constructor', i18n: {} } }
  const i18n = new I18n(host)
  for (const key of ['constructor', 'toString', '__proto__'])
    assert.equal(i18n.get(key), key)
  i18n.update(JSON.parse('{"constructor":{"constructor":"ctor","toString":"string","__proto__":"proto"}}'))
  assert.equal(i18n.get('constructor'), 'ctor')
  assert.equal(i18n.get('toString'), 'string')
  assert.equal(i18n.get('__proto__'), 'proto')
  assert.equal(Object.getPrototypeOf(i18n.languages), Object.prototype)
  assert.equal(Object.getPrototypeOf(i18n.language), Object.prototype)
})

test('language updates remain isolated between instances', () => {
  const host = { option: { lang: 'zh-cn', i18n: {} } }
  const first = new I18n(host)
  const second = new I18n(host)
  first.update({ 'zh-cn': { Play: 'first' } })
  assert.equal(first.get('Play'), 'first')
  assert.equal(second.get('Play'), '播放')
})

test('SSR imports expose exact historical template and retain browser-only construction', async () => {
  const { Artplayer: published } = await loadPublishedCore()
  const { default: candidate } = await loadPackage('artplayer')
  assert.equal(html, candidate.html)
  assert.equal(candidate.html.replace(candidate.version, '<version>'), published.html.replace(published.version, '<version>'))
  for (const Artplayer of [published, candidate]) {
    assert.throws(() => new Artplayer({ container: '#player', url: '' }), {
      message: 'Artplayer can only be used in the browser environment',
    })
    assert.equal(Artplayer.instances.length, 0)
  }
})
