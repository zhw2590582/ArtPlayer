function uniqueLabels(items) {
  const seen = new Map()
  return items.filter((item) => {
    if (item.html === undefined)
      return true
    const first = seen.get(item.html)
    if (first) {
      if (item.default) {
        first.default = true
        first.value = item.value
      }
      return false
    }
    seen.set(item.html, item)
    return true
  })
}

export function qualitySelection(hls) {
  return hls.autoLevelEnabled === true ? -1 : hls.currentLevel
}

export function qualityModel(hls, config) {
  if (!hls.levels.length)
    return null
  const auto = config.auto || 'Auto'
  const getName = config.getName || (level => level.name || `${level.height}P`)
  const selected = qualitySelection(hls)
  const level = hls.levels[selected]
  const html = level ? getName(level) : auto
  const selector = uniqueLabels(hls.levels.map((item, index) => ({ html: getName(item, index), value: index, default: selected === index })))
    .sort((a, b) => b.value - a.value)
  selector.push({ html: auto, value: -1, default: selected === -1 })
  return { html, title: config.title || 'Quality', selector }
}

export function audioModel(hls, config) {
  if (!hls.audioTracks.length)
    return null
  const auto = config.auto || 'Auto'
  const getName = config.getName || (track => track.name || track.lang || track.language)
  const track = hls.audioTracks[hls.audioTrack]
  const html = track ? getName(track) : auto
  const selector = uniqueLabels(hls.audioTracks.map((item, index) => ({ html: getName(item, index), value: item.id, default: hls.audioTrack === item.id })))
  return { html, title: config.title || 'Audio', selector }
}
