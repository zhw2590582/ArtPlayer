function invalid(line, message) {
  throw new TypeError(`Invalid VTT thumbnail at line ${line}: ${message}`)
}

function timestamp(value, line) {
  if (!/^\d{2,}(?::\d{2}){0,2}(?:\.\d{3})?$/.test(value))
    invalid(line, 'invalid timestamp')
  const [whole, fraction = '0'] = value.split('.')
  const seconds = whole.split(':').reduce((total, part) => total * 60 + Number(part), 0) + Number(fraction) / 1000
  if (!Number.isSafeInteger(Math.floor(seconds)))
    invalid(line, 'timestamp exceeds the supported numeric range')
  return seconds
}

function rectangle(text, vttUrl, line) {
  const match = text.match(/^(.+)#([xywh]{4})=(.*)$/)
  if (!match || new Set(match[2]).size !== 4)
    invalid(line, 'expected an image URL and four distinct xywh keys')
  const values = match[3].split(',').map(value => value.trim())
  if (values.length !== 4)
    invalid(line, 'expected four rectangle coordinates')
  const rect = {}
  for (let index = 0; index < 4; index++) {
    const key = match[2][index]
    const value = values[index]
    if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) || !Number.isFinite(Number(value)))
      invalid(line, 'rectangle coordinates must be finite non-negative decimals')
    if ((key === 'w' || key === 'h') && Number(value) === 0)
      invalid(line, 'rectangle width and height must be positive')
    rect[key] = value
  }
  let url = match[1]
  if (!/^\/|(?:https?|ftp|file):\/\//i.test(url)) {
    const segments = vttUrl.split('/')
    segments.pop()
    segments.push(url)
    url = segments.join('/')
  }
  return { url, ...rect }
}

export function findThumbnail(thumbnails, second) {
  return thumbnails.find(item => second >= item.start && second <= item.end)
}

export default function parseVtt(text, vttUrl = '') {
  if (typeof text !== 'string')
    invalid(1, 'expected text')
  const lines = text.replace(/^\uFEFF/, '').split(/\r\n|\r|\n/)
  let index = 0
  function skipEmpty() {
    while (index < lines.length && !lines[index].trim())
      index++
  }
  skipEmpty()
  if (index === lines.length)
    return []
  if (!/^WEBVTT(?:[\t ].*)?$/.test(lines[index].trim()) || lines[index].includes('-->'))
    invalid(index + 1, 'expected WEBVTT header')
  index++
  const thumbnails = []
  while (index < lines.length) {
    skipEmpty()
    if (index === lines.length)
      break
    const first = lines[index].trim()
    if (/^NOTE(?:[\t ]|$)/.test(first) || first === 'STYLE' || first === 'REGION') {
      while (index < lines.length && lines[index].trim())
        index++
      continue
    }
    const identifierLine = index + 1
    if (!first.includes('-->')) {
      index++
      if (index === lines.length || !lines[index].trim())
        invalid(identifierLine, 'cue identifier must be followed by timing')
    }
    const timingLine = index + 1
    const timing = lines[index].trim().match(/^([\d:.]+)[\t ]*-->[\t ]*([\d:.]+)(?:[\t ].*)?$/)
    if (!timing)
      invalid(timingLine, 'invalid cue timing')
    const start = timestamp(timing[1], timingLine)
    const end = timestamp(timing[2], timingLine)
    if (end < start)
      invalid(timingLine, 'cue end precedes its start')
    index++
    skipEmpty()
    if (index === lines.length)
      invalid(timingLine, 'missing sprite image')
    const image = rectangle(lines[index].trim(), vttUrl, index + 1)
    thumbnails.push({ start: Math.floor(start), end: Math.floor(end), ...image })
    index++
  }
  return thumbnails
}
