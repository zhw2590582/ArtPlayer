import type { ControlFactory, ControlOption } from './types'
import { keyboardButton } from '../accessibility/button'
import { appendElement } from '../component/dom'
import { entryScope } from '../component/resources'
import { silencePromise } from '../utils'
import { controlEvents } from './resources'

export default function screenshot(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    tooltip: art.i18n.get('Screenshot'),
    mounted: ($control) => {
      const { proxy } = controlEvents(art, $control)
      const { icons } = art
      keyboardButton(entryScope($control), $control)

      appendElement($control, icons.screenshot)
      proxy($control, 'click', () => {
        silencePromise(art.screenshot())
      })
    },
  })
}
