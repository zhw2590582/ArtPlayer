import type ResourceScope from '../lifecycle/scope'
import { listen } from '../lifecycle/resources'

/** Keep keyboard visibility separate from the existing pointer focus flags. */
export function focusVisibility(scope: ResourceScope, root: HTMLElement, show: () => void): () => boolean {
  let keyboard = true
  let document: Document | undefined
  let documentScope: ResourceScope | undefined
  const focused = () => !scope.closed && keyboard && root.contains(root.ownerDocument.activeElement)
  const update = () => {
    const visible = focused()
    const previous = root.classList.contains('art-keyboard-focus')
    root.classList.toggle('art-keyboard-focus', visible)
    if (visible && !previous)
      show()
  }
  const key = () => {
    keyboard = true
    update()
  }
  const pointer = () => {
    keyboard = false
    update()
  }
  const bindDocument = () => {
    if (document === root.ownerDocument)
      return
    documentScope?.dispose()
    document = root.ownerDocument
    documentScope = scope.child()
    listen(documentScope, document, 'keydown', key, { capture: true })
    listen(documentScope, document, 'mousedown', pointer, { capture: true })
    listen(documentScope, document, 'touchstart', pointer, { capture: true, passive: true })
  }
  bindDocument()
  listen(scope, root, 'keydown', key, { capture: true })
  listen(scope, root, 'mousedown', pointer, { capture: true })
  listen(scope, root, 'touchstart', pointer, { capture: true, passive: true })
  listen(scope, root, 'focusin', () => {
    bindDocument()
    update()
  })
  listen(scope, root, 'focusout', () => {
    root.classList.remove('art-keyboard-focus')
  })
  scope.add(() => {
    root.classList.remove('art-keyboard-focus')
  })
  return focused
}
