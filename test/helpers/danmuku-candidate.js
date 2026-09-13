import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { ensureArchive, readMember, refactorDir } from '../../refactor/scripts/releases.mjs'
import { getEntryFile } from '../../scripts/projects.js'
import { danmukuEnvironment } from './danmuku.js'

const workspace = fileURLToPath(new URL('../../', import.meta.url))

export async function danmukuCandidate() {
  const coreRelease = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json'), 'utf8')).releases.find(item => item.name === 'artplayer')
  const coreCode = readMember(await ensureArchive(coreRelease), 'package/dist/artplayer.js').toString()
  const artifact = process.env.ARTPLAYER_DANMUKU_ARTIFACT
  if (artifact)
    return { name: path.basename(artifact), code: fs.readFileSync(path.resolve(artifact), 'utf8'), coreCode }
  const project = path.join(workspace, 'packages/artplayer-plugin-danmuku')
  const compiled = await build({ entryPoints: [getEntryFile(project)], bundle: true, write: false, format: 'cjs', platform: 'browser', target: 'es2020', plugins: [{ name: 'danmuku-controlled-assets', setup(build) {
    build.onResolve({ filter: /\?(?:worker|raw|inline)/ }, args => ({ path: path.resolve(args.resolveDir, args.path), namespace: 'controlled-asset' }))
    build.onLoad({ filter: /.*/, namespace: 'controlled-asset' }, (args) => {
      if (args.path.includes('?worker'))
        return { contents: 'export default Worker', loader: 'js' }
      return { contents: `export default ${JSON.stringify(fs.readFileSync(args.path.split('?')[0], 'utf8'))}`, loader: 'js' }
    })
  } }] })
  return { name: 'candidate-source', code: compiled.outputFiles[0].text, coreCode }
}

export function danmukuCandidateEnvironment(implementation, settings = {}) {
  // Inject before module evaluation: source worker imports capture the constructor.
  const initialWorker = settings.initialWorkerError
    ? { ...implementation, code: `globalThis.Worker = class { constructor() { throw globalThis.__danmukuCandidateWorkerError } };\n${implementation.code}` }
    : implementation
  const env = danmukuEnvironment(initialWorker, settings)
  if (settings.initialWorkerError)
    env.context.__danmukuCandidateWorkerError = settings.initialWorkerError
  const consoleWarnings = []
  env.context.console.warn = (...args) => consoleWarnings.push(args)
  env.context.AbortController = AbortController
  env.context.AbortSignal = AbortSignal
  env.context.window.AbortController = AbortController
  env.context.window.AbortSignal = AbortSignal
  env.context.Worker.prototype.removeEventListener = function (name, callback) {
    this.listeners.set(name, (this.listeners.get(name) || []).filter(listener => listener !== callback))
  }
  const fetchCalls = []
  env.context.fetch = async (url, init) => {
    env.requests.push(url)
    fetchCalls.push({ url, init })
    if (settings.fetch)
      return settings.fetch(url, init)
    return { ok: true, status: 200, text: async () => '<i><d p="10,1,25,16777215,1,0,u,1">xml</d></i>' }
  }
  return { ...env, fetchCalls, consoleWarnings }
}
