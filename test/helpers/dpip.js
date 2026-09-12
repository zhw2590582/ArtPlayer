import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { build, transform } from 'esbuild'
import less from 'less'
import { verifyDpipContract } from '../../refactor/scripts/dpip-contract.mjs'
import { readMember } from '../../refactor/scripts/releases.mjs'
import { getEntryFile } from '../../scripts/projects.js'

export async function dpipCandidate() {
  if (process.env.ARTPLAYER_DPIP_BASELINE === '1')
    return (await dpipHistorical()).find(item => item.name === 'frozen-workspace')
  if (process.env.ARTPLAYER_DPIP_ARTIFACT)
    return { name: 'candidate-artifact', code: await fs.readFile(process.env.ARTPLAYER_DPIP_ARTIFACT, 'utf8') }
  const root = fileURLToPath(new URL('../../', import.meta.url))
  const output = await build({ entryPoints: [getEntryFile(path.join(root, 'packages/artplayer-plugin-document-pip'))], bundle: true, write: false, format: 'cjs', target: 'es2020', plugins: [{
    name: 'dpip-less-inline',
    setup(build) {
      build.onLoad({ filter: /\.less$/ }, async ({ path: filename }) => {
        const source = await fs.readFile(filename.replace(/\?inline$/, ''), 'utf8')
        return { contents: (await less.render(source)).css, loader: 'text' }
      })
    },
  }] })
  return { name: 'candidate-source', code: output.outputFiles[0].text }
}

export async function dpipHistorical() {
  const contract = await verifyDpipContract()
  const css = (await less.render(contract.sources.get('packages/artplayer-plugin-document-pip/src/style.less'))).css
  const source = contract.sources.get('packages/artplayer-plugin-document-pip/src/index.js').replace('import style from \'./style.less?inline\'', `const style = ${JSON.stringify(css)}`)
  return [
    ...[contract.baseline.release, ...contract.baseline.previous].filter(release => !release.missingEntrypoints.main).map(release => ({ name: `published-${release.version}`, code: readMember(contract.archives.get(release.version), `package/${release.manifest.main.replace(/^\.\//, '')}`).toString() })),
    { name: 'frozen-workspace', code: (await transform(source, { format: 'cjs', target: 'es2020' })).code },
  ]
}

function eventTarget() {
  const listeners = new Map()
  return {
    listeners,
    addEventListener(name, callback) {
      if (!listeners.has(name))
        listeners.set(name, new Set())
      listeners.get(name).add(callback)
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback) },
    dispatchEvent(event) {
      for (const callback of [...(listeners.get(event.type) || [])]) callback(event)
    },
  }
}

function adopt(node, document) {
  node.ownerDocument = document
  for (const child of node.children) adopt(child, document)
}

function createNode(tag, document) {
  return {
    ...eventTarget(),
    nodeName: tag.toUpperCase(),
    ownerDocument: document,
    parentNode: null,
    children: [],
    style: {},
    className: '',
    textContent: '',
    get nextSibling() {
      return this.parentNode?.children[this.parentNode.children.indexOf(this) + 1] || null
    },
    appendChild(child) { return this.insertBefore(child, null) },
    insertBefore(child, before) {
      assert(before === null || before.parentNode === this, 'Reference node must belong to this parent')
      child.remove()
      const index = before === null ? this.children.length : this.children.indexOf(before)
      this.children.splice(index, 0, child)
      child.parentNode = this
      adopt(child, this.ownerDocument)
      return child
    },
    removeChild(child) {
      assert.equal(child.parentNode, this)
      this.children.splice(this.children.indexOf(child), 1)
      child.parentNode = null
      return child
    },
    remove() { this.parentNode?.removeChild(this) },
  }
}

function createDocument(readyState = 'complete') {
  const doc = { ...eventTarget(), readyState }
  doc.createElement = tag => createNode(tag, doc)
  doc.documentElement = doc.createElement('html')
  doc.head = doc.createElement('head')
  doc.body = doc.createElement('body')
  doc.documentElement.appendChild(doc.head)
  doc.documentElement.appendChild(doc.body)
  const nodes = () => {
    const result = []
    const walk = (node) => {
      result.push(node)
      for (const child of node.children) walk(child)
    }
    walk(doc.documentElement)
    return result
  }
  doc.getElementById = id => nodes().find(node => node.id === id) || null
  doc.querySelectorAll = (selector) => {
    if (selector === 'style')
      return nodes().filter(node => node.nodeName === 'STYLE')
    if (selector === 'link[rel="stylesheet"]')
      return nodes().filter(node => node.nodeName === 'LINK' && node.rel === 'stylesheet')
    if (selector === 'meta[name="viewport"]')
      return nodes().filter(node => node.nodeName === 'META' && node.name === 'viewport')
    throw new Error(`Unimplemented controlled selector: ${selector}`)
  }
  doc.querySelector = selector => doc.querySelectorAll(selector)[0] || null
  doc.adoptNode = (node) => {
    node.remove()
    adopt(node, doc)
    return node
  }
  return doc
}

export function dpipEnvironment(implementation, settings = {}) {
  const document = createDocument(settings.readyState)
  const windows = []
  const requests = []
  const sleeps = []
  const emitted = []
  const warnings = []
  const subscriptions = new Map()
  const controls = new Map()
  const proxies = []
  const rebinds = []
  const timers = new Map()
  let timerId = 0
  const window = { ...eventTarget(), document }
  document.defaultView = window
  function createWindow() {
    const win = { ...eventTarget(), document: createDocument(), closed: false, close() {
      this.closed = true
    } }
    win.document.defaultView = win
    windows.push(win)
    return win
  }
  if (settings.supported !== false) {
    window.documentPictureInPicture = { requestWindow(option) {
      requests.push(option)
      return settings.requestWindow ? settings.requestWindow(option, createWindow) : Promise.resolve(createWindow())
    } }
  }
  const parent = document.createElement('div')
  const player = document.createElement('div')
  player.className = 'art-video-player'
  const sibling = document.createElement('span')
  document.body.appendChild(parent)
  parent.appendChild(player)
  parent.appendChild(sibling)
  const utils = {
    append(node, content) { node.content = content },
    tooltip(node, value) { node.tooltip = value },
    addClass(node, name) { node.className = `${node.className} ${name}`.trim() },
    removeClass(node, name) { node.className = node.className.split(' ').filter(value => value !== name).join(' ') },
    sleep(ms) {
      sleeps.push(ms)
      return settings.sleep ? settings.sleep(ms) : Promise.resolve()
    },
  }
  const art = {
    template: { $player: player },
    constructor: { utils },
    icons: { pip: 'pip-icon' },
    i18n: { get: name => name },
    notice: { show: '' },
    pip: false,
    isDestroy: false,
    proxy(target, name, callback) {
      target.addEventListener(name, callback)
      const dispose = () => target.removeEventListener(name, callback)
      proxies.push(dispose)
      return dispose
    },
    controls: { add(spec) {
      const node = document.createElement('button')
      controls.set(spec.name, { spec, node })
      spec.mounted?.(node)
      return node
    }, remove(name) { controls.delete(name) } },
    events: { bindGlobalEvents: (...args) => rebinds.push({ args, document: player.ownerDocument }) },
    on(name, callback) {
      if (!subscriptions.has(name))
        subscriptions.set(name, new Set())
      subscriptions.get(name).add(callback)
      return art
    },
    off(name, callback) { subscriptions.get(name)?.delete(callback) },
    emit(name, ...args) {
      emitted.push({ name, args })
      for (const callback of [...(subscriptions.get(name) || [])]) callback(...args)
    },
    destroy() {
      art.isDestroy = true
      art.emit('destroy')
    },
  }
  const context = vm.createContext({ window, document, console: { warn: (...args) => warnings.push(args) }, module: { exports: {} }, setTimeout(callback, ms) {
    const id = timerId++
    timers.set(id, callback)
    sleeps.push(ms)
    const delay = settings.sleep ? settings.sleep(ms) : Promise.resolve()
    void delay.then(() => {
      const run = timers.get(id)
      timers.delete(id)
      run?.()
    })
    return id
  }, clearTimeout(id) { timers.delete(id) } })
  context.exports = context.module.exports
  const evaluate = () => vm.runInContext(`(() => { ${implementation.code}\n })()`, context, { timeout: 5000 })
  evaluate()
  return {
    factory: context.module.exports.default || context.module.exports,
    exported: context.module.exports,
    document,
    window,
    art,
    parent,
    player,
    sibling,
    controls,
    windows,
    requests,
    sleeps,
    emitted,
    warnings,
    proxies,
    subscriptions,
    rebinds,
    timers,
    evaluate,
    createWindow,
    async flush() {
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    },
  }
}
