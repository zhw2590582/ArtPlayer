import type { ComponentHost } from './types'
import { focusPlayer } from '../accessibility/player-focus'
import { isClosing } from '../lifecycle/instance'

interface FocusOwner {
  name?: string
  art: ComponentHost
  cache: Map<string, { $ref: HTMLDivElement }>
}

const pending = new WeakSet<object>()
const focusable = '[tabindex],button,input,select,textarea,a[href],[contenteditable]'

function targetIn(element: HTMLElement): HTMLElement | undefined {
  const targets = [element, ...element.querySelectorAll<HTMLElement>(focusable)]
  return targets.find((target) => {
    if (!target.matches(focusable) || target.tabIndex < 0 || target.matches(':disabled') || target.closest('[inert]') || target.getAttribute('aria-disabled') === 'true' || !target.getClientRects().length)
      return false
    const style = target.ownerDocument.defaultView?.getComputedStyle(target)
    return style?.visibility !== 'hidden' && style?.visibility !== 'collapse'
  })
}

export function captureComponentFocus(owner: FocusOwner, element?: HTMLElement, replacement?: string): () => void {
  const doc = element?.ownerDocument
  const focused = doc?.activeElement
  if (!['control', 'contextmenu'].includes(owner.name ?? '') || pending.has(owner) || !element || !doc || !focused || !element.contains(focused))
    return () => {}
  const player = owner.art.template.$player
  const controls = Array.from(player.querySelectorAll<HTMLElement>(`.art-${owner.name}`))
  const index = controls.indexOf(element)
  const neighbors = [...controls.slice(index + 1), ...controls.slice(0, index).reverse()]
  pending.add(owner)
  return () => {
    pending.delete(owner)
    if (isClosing(owner.art) || !player.isConnected || doc.activeElement !== doc.body)
      return
    const next = replacement ? owner.cache.get(replacement)?.$ref : undefined
    for (const candidate of [...(next ? [next] : []), ...neighbors]) {
      if (!player.contains(candidate))
        continue
      const target = targetIn(candidate)
      if (target) {
        target.focus({ preventScroll: true })
        return
      }
    }
    focusPlayer(owner.art)
  }
}
