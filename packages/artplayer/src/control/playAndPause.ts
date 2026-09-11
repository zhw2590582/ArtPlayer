import type { ControlFactory, ControlOption } from './types'
import { keyboardButton } from '../accessibility/button'
import { appendElement } from '../component/dom'
import { entryScope } from '../component/resources'
import { setStyle, silencePromise, tooltip } from '../utils'
import { controlEvents } from './resources'

export default function playAndPause(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control)
      const { icons, i18n } = art

      const $play = appendElement($control, icons.play)
      const $pause = appendElement($control, icons.pause)
      keyboardButton(entryScope($control), $control, () => (art.playing ? $pause : $play).click())
      tooltip($play, i18n.get('Play'))
      tooltip($pause, i18n.get('Pause'))

      proxy($play, 'click', () => {
        silencePromise(art.play())
      })

      proxy($pause, 'click', () => {
        art.pause()
      })

      function showPlay() {
        $control.setAttribute('aria-label', i18n.get('Play'))
        setStyle($play, 'display', 'flex')
        setStyle($pause, 'display', 'none')
      }

      function showPause() {
        $control.setAttribute('aria-label', i18n.get('Pause'))
        setStyle($play, 'display', 'none')
        setStyle($pause, 'display', 'flex')
      }

      if (art.playing) {
        showPause()
      }
      else {
        showPlay()
      }

      on('video:playing', () => {
        showPause()
      })

      on('video:pause', () => {
        showPlay()
      })
    },
  })
}
