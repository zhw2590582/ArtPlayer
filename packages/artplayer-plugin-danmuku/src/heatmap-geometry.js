import { MAX_HEATMAP_POINTS, sampleHeatmap } from './heatmap-sampling'

function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

function line(pointA, pointB) {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return { length: Math.sqrt(lengthX ** 2 + lengthY ** 2), angle: Math.atan2(lengthY, lengthX) }
}

export function heatmapGeometry({ width, height, duration, queue, option, points: input = [] }) {
  if (![width, height, duration].every(value => Number.isFinite(value) && value > 0))
    return null
  const defaults = {
    xMin: 0,
    xMax: width,
    yMin: 0,
    yMax: 128,
    scale: 0.25,
    opacity: 0.2,
    minHeight: Math.floor(height * 0.05),
    sampling: Math.max(1, Math.floor(width / 100)),
    smoothing: 0.2,
    flattening: 0.2,
  }
  const options = Object.assign({}, defaults, typeof option === 'object' ? option : {})
  for (const key of Object.keys(defaults)) {
    if (!Number.isFinite(options[key]))
      options[key] = defaults[key]
  }
  if (options.sampling <= 0)
    options.sampling = defaults.sampling
  if (options.xMin === options.xMax || options.yMin === options.yMax)
    return null
  const points = Array.isArray(input) && input.length ? [...input] : sampleHeatmap(queue, width, duration, options.sampling)
  if (!points.length
    || !points.every(point => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1]))) { return null }
  const lastPoint = points[points.length - 1]
  if (lastPoint[0] !== width) {
    if (points.length === MAX_HEATMAP_POINTS)
      return null
    points.push([width, lastPoint[1]])
  }
  let yMin = Infinity
  let yMax = -Infinity
  for (const point of points) {
    yMin = Math.min(yMin, point[1])
    yMax = Math.max(yMax, point[1])
  }
  const yMid = (yMin + yMax) / 2
  // Historical points events copy only the outer array: callers observe these y writes.
  for (const point of points) {
    const y = point[1]
    point[1] = y * (y > yMid ? 1 + options.scale : 1 - options.scale) + options.minHeight
  }
  const controlPoint = (current, previous, next, reverse) => {
    const geometry = line(previous || current, next || current)
    const flat = map(Math.cos(geometry.angle) * options.flattening, 0, 1, 1, 0)
    const angle = geometry.angle * flat + (reverse ? Math.PI : 0)
    const length = geometry.length * options.smoothing
    return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length]
  }
  const positions = points.map(point => [map(point[0], options.xMin, options.xMax, 0, width), map(point[1], options.yMin, options.yMax, height, 0)])
  if (!positions.every(point => point.every(Number.isFinite)))
    return null
  const path = positions.map((point, index, all) => {
    if (index === 0)
      return `M ${all[all.length - 1][0]},${height} L ${point[0]},${height} L ${point[0]},${point[1]}`
    const start = controlPoint(all[index - 1], all[index - 2], point)
    const end = controlPoint(point, all[index - 1], all[index + 1], true)
    return `C ${start[0]},${start[1]} ${end[0]},${end[1]} ${point[0]},${point[1]}${index === all.length - 1 ? ' z' : ''}`
  }).join(' ')
  if (/NaN|Infinity/u.test(path))
    return null
  return { path, opacity: options.opacity, width, height }
}
