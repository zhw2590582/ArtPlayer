import type { Config } from '../types/artplayer-plugin-hls-control'
import type { AudioFields, Hls, LevelFields, MenuModel, SelectorItem } from './types'

function uniqueLabels(items: SelectorItem[]): SelectorItem[] {
  const seen = new Map<string, SelectorItem>()
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

export function qualitySelection(hls: Pick<Hls, 'currentLevel' | 'autoLevelEnabled'>): number {
  return hls.autoLevelEnabled === true ? -1 : hls.currentLevel
}

export function qualityModel<Level extends object>(hls: Pick<Hls<Level>, 'levels' | 'currentLevel' | 'autoLevelEnabled'>, config: Config<Level>): MenuModel | null {
  if (!hls.levels.length)
    return null
  const auto = config.auto || 'Auto'
  const getName = config.getName || ((level: LevelFields) => level.name || `${level.height}P`)
  const selected = qualitySelection(hls)
  const level = hls.levels[selected]
  const html = level ? getName(level) : auto
  const selector = uniqueLabels(hls.levels.map((item, index) => ({ html: getName(item, index), value: index, default: selected === index })))
    .sort((a, b) => b.value - a.value)
  selector.push({ html: auto, value: -1, default: selected === -1 })
  return { html, title: config.title || 'Quality', selector }
}

export function audioModel<Track extends object>(hls: Pick<Hls<object, Track>, 'audioTracks' | 'audioTrack'>, config: Config<Track>): MenuModel | null {
  if (!hls.audioTracks.length)
    return null
  const auto = config.auto || 'Auto'
  const getName = config.getName || ((track: AudioFields) => track.name || track.lang || track.language)
  const track = hls.audioTracks[hls.audioTrack]
  const html = track ? getName(track) : auto
  const selector = uniqueLabels(hls.audioTracks.map((item, index) => ({ html: getName(item, index), value: item.id, default: hls.audioTrack === item.id })))
  return { html, title: config.title || 'Audio', selector }
}
