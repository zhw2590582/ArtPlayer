import type { ControlFactory, ControlOption } from './types'
import { keyboardButton } from '../accessibility/button'
import { appendElement } from '../component/dom'
import { entryScope } from '../component/resources'
import { controlEvents } from './resources'

export default function airplay(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    tooltip: art.i18n.get('AirPlay'),
    mounted: ($control) => {
      const { proxy } = controlEvents(art, $control)
      const { icons } = art
      keyboardButton(entryScope($control), $control)
      appendElement($control, icons.airplay)
      proxy($control, 'click', () => art.airplay())
    },
  })
}
