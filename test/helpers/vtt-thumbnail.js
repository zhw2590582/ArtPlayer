import fs from 'node:fs'
import process from 'node:process'
import vm from 'node:vm'
import { transform } from 'esbuild'
import { readMember } from '../../refactor/scripts/releases.mjs'
import { verifyVttThumbnailContract } from '../../refactor/scripts/vtt-thumbnail-contract.mjs'
import { compilePackage } from './load.js'

export async function vttThumbnailCandidate() {
  if (process.env.ARTPLAYER_VTT_THUMBNAIL_BASELINE === '1')
    return (await vttThumbnailHistorical()).find(item => item.name === 'frozen-workspace-js')
  return { name: 'candidate', profile: 'current', code: process.env.ARTPLAYER_VTT_THUMBNAIL_ARTIFACT ? fs.readFileSync(process.env.ARTPLAYER_VTT_THUMBNAIL_ARTIFACT, 'utf8') : await compilePackage('artplayer-plugin-vtt-thumbnail', 'umd') }
}

export async function vttThumbnailHistorical() {
  const { baseline, archives, sources } = await verifyVttThumbnailContract()
  const name = 'artplayer-plugin-vtt-thumbnail'
  const implementations = []
  for (const release of [baseline.release, ...baseline.previous]) {
    if (release.version === '1.0.0')
      continue
    for (const field of ['main', 'legacy']) {
      implementations.push({ name: `published-${release.version}-${field}`, version: release.version, profile: release.version === '1.0.1' ? 'old-control' : release.version === '1.0.2' ? 'no-class' : 'current', code: readMember(archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//, '')}`).toString() })
    }
  }
  for (const version of ['1.0.0', 'workspace']) {
    const source = file => version === 'workspace' ? sources.get(`packages/${name}/src/${file}`) : readMember(archives.get(version), `package/src/${file}`).toString()
    const code = `${source('getVttArray.js').replace('export default ', '')}\n${source('index.js').replace(/^import getVttArray from ['"].\/getVttArray['"];?\s*$/m, '')}`
    implementations.push({ name: version === 'workspace' ? 'frozen-workspace-source' : 'published-1.0.0-source-only', version, profile: version === '1.0.0' ? 'mouse-source-only' : 'current', code: (await transform(code, { format: 'cjs', target: 'es2020' })).code })
  }
  for (const suffix of ['js', 'legacy.js'])
    implementations.push({ name: `frozen-workspace-${suffix}`, version: 'workspace', profile: 'current', code: sources.get(`packages/${name}/dist/${name}.${suffix}`) })
  return implementations
}

export const vttText = 'WEBVTT\n\n00:00:00.900 --> 00:00:05.900\nsheet.jpg#xywh=10,20,80,45\n\n00:00:05.100 --> 00:00:10.999\nsecond.jpg#xywh=90,65,80,45\n'

// Only the 1.0.1–1.0.3 compiled artifacts require compact cue arrows.
export function acceptedVttText(implementation, text = vttText) {
  return /^published-1\.0\.[123]-(?:main|legacy)$/.test(implementation.name)
    ? text.replaceAll(' --> ', '-->')
    : text
}

export function vttThumbnailEnvironment(implementation, { script = false, mobile = false, text = vttText, deferred = false } = {}) {
  const requests = []
  const controls = []
  const listeners = new Map()
  const proxies = new Map()
  const timers = new Map()
  const classes = new Set()
  const styles = {}
  const removed = []
  const warnings = []
  let nextTimer = 0
  let resolveFetch
  let rejectFetch
  const response = source => ({ ok: true, status: 200, text: async () => source })
  const pending = deferred
    ? new Promise((resolve, reject) => {
        resolveFetch = resolve
        rejectFetch = reject
      })
    : null
  const progress = { clientWidth: 200, getBoundingClientRect: () => ({ left: 20 }) }
  const control = { styles }
  const art = {
    constructor: { utils: {
      isMobile: mobile,
      clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
      setStyle(element, key, value) { element.styles[key] = value },
      addClass(element, name) { classes.add(name) },
    } },
    duration: 10,
    template: { $progress: progress },
    events: { proxy(element, name, callback) {
      if (!proxies.has(name))
        proxies.set(name, [])
      proxies.get(name).push(callback)
    } },
    controls: { add(option) {
      controls.push(option)
      this[option.name] = control
      option.mounted(control)
      return control
    }, remove(name) {
      removed.push(name)
      delete this[name]
    } },
    on(name, callback) {
      if (!listeners.has(name))
        listeners.set(name, [])
      listeners.get(name).push(callback)
      return this
    },
    off(name, callback) { listeners.set(name, (listeners.get(name) || []).filter(item => item !== callback)) },
  }
  const box = {
    window: {},
    AbortController,
    console: { warn(...args) { warnings.push(args) } },
    fetch(...args) {
      requests.push(args)
      return pending || Promise.resolve(response(text))
    },
    setTimeout(callback, delay) {
      const id = nextTimer++
      timers.set(id, { callback, delay })
      return id
    },
    clearTimeout(id) { timers.delete(id) },
  }
  const module = { exports: {} }
  if (!script)
    Object.assign(box, { module, exports: module.exports })
  vm.runInNewContext(implementation.code, box)
  const exported = script ? box.artplayerPluginVttThumbnail || box.window.artplayerPluginVttThumbnail : module.exports
  const factory = typeof exported === 'function' ? exported : exported.default
  return {
    factory,
    exported,
    art,
    box,
    styles,
    classes,
    controls,
    listeners,
    proxies,
    timers,
    requests,
    progress,
    removed,
    warnings,
    resolve(source = text) { resolveFetch(response(source)) },
    reject(error) { rejectFetch(error) },
    async emit(name, ...args) { return Promise.all((listeners.get(name) || []).map(callback => callback(...args))) },
    async hover(percentage, type = 'hover', event = {}) {
      return Promise.all(implementation.profile === 'mouse-source-only'
        ? (proxies.get('mousemove') || []).map(callback => callback({ pageX: 20 + progress.clientWidth * percentage }))
        : (listeners.get('setBar') || []).map(callback => callback(type, percentage, event)))
    },
  }
}
