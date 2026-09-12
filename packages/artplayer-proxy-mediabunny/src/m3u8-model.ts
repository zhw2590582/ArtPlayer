import type { ProxyOptions } from './engine-types'
import type { Label, MenuModel, SelectorItem, State } from './m3u8-types'

type Options = NonNullable<ProxyOptions['m3u8']>

function unique(items: SelectorItem[]): SelectorItem[] {
  const positions = new Map<Label, number>()
  const output: SelectorItem[] = []
  for (const item of items) {
    const position = positions.get(item.html)
    if (item.html !== undefined && position !== undefined) {
      if (item.default)
        output[position] = item
    }
    else {
      positions.set(item.html, output.length)
      output.push(item)
    }
  }
  return output
}

export function qualityModel(state: State | null, config: NonNullable<Options['quality']>, active: () => boolean): MenuModel | null {
  if ((!config.control && !config.setting) || !state?.levels.length)
    return null
  const auto = config.auto || 'Auto'
  const getName = config.getName || (level => level.name || `${level.height}P`)
  const html = state.currentLevel ? getName(state.currentLevel) : auto
  const items: SelectorItem[] = []
  for (const level of state.levels) {
    if (!active())
      return null
    items.push({ html: getName(level), value: level.id, default: state.currentLevel?.id === level.id })
  }
  const heights = new Map(state.levels.map(level => [level.id, level.height]))
  const selector = unique(items).sort((left, right) => (right.value === 'auto' ? 0 : heights.get(right.value) || 0) - (left.value === 'auto' ? 0 : heights.get(left.value) || 0))
  selector.push({ html: auto, value: 'auto', default: !state.currentLevel })
  return { title: config.title || 'Quality', html, selector }
}

export function audioModel(state: State | null, config: NonNullable<Options['audio']>, active: () => boolean): MenuModel | null {
  if ((!config.control && !config.setting) || !state || state.audios.length < 2)
    return null
  const auto = config.auto || 'Auto'
  const getName = config.getName || (track => track.name || track.lang || track.language)
  const html = state.currentAudio ? getName(state.currentAudio) : auto
  const items: SelectorItem[] = []
  for (const track of state.audios) {
    if (!active())
      return null
    items.push({ html: getName(track), value: track.id, default: state.currentAudio?.id === track.id })
  }
  const selector = unique(items)
  selector.push({ html: auto, value: 'auto', default: !state.currentAudio })
  return { title: config.title || 'Audio', html, selector }
}
