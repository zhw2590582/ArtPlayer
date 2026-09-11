import type { ControlFactory, ControlOption } from './types'
import { keyboardButton } from '../accessibility/button'
import { appendElement } from '../component/dom'
import { entryScope } from '../component/resources'
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
      keyboardButton(entryScope($control), $control)
      $control.setAttribute('aria-expanded', 'false')

      proxy($control, 'click', () => {
        art.setting.toggle()
        art.setting.resize()
      })

      on('setting', (value) => {
        $control.setAttribute('aria-expanded', String(value))
        tooltip($control, i18n.get(value ? 'Hide Setting' : 'Show Setting'))
      })
    },
  })
}
