import type { SettingHost, SettingItem } from './types'
import { subscribeSetting } from './resources'

export default function aspectRatio(art: SettingHost): SettingItem {
  const {
    i18n,
    icons,
    constructor: { SETTING_ITEM_WIDTH, ASPECT_RATIO },
  } = art

  function getI18n(value: string) {
    return value === 'default' ? i18n.get('Default') : value
  }

  function update() {
    const target = art.setting.find(`aspect-ratio-${art.aspectRatio}`)
    art.setting.check(target)
  }

  return {
    width: SETTING_ITEM_WIDTH,
    name: 'aspect-ratio',
    html: i18n.get('Aspect Ratio'),
    icon: icons.aspectRatio,
    tooltip: getI18n(art.aspectRatio),
    selector: ASPECT_RATIO.map((item) => {
      return {
        value: item,
        name: `aspect-ratio-${item}`,
        default: item === art.aspectRatio,
        html: getI18n(item),
      }
    }),
    onSelect(item) {
      art.aspectRatio = item.value as string
      return item.html
    },
    mounted: (_element, item) => {
      update()
      subscribeSetting(art, item, 'aspectRatio', () => update())
    },
  }
}
