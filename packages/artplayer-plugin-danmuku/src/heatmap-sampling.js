export const MAX_HEATMAP_POINTS = 0xFFFFFFFF

function upperBound(values, value) {
  let start = 0
  let end = values.length
  while (start < end) {
    const middle = Math.floor((start + end) / 2)
    if (values[middle] <= value)
      start = middle + 1
    else end = middle
  }
  return start
}

export function sampleHeatmap(queue, width, duration, sampling) {
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(duration) || duration <= 0
    || !Number.isFinite(sampling) || sampling <= 0 || Math.floor(width / sampling) + 1 > MAX_HEATMAP_POINTS) { return [] }
  const times = queue.map(item => item.time).filter(time => typeof time === 'number' && !Number.isNaN(time)).sort((a, b) => a - b)
  const points = []
  const gap = duration / width
  if (!Number.isFinite(gap))
    return []
  // Keep the old floating-point x progression and strict-left/inclusive-right bins.
  for (let x = 0; x <= width; x += sampling) {
    if (points.length >= MAX_HEATMAP_POINTS || x + sampling === x)
      return []
    const left = x * gap
    const right = (x + sampling) * gap
    points.push([x, upperBound(times, right) - upperBound(times, left)])
  }
  return points
}
