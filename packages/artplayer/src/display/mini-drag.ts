import type ResourceScope from '../lifecycle/scope'
import type { MiniHost } from './types'
import { listen } from '../lifecycle/resources'
import { clampMini, miniGeometry } from './mini-layout'

export function miniDrag(art: MiniHost, element: HTMLElement, scope: ResourceScope, active: () => boolean): () => void {
  let dragging = false
  let startX = 0
  let startY = 0
  const cancel = (): undefined => {
    dragging = false
    element.classList.remove('art-mini-dragging')
    element.style.transform = ''
  }
  listen(scope, element, 'mousedown', (event) => {
    const mouse = event as MouseEvent
    if (mouse.button !== 0 || !active())
      return
    dragging = true
    startX = mouse.clientX
    startY = mouse.clientY
  })
  const move = (event: MouseEvent) => {
    if (!scope.closed && dragging && active()) {
      element.classList.add('art-mini-dragging')
      element.style.transform = `translate(${event.clientX - startX}px, ${event.clientY - startY}px)`
    }
  }
  const end = () => {
    if (scope.closed || !dragging || !active())
      return
    const rect = element.getBoundingClientRect()
    const position = clampMini(rect.left, rect.top, miniGeometry(element))
    cancel()
    element.style.left = `${position.left}px`
    element.style.top = `${position.top}px`
    art.storage.set('left', position.left)
    if (!scope.closed)
      art.storage.set('top', position.top)
  }
  art.on('document:mousemove', move)
  scope.add(() => {
    art.off('document:mousemove', move)
  })
  art.on('document:mouseup', end)
  scope.add(() => {
    art.off('document:mouseup', end)
  })
  scope.add(cancel)
  return cancel
}
