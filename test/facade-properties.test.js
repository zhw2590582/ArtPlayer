import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { attrMix, cssVarMix, typeMix, themeMix, posterMix } = await loadModules(Object.fromEntries(
  ['attrMix', 'cssVarMix', 'typeMix', 'themeMix', 'posterMix'].map(name => [name, `packages/artplayer/src/player/${name}`]),
))

test('attr retains dynamic keys, captured media, undefined reads and native receiver errors', () => {
  const symbol = Symbol('plugin')
  const video = { volume: 0.5, [symbol]: 1 }
  const error = new Error('native property')
  Object.defineProperty(video, 'throwing', {
    get() { return undefined },
    set() {
      throw error
    },
  })
  const art = { template: { $video: video } }
  attrMix(art)
  const attr = art.attr
  art.template.$video = { volume: 1 }
  assert.equal(attr('volume'), 0.5)
  assert.equal(attr('volume', undefined), 0.5)
  assert.equal(attr(symbol, 2), undefined)
  assert.equal(video[symbol], 2)
  assert.equal(attr('volume', null), undefined)
  assert.equal(video.volume, null)
  assert.throws(() => attr('throwing', 1), e => e === error)
  assert.deepEqual(Object.getOwnPropertyDescriptor(art, 'attr'), { value: attr, configurable: false, enumerable: false, writable: false })
})

test('cssVar retains falsy reads and passes truthy values to the captured native style', (t) => {
  const saved = Object.getOwnPropertyDescriptor(globalThis, 'getComputedStyle')
  t.after(() => saved ? Object.defineProperty(globalThis, 'getComputedStyle', saved) : delete globalThis.getComputedStyle)
  const writes = []
  const player = { style: { setProperty: (...args) => {
    writes.push(args)
  } } }
  globalThis.getComputedStyle = (element) => {
    assert.equal(element, player)
    return { getPropertyValue: key => `value:${key}` }
  }
  const art = { template: { $player: player } }
  cssVarMix(art)
  const cssVar = art.cssVar
  art.template.$player = {}
  for (const value of [undefined, null, false, 0, '', Number.NaN])
    assert.equal(cssVar('--custom', value), 'value:--custom')
  const object = { toString: () => 'native coercion' }
  assert.equal(cssVar('--custom', object), undefined)
  assert.equal(writes[0][1], object)
  assert.equal(Object.getOwnPropertyDescriptor(art, 'cssVar').enumerable, false)
})

test('type and theme preserve forwarding and immutable accessor descriptors', () => {
  const calls = []
  const option = { type: 'mp4' }
  const art = { option, cssVar(...args) {
    calls.push(args)
    return 'computed-theme'
  } }
  typeMix(art)
  themeMix(art)
  art.type = 'custom'
  assert.equal(option.type, 'custom')
  assert.equal(art.type, 'custom')
  assert.equal(art.theme, 'computed-theme')
  art.theme = ''
  assert.deepEqual(calls, [['--art-theme'], ['--art-theme', '']])
  for (const name of ['type', 'theme']) {
    const descriptor = Object.getOwnPropertyDescriptor(art, name)
    assert.equal(descriptor.enumerable, false)
    assert.equal(descriptor.configurable, false)
    assert.equal(typeof descriptor.get, 'function')
    assert.equal(typeof descriptor.set, 'function')
  }
})

test('poster keeps historical quoted extraction, empty fallback and original target', () => {
  const poster = { style: { backgroundImage: 'url("first.png")' } }
  const art = { template: { $poster: poster } }
  posterMix(art)
  assert.equal(art.poster, 'first.png')
  poster.style.backgroundImage = 'url(unquoted.png)'
  assert.equal(art.poster, '')
  art.template.$poster = { style: {} }
  art.poster = 'new.png'
  assert.equal(poster.style.backgroundImage, 'url(new.png)')
  assert.equal(Object.getOwnPropertyDescriptor(art, 'poster').configurable, false)
})
