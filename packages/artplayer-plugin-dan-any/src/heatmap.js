const CONTROL_NAME = 'danAnyHeatmap'
const GRADIENT_ID = 'dan-any-heatmap-solids'
const START_ID = 'dan-any-heatmap-start'
const STOP_ID = 'dan-any-heatmap-stop'

const lib = {
  map(value, inMin, inMax, outMin, outMax) {
    if (inMin === inMax)
      return outMin

    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  },
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function toNumber(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function line(pointA, pointB) {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
    angle: Math.atan2(lengthY, lengthX),
  }
}

function getOptions(svg, option) {
  const options = {
    xMin: 0,
    xMax: svg.w,
    yMin: 0,
    yMax: 128,
    scale: 0.25,
    opacity: 0.2,
    minHeight: Math.floor(svg.h * 0.05),
    sampling: Math.max(1, Math.floor(svg.w / 100)),
    smoothing: 0.2,
    flattening: 0.2,
  }

  if (option && typeof option === 'object') {
    Object.keys(options).forEach((key) => {
      if (option[key] !== undefined)
        options[key] = toNumber(option[key], options[key])
    })
  }

  options.sampling = Math.max(1, Math.round(options.sampling))
  options.opacity = clamp(options.opacity, 0, 1)

  return options
}

function getQueue(danAny) {
  if (Array.isArray(danAny.renderer?.queue))
    return danAny.renderer.queue

  return Array.isArray(danAny.udanmakus) ? danAny.udanmakus : []
}

function getDanmakuTime(danmaku) {
  const progress = Number(danmaku?.progress)

  if (!Number.isFinite(progress))
    return null

  return progress / 1000
}

function getPointTime(point) {
  if (!point || typeof point !== 'object')
    return null

  const time = Number(point.time)

  if (!Number.isFinite(time))
    return null

  return time
}

function getPointValue(point) {
  const value = Number(point.value)

  if (!Number.isFinite(value))
    return null

  return Math.max(0, value)
}

function getExternalPoints(points, art, svg) {
  if (!Array.isArray(points) || !points.length)
    return []

  return points
    .map((point) => {
      const time = getPointTime(point)
      const value = getPointValue(point)

      if (time === null || value === null)
        return null

      return [
        clamp(time, 0, art.duration) / art.duration * svg.w,
        value,
      ]
    })
    .filter(Boolean)
    .sort((prev, next) => prev[0] - next[0])
}

function getAutoPoints(art, danAny, svg, options) {
  const queue = getQueue(danAny)
  const gap = art.duration / svg.w
  const points = []

  for (let x = 0; x <= svg.w; x += options.sampling) {
    const start = x * gap
    const end = (x + options.sampling) * gap
    const y = queue.filter((danmaku) => {
      const time = getDanmakuTime(danmaku)
      return time !== null && time > start && time <= end
    }).length

    points.push([x, y])
  }

  return points
}

function resolvePoints(points, runtimePoints, art, danAny, svg, options) {
  const source = Array.isArray(points)
    ? points
    : Array.isArray(runtimePoints)
      ? runtimePoints
      : danAny.option.points

  const externalPoints = getExternalPoints(source, art, svg)

  if (externalPoints.length)
    return externalPoints

  return getAutoPoints(art, danAny, svg, options)
}

function fillEdges(points, width) {
  if (!points.length)
    return

  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]

  if (firstPoint[0] !== 0)
    points.unshift([0, firstPoint[1]])

  if (lastPoint[0] !== width)
    points.push([width, lastPoint[1]])
}

function getPath(points, svg, options) {
  const controlPoint = (current, previous, next, reverse) => {
    const p = previous || current
    const n = next || current
    const o = line(p, n)
    const flat = lib.map(Math.cos(o.angle) * options.flattening, 0, 1, 1, 0)
    const angle = o.angle * flat + (reverse ? Math.PI : 0)
    const length = o.length * options.smoothing
    const x = current[0] + Math.cos(angle) * length
    const y = current[1] + Math.sin(angle) * length
    return [x, y]
  }

  const bezierCommand = (point, i, a) => {
    const cps = controlPoint(a[i - 1], a[i - 2], point)
    const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
    const close = i === a.length - 1 ? ' z' : ''
    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}${close}`
  }

  const pointsPositions = points.map((point) => {
    const x = lib.map(point[0], options.xMin, options.xMax, 0, svg.w)
    const y = lib.map(point[1], options.yMin, options.yMax, svg.h, 0)
    return [x, y]
  })

  return pointsPositions.reduce(
    (acc, point, index, array) =>
      index === 0
        ? `M ${array[array.length - 1][0]},${svg.h} L ${point[0]},${svg.h} L ${point[0]},${point[1]}`
        : `${acc} ${bezierCommand(point, index, array)}`,
    '',
  )
}

function hasControl(art) {
  return !!art.controls?.cache?.has(CONTROL_NAME)
}

export default function createHeatmap(art, danAny, option) {
  const { query } = art.constructor.utils
  let heatmapOption = option
  let runtimePoints = null
  let handlers = null
  let update = () => {}

  function offEvents() {
    if (!handlers)
      return

    art.off('video:timeupdate', handlers.timeupdate)
    art.off('setBar', handlers.setBar)
    art.off('ready', handlers.ready)
    art.off('resize', handlers.resize)
    art.off('artplayerPluginDanAny:loaded', handlers.loaded)
    art.off('artplayerPluginDanAny:points', handlers.points)
    handlers = null
  }

  const controller = {
    config(nextOption) {
      heatmapOption = nextOption
      return controller
    },
    clearPoints() {
      runtimePoints = null
      return controller
    },
    update(points) {
      update(points)
      return controller
    },
    destroy() {
      offEvents()

      if (hasControl(art))
        art.controls.remove(CONTROL_NAME)
    },
  }

  art.controls.add({
    name: CONTROL_NAME,
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
    mounted($heatmap) {
      let $start = null
      let $stop = null

      function setPlayed(percentage = art.played) {
        if ($start && $stop) {
          $start.setAttribute('offset', `${percentage * 100}%`)
          $stop.setAttribute('offset', `${percentage * 100}%`)
        }
      }

      update = (points) => {
        $start = null
        $stop = null
        $heatmap.innerHTML = ''

        if (!art.duration || art.option.isLive)
          return

        const svg = {
          w: $heatmap.offsetWidth,
          h: $heatmap.offsetHeight,
        }

        if (!svg.w || !svg.h)
          return

        const options = getOptions(svg, heatmapOption)
        const heatmapPoints = resolvePoints(points, runtimePoints, art, danAny, svg, options)

        if (heatmapPoints.length === 0)
          return

        fillEdges(heatmapPoints, svg.w)

        const yPoints = heatmapPoints.map(point => point[1])
        const yMin = Math.min(...yPoints)
        const yMax = Math.max(...yPoints)
        const yMid = (yMin + yMax) / 2

        for (let index = 0; index < heatmapPoints.length; index++) {
          const point = heatmapPoints[index]
          const y = point[1]
          point[1] = y * (y > yMid ? 1 + options.scale : 1 - options.scale) + options.minHeight
        }

        const pathD = getPath(heatmapPoints, svg, options)

        $heatmap.innerHTML = `
                    <svg viewBox="0 0 ${svg.w} ${svg.h}">
                        <defs>
                            <linearGradient id="${GRADIENT_ID}" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${options.opacity}" />
                                <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${options.opacity}" id="${START_ID}" />
                                <stop offset="0%" style="stop-color:var(--art-progress-color);stop-opacity:1" id="${STOP_ID}" />
                                <stop offset="100%" style="stop-color:var(--art-progress-color);stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#${GRADIENT_ID})" d="${pathD}"></path>
                    </svg>
                `

        $start = query(`#${START_ID}`, $heatmap)
        $stop = query(`#${STOP_ID}`, $heatmap)
        setPlayed()
      }

      handlers = {
        timeupdate: () => setPlayed(),
        setBar: (type, percentage) => {
          if (type === 'played')
            setPlayed(percentage)
        },
        ready: () => update(),
        resize: () => update(),
        loaded: () => update(),
        points: (points) => {
          runtimePoints = Array.isArray(points) ? points : []
          update(runtimePoints)
        },
      }

      art.on('video:timeupdate', handlers.timeupdate)
      art.on('setBar', handlers.setBar)
      art.on('ready', handlers.ready)
      art.on('resize', handlers.resize)
      art.on('artplayerPluginDanAny:loaded', handlers.loaded)
      art.on('artplayerPluginDanAny:points', handlers.points)

      update()
    },
    beforeUnmount($heatmap) {
      offEvents()
      $heatmap.innerHTML = ''
      update = () => {}
    },
  })

  return controller
}
