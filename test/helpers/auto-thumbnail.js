import fs from 'node:fs'
import process from 'node:process'
import vm from 'node:vm'
import { transform } from 'esbuild'
import { verifyAutoThumbnailContract } from '../../refactor/scripts/auto-thumbnail-contract.mjs'
import { readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from './load.js'

export async function autoThumbnailHistorical() {
  const { baseline, archives, sources } = await verifyAutoThumbnailContract()
  const name = 'artplayer-plugin-auto-thumbnail'
  const implementations = []
  for (const release of [baseline.release, ...baseline.previous]) {
    if (release.missingEntrypoints.main)
      continue
    for (const field of ['main', 'legacy']) {
      implementations.push({ name: `published-${release.version}-${field}`, code: readMember(archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//, '')}`).toString() })
    }
  }
  implementations.push({ name: 'published-1.0.0-source-only', code: (await transform(readMember(archives.get('1.0.0'), 'package/src/index.js').toString(), { format: 'cjs', target: 'es2020' })).code })
  implementations.push({ name: 'frozen-workspace-source', code: (await transform(sources.get(`packages/${name}/src/index.js`), { format: 'cjs', target: 'es2020' })).code })
  for (const suffix of ['js', 'legacy.js']) {
    implementations.push({ name: `frozen-workspace-${suffix}`, code: sources.get(`packages/${name}/dist/${name}.${suffix}`) })
  }
  return implementations
}

export async function autoThumbnailCandidate() {
  if (process.env.ARTPLAYER_AUTO_THUMBNAIL_BASELINE === '1')
    return (await autoThumbnailHistorical()).find(item => item.name === 'frozen-workspace-js')
  return { name: 'candidate', code: process.env.ARTPLAYER_AUTO_THUMBNAIL_ARTIFACT ? fs.readFileSync(process.env.ARTPLAYER_AUTO_THUMBNAIL_ARTIFACT, 'utf8') : await compilePackage('artplayer-plugin-auto-thumbnail', 'umd') }
}

// Controlled media events and deferred encodes are not evidence of native decoding.
export function autoThumbnailEnvironment(implementation, { script = false } = {}) {
  const operations = []
  const videos = []
  const canvases = []
  const blobs = []
  const urls = new Map()
  const listeners = new Map()
  const updates = []
  const warnings = []
  let nextUrl = 0
  const controls = { nullContext: false, drawError: null, encodeError: null, updateError: null, onUpdate: null }
  const document = {
    createElement(tag) {
      if (tag === 'video') {
        const video = {
          duration: 120,
          videoWidth: 1920,
          videoHeight: 1080,
          onloadedmetadata: null,
          onseeked: null,
          onerror: null,
          pause() { operations.push({ name: 'pause', video }) },
          load() { operations.push({ name: 'load', video }) },
          removeAttribute(name) {
            delete this[name]
            operations.push({ name: 'removeAttribute', attribute: name, video })
          },
        }
        let time = 0
        Object.defineProperty(video, 'currentTime', {
          get: () => time,
          set(value) {
            time = value
            operations.push({ name: 'seek', value, handlerInstalled: typeof video.onseeked === 'function', video })
          },
        })
        videos.push(video)
        return video
      }
      if (tag === 'canvas') {
        const draws = []
        const ctx = { drawImage(...args) {
          if (controls.drawError)
            throw controls.drawError
          draws.push(args)
          operations.push({ name: 'draw', args })
        } }
        const canvas = {
          width: 0,
          height: 0,
          draws,
          getContext() { return controls.nullContext ? null : ctx },
          toBlob(callback, type) {
            if (controls.encodeError)
              throw controls.encodeError
            const encode = { callback, type, draws: draws.map(args => [...args]), canvas }
            blobs.push(encode)
            operations.push({ name: 'encode', encode })
          },
        }
        canvases.push(canvas)
        return canvas
      }
      throw new Error(`Unexpected element: ${tag}`)
    },
  }
  const module = { exports: {} }
  const box = { document, URL: {
    createObjectURL(blob) {
      if (blob == null)
        throw new TypeError('Blob required')
      const url = `blob:auto-thumbnail-${++nextUrl}`
      urls.set(url, blob)
      operations.push({ name: 'createURL', url, blob })
      return url
    },
    revokeObjectURL(url) {
      urls.delete(url)
      operations.push({ name: 'revokeURL', url })
    },
  }, window: {}, console: { warn: (...args) => warnings.push(args) } }
  if (!script)
    Object.assign(box, { module, exports: module.exports })
  vm.runInNewContext(implementation.code, box)
  const exported = script ? box.artplayerPluginAutoThumbnail || box.window.artplayerPluginAutoThumbnail : module.exports
  const factory = typeof exported === 'function' ? exported : exported.default
  const art = {
    option: { url: 'original.mp4' },
    on(name, fn) {
      if (!listeners.has(name))
        listeners.set(name, new Set())
      listeners.get(name).add(fn)
      return this
    },
    off(name, fn) {
      listeners.get(name)?.delete(fn)
      return this
    },
    emit(name, ...args) {
      for (const fn of [...(listeners.get(name) || [])]) fn(...args)
      return this
    },
  }
  Object.defineProperty(art, 'thumbnails', {
    get: () => updates.at(-1),
    set(value) {
      if (controls.updateError)
        throw controls.updateError
      updates.push(value)
      controls.onUpdate?.(value)
    },
  })
  return {
    art,
    factory,
    exported,
    box,
    operations,
    videos,
    canvases,
    blobs,
    urls,
    listeners,
    updates,
    warnings,
    controls,
    metadata(video = videos.at(-1)) { video.onloadedmetadata?.() },
    seeked(video = videos.at(-1)) { video.onseeked?.() },
    finish(index = 0, blob = { type: 'image/jpeg' }) { blobs[index].callback(blob) },
  }
}
