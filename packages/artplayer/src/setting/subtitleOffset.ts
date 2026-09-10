import type { SettingHost, SettingItem } from './types'
import { subscribeSetting } from './resources'

export default function subtitleOffset(art: SettingHost): SettingItem {
  const { i18n, icons, constructor } = art

  return {
    width: constructor.SETTING_ITEM_WIDTH,
    name: 'subtitle-offset',
    html: i18n.get('Subtitle Offset'),
    icon: icons.subtitle,
    tooltip: '0s',
    range: [0, -10, 10, 0.1],
    onChange(item) {
      art.subtitleOffset = item.range![0]!
      return `${item.range![0]}s`
    },
    mounted: (_, item) => {
      subscribeSetting(art, item, 'subtitleOffset', (value) => {
        item.$range!.value = String(value)
        item.tooltip = `${value}s`
      })
    },
  }
}
