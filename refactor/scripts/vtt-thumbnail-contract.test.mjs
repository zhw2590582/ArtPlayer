import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Node frozen release-contract runner.
import test from 'node:test'
import vm from 'node:vm'
import { acceptedVttText, vttText, vttThumbnailEnvironment, vttThumbnailHistorical } from '../../test/helpers/vtt-thumbnail.js'
import { readMember } from './releases.mjs'
import { verifyVttThumbnailContract } from './vtt-thumbnail-contract.mjs'

const contract = await verifyVttThumbnailContract()
const implementations = await vttThumbnailHistorical()
const name = 'artplayer-plugin-vtt-thumbnail'

test('VTT-thumbnail freezes five actual archives, 34 members, ten source inputs and separate Git core associations', () => {
  const releases = [contract.baseline.release, ...contract.baseline.previous]
  assert.deepEqual(releases.map(release => release.version), ['1.1.0', '1.0.0', '1.0.1', '1.0.2', '1.0.3'])
  assert.equal(releases.reduce((sum, release) => sum + Object.keys(release.files).length, 0), 34)
  assert.equal(Object.keys(contract.baseline.source).length, 10)
  assert.deepEqual(releases.map(release => release.historicalCore.version), ['5.3.1', '5.1.2', '5.1.6', '5.1.7', '5.1.7'])
  for (const release of releases) {
    assert.deepEqual(release.missingEntrypoints, {})
    assert.equal(release.manifest.dependencies, undefined)
    assert.equal(release.manifest.peerDependencies, undefined)
  }
})

test('VTT-thumbnail 1.0.0 actual main and legacy cannot parse; its valid shipped source stays source-only', () => {
  const release = contract.baseline.previous[0]
  for (const field of ['main', 'legacy']) {
    const code = readMember(contract.archives.get('1.0.0'), `package/${release.manifest[field].replace(/^\.\//, '')}`).toString()
    assert.throws(() => new vm.Script(code), error => error.name === 'SyntaxError' && /Nothing to repeat/.test(error.message))
    assert(code.includes('(?:?-->?)'))
  }
  const source = readMember(contract.archives.get('1.0.0'), 'package/src/getVttArray.js').toString()
  assert(source.includes('(?: ?--> ?)'))
  assert(implementations.some(item => item.name === 'published-1.0.0-source-only'))
  assert(!implementations.some(item => item.name === 'published-1.0.0-main'))
})

test('VTT-thumbnail historical declarations omit Promise while retaining optional vtt/style and required option object', () => {
  for (const release of [contract.baseline.release, ...contract.baseline.previous]) {
    const source = readMember(contract.archives.get(release.version), `package/${release.manifest.types.replace(/^\.\//, '')}`).toString()
    assert.match(source, /\(option: \{ vtt\?: string/)
    assert.match(source, /style\?: Partial<CSSStyleDeclaration>/)
    assert.match(source, /name: ['"]artplayerPluginVttThumbnail['"]/)
    assert.doesNotMatch(source, /Promise</)
    assert.match(source, release.version === '1.1.0' ? /export default artplayerPluginVttThumbnail/ : /export = artplayerPluginVttThumbnail/)
    if (release.version !== '1.1.0')
      assert.match(source, /export as namespace artplayerPluginVttThumbnail/)
  }
})

test('VTT-thumbnail runnable CommonJS generations and script globals retain their actual shapes without import-time fetch', () => {
  for (const implementation of implementations.filter(item => !item.name.includes('source'))) {
    const env = vttThumbnailEnvironment(implementation, { text: acceptedVttText(implementation) })
    assert.equal(typeof env.factory, 'function')
    assert.equal(env.requests.length, 0)
    assert.equal(typeof env.exported, implementation.version.startsWith('1.0.') ? 'object' : 'function')
    if (typeof env.exported === 'object')
      assert.deepEqual(Object.keys(env.exported), ['default'])
    const script = vttThumbnailEnvironment(implementation, { script: true })
    assert.equal(typeof script.factory, 'function')
    assert.equal(script.requests.length, 0)
  }
})

test('VTT-thumbnail actual latest ESM modules expose default-only factories and asynchronously register after fetch', async () => {
  const codes = [readMember(contract.archives.get('1.1.0'), `package/${contract.baseline.release.manifest.module.replace(/^\.\//, '')}`).toString(), contract.sources.get(`packages/${name}/dist/${name}.mjs`)]
  const original = globalThis.fetch
  try {
    for (const code of codes) {
      const requests = []
      globalThis.fetch = async (url) => {
        requests.push(url)
        return { text: async () => vttText }
      }
      const exported = await import(`data:text/javascript,${encodeURIComponent(code)}`)
      assert.deepEqual(Object.keys(exported), ['default'])
      const env = vttThumbnailEnvironment(implementations[0])
      const result = exported.default({ vtt: 'sprite.vtt' })(env.art)
      assert.equal(result.name, undefined)
      assert.equal(typeof result.then, 'function')
      assert.deepEqual(await result, { name: 'artplayerPluginVttThumbnail' })
      assert.deepEqual(requests, ['sprite.vtt'])
    }
  }
  finally { globalThis.fetch = original }
})

test('VTT-thumbnail latest published members match their separately frozen workspace files after line-ending normalization', () => {
  for (const member of Object.keys(contract.baseline.release.files)) {
    const published = readMember(contract.archives.get('1.1.0'), member).toString().replaceAll('\r\n', '\n')
    assert.equal(published, contract.sources.get(`packages/${name}/${member.slice('package/'.length)}`))
  }
})

test('VTT-thumbnail README and example select the VTT demo and its actual local sample assets', () => {
  for (const release of [contract.baseline.release, ...contract.baseline.previous]) {
    const readme = readMember(contract.archives.get(release.version), 'package/README.md').toString()
    assert.match(readme, /example=vtt\.thumbnail/)
  }
  const example = contract.sources.get('docs/assets/example/vtt.thumbnail.js')
  assert.match(example, /artplayerPluginVttThumbnail\(\{/)
  for (const file of ['bbb-video.mp4', 'bbb-thumbnails.vtt']) {
    assert(example.includes(`/assets/sample/${file}`))
    assert(fs.existsSync(`docs/assets/sample/${file}`))
  }
})

for (const implementation of implementations) {
  test(`VTT-thumbnail ${implementation.name}: registration fetches once and adds controls only after awaiting text`, async () => {
    const env = vttThumbnailEnvironment(implementation, { deferred: true, text: acceptedVttText(implementation) })
    const option = { vtt: 'https://cdn.test/folder/cues.vtt', style: { opacity: '0.8' } }
    const register = env.factory(option)
    assert.equal(env.requests.length, 0)
    const result = register(env.art)
    assert.equal(typeof result.then, 'function')
    assert.equal(result.name, undefined)
    assert.deepEqual(env.requests, [[option.vtt]])
    assert.equal(env.controls.length, 0)
    assert.equal(env.listeners.size, 0)
    env.resolve()
    assert.deepEqual({ ...await result }, { name: 'artplayerPluginVttThumbnail' })
    assert.equal(env.controls.length, 1)
    assert.equal(env.controls[0].name, ['mouse-source-only', 'old-control'].includes(implementation.profile) ? 'thumbnails' : 'vtt-thumbnail')
    assert.equal(env.controls[0].position, 'top')
    assert.equal(env.controls[0].index, 20)
    assert.equal(env.controls[0].style, option.style)
    assert.equal(env.classes.has('art-control-thumbnails'), implementation.profile === 'current')
  })

  test(`VTT-thumbnail ${implementation.name}: floored inclusive cue bounds select the first matching sprite and retain geometry`, async () => {
    const env = vttThumbnailEnvironment(implementation, { text: acceptedVttText(implementation) })
    await env.factory({ vtt: 'https://cdn.test/folder/cues.vtt' })(env.art)
    await env.hover(0.05)
    assert.equal(env.styles.left, 0)
    assert.equal(env.styles.backgroundImage, 'url(https://cdn.test/folder/sheet.jpg)')
    assert.equal(env.styles.backgroundPosition, '-10px -20px')
    assert.equal(env.styles.height, '45px')
    assert.equal(env.styles.width, '80px')
    await env.hover(0.5)
    assert.equal(env.styles.backgroundImage, 'url(https://cdn.test/folder/sheet.jpg)', 'At the shared floored boundary the earlier inclusive cue wins')
    assert.equal(env.styles.left, '60px')
    await env.hover(0.51)
    assert.equal(env.styles.backgroundImage, 'url(https://cdn.test/folder/second.jpg)')
    assert.equal(env.styles.backgroundPosition, '-90px -65px')
    await env.hover(0.99)
    assert.equal(env.styles.left, '120px')
    assert.equal(env.styles.display, implementation.profile === 'mouse-source-only' ? 'block' : 'flex')
  })

  test(`VTT-thumbnail ${implementation.name}: style is read after fetch while the VTT URL is captured before it`, async () => {
    const env = vttThumbnailEnvironment(implementation, { deferred: true, text: acceptedVttText(implementation) })
    const options = { vtt: '/original.vtt', style: { opacity: '0.1' } }
    const result = env.factory(options)(env.art)
    options.vtt = '/later.vtt'
    options.style = { opacity: '0.9' }
    env.resolve()
    await result
    assert.deepEqual(env.requests, [['/original.vtt']])
    assert.equal(env.controls[0].style, options.style)
  })

  test(`VTT-thumbnail ${implementation.name}: image URLs preserve literal joining and absolute forms`, async () => {
    for (const [image, expected] of [['../sprite.jpg', 'https://cdn.test/folder/../sprite.jpg'], ['/sprite.jpg', '/sprite.jpg'], ['https://img.test/s.jpg', 'https://img.test/s.jpg'], ['//img.test/s.jpg', '//img.test/s.jpg']]) {
      const env = vttThumbnailEnvironment(implementation, { text: acceptedVttText(implementation, `WEBVTT\n\n00:00:00.000 --> 00:00:10.000\n${image}#xywh=1,2,80,45\n`) })
      await env.factory({ vtt: 'https://cdn.test/folder/cues.vtt' })(env.art)
      await env.hover(0.5)
      assert.equal(env.styles.backgroundImage, `url(${expected})`)
    }
  })

  test(`VTT-thumbnail ${implementation.name}: omitted option rejects asynchronously while omitted vtt fetches the empty string`, async () => {
    const env = vttThumbnailEnvironment(implementation, { text: acceptedVttText(implementation) })
    const result = env.factory()(env.art)
    assert.equal(typeof result.then, 'function')
    await assert.rejects(result, error => error.name === 'TypeError')
    assert.equal(env.requests.length, 0)
    await env.factory({})(env.art)
    assert.deepEqual(env.requests, [['']])
  })

  if (implementation.profile !== 'mouse-source-only') {
    test(`VTT-thumbnail ${implementation.name}: setBar handles mobile played drags with a replaceable 500ms hide timer`, async () => {
      const env = vttThumbnailEnvironment(implementation, { mobile: true, text: acceptedVttText(implementation) })
      await env.factory({ vtt: '/cues.vtt' })(env.art)
      await env.hover(0.3, 'played', null)
      assert.deepEqual(env.styles, {})
      await env.hover(0.3, 'played', {})
      assert.equal(env.styles.display, 'flex')
      assert.equal(env.timers.size, 1)
      await env.hover(0.7, 'played', {})
      assert.equal(env.timers.size, 1)
      const timer = [...env.timers.values()][0]
      assert.equal(timer.delay, 500)
      timer.callback()
      assert.equal(env.styles.display, 'none')
    })
  }
}

test('VTT-thumbnail 1.0.0 source-only retains native mousemove/mouseleave and hover-hide integration', async () => {
  const implementation = implementations.find(item => item.profile === 'mouse-source-only')
  const env = vttThumbnailEnvironment(implementation, { text: acceptedVttText(implementation) })
  await env.factory({})(env.art)
  assert.deepEqual([...env.proxies.keys()], ['mousemove', 'mouseleave'])
  assert.deepEqual([...env.listeners.keys()], ['hover'])
  await env.hover(0)
  assert.equal(env.styles.display, 'block')
  await env.emit('hover', false)
  assert.equal(env.styles.display, 'none')
  await env.hover(1)
  assert.equal(env.styles.display, 'block')
  env.proxies.get('mouseleave')[0]()
  assert.equal(env.styles.display, 'none')
})

for (const implementation of implementations) {
  test(`VTT-thumbnail ${implementation.name}: standard spaced arrows remain distinct from historical compact-only bundles`, async () => {
    const env = vttThumbnailEnvironment(implementation, { text: vttText })
    const result = env.factory({ vtt: '/cues.vtt' })(env.art)
    if (/^published-1\.0\.[123]-(?:main|legacy)$/.test(implementation.name)) {
      await assert.rejects(result, error => error.name === 'TypeError')
      assert.equal(env.controls.length, 0)
    }
    else {
      assert.equal((await result).name, 'artplayerPluginVttThumbnail')
      await env.hover(0.3)
      assert.equal(env.styles.backgroundImage, 'url(/sheet.jpg)')
    }
  })
}
