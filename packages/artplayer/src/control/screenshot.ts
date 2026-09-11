import type { ControlFactory, ControlOption } from './types'
import { appendElement } from '../component/dom'
import { silencePromise } from '../utils'
import { controlEvents } from './resources'

export default function screenshot(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    tooltip: art.i18n.get('Screenshot'),
    mounted: ($control) => {
      const { proxy } = controlEvents(art, $control)
      const { icons } = art

      appendElement($control, icons.screenshot)
      proxy($control, 'click', () => {
        silencePromise(art.screenshot())
      })
    },
  })
}
