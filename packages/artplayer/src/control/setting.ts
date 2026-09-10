import type { ControlFactory, ControlOption } from './types'
import { appendElement } from '../component/dom'
import { tooltip } from '../utils'
import { controlEvents } from './resources'

export default function setting(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    tooltip: art.i18n.get('Show Setting'),
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control)
      const { icons, i18n } = art

      appendElement($control, icons.setting)

      proxy($control, 'click', () => {
        art.setting.toggle()
        art.setting.resize()
      })

      on('setting', (value) => {
        tooltip($control, i18n.get(value ? 'Hide Setting' : 'Show Setting'))
      })
    },
  })
}
