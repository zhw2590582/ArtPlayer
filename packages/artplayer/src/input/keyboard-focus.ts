import { isClaimedKey } from '../accessibility/keyboard'

function asElement(target: EventTarget | null | undefined): HTMLElement | undefined {
  if (target && (target as Node).nodeType === 1)
    return target as HTMLElement
}

function eventDocument(event: KeyboardEvent, fallback: Document): Document {
  const target = event.target as Node | null
  return target?.nodeType === 9 ? target as Document : target?.ownerDocument || event.view?.document || fallback
}

function editable(target: HTMLElement): boolean {
  const tag = target.tagName.toUpperCase()
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')
    return true
  return target.isContentEditable
}

export function acceptsHotkey(event: KeyboardEvent, fallback: Document): boolean {
  if (isClaimedKey(event) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing || event.keyCode === 229)
    return false
  const doc = eventDocument(event, fallback)
  let active = asElement(doc.activeElement)
  while (active?.shadowRoot?.activeElement)
    active = asElement(active.shadowRoot.activeElement)
  if (active && editable(active))
    return false
  // The composed path exposes an editable descendant behind a retargeted shadow host.
  const first = asElement(event.composedPath?.()[0]) || asElement(event.target)
  const enter = event.key === 'Enter' || event.code === 'Enter' || event.code === 'NumpadEnter'
  const activation = enter || event.key === ' ' || event.code === 'Space'
  if (activation) {
    const selector = `button,summary,[role="button"],[role="switch"]${enter ? ',a[href]' : ''}`
    if (first?.closest?.(selector) || active?.closest?.(selector))
      return false
  }
  return !first || !editable(first)
}
