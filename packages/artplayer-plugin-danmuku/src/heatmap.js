import { heatmapGeometry } from './heatmap-geometry'

let nextGradient = 0

export default function heatmap(art, danmuku, option) {
  if (art.isDestroy)
    return
  const { query } = art.constructor.utils
  let gradient
  const subscriptions = []
  let element
  let start
  let stop
  let closed = false

  const active = () => !closed && !art.isDestroy
  function listen(name, callback) {
    subscriptions.push([name, callback])
    art.on(name, callback)
  }
  function dispose(removeControl) {
    if (closed)
      return
    closed = true
    start = null
    stop = null
    let failure
    let failed = false
    const attempt = (callback) => {
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
  function progress(value) {
    if (active() && start && stop) {
      start.setAttribute('offset', `${value * 100}%`)
      stop.setAttribute('offset', `${value * 100}%`)
    }
  }
  function draw(points = []) {
    if (!active())
      return
    start = null
    stop = null
    element.innerHTML = ''
    if (art.option.isLive)
      return
    const shape = heatmapGeometry({ width: element.offsetWidth, height: element.offsetHeight, duration: art.duration, queue: danmuku.queue, option, points })
    if (!shape || !active())
      return
    const document = element.ownerDocument
    if (!gradient)
      gradient = document ? 'heatmap-solids' : `heatmap-solids-${++nextGradient}`
    while (document?.getElementById(gradient))
      gradient = `heatmap-solids-${++nextGradient}`
    element.innerHTML = `
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
    start = query('#heatmap-start', element)
    stop = query('#heatmap-stop', element)
    progress(art.played)
  }
  function update(points) {
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
