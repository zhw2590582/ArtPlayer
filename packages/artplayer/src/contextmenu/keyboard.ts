import type Contextmenu from './index'
import { claimKey, plainKey } from '../accessibility/keyboard'
import { resolveFocusOrigin, setOverlayOrigin } from '../accessibility/overlay-focus'
import { focusPlayer } from '../accessibility/player-focus'
import { entryScope } from '../component/resources'
import { isClosing } from '../lifecycle/instance'
import { listen, timeout } from '../lifecycle/resources'

function editable(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  return !!element && (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) || element.isContentEditable)
}

function available(element: HTMLElement): boolean {
  const visibility = element.ownerDocument.defaultView?.getComputedStyle(element).visibility
  return element.isConnected && !element.matches(':disabled') && !element.closest('[inert]') && element.getAttribute('aria-disabled') !== 'true' && element.getClientRects().length > 0 && visibility !== 'hidden' && visibility !== 'collapse'
}

export function contextmenuKeyboard(menu: Contextmenu, open: (x: number, y: number) => void) {
  const { art } = menu
  const { $player, $contextmenu } = art.template
  const scope = entryScope($contextmenu)
  const active = () => !scope.closed && !isClosing(art)
  let origin: HTMLElement | undefined
  let hadFocus = false
  let prefix = ''
  let typedAt = 0
  const capture = () => {
    const focused = $player.ownerDocument.activeElement as HTMLElement | null
    origin = focused && $player.contains(focused) ? resolveFocusOrigin(focused) : $player
    setOverlayOrigin($contextmenu, origin)
  }
  const targets = () => Array.from($contextmenu.querySelectorAll<HTMLElement>('[tabindex],button,input,select,textarea,a[href],[contenteditable]'))
    .filter(element => element.tabIndex >= 0 && available(element))
  const label = art.i18n.get('Context Menu')
  if (!active())
    return { pointer: () => false }
  $contextmenu.setAttribute('role', 'group')
  $contextmenu.setAttribute('aria-label', label)
  const changed = (show: boolean) => {
    if (!active())
      return
    if (show) {
      if (!$contextmenu.contains($player.ownerDocument.activeElement))
        capture()
      return
    }
    const focused = $player.ownerDocument.activeElement
    const restore = $contextmenu.contains(focused) || (hadFocus && focused === $player.ownerDocument.body)
    const previous = origin
    origin = undefined
    hadFocus = false
    prefix = ''
    setOverlayOrigin($contextmenu)
    if (!restore)
      return
    if (previous && $player.contains(previous) && available(previous))
      previous.focus({ preventScroll: true })
    if ($player.ownerDocument.activeElement === $player.ownerDocument.body || $contextmenu.contains($player.ownerDocument.activeElement))
      focusPlayer(art)
  }
  art.on('contextmenu', changed)
  scope.add(() => {
    art.off('contextmenu', changed)
    setOverlayOrigin($contextmenu)
  })
  listen(scope, $contextmenu, 'focusin', () => {
    hadFocus = true
  })
  let pending = false
  listen(scope, $contextmenu, 'focusout', (input) => {
    if ($contextmenu.contains((input as FocusEvent).relatedTarget as Node | null) || pending)
      return
    pending = true
    timeout(scope, () => {
      pending = false
      if (active() && menu.show && !$contextmenu.contains($player.ownerDocument.activeElement))
        menu.show = false
    }, 0)
  })
  listen(scope, $player, 'keydown', (input) => {
    const event = input as KeyboardEvent
    if (!active() || !plainKey(event) || event.defaultPrevented)
      return
    const opening = event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)
    if (opening && art.constructor.CONTEXTMENU && !editable(event.target)) {
      claimKey(event)
      capture()
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      open(rect.left, rect.bottom)
      if (active() && menu.show)
        targets()[0]?.focus({ preventScroll: true })
      return
    }
    if (!menu.show || !$contextmenu.contains(event.target as Node | null))
      return
    if (event.key === 'Escape') {
      claimKey(event)
      menu.show = false
      return
    }
    if (event.key === 'Tab') {
      menu.show = false
      return
    }
    if (editable(event.target))
      return
    const items = targets()
    const index = items.indexOf(event.target as HTMLElement)
    let target: HTMLElement | undefined
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      target = items[(index + 1) % items.length]
    }
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      target = items[(index + items.length - 1) % items.length]
    }
    else if (event.key === 'Home') {
      target = items[0]
    }
    else if (event.key === 'End') {
      target = items[items.length - 1]
    }
    else if (event.key.length === 1 && event.key !== ' ') {
      const key = event.key.toLowerCase()
      prefix = Date.now() - typedAt > 700 ? key : prefix + key
      typedAt = Date.now()
      const search = [...prefix].every(letter => letter === key) ? key : prefix
      target = [...items.slice(index + 1), ...items.slice(0, index + 1)].find(item => (item.getAttribute('aria-label') || item.textContent || '').trim().toLowerCase().startsWith(search))
    }
    else {
      return
    }
    claimKey(event)
    target?.focus({ preventScroll: true })
  })
  return {
    pointer(event: MouseEvent): boolean {
      if (!active() || !art.constructor.CONTEXTMENU || editable(event.target))
        return false
      capture()
      return true
    },
  }
}
