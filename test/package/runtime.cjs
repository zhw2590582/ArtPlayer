const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
const { pathToFileURL } = require('node:url')

const vm = require('node:vm');

(async () => {
  const checks = []
  const observations = {}
  const check = (id, value) => {
    assert(value, id)
    checks.push(id)
  }
  const root = __dirname
  const expected = JSON.parse(fs.readFileSync(path.join(root, 'expected.json')))
  const load = relative => fs.readFileSync(path.join(root, 'node_modules', relative), 'utf8')
  const core = require('artplayer')
  const chapter = require('artplayer-plugin-chapter')
  check('DIST.cjs', typeof core === 'function' && core.version === JSON.parse(fs.readFileSync(path.join(root, 'expected.json'))).version && typeof chapter({}) === 'function')
  check('DIST.cjs-legacy', require('artplayer/legacy').version === core.version && typeof require('artplayer-plugin-chapter/legacy')({}) === 'function')
  const esm = await import('artplayer')
  const pluginEsm = await import('artplayer-plugin-chapter')
  check('DIST.esm', esm.default.version === core.version && typeof pluginEsm.default({}) === 'function')
  check('DIST.esm-default-only', Object.keys(esm).join() === 'default' && Object.keys(pluginEsm).join() === 'default')
  const legacy = await import('artplayer/legacy')
  const pluginLegacy = await import('artplayer-plugin-chapter/legacy')
  check('DIST.esm-legacy', legacy.default.version === core.version && typeof pluginLegacy.default({}) === 'function')
  if (!expected.baseline) {
    const precise = require('artplayer/runtime')
    const preciseEsm = await import('artplayer/runtime')
    const preciseLegacy = require('artplayer/runtime/legacy')
    const preciseLegacyEsm = await import('artplayer/runtime/legacy')
    check('DIST.runtime-cjs-identity', precise === core && require.resolve('artplayer/runtime') === require.resolve('artplayer'))
    check('DIST.runtime-esm-identity', preciseEsm === esm && preciseEsm.default === esm.default)
    check('DIST.runtime-legacy-identity', preciseLegacy === require('artplayer/legacy') && preciseLegacyEsm === legacy)
    check('DIST.runtime-shared-statics', precise.instances === core.instances && preciseEsm.default.instances === esm.default.instances && preciseLegacy.instances === legacy.default.instances)
    assert.throws(() => require('artplayer/runtime/types'), error => error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED')
    await assert.rejects(import('artplayer/runtime/types'), error => error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED')
    check('DIST.runtime-types-only', true)
  }
  for (const [name, filename, globalName] of [
    ['core', 'artplayer/dist/artplayer.js', 'Artplayer'],
    ['core-legacy', 'artplayer/dist/artplayer.legacy.js', 'Artplayer'],
    ['chapter', 'artplayer-plugin-chapter/dist/artplayer-plugin-chapter.js', 'artplayerPluginChapter'],
    ['chapter-legacy', 'artplayer-plugin-chapter/dist/artplayer-plugin-chapter.legacy.js', 'artplayerPluginChapter'],
  ]) {
    const code = load(filename)
    const global = vm.createContext({ console })
    vm.runInContext(code, global, { timeout: 2000 })
    check(`DIST.global-${name}`, typeof global[globalName] === 'function')
    let value
    let calls = 0
    const define = (factory) => {
      calls++
      value = factory()
    }
    define.amd = {}
    const amd = vm.createContext({ console, define })
    vm.runInContext(code, amd, { timeout: 2000 })
    check(`DIST.amd-${name}`, calls === 1 && typeof value === 'function' && amd[globalName] === value)
  }
  check('SSR.import-template', core.html.includes('art-video-player') && esm.default.html === core.html && typeof core.STYLE === 'string' && core.instances.length === 0)
  observations.constructorErrors = []
  for (const Class of [core, esm.default, legacy.default]) {
    for (const useSSR of [false, true]) {
      let error
      try {
        Reflect.construct(Class, [{ container: '#server', url: 'video.mp4', useSSR }])
      }
      catch (caught) { error = caught }
      assert.equal(error?.message, 'Artplayer can only be used in the browser environment')
      observations.constructorErrors.push({ useSSR, name: error.name, message: error.message })
    }
  }
  check('SSR.constructor-browser-only', observations.constructorErrors.length === 6)
  observations.customUA = []
  const userAgents = ['', 'Android Chrome', 'iPhone Safari', 'Macintosh Safari']
  for (const filename of ['artplayer.js', 'artplayer.legacy.js']) {
    for (const userAgent of userAgents) {
      const module = { exports: {} }
      let timers = 0
      const context = { module, exports: module.exports, CUSTOM_USER_AGENT: userAgent, setTimeout() {
        timers++
      } }
      const historicalFailure = expected.baseline && /^(?:iPhone|Macintosh)/.test(userAgent)
      const evaluate = () => vm.runInNewContext(load(`artplayer/dist/${filename}`), context, { timeout: 2000 })
      if (historicalFailure) {
        assert.throws(evaluate, error => error.name === 'ReferenceError')
      }
      else {
        evaluate()
        assert.equal(module.exports.utils.userAgent, userAgent)
        assert.equal(module.exports.utils.isBrowser, false)
        assert.equal(module.exports.instances.length, 0)
        assert.throws(() => Reflect.construct(module.exports, [{}]), error => error.message === 'Artplayer can only be used in the browser environment')
      }
      assert.equal(timers, 0)
      observations.customUA.push({ filename, userAgent, historicalFailure: !!historicalFailure, timers })
    }
  }
  check('SSR.custom-ua-umd-legacy', observations.customUA.length === 8)
  const userAgentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'CUSTOM_USER_AGENT')
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  try {
    // Node exposes navigator in newer versions; this profile intentionally checks
    // server imports without either browser globals or a navigator shim.
    assert(delete globalThis.navigator)
    for (const userAgent of userAgents) {
      globalThis.CUSTOM_USER_AGENT = userAgent
      const url = pathToFileURL(path.join(root, 'node_modules/artplayer/dist/artplayer.mjs'))
      url.searchParams.set('custom-user-agent', userAgent)
      const historicalFailure = expected.baseline && /^(?:iPhone|Macintosh)/.test(userAgent)
      if (historicalFailure) {
        await assert.rejects(import(url.href), error => error.name === 'ReferenceError')
      }
      else {
        const { default: Player } = await import(url.href)
        assert.equal(Player.utils.userAgent, userAgent)
        assert.equal(Player.utils.isBrowser, false)
        assert.equal(Player.instances.length, 0)
      }
      observations.customUA.push({ filename: 'artplayer.mjs', userAgent, historicalFailure: !!historicalFailure })
    }
  }
  finally {
    if (userAgentDescriptor)
      Object.defineProperty(globalThis, 'CUSTOM_USER_AGENT', userAgentDescriptor)
    else
      delete globalThis.CUSTOM_USER_AGENT
    if (navigatorDescriptor)
      Object.defineProperty(globalThis, 'navigator', navigatorDescriptor)
    else
      delete globalThis.navigator
  }
  check('SSR.custom-ua-esm', observations.customUA.length === 12)
  observations.languages = []
  const languages = fs.readdirSync(path.join(root, 'node_modules/artplayer/dist/i18n')).filter(file => file.endsWith('.mjs')).map(file => file.slice(0, -4)).sort()
  assert.deepEqual(languages, ['ar', 'cs', 'es', 'fa', 'fr', 'id', 'pl', 'ru', 'tr', 'vi', 'zh-tw'])
  assert.deepEqual(fs.readdirSync(path.join(root, 'node_modules/artplayer/dist/i18n')).sort(), languages.flatMap(name => [`${name}.js`, `${name}.mjs`]).sort())
  for (const name of languages) {
    const cjs = require(`artplayer/i18n/${name}`)
    globalThis.window = {}
    let module
    try {
      module = await import(`artplayer/i18n/${name}`)
      assert.equal(globalThis.window[`artplayer-i18n-${name}`], module.default)
    }
    finally {
      delete globalThis.window
    }
    assert.deepEqual(module.default, cjs)
    const globalName = `artplayerI18n${name.replace(/(^|-)([a-z])/g, (_, _prefix, char) => char.toUpperCase())}`
    const context = vm.createContext({ window: {} })
    vm.runInContext(load(`artplayer/dist/i18n/${name}.js`), context, { timeout: 2000 })
    assert.equal(JSON.stringify(context[globalName]), JSON.stringify(cjs))
    assert.equal(context.window[`artplayer-i18n-${name}`], context[globalName])
    observations.languages.push({ name, globalName, keys: Object.keys(cjs).sort(), play: cjs.Play })
  }
  check('DIST.i18n-cjs-esm-global', languages.length > 0)
  observations.blockedDeepImports = []
  for (const specifier of ['artplayer/dist/artplayer.js', 'artplayer/types/artplayer.d.ts', 'artplayer-plugin-chapter/dist/artplayer-plugin-chapter.js', 'artplayer/types']) {
    let code
    try {
      require.resolve(specifier)
    }
    catch (error) { code = error.code }
    assert.equal(code, 'ERR_PACKAGE_PATH_NOT_EXPORTED')
    observations.blockedDeepImports.push({ specifier, code })
  }
  await assert.rejects(import('artplayer/types'), error => error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED')
  check('DIST.exports-boundary', observations.blockedDeepImports.length === 4)
  observations.resolutions = {}
  for (const specifier of ['artplayer', 'artplayer/legacy', 'artplayer-plugin-chapter', 'artplayer-plugin-chapter/legacy']) {
    const resolved = require.resolve(specifier)
    assert(resolved.startsWith(path.join(root, 'node_modules') + path.sep), 'Escaped isolated packages')
    observations.resolutions[specifier] = path.relative(root, resolved).replaceAll('\\', '/')
  }
  // CDN-style absolute URLs bypass package exports; verify the actual files remain readable imports.
  const direct = await import(pathToFileURL(path.join(root, 'node_modules/artplayer/dist/artplayer.mjs')).href)
  check('DIST.direct-esm-file', direct.default === esm.default)
  const { emitterContracts } = await import('./emitter.mjs')
  for (const [id, run] of Object.entries(emitterContracts)) {
    run(core.Emitter)
    checks.push(id)
  }
  const shape = value => Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(value)).map(([key, d]) => [key, { enumerable: d.enumerable, configurable: d.configurable, writable: d.writable, get: typeof d.get, set: typeof d.set, value: typeof d.value }]))
  const defaultNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  try {
    assert(delete globalThis.navigator)
    // CORE-25 tracks this reproduced published and candidate failure separately.
    assert.throws(() => core.option, { name: 'ReferenceError', message: 'navigator is not defined' })
    observations.defaultsWithoutNavigator = { name: 'ReferenceError', message: 'navigator is not defined', historical: !!expected.baseline, resolved: false }
    check('SSR.defaults-missing-navigator-known-failure', true)
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { language: 'en-US' } })
    observations.api = { static: shape(core), prototype: shape(core.prototype), emitter: shape(core.Emitter.prototype), factory: shape(chapter), defaults: JSON.parse(JSON.stringify(core.option, (_, value) => typeof value === 'function' ? '$function' : value)) }
    check('API.defaults-controlled-language', observations.api.defaults.lang === 'en-us')
  }
  finally {
    if (defaultNavigator)
      Object.defineProperty(globalThis, 'navigator', defaultNavigator)
    else
      delete globalThis.navigator
  }
  process.stdout.write(JSON.stringify({ node: process.versions.node, checks, observations }))
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
