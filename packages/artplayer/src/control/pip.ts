import type { ControlFactory, ControlOption } from './types'
import { appendElement } from '../component/dom'
import { tooltip } from '../utils'
import { controlEvents } from './resources'

export default function pip(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    tooltip: art.i18n.get('PIP Mode'),
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control)
      const { icons, i18n } = art

      appendElement($control, icons.pip)

      proxy($control, 'click', () => {
        art.pip = !art.pip
      })

      on('pip', (value) => {
        tooltip($control, i18n.get(value ? 'Exit PIP Mode' : 'PIP Mode'))
      })
    },
  })
}
