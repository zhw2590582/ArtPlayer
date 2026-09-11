import type { SettingManager } from './types'
import { focusPlayer } from '../accessibility/player-focus'
import { isClosing } from '../lifecycle/instance'
import { settingScopeActive } from './activity'
import { settingPanelScope } from './panels'

const focusSelector = '[tabindex="0"],button,input,select,textarea,a[href],[contenteditable]'

function available(element: HTMLElement): boolean {
  if (!element.isConnected || element.matches(':disabled') || element.closest('[inert]') || element.getAttribute('aria-disabled') === 'true' || !element.getClientRects().length)
    return false
  const visibility = element.ownerDocument.defaultView?.getComputedStyle(element).visibility
  return visibility !== 'hidden' && visibility !== 'collapse'
}

export function settingFocusTargets(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(focusSelector))
    .filter(element => element.getAttribute('tabindex') !== '-1' && available(element))
}

function selectSettingTarget(panel: HTMLElement, preferred?: HTMLElement, last = false): HTMLElement | undefined {
  if (preferred && preferred !== panel && panel.contains(preferred) && preferred.matches(focusSelector) && preferred.getAttribute('tabindex') !== '-1' && available(preferred))
    return preferred
  const targets = settingFocusTargets(panel)
  const selected = panel.querySelector('.art-setting-item.art-current')
  return targets.find(element => preferred?.contains(element))
    || (last ? targets[targets.length - 1] : targets.find(element => selected?.contains(element)) || targets.find(element => !element.classList.contains('art-setting-item-back')) || targets[0])
}

export function returnSettingFocus(setting: SettingManager): void {
  const { art, $parent } = setting
  const player = art.template.$player
  const doc = $parent.ownerDocument
  const button = art.controls.setting
  if (isClosing(art) || !$parent.contains(doc.activeElement))
    return
  if (button && player.contains(button) && available(button))
    button.focus({ preventScroll: true })
  if (doc.activeElement === doc.body || $parent.contains(doc.activeElement))
    focusPlayer(art)
}

export function focusSettingPanel(setting: SettingManager, preferred?: HTMLElement, last = false): void {
  if (!setting.show || isClosing(setting.art) || !setting.active)
    return
  const panel = setting.cache.get(setting.active)
  if (!panel || !settingScopeActive(settingPanelScope(panel)))
    return
  const target = selectSettingTarget(panel, preferred, last)
  target?.focus({ preventScroll: true })
  if (!isClosing(setting.art))
    target?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

export function captureSettingFocus(setting: SettingManager): (preferred?: HTMLElement) => void {
  const doc = setting.$parent.ownerDocument
  const focused = doc.activeElement as HTMLElement | null
  const inside = setting.$parent.contains(focused)
  return (preferred) => {
    if (!inside || isClosing(setting.art))
      return
    if (doc.activeElement === doc.body || (doc.activeElement === focused && !focused?.getClientRects().length))
      focusSettingPanel(setting, preferred)
  }
}
