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
  observations.languages = []
  const languages = fs.readdirSync(path.join(root, 'node_modules/artplayer/dist/i18n')).filter(file => file.endsWith('.mjs')).map(file => file.slice(0, -4)).sort()
  for (const name of languages) {
    const cjs = require(`artplayer/i18n/${name}`)
    const module = await import(`artplayer/i18n/${name}`)
    assert.deepEqual(module.default, cjs)
    const globalName = `artplayerI18n${name.replace(/(^|-)([a-z])/g, (_, _prefix, char) => char.toUpperCase())}`
    const context = vm.createContext({})
    vm.runInContext(load(`artplayer/dist/i18n/${name}.js`), context, { timeout: 2000 })
    assert.equal(JSON.stringify(context[globalName]), JSON.stringify(cjs))
    observations.languages.push({ name, globalName, keys: Object.keys(cjs).sort(), play: cjs.Play })
  }
  check('DIST.i18n-cjs-esm-global', languages.length > 0)
  observations.blockedDeepImports = []
  for (const specifier of ['artplayer/dist/artplayer.js', 'artplayer/types/artplayer.d.ts', 'artplayer-plugin-chapter/dist/artplayer-plugin-chapter.js']) {
    let code
    try {
      require.resolve(specifier)
    }
    catch (error) { code = error.code }
    assert.equal(code, 'ERR_PACKAGE_PATH_NOT_EXPORTED')
    observations.blockedDeepImports.push({ specifier, code })
  }
  check('DIST.exports-boundary', observations.blockedDeepImports.length === 3)
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
  observations.api = { static: shape(core), prototype: shape(core.prototype), emitter: shape(core.Emitter.prototype), factory: shape(chapter), defaults: JSON.parse(JSON.stringify(core.option, (_, value) => typeof value === 'function' ? '$function' : value)) }
  process.stdout.write(JSON.stringify({ checks, observations }))
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
