import type ResourceScope from '../lifecycle/scope'
import type { SettingKind } from './selection'
import type { SettingItem, SettingManager } from './types'
import { keyboardButton } from '../accessibility/button'
import { isClosing } from '../lifecycle/instance'
import { settingScopeActive } from './activity'

export function nameSettingRange(item: SettingItem): void {
  const input = item.$item?.querySelector<HTMLInputElement>('.art-setting-range')
  if (input)
    input.setAttribute('aria-label', item.$html?.textContent || '')
}

export function settingItemKeyboard(setting: SettingManager, item: SettingItem, element: HTMLDivElement, kind: SettingKind, scope: ResourceScope): void {
  if (kind === 'range') {
    nameSettingRange(item)
    return
  }
  if (element.querySelector('button,input,select,textarea,a[href],[tabindex],[contenteditable]'))
    return
  if (kind === 'switch') {
    element.setAttribute('role', 'switch')
    element.setAttribute('aria-checked', String(Boolean(item.switch)))
    element.setAttribute('aria-disabled', String(!item.onSwitch))
  }
  else if (kind === 'selector' && !item.selector?.length) {
    element.setAttribute('aria-current', String(Boolean(item.default)))
  }
  keyboardButton(scope, element, () => element.click(), () => settingScopeActive(scope) && !isClosing(setting.art))
}
