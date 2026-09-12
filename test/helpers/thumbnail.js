import vm from 'node:vm'
import { verifyThumbnailContract } from '../../refactor/scripts/thumbnail-contract.mjs'

export function thumbnailHistorical() {
  const { source, historical } = verifyThumbnailContract()
  return [
    { name: 'cdn-3.5.31', code: historical.get('packages/artplayer-tool-thumbnail/dist/artplayer-tool-thumbnail.js'), legacy: true },
    ...['.js', '.legacy.js'].map(suffix => ({ name: `workspace${suffix}`, code: source.get(`packages/artplayer-tool-thumbnail/dist/artplayer-tool-thumbnail${suffix}`), legacy: false })),
  ]
}

export function thumbnailEnvironment(implementation, script = false) {
  const operations = []
  const timers = new Map()
  let nextTimer = 0
  let nextUrl = 0
  const context2D = Object.fromEntries(['fillRect', 'fillText', 'drawImage'].map(name => [name, (...args) => operations.push({ name, args })]))
  class Element {
    constructor(tagName = 'div') {
      this.tagName = tagName.toUpperCase()
      this.type = this.tagName === 'INPUT' ? 'file' : ''
      this.style = {}
      this.children = []
      this.handlers = new Map()
      this.files = []
      if (this.tagName === 'VIDEO') {
        this.duration = 0
        this.videoWidth = 160
        this.videoHeight = 90
        this.currentTime = 0
        this.canPlayType = () => 'probably'
      }
    }

    appendChild(child) {
      child.parentNode = this
      this.children.push(child)
      operations.push({ name: 'append', parent: this.tagName, child: child.tagName })
      return child
    }

    removeChild(child) {
      const index = this.children.indexOf(child)
      if (index === -1)
        throw new Error('NotFoundError')
      this.children.splice(index, 1)
      child.parentNode = null
      return child
    }

    addEventListener(name, callback) {
      operations.push({ name: 'listen', type: name, callback })
      if (!callback)
        return
      const list = this.handlers.get(name) || new Set()
      list.add(callback)
      this.handlers.set(name, list)
    }

    removeEventListener(name, callback) { this.handlers.get(name)?.delete(callback) }
    getContext() { return context2D }
    click() { operations.push({ name: 'click', download: this.download, href: this.href }) }
    toBlob(callback) { callback({ kind: 'image/png' }) }
  }
  const body = new Element('body')
  const module = { exports: {} }
  const box = {
    Element,
    document: { body, createElement: tag => new Element(tag) },
    URL: {
      createObjectURL(value) {
        const url = `blob:thumbnail-${++nextUrl}`
        operations.push({ name: 'createURL', value, url })
        return url
      },
      revokeObjectURL(url) { operations.push({ name: 'revokeURL', url }) },
    },
    setTimeout(callback, delay) {
      const id = ++nextTimer
      timers.set(id, { callback, delay })
      return id
    },
    clearTimeout(id) { timers.delete(id) },
  }
  box.window = box
  box.self = box
  if (!script) {
    box.module = module
    box.exports = module.exports
  }
  vm.runInNewContext(implementation.code, box)
  const exported = script ? box.ArtplayerToolThumbnail : module.exports
  const Factory = exported.default || exported
  return { box, Element, body, Factory, exported, operations, context2D, timers }
}
