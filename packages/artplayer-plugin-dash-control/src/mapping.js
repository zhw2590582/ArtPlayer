import { qualityAdapter } from './sdk'

function uniqueLabels(items) {
  const seen = new Map()
  return items.filter((item) => {
    if (item.html === undefined)
      return true
    const first = seen.get(item.html)
    if (first) {
      if (item.default)
        Object.assign(first, item)
      return false
    }
    seen.set(item.html, item)
    return true
  })
}

export function qualityModel(dash, config, active) {
  const adapter = qualityAdapter(dash)
  const levels = adapter.levels()
  if (!active() || !levels?.length)
    return null
  const auto = config.auto || 'Auto'
  const getName = config.getName || (level => `${level.height}p`)
  const selected = adapter.current(levels)
  if (!active())
    return null
  const automatic = dash.getSettings().streaming.abr.autoSwitchBitrate.video
  if (!active())
    return null
  const html = !automatic && selected ? getName(selected) : auto
  if (!active())
    return null
  const items = []
  for (const [index, level] of levels.entries()) {
    const label = getName(level)
    if (!active())
      return null
    items.push({ html: label, ...adapter.item(level, index, selected, automatic) })
  }
  const selector = uniqueLabels(items)
    .sort((left, right) => right.value - left.value)
  selector.push({ html: auto, value: 'auto', default: automatic })
  return { html, title: config.title || 'Quality', selector, select: adapter.select }
}

function selectedTrack(tracks, current) {
  if (tracks.includes(current))
    return current
  if (current.id == null && current.index == null)
    return undefined
  const matching = tracks.filter(track => ['id', 'index', 'lang'].every(key => current[key] == null || track[key] === current[key]))
  return matching.length === 1 ? matching[0] : undefined
}

export function audioModel(dash, config, active) {
  const tracks = dash.getTracksFor('audio')
  if (!active() || !tracks?.length)
    return null
  const auto = config.auto || 'Auto'
  const getName = config.getName || (track => track.lang || track.id)
  const current = dash.getCurrentTrackFor('audio') || tracks[0]
  if (!active())
    return null
  const html = current ? getName(current) : auto
  if (!active())
    return null
  const selected = selectedTrack(tracks, current)
  const items = []
  for (const track of tracks) {
    const label = getName(track)
    if (!active())
      return null
    items.push({ html: label, value: track, default: track === selected })
  }
  const selector = uniqueLabels(items)
  return { html, title: config.title || 'Audio', selector, select: item => dash.setCurrentTrack(item.value) }
}
