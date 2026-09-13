import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules, loadPackage, loadPublishedCore } from './helpers/load.js'

const { resolveOption } = await loadModules({ resolveOption: 'packages/artplayer/src/option/resolve' })
const published = await loadPublishedCore({ navigator: { language: navigator.language, userAgent: navigator.userAgent } })
const current = {
  name: 'workspace',
  Artplayer: (await loadPackage('artplayer')).default,
}
function oldResolve(input, defaults) {
  const merged = published.Artplayer.utils.mergeDeep(defaults, input)
  merged.container = input.container
  return published.Artplayer.validator(merged, published.Artplayer.scheme)
}

for (const { name, Artplayer } of [published, current]) {
  test(`option defaults are fresh, keep all fields and callback shape: ${name}`, () => {
    const first = Artplayer.option
    const second = Artplayer.option
    assert.notEqual(first, second)
    for (const key of ['plugins', 'layers', 'controls', 'settings', 'quality', 'highlight', 'contextmenu', 'thumbnails', 'subtitle', 'moreVideoAttr', 'icons', 'i18n', 'customType', 'cssVar'])
      assert.notEqual(first[key], second[key], key)
    assert.notEqual(first.subtitle.style, second.subtitle.style)
    assert.notEqual(first.subtitle.onVttLoad, second.subtitle.onVttLoad)
    assert.equal(first.subtitle.onVttLoad(' text '), ' text ')
    assert.equal(first.subtitle.onVttLoad.length, 1)
    assert.equal(first.subtitle.onVttLoad.name, 'onVttLoad')
    assert(Object.hasOwn(first, 'proxy'))
    assert.equal(first.proxy, undefined)
    assert.equal(first.lang, navigator.language.toLowerCase())
    assert.equal(Artplayer.scheme.layers[0], Artplayer.scheme.settings[0])
    assert.equal(Artplayer.scheme.layers[0], Artplayer.scheme.contextmenu[0])
  })
}

test('default values, keys and nested order match the published getter', () => {
  assert.equal(JSON.stringify(current.Artplayer.option), JSON.stringify(published.Artplayer.option))
  assert.deepEqual(Object.keys(current.Artplayer.option), Object.keys(published.Artplayer.option))
})

test('candidate defaults are readable without navigator and keep independent option containers', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  try {
    for (const mode of ['absent', 'undefined', 'null']) {
      assert(delete globalThis.navigator)
      if (mode !== 'absent')
        Object.defineProperty(globalThis, 'navigator', { configurable: true, value: mode === 'null' ? null : undefined })
      const first = current.Artplayer.option
      const second = current.Artplayer.option
      assert.equal(first.lang, undefined, mode)
      assert(Object.hasOwn(first, 'lang'))
      assert.notEqual(first, second)
      assert.notEqual(first.subtitle, second.subtitle)
      assert.deepEqual(first.plugins, [])
      assert.equal(first.subtitle.onVttLoad('text'), 'text')
      assert.throws(() => resolveOption({ container: '#player' }, first), /option.lang/)
      assert.equal(resolveOption({ container: '#player', lang: 'en' }, first).lang, 'en')
    }
  }
  finally {
    if (descriptor)
      Object.defineProperty(globalThis, 'navigator', descriptor)
    else
      delete globalThis.navigator
  }
})

test('candidate defaults read the current browser language on each access without caching it', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  try {
    let language = 'EN-us'
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
      get language() {
        return language
      },
    } })
    for (const value of ['EN-us', 'zh-CN', '']) {
      language = value
      assert.equal(current.Artplayer.option.lang, value.toLowerCase())
    }
  }
  finally {
    if (descriptor)
      Object.defineProperty(globalThis, 'navigator', descriptor)
    else
      delete globalThis.navigator
  }
})

for (const [name, resolve, Artplayer] of [['published', oldResolve, published.Artplayer], ['workspace', resolveOption, current.Artplayer]]) {
  test(`resolved options preserve unknown fields, merge ownership and collection item identity: ${name}`, () => {
    const callback = () => {}
    const item = { html: 'Quality', url: 'a.mp4' }
    const extension = { value: 1 }
    const input = { container: '#player', url: 'video.mp4', subtitle: { style: { color: 'red' } }, thumbnails: { url: 'sprite.jpg' }, quality: [item], customType: { mp4: callback }, extension }
    const defaults = Artplayer.option
    const option = resolve(input, defaults)
    assert.equal(option.container, input.container)
    assert.notEqual(option, input)
    assert.notEqual(option.subtitle, input.subtitle)
    assert.notEqual(option.subtitle.style, input.subtitle.style)
    assert.equal(option.subtitle.style.color, 'red')
    assert.equal(option.subtitle.encoding, 'utf-8')
    assert.equal(option.thumbnails.column, 10)
    assert.notEqual(option.quality, input.quality)
    assert.equal(option.quality[0], item)
    assert.equal(option.customType.mp4, callback)
    assert.equal(option.extension, extension)
    assert.deepEqual(Object.keys(input.subtitle), ['style'])
    assert.deepEqual(Object.keys(defaults.subtitle.style), [])
  })

  test(`getter reads and inherited container restoration retain their order: ${name}`, () => {
    const reads = []
    const input = {
      get container() {
        reads.push('container')
        return '#player'
      },
      get url() {
        reads.push('url')
        return 'video.mp4'
      },
      get volume() {
        reads.push('volume')
        return 0.5
      },
    }
    const option = resolve(input, Artplayer.option)
    assert.deepEqual(reads, ['container', 'url', 'volume', 'container'])
    assert.equal(option.volume, 0.5)
    const inherited = Object.create({ container: '#inherited', url: 'ignored.mp4' })
    inherited.customField = 'own'
    const result = resolve(inherited, Artplayer.option)
    assert.equal(result.container, '#inherited')
    assert.equal(result.url, '')
    assert.equal(result.customField, 'own')
  })
}

test('invalid JS input keeps the published validation path, first error and thrown kind', () => {
  const cases = [
    { volume: undefined },
    { volume: 'loud', muted: 'yes' },
    { subtitle: { encoding: undefined } },
    { thumbnails: { number: 'many' } },
    { plugins: [42] },
    { controls: [{ html: 'Button', position: 'middle' }] },
    { quality: [{ html: 'HD', url: 42 }] },
    { proxy: null },
    { moreVideoAttr: [] },
  ]
  for (const patch of cases) {
    const input = { container: '#player', url: 'video.mp4', ...patch }
    const errors = []
    for (const [resolve, Artplayer] of [[oldResolve, published.Artplayer], [resolveOption, current.Artplayer]]) {
      assert.throws(() => resolve(input, Artplayer.option), (error) => {
        errors.push({ name: error.name, message: error.message })
        return true
      })
    }
    assert.deepEqual(errors[0], errors[1])
  }
})
