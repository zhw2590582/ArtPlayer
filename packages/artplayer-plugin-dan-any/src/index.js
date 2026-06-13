import { UniDB } from '@dan-uni/dan-any/core/main/pure'
import DanAnyControl from './control'
import createHeatmap from './heatmap'
import DanAnyDomRenderer, { normalizeRendererOption } from './renderer'
import { isUniChunk, resolveSource } from './source'
import style from './style.less?inline'

function isPromise(value) {
  return !!value && typeof value.then === 'function'
}

async function resolveTarget(target) {
  if (typeof target === 'function')
    return resolveTarget(await target())

  if (isPromise(target))
    return resolveTarget(await target)

  return target
}

function createRenderer(art, option) {
  if (typeof option.renderer === 'function')
    return option.renderer({ art, option })

  if (option.renderer)
    return option.renderer

  return new DanAnyDomRenderer(art, option)
}

function callRenderer(renderer, name, ...args) {
  if (renderer && typeof renderer[name] === 'function')
    return renderer[name](...args)

  return undefined
}

async function deleteChunk(chunk) {
  if (chunk && typeof chunk.delete === 'function')
    await chunk.delete()
}

async function deleteChunks(chunks) {
  for (const chunk of new Set(chunks))
    await deleteChunk(chunk)
}

async function applyPlugins(chunk, owned, plugins = []) {
  const result = {
    chunk,
    owned,
    ownedChunks: owned ? [chunk] : [],
    obsoleteChunks: [],
  }
  const pluginList = Array.isArray(plugins) ? plugins : []

  for (let index = 0; index < pluginList.length; index++) {
    const nextChunk = await result.chunk.plugin(pluginList[index])

    if (!isUniChunk(nextChunk))
      continue

    if (nextChunk === result.chunk)
      continue

    if (result.owned)
      result.obsoleteChunks.push(result.chunk)

    result.chunk = nextChunk
    result.owned = true
    result.ownedChunks.push(nextChunk)
  }

  return result
}

class DanAny {
  constructor(art, option = {}) {
    this.art = art
    this.option = normalizeRendererOption(option)
    this.chunk = null
    this.ownsChunk = false
    this.udanmakus = []
    this.destroyed = false
    this.renderer = createRenderer(art, this.option)
    this.control = new DanAnyControl(art, this)
    this.heatmap = null
    this.udbReady = Promise.resolve(new UniDB().init())

    this.destroy = this.destroy.bind(this)
    art.on('destroy', this.destroy)

    this.updateHeatmap()
    this.load().catch(() => {})
  }

  async deleteOwnedChunk(chunk = this.chunk, ownsChunk = this.ownsChunk) {
    if (ownsChunk)
      await deleteChunk(chunk)
  }

  async load(source) {
    const target = await resolveTarget(source === undefined ? this.option.danmuku : source)
    const udb = await this.udbReady
    const previousChunk = this.chunk
    const previousOwned = this.ownsChunk
    let ownedChunks = []
    let committed = false

    try {
      const sourceResult = await resolveSource(udb, target ?? [], this.option)
      const pluginResult = await applyPlugins(sourceResult.chunk, sourceResult.owned, this.option.plugins)
      ownedChunks = pluginResult.ownedChunks

      const udanmakus = [...await pluginResult.chunk.$danmakus].sort((prev, next) => {
        const diff = prev.progress - next.progress

        if (diff)
          return diff

        return String(prev.DMID || '').localeCompare(String(next.DMID || ''))
      })

      this.chunk = pluginResult.chunk
      this.ownsChunk = pluginResult.owned
      this.udanmakus = udanmakus
      committed = true
      callRenderer(this.renderer, 'load', udanmakus)

      await deleteChunks(pluginResult.obsoleteChunks)

      if (previousChunk && previousChunk !== pluginResult.chunk)
        await this.deleteOwnedChunk(previousChunk, previousOwned)

      this.art.emit('artplayerPluginDanAny:loaded', udanmakus, pluginResult.chunk)
    }
    catch (error) {
      if (!committed)
        await deleteChunks(ownedChunks).catch(() => {})

      this.art.emit('artplayerPluginDanAny:error', error)
      throw error
    }

    return this
  }

  config(option = {}) {
    const hasPoints = Object.prototype.hasOwnProperty.call(option, 'points')

    this.option = normalizeRendererOption({
      ...this.option,
      ...option,
    })

    callRenderer(this.renderer, 'config', this.option)
    this.control.update()
    this.updateHeatmap({ hasPoints })

    return this
  }

  updateHeatmap({ hasPoints = false } = {}) {
    if (!this.option.heatmap) {
      this.destroyHeatmap()
      return
    }

    if (!this.heatmap) {
      this.heatmap = createHeatmap(this.art, this, this.option.heatmap)
    }
    else {
      this.heatmap.config(this.option.heatmap)
    }

    if (hasPoints)
      this.heatmap.clearPoints()

    this.heatmap.update()
  }

  destroyHeatmap() {
    if (!this.heatmap)
      return

    this.heatmap.destroy()
    this.heatmap = null
  }

  hide() {
    this.config({ visible: false })
    return this
  }

  show() {
    this.config({ visible: true })
    return this
  }

  reset() {
    callRenderer(this.renderer, 'reset')
    return this
  }

  mount(el) {
    this.control.mount(el)
  }

  async closeDB() {
    const udb = await this.udbReady

    if (udb && typeof udb.close === 'function')
      udb.close()
  }

  destroy() {
    if (this.destroyed)
      return

    this.destroyed = true
    this.art.off('destroy', this.destroy)
    this.destroyHeatmap()
    this.control.destroy()
    callRenderer(this.renderer, 'destroy')

    Promise.resolve()
      .then(() => this.deleteOwnedChunk())
      .then(() => this.closeDB())
      .catch(() => {})
  }
}

export default function artplayerPluginDanAny(option = {}) {
  return (art) => {
    const danAny = new DanAny(art, option)
    const result = {
      name: 'artplayerPluginDanAny',
      load: async (source) => {
        await danAny.load(source)
        return result
      },
      config: (config) => {
        danAny.config(config)
        return result
      },
      hide: () => {
        danAny.hide()
        return result
      },
      show: () => {
        danAny.show()
        return result
      },
      reset: () => {
        danAny.reset()
        return result
      },
      mount: (el) => {
        danAny.mount(el)
      },
      get chunk() {
        return danAny.chunk
      },
      get udanmakus() {
        return danAny.udanmakus
      },
      get option() {
        return danAny.option
      },
      get isHide() {
        return !!danAny.renderer?.isHide
      },
      get isStop() {
        return !!danAny.renderer?.isStop
      },
    }

    return result
  }
}

if (typeof document !== 'undefined') {
  const id = 'artplayer-plugin-dan-any'
  let $style = document.getElementById(id)

  if (!$style) {
    $style = document.createElement('style')
    $style.id = id

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.head.appendChild($style)
      })
    }
    else {
      (document.head || document.documentElement).appendChild($style)
    }
  }

  $style.textContent = style
}
