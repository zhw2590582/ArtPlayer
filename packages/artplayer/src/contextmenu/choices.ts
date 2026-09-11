import { keyboardButton } from '../accessibility/button'
import { entryScope } from '../component/resources'

export function updateChoices(panel: HTMLElement): void {
  for (const item of panel.querySelectorAll<HTMLElement>('[data-value]'))
    item.setAttribute('aria-pressed', String(item.classList.contains('art-current')))
}

export function keyboardChoices(panel: HTMLElement, label: string): void {
  const scope = entryScope(panel)
  if (scope.closed)
    return
  panel.setAttribute('role', 'group')
  panel.setAttribute('aria-label', label)
  for (const item of panel.querySelectorAll<HTMLElement>('[data-value]')) {
    keyboardButton(scope, item)
    item.setAttribute('aria-label', `${label}: ${item.textContent?.trim() ?? ''}`)
  }
  updateChoices(panel)
}
