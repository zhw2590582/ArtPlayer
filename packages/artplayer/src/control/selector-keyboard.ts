import type ResourceScope from '../lifecycle/scope'
import { keyboardButton } from '../accessibility/button'
import { claimKey, plainKey } from '../accessibility/keyboard'
import { listen } from '../lifecycle/resources'

const interactive = 'button,input,select,textarea,a[href],[tabindex],[contenteditable]'

export function selectorKeyboard(scope: ResourceScope, owner: HTMLElement, value: HTMLElement, list: HTMLElement, label: string): (restore?: boolean) => void {
  if (scope.closed)
    return () => {}
  const items = Array.from(list.children) as HTMLElement[]
  const complex = items.some(item => item.querySelector(interactive))
  list.setAttribute('role', complex ? 'group' : 'listbox')
  list.setAttribute('aria-label', label)
  let hovered = false
  let opened = false
  let dismissed = false
  let prefix = ''
  let typedAt = 0
  const expanded = () => items.length > 0 && (opened || (hovered && !dismissed))
  const trigger = () => value.querySelector<HTMLElement>('button,a[href],[role="button"]') || value
  const refresh = (restore = false) => {
    if (scope.closed)
      return
    const target = trigger()
    if (value.querySelector(interactive)) {
      value.removeAttribute('role')
      value.removeAttribute('tabindex')
    }
    else {
      value.setAttribute('role', 'button')
      value.tabIndex = 0
    }
    if (target !== value) {
      value.removeAttribute('aria-haspopup')
      value.removeAttribute('aria-expanded')
      value.removeAttribute('aria-disabled')
    }
    if (complex)
      target.removeAttribute('aria-haspopup')
    else
      target.setAttribute('aria-haspopup', 'listbox')
    target.setAttribute('aria-expanded', String(expanded()))
    target.setAttribute('aria-disabled', String(items.length === 0))
    if (restore && value.isConnected && value.ownerDocument.activeElement === value.ownerDocument.body)
      target.focus({ preventScroll: true })
  }
  const visibility = (state: boolean, hide = false) => {
    opened = state
    dismissed = hide
    owner.classList.toggle('art-selector-open', state)
    owner.classList.toggle('art-selector-dismissed', hide)
    refresh()
  }
  const focus = (item?: HTMLElement) => {
    if (!item || scope.closed)
      return
    const target = item.querySelector<HTMLElement>(interactive) || item
    target.focus({ preventScroll: true })
    if (!scope.closed)
      item.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }
  const open = (last = false) => {
    if (scope.closed || !items.length)
      return
    visibility(true)
    prefix = ''
    focus(items.find(item => item.classList.contains('art-current')) || items[last ? items.length - 1 : 0])
  }
  const close = () => {
    if (scope.closed)
      return
    const restore = list.contains(owner.ownerDocument.activeElement)
    visibility(false, true)
    prefix = ''
    if (restore && value.isConnected)
      trigger().focus({ preventScroll: true })
  }
  keyboardButton(scope, value, () => {
    value.click()
    if (owner.ownerDocument.activeElement === value)
      open()
  })
  refresh()
  for (const item of items) {
    const selected = item.classList.contains('art-current')
    if (!complex) {
      item.setAttribute('role', 'option')
      item.setAttribute('aria-selected', String(selected))
    }
    else {
      item.setAttribute('aria-current', String(selected))
    }
    if (!item.querySelector(interactive)) {
      item.tabIndex = -1
      keyboardButton(scope, item, () => {
        item.click()
        close()
      })
    }
  }
  listen(scope, value, 'keydown', (input) => {
    const event = input as KeyboardEvent
    if (!plainKey(event) || event.defaultPrevented || (event.target !== value && event.target !== trigger()))
      return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      claimKey(event)
      open(event.key === 'ArrowUp')
    }
    else if (event.key === 'Escape' && expanded()) {
      claimKey(event)
      close()
    }
  })
  listen(scope, value, 'click', (event) => {
    if (event.isTrusted && (event as MouseEvent).detail === 0 && trigger() !== value)
      open()
  })
  listen(scope, list, 'keydown', (input) => {
    const event = input as KeyboardEvent
    if (!plainKey(event) || event.defaultPrevented)
      return
    if (event.key === 'Escape') {
      claimKey(event)
      close()
      return
    }
    const index = items.indexOf(event.target as HTMLElement)
    if (index < 0)
      return
    if (event.key.length !== 1)
      prefix = ''
    let next: number | undefined
    switch (event.key) {
      case 'ArrowDown':
        next = Math.min(index + 1, items.length - 1)
        break
      case 'ArrowUp':
        next = Math.max(index - 1, 0)
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = items.length - 1
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        claimKey(event)
        return
      default: {
        if (event.key.length !== 1 || event.key === ' ')
          return
        const now = Date.now()
        prefix = now - typedAt < 500 ? prefix + event.key.toLocaleLowerCase() : event.key.toLocaleLowerCase()
        typedAt = now
        const query = [...prefix].every(char => char === prefix[0]) ? prefix[0]! : prefix
        for (let offset = 1; offset <= items.length; offset++) {
          const candidate = (index + offset) % items.length
          if (items[candidate]!.textContent?.trim().toLocaleLowerCase().startsWith(query)) {
            next = candidate
            break
          }
        }
      }
    }
    claimKey(event)
    if (next !== undefined)
      focus(items[next])
  })
  listen(scope, list, 'click', (event) => {
    if (event.isTrusted && (event as MouseEvent).detail === 0)
      close()
  })
  listen(scope, owner, 'mouseenter', () => {
    hovered = true
    visibility(opened)
  })
  listen(scope, owner, 'mouseleave', () => {
    hovered = false
    visibility(list.contains(owner.ownerDocument.activeElement))
  })
  listen(scope, owner, 'focusout', (event) => {
    if (!owner.contains((event as FocusEvent).relatedTarget as Node | null))
      visibility(false, true)
  })
  scope.add(() => {
    owner.classList.remove('art-selector-open', 'art-selector-dismissed')
  })
  return refresh
}
