import type { Config } from '../types/artplayer-plugin-dash-control'
import type { AudioFields, AudioItem, Dash, Label, MenuModel, QualityFields, QualityItem, SelectorItem, Valid } from './types'
import { qualityAdapter } from './sdk'

function uniqueLabels<Item extends SelectorItem>(items: Item[]): Item[] {
  const seen = new Map<Label, Item>()
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

export function qualityModel<Level extends object, Track extends object>(dash: Dash<Level, Track>, config: Config<Level>, active: Valid): MenuModel<QualityItem> | null {
  const adapter = qualityAdapter(dash)
  const levels = adapter.levels()
  if (!active() || !levels?.length)
    return null
  const auto = config.auto || 'Auto'
  const getName = config.getName || ((level: QualityFields) => `${level.height}p`)
  const selected = adapter.current(levels)
  if (!active())
    return null
  const automatic = dash.getSettings().streaming.abr.autoSwitchBitrate.video
  if (!active())
    return null
  const html = !automatic && selected ? getName(selected) : auto
  if (!active())
    return null
  const items: QualityItem[] = []
  for (const [index, level] of levels.entries()) {
    const label = getName(level)
    if (!active())
      return null
    items.push({ html: label, ...adapter.item(level, index, selected, automatic) })
  }
  const selector = uniqueLabels(items)
    // The synthetic Auto item is appended after sorting SDK numeric keys.
    .sort((left, right) => (right.value as number) - (left.value as number))
  selector.push({ html: auto, value: 'auto', default: automatic })
  return { html, title: config.title || 'Quality', selector, select: adapter.select }
}

function selectedTrack<Track extends AudioFields>(tracks: Track[], current: Track): Track | undefined {
  if (tracks.includes(current))
    return current
  if (current.id == null && current.index == null)
    return undefined
  const fields = ['id', 'index', 'lang'] as const
  const matching = tracks.filter(track => fields.every(key => current[key] == null || track[key] === current[key]))
  return matching.length === 1 ? matching[0] : undefined
}

export function audioModel<Level extends object, Track extends object>(dash: Dash<Level, Track>, config: Config<Track>, active: Valid): MenuModel<AudioItem<Track>> | null {
  const tracks = dash.getTracksFor('audio')
  if (!active() || !tracks?.length)
    return null
  const auto = config.auto || 'Auto'
  const getName = config.getName || ((track: AudioFields) => track.lang || track.id)
  // The non-empty list check above protects the fallback item.
  const current = dash.getCurrentTrackFor('audio') || tracks[0]!
  if (!active())
    return null
  const html = current ? getName(current) : auto
  if (!active())
    return null
  const selected = selectedTrack(tracks, current)
  const items: AudioItem<Track>[] = []
  for (const track of tracks) {
    const label = getName(track)
    if (!active())
      return null
    items.push({ html: label, value: track, default: track === selected })
  }
  const selector = uniqueLabels(items)
  return { html, title: config.title || 'Audio', selector, select: item => dash.setCurrentTrack(item.value) }
}
