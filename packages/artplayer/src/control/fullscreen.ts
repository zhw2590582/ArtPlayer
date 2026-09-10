import type { ControlFactory, ControlOption } from './types'
import { appendElement } from '../component/dom'
import { setStyle, tooltip } from '../utils'
import { controlEvents } from './resources'

export default function fullscreen(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    tooltip: art.i18n.get('Fullscreen'),
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control)
      const { icons, i18n } = art

      const $fullscreenOn = appendElement($control, icons.fullscreenOn)
      const $fullscreenOff = appendElement($control, icons.fullscreenOff)
      setStyle($fullscreenOff, 'display', 'none')

      proxy($control, 'click', () => {
        art.fullscreen = !art.fullscreen
      })

      on('fullscreen', (state) => {
        if (state) {
          tooltip($control, i18n.get('Exit Fullscreen'))
          setStyle($fullscreenOn, 'display', 'none')
          setStyle($fullscreenOff, 'display', 'inline-flex')
        }
        else {
          tooltip($control, i18n.get('Fullscreen'))
          setStyle($fullscreenOn, 'display', 'inline-flex')
          setStyle($fullscreenOff, 'display', 'none')
        }
      })
    },
  })
}
