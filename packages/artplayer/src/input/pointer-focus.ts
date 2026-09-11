import type { FocusHost } from './pointer-types'
import { getScope, isClosing } from '../lifecycle/instance'
import { includeFromEvent } from '../utils/dom'

export function pointerFocus(art: FocusHost): void {
  const { $player } = art.template
  const onDocumentClick = (event: Event) => {
    if (isClosing(art))
      return
    const inside = includeFromEvent(event, $player)
    art.isInput = inside && (event.target as Element | null)?.tagName === 'INPUT'
    art.isFocus = inside
    art.emit(inside ? 'focus' : 'blur', event)
  }
  art.on('document:click', onDocumentClick)
  art.on('document:contextmenu', onDocumentClick)
  getScope(art).add(() => {
    art.off('document:click', onDocumentClick)
    art.off('document:contextmenu', onDocumentClick)
  })
}
