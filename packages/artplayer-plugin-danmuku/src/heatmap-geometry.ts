import type { DanmuItem, HeatmapOptions, HeatmapPoint } from './types'
import { MAX_HEATMAP_POINTS, sampleHeatmap } from './heatmap-sampling'

function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

function line(pointA: HeatmapPoint, pointB: HeatmapPoint) {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return { length: Math.sqrt(lengthX ** 2 + lengthY ** 2), angle: Math.atan2(lengthY, lengthX) }
}

interface GeometryInput {
  width: number
  height: number
  duration: number
  queue: readonly Pick<DanmuItem, 'time'>[]
  option: boolean | HeatmapOptions
  points?: HeatmapPoint[]
}

export interface HeatmapGeometry {
  path: string
  opacity: number
  width: number
  height: number
}

export function heatmapGeometry({ width, height, duration, queue, option, points: input = [] }: GeometryInput): HeatmapGeometry | null {
  if (![width, height, duration].every(value => Number.isFinite(value) && value > 0))
    return null
  const defaults: Required<HeatmapOptions> = {
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
  const configured: HeatmapOptions = Object.assign({}, typeof option === 'object' ? option : {})
  const options = Object.assign({}, defaults, configured)
  for (const key of Object.keys(defaults) as (keyof HeatmapOptions)[]) {
    if (!Number.isFinite(options[key]))
      options[key] = defaults[key]
  }
  if (options.sampling <= 0)
    options.sampling = defaults.sampling
  if (options.xMin === options.xMax || options.yMin === options.yMax)
    return null
  const hasCustomPoints = Array.isArray(input) && input.length > 0
  const points = hasCustomPoints ? [...input] : sampleHeatmap(queue, width, duration, options.sampling)
  if (!points.length
    || !points.every(point => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1]))) { return null }
  // The nonempty check above guarantees both endpoints used below.
  const lastPoint = points[points.length - 1]!
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
  // Explicit axes and custom points retain their coordinate interpretation. Fit automatic
  // charts into the lower quarter so dense data cannot obscure the video.
  const automatic = !hasCustomPoints && !Number.isFinite(configured.yMin) && !Number.isFinite(configured.yMax)
  let peak = 0
  for (const point of points) peak = Math.max(peak, point[1])
  const fitted = automatic && peak > defaults.yMax / 4
  if (fitted)
    options.yMax = peak * 4
  const boundY = (value: number) => fitted ? Math.min(height, Math.max(height * 0.75, value)) : value
  const controlPoint = (current: HeatmapPoint, previous: HeatmapPoint | undefined, next: HeatmapPoint | undefined, reverse?: boolean): HeatmapPoint => {
    const geometry = line(previous || current, next || current)
    const flat = map(Math.cos(geometry.angle) * options.flattening, 0, 1, 1, 0)
    const angle = geometry.angle * flat + (reverse ? Math.PI : 0)
    const length = geometry.length * options.smoothing
    // A cubic stays inside the convex hull of its endpoints and controls.
    return [current[0] + Math.cos(angle) * length, boundY(current[1] + Math.sin(angle) * length)]
  }
  const positions = points.map<HeatmapPoint>(point => [map(point[0], options.xMin, options.xMax, 0, width), boundY(map(point[1], options.yMin, options.yMax, height, 0))])
  if (!positions.every(point => point.every(Number.isFinite)))
    return null
  const path = positions.map((point, index, all) => {
    if (index === 0)
      return `M ${all[all.length - 1]![0]},${height} L ${point[0]},${height} L ${point[0]},${point[1]}`
    // Every noninitial point has its immediately preceding control point.
    const start = controlPoint(all[index - 1]!, all[index - 2], point)
    const end = controlPoint(point, all[index - 1], all[index + 1], true)
    return `C ${start[0]},${start[1]} ${end[0]},${end[1]} ${point[0]},${point[1]}${index === all.length - 1 ? ' z' : ''}`
  }).join(' ')
  if (/NaN|Infinity/u.test(path))
    return null
  return { path, opacity: options.opacity, width, height }
}
