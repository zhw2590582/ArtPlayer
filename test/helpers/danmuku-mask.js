import assert from 'node:assert/strict'
import vm from 'node:vm'
import { transform } from 'esbuild'
import ts from 'typescript'
import { verifyDanmukuMaskContract } from '../../refactor/scripts/danmuku-mask-contract.mjs'
import { hash, readMember } from '../../refactor/scripts/releases.mjs'

const sourceFile = 'packages/artplayer-plugin-danmuku-mask/src/index.js'
let historical
export function danmukuMaskHistorical() {
  historical ||= loadHistorical()
  return historical
}

function evaluate(code, additions = {}) {
  const module = { exports: {} }
  const context = {
    module,
    exports: module.exports,
    console: { log() {}, warn() {}, error() {} },
    fetch() { throw new Error('Model network access is forbidden in historical probes') },
    ...additions,
  }
  context.global = context
  context.self = context
  vm.runInNewContext(code, context, { timeout: 5000 })
  return module.exports.default || module.exports
}

function instrument(code, factory, label) {
  const text = factory.toString()
  const start = code.indexOf(text)
  assert(start >= 0 && !code.includes(text, start + 1), 'Exported factory must map uniquely to the evaluated bytes')
  const prefix = 'const factory = ('
  const parsed = ts.createSourceFile('factory.js', `${prefix}${text});`, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  assert.equal(parsed.parseDiagnostics.length, 0)
  const replacements = []
  const counts = { setBackend: 0, createSegmenter: 0, toBinaryMask: 0, drawMask: 0 }
  const configs = new Set()
  function findConfigs(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      const properties = node.initializer.properties.map(property => property.name?.getText(parsed))
      if (properties.includes('runtime') && properties.includes('modelType'))
        configs.add(node.name.text)
    }
    ts.forEachChild(node, findConfigs)
  }
  findConfigs(parsed)
  function visit(node) {
    if (ts.isCallExpression(node)) {
      const args = node.arguments
      const callee = node.expression.getText(parsed)
      let target
      if (args.length === 1 && ts.isStringLiteral(args[0]) && ['webgl', 'cpu'].includes(args[0].text))
        target = 'setBackend'
      else if (callee === 'createSegmenter' || callee.endsWith('.createSegmenter') || callee.includes('is not a supported model name.') || (args.length === 2 && ts.isIdentifier(args[1]) && configs.has(args[1].text)))
        target = 'createSegmenter'
      else if (callee === 'toBinaryMask' || callee.endsWith('.toBinaryMask') || callee.includes('mask.toImageData') || (args.length === 5 && args[3].getText(parsed).endsWith('.drawContour') && args[4].getText(parsed).endsWith('.foregroundThreshold')))
        target = 'toBinaryMask'
      else if (args.length === 5 && args[3].getText(parsed).endsWith('.opacity') && args[4].getText(parsed).endsWith('.maskBlurAmount'))
        target = 'drawMask'
      if (target) {
        counts[target]++
        replacements.push({ start: start + node.expression.getStart(parsed) - prefix.length, end: start + node.expression.end - prefix.length, target, original: callee })
        // Inline SDK bodies are replaced as one expression, never traversed as owned lifecycle code.
        return
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(parsed)
  assert.deepEqual(counts, { setBackend: 2, createSegmenter: 1, toBinaryMask: 1, drawMask: 1 }, label)
  let result = code
  for (const replacement of [...replacements].sort((a, b) => b.start - a.start))
    result = `${result.slice(0, replacement.start)}globalThis.__maskProbe.${replacement.target}${result.slice(replacement.end)}`
  return { code: result, counts, replacements: replacements.map(({ start, end, target, original }) => ({ start, end, target, originalSha256: hash(original) })) }
}

async function loadHistorical() {
  const contract = await verifyDanmukuMaskContract()
  const implementations = []
  const source = contract.sources.get(sourceFile)
  const sourceCode = (await transform(source, { format: 'cjs', target: 'es2020' })).code
  implementations.push({ name: 'frozen-source', code: sourceCode, inputSha256: hash(source), transformedSha256: hash(sourceCode), source: true, replacements: [] })
  for (const release of [contract.baseline.release, ...contract.baseline.previous]) {
    const archive = contract.archives.get(release.version)
    for (const entry of ['main', 'legacy', 'module']) {
      const member = `package/${release.manifest[entry].replace(/^\.\//u, '')}`
      const input = readMember(archive, member).toString()
      const code = entry === 'module' ? (await transform(input, { format: 'cjs', target: 'es2020' })).code : input
      const modified = instrument(code, evaluate(code), `${release.version}/${entry}`)
      implementations.push({ name: `published-${release.version}-${entry}`, archiveSha256: release.sha256, member, inputSha256: hash(input), transformedSha256: hash(code), probeSha256: hash(modified.code), ...modified })
    }
  }
  return implementations
}

export const flushMask = () => new Promise(resolve => setImmediate(resolve))
function deferred() {
  let resolve
  let reject
  const promise = new Promise((accept, fail) => {
    resolve = accept
    reject = fail
  })
  return { promise, resolve, reject }
}

export function danmukuMaskEnvironment(implementation, settings = {}) {
  const env = {
    frames: new Map(),
    listeners: new Map(),
    logs: [],
    backends: [],
    created: [],
    inferences: [],
    masks: [],
    draws: [],
    initGates: [],
    segmentGates: [],
    writes: [],
    cancelled: [],
    settings,
  }
  let nextFrame = settings.firstFrame ?? 1
  const style = { maskMode: 'luminance', maskImage: 'url(prior-mask)' }
  Object.defineProperty(style, 'maskImage', {
    configurable: true,
    enumerable: true,
    get: () => env.writes.at(-1) ?? 'url(prior-mask)',
    set: value => env.writes.push(value),
  })
  const context = {
    getImageData() {
      if (settings.readError)
        throw settings.readError
      return { data: new Uint8ClampedArray([255, 255, 255, 255]) }
    },
    putImageData() {},
  }
  env.canvas = {
    width: 0,
    height: 0,
    getContext: () => settings.noContext ? null : context,
    toDataURL: () => 'data:image/png;base64,historical-mask',
  }
  env.video = settings.noVideo ? undefined : { paused: settings.paused ?? false, ended: false, videoWidth: 2, videoHeight: 1 }
  env.style = style
  env.art = {
    isDestroy: false,
    template: { $video: env.video, $danmuku: settings.noDanmuku ? undefined : { style } },
    on(name, callback) {
      if (!env.listeners.has(name))
        env.listeners.set(name, new Set())
      env.listeners.get(name).add(callback)
    },
    off(name, callback) { env.listeners.get(name)?.delete(callback) },
  }
  const probe = {
    SupportedModels: { MediaPipeSelfieSegmentation: 'selfie' },
    async setBackend(name) {
      env.backends.push(name)
      if (settings.backendError?.[name])
        throw settings.backendError[name]
      return settings.backendResult?.[name] ?? true
    },
    async createSegmenter(model, config) {
      const instance = {
        model,
        config,
        disposed: 0,
        dispose() { instance.disposed++ },
        async segmentPeople(video) {
          env.inferences.push({ instance, video })
          if (settings.segmentError)
            throw settings.segmentError
          if (settings.pendingSegment) {
            const gate = deferred()
            env.segmentGates.push(gate)
            return gate.promise
          }
          return settings.empty ? [] : [{}]
        },
      }
      env.created.push(instance)
      if (settings.initError)
        throw settings.initError
      if (settings.pendingInit) {
        const gate = deferred()
        env.initGates.push(gate)
        await gate.promise
      }
      return instance
    },
    async toBinaryMask(...args) {
      env.masks.push(args)
      return {}
    },
    async drawMask(...args) { env.draws.push(args) },
  }
  const factory = evaluate(implementation.code, {
    __maskProbe: probe,
    require(name) {
      assert(['@tensorflow-models/body-segmentation', '@tensorflow/tfjs-core', '@tensorflow/tfjs-backend-webgl', '@tensorflow/tfjs-backend-cpu'].includes(name))
      return probe
    },
    console: { log() {}, warn: (...args) => env.logs.push(['warn', ...args]), error: (...args) => env.logs.push(['error', ...args]) },
    document: { createElement(tag) {
      assert.equal(tag, 'canvas')
      if (settings.canvasError)
        throw settings.canvasError
      return env.canvas
    } },
    requestAnimationFrame(callback) {
      const id = nextFrame++
      env.frames.set(id, callback)
      return id
    },
    cancelAnimationFrame(id) {
      env.cancelled.push(id)
      env.frames.delete(id)
    },
  })
  env.result = factory(settings.option)(env.art)
  env.emit = (name) => {
    for (const callback of [...(env.listeners.get(name) || [])]) callback()
  }
  env.destroy = () => {
    env.art.isDestroy = true
    env.emit('destroy')
  }
  env.frame = async () => {
    const frames = [...env.frames.values()]
    env.frames.clear()
    for (const callback of frames) await callback()
    await flushMask()
  }
  return env
}
