import type { DanmuItem, DanmukuArt, HeatmapOptions, HeatmapPoint } from './types'
import { heatmapGeometry } from './heatmap-geometry'

let nextGradient = 0

type HeatmapArt = Pick<DanmukuArt, 'isDestroy' | 'constructor' | 'on' | 'off' | 'controls' | 'option' | 'duration' | 'played'>
interface HeatmapEvents {
  'destroy': []
  'video:timeupdate': []
  'setBar': [type: string, percentage: number]
  'ready': []
  'resize': []
  'artplayerPluginDanmuku:loaded': []
  'artplayerPluginDanmuku:points': [points: HeatmapPoint[]]
}
type HeatmapCallback = (...args: unknown[]) => unknown

export default function heatmap(art: HeatmapArt, danmuku: { queue: readonly Pick<DanmuItem, 'time'>[] }, option: boolean | HeatmapOptions): (() => void) | undefined {
  if (art.isDestroy)
    return
  const { query } = art.constructor.utils
  let gradient: string | undefined
  const subscriptions: [keyof HeatmapEvents, HeatmapCallback][] = []
  let element: HTMLElement | undefined
  let start: Element | null | undefined
  let stop: Element | null | undefined
  let closed = false

  const active = () => !closed && !art.isDestroy
  function listen<Name extends keyof HeatmapEvents>(name: Name, callback: (...args: HeatmapEvents[Name]) => unknown) {
    // Core's string-event overload erases payloads; this local map checks each subscription.
    const listener = callback as HeatmapCallback
    subscriptions.push([name, listener])
    art.on(name, listener)
  }
  function dispose(removeControl: boolean) {
    if (closed)
      return
    closed = true
    start = null
    stop = null
    let failure: unknown
    let failed = false
    const attempt = (callback: () => unknown) => {
      try {
        callback()
      }
      catch (error) {
        if (!failed)
          failure = error
        failed = true
      }
    }
    for (const [name, callback] of subscriptions.splice(0))
      attempt(() => art.off(name, callback))
    if (removeControl && element && art.controls.heatmap === element)
      attempt(() => art.controls.remove('heatmap'))
    element = undefined
    if (failed)
      throw failure
  }
  function progress(value: number) {
    if (active() && start && stop) {
      start.setAttribute('offset', `${value * 100}%`)
      stop.setAttribute('offset', `${value * 100}%`)
    }
  }
  function draw(points: HeatmapPoint[] = []) {
    if (!active())
      return
    start = null
    stop = null
    // Drawing listeners are registered only after mounted assigns element; dispose closes first.
    const target = element!
    target.innerHTML = ''
    if (art.option.isLive)
      return
    const shape = heatmapGeometry({ width: target.offsetWidth, height: target.offsetHeight, duration: art.duration, queue: danmuku.queue, option, points })
    if (!shape || !active())
      return
    const document = target.ownerDocument
    if (!gradient)
      gradient = document ? 'heatmap-solids' : `heatmap-solids-${++nextGradient}`
    while (document?.getElementById(gradient))
      gradient = `heatmap-solids-${++nextGradient}`
    target.innerHTML = `
      <svg viewBox="0 0 ${shape.width} ${shape.height}">
        <defs>
          <linearGradient id="${gradient}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${shape.opacity}" />
            <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${shape.opacity}" id="heatmap-start" />
            <stop offset="0%" style="stop-color:var(--art-progress-color);stop-opacity:1" id="heatmap-stop" />
            <stop offset="100%" style="stop-color:var(--art-progress-color);stop-opacity:1" />
          </linearGradient>
        </defs>
        <path fill="url(#${gradient})" d="${shape.path}"></path>
      </svg>
    `
    start = query('#heatmap-start', target)
    stop = query('#heatmap-stop', target)
    progress(art.played)
  }
  function update(points?: HeatmapPoint[]) {
    try {
      draw(points)
    }
    catch (error) {
      try {
        dispose(true)
      }
      catch {}
      throw error
    }
  }
  listen('destroy', () => dispose(true))
  try {
    art.controls.add({
      name: 'heatmap',
      position: 'top',
      html: '',
      style: {
        position: 'absolute',
        top: '-100px',
        left: '0px',
        right: '0px',
        height: '100px',
        width: '100%',
        pointerEvents: 'none',
      },
      beforeUnmount() { dispose(false) },
      mounted(value) {
        element = value
        if (closed) {
          if (art.controls.heatmap === value)
            art.controls.remove('heatmap')
          element = undefined
          return
        }
        if (!active()) {
          dispose(true)
          return
        }
        listen('video:timeupdate', () => progress(art.played))
        listen('setBar', (type, percentage) => {
          if (type === 'played')
            progress(percentage)
        })
        listen('ready', () => update())
        listen('resize', () => update())
        listen('artplayerPluginDanmuku:loaded', () => update())
        listen('artplayerPluginDanmuku:points', points => update(points))
      },
    })
  }
  catch (error) {
    try {
      dispose(true)
    }
    catch {}
    throw error
  }
  return () => dispose(true)
}
