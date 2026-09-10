import type { ControlFactory, ControlOption } from './types'
import { appendElement } from '../component/dom'
import { controlEvents } from './resources'

export default function airplay(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    tooltip: art.i18n.get('AirPlay'),
    mounted: ($control) => {
      const { proxy } = controlEvents(art, $control)
      const { icons } = art
      appendElement($control, icons.airplay)
      proxy($control, 'click', () => art.airplay())
    },
  })
}
