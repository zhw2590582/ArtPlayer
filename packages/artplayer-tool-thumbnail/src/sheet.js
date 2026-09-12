import { getFileName } from './utils'

export function screenshotPoints(option, duration) {
  const { number, width, height, column, begin } = option
  const timeGap = duration / number
  const timePoints = [begin + timeGap]
  while (timePoints.length < number) {
    const last = timePoints[timePoints.length - 1]
    timePoints.push(last + timeGap)
  }
  return timePoints.map((item, index) => ({
    time: item - timeGap / 2,
    x: (index % column) * width,
    y: Math.floor(index / column) * height,
  }))
}

export function createSheet(option) {
  const { number, width, height, column } = option
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = width * column
  canvas.height = Math.ceil(number / column) * height + 30
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.font = '14px Georgia'
  context.fillStyle = '#fff'
  context.fillText(
    `From: https://artplayer.org/, Number: ${number}, Width: ${width}, Height: ${height}, Column: ${column}`,
    10,
    canvas.height - 11,
  )
  return canvas
}

export function downloadSheet(file, url) {
  const link = document.createElement('a')
  const name = `${getFileName(file.name)}.png`
  link.download = name
  link.href = url
  try {
    document.body.appendChild(link)
    link.click()
  }
  finally {
    if (link.parentNode)
      link.parentNode.removeChild(link)
  }
  return name
}
