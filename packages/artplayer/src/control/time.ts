import type { ControlFactory, ControlOption } from './types'
import { isMobile, secondToTime } from '../utils'
import { controlEvents } from './resources'

export default function time(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    style: isMobile
      ? {
          fontSize: '12px',
          padding: '0 5px',
        }
      : {
          cursor: 'auto',
          padding: '0 10px',
        },
    mounted: ($control) => {
      const { on } = controlEvents(art, $control)
      function getTime() {
        const newTime = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`
        if (newTime !== $control.textContent) {
          $control.textContent = newTime
        }
      }

      getTime()

      const events = ['video:loadedmetadata', 'video:timeupdate', 'video:progress'] as const
      for (let index = 0; index < events.length; index++) {
        on(events[index]!, getTime)
      }
    },
  })
}
