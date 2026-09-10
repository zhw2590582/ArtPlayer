import type { ControlHost } from '../types'
import { isMobile } from '../../utils'
import { controlEvents } from '../resources'
import { getPosFromEvent, setCurrentTime } from './position'

export function installProgressInteractions(art: ControlHost, $control: HTMLDivElement): void {
  const { $progress } = art.template
  const $indicator = $control.querySelector('.art-progress-indicator')
  const { on, proxy } = controlEvents(art, $control)
  if (!isMobile) {
    let isDragging = false
    proxy($progress, 'click', (event) => {
      if (event.target !== $indicator) {
        setCurrentTime(art, event)
      }
    })

    proxy($progress, 'mousemove', (event) => {
      const { percentage } = getPosFromEvent(art, event)
      art.emit('setBar', 'hover', percentage, event)
    })

    proxy($progress, 'mouseleave', (event) => {
      art.emit('setBar', 'hover', 0, event)
    })

    proxy($progress, 'mousedown', (event) => {
      isDragging = event.button === 0
    })

    on('document:mousemove', (event) => {
      if (isDragging) {
        const { second, percentage } = getPosFromEvent(art, event)
        art.emit('setBar', 'played', percentage, event)
        art.seek = second
      }
    })

    on('document:mouseup', () => {
      if (isDragging) {
        isDragging = false
      }
    })
  }
}
