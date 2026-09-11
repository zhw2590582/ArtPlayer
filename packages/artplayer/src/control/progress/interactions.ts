import type { ControlHost } from '../types'
import { entryScope } from '../../component/resources'
import { isClosing } from '../../lifecycle/instance'
import { captureSource } from '../../source/operation'
import { isMobile } from '../../utils'
import { controlEvents } from '../resources'
import { getPosFromEvent, setCurrentTime } from './position'

export function installProgressInteractions(art: ControlHost, $control: HTMLDivElement): void {
  const { $progress } = art.template
  const $indicator = $control.querySelector('.art-progress-indicator')
  const { on, proxy } = controlEvents(art, $control)
  const scope = entryScope($control)
  let action = 0
  const capture = () => {
    const sourceActive = captureSource(art)
    return () => !scope.closed && !isClosing(art) && sourceActive()
  }
  const captureAction = () => {
    const revision = ++action
    const active = capture()
    return () => revision === action && active()
  }
  if (!isMobile) {
    let dragging: (() => boolean) | undefined
    proxy($progress, 'click', (event) => {
      if (event.target !== $indicator) {
        setCurrentTime(art, event, captureAction())
      }
    })

    proxy($progress, 'mousemove', (event) => {
      const active = capture()
      const { percentage } = getPosFromEvent(art, event)
      if (active())
        art.emit('setBar', 'hover', percentage, event)
    })

    proxy($progress, 'mouseleave', (event) => {
      art.emit('setBar', 'hover', 0, event)
    })

    proxy($progress, 'mousedown', (event) => {
      dragging = event.button === 0 ? captureAction() : undefined
    })

    on('document:mousemove', (event) => {
      const active = dragging
      if (active?.()) {
        const { second, percentage } = getPosFromEvent(art, event)
        if (!active() || dragging !== active)
          return
        art.emit('setBar', 'played', percentage, event)
        if (active() && dragging === active)
          art.seek = second
      }
      else {
        dragging = undefined
      }
    })

    on('document:mouseup', () => {
      dragging = undefined
    })
  }
}
