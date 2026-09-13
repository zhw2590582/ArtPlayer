import fs from 'node:fs'
import process from 'node:process'
import vm from 'node:vm'
import { transform } from 'esbuild'
import { verifyMultipleSubtitlesContract } from '../../refactor/scripts/multiple-subtitles-contract.mjs'
import { readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from './load.js'

export const subtitleVtt = text => `WEBVTT\n\n00:00.000 --> 00:02.000\n${text}\n`

export async function multipleSubtitlesCandidate() {
  return { name: 'candidate', version: 'candidate', code: process.env.ARTPLAYER_MULTIPLE_SUBTITLES_ARTIFACT ? fs.readFileSync(process.env.ARTPLAYER_MULTIPLE_SUBTITLES_ARTIFACT, 'utf8') : await compilePackage('artplayer-plugin-multiple-subtitles', 'umd') }
}

export async function multipleSubtitlesHistorical() {
  const { baseline, archives, sources } = await verifyMultipleSubtitlesContract()
  const name = 'artplayer-plugin-multiple-subtitles'
  const implementations = []
  for (const release of [baseline.release, ...baseline.previous]) {
    for (const field of ['main', 'legacy'])
      implementations.push({ name: `published-${release.version}-${field}`, version: release.version, code: readMember(archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//, '')}`).toString() })
  }
  const source = sources.get(`packages/${name}/src/parser.js`)
    + sources.get(`packages/${name}/src/index.js`).replace(/^import .* from ['"].\/parser['"];?\s*$/m, '')
  implementations.push({ name: 'frozen-workspace-source', version: 'workspace', code: (await transform(source, { format: 'cjs', target: 'es2020' })).code })
  for (const suffix of ['js', 'legacy.js'])
    implementations.push({ name: `frozen-workspace-${suffix}`, version: 'workspace', code: sources.get(`packages/${name}/dist/${name}.${suffix}`) })
  return implementations
}

export function multipleSubtitlesEnvironment(implementation, { script = false, responses = {} } = {}) {
  const requests = []
  const blobs = new Map()
  const revoked = []
  const initialized = []
  const converted = []
  const module = { exports: {} }
  const utils = {
    getExt: url => url.split('.').pop(),
    unescape: text => text.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&'),
    srtToVtt(text) {
      converted.push(['srt', text])
      return subtitleVtt('SRT')
    },
    assToVtt(text) {
      converted.push(['ass', text])
      return subtitleVtt('ASS')
    },
  }
  const art = {
    constructor: { utils },
    option: { subtitle: { escape: true, style: { color: 'red' } } },
    subtitle: { init(option) { initialized.push(option) } },
  }
  const context = {
    Blob,
    TextDecoder,
    console: { log() {}, warn() {}, error() {} },
    URL: {
      createObjectURL(blob) {
        const url = `blob:subtitle-${blobs.size + 1}`
        blobs.set(url, blob)
        return url
      },
      revokeObjectURL(url) { revoked.push(url) },
    },
    fetch: async (url) => {
      requests.push(url)
      const bytes = new TextEncoder().encode(responses[url] ?? subtitleVtt(url))
      return { ok: true, arrayBuffer: async () => bytes.buffer }
    },
  }
  context.window = context
  if (!script) {
    context.module = module
    context.exports = module.exports
  }
  vm.runInNewContext(implementation.code, context, { timeout: 5000 })
  const exported = script ? context.artplayerPluginMultipleSubtitles : module.exports
  const factory = exported?.default || exported
  const latestText = async () => blobs.get(initialized.at(-1).url).text()
  return { factory, exported, art, utils, requests, blobs, revoked, initialized, converted, latestText }
}
