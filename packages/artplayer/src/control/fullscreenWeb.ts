import type { ControlFactory, ControlOption } from './types'
import { appendElement } from '../component/dom'
import { setStyle, tooltip } from '../utils'
import { controlEvents } from './resources'

export default function fullscreenWeb(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    tooltip: art.i18n.get('Web Fullscreen'),
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control)
      const { icons, i18n } = art

      const $fullscreenWebOn = appendElement($control, icons.fullscreenWebOn)
      const $fullscreenWebOff = appendElement($control, icons.fullscreenWebOff)
      setStyle($fullscreenWebOff, 'display', 'none')

      proxy($control, 'click', () => {
        art.fullscreenWeb = !art.fullscreenWeb
      })

      on('fullscreenWeb', (value) => {
        if (value) {
          tooltip($control, i18n.get('Exit Web Fullscreen'))
          setStyle($fullscreenWebOn, 'display', 'none')
          setStyle($fullscreenWebOff, 'display', 'inline-flex')
        }
        else {
          tooltip($control, i18n.get('Web Fullscreen'))
          setStyle($fullscreenWebOn, 'display', 'inline-flex')
          setStyle($fullscreenWebOff, 'display', 'none')
        }
      })
    },
  })
}
