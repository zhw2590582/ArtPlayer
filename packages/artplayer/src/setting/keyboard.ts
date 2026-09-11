import type { SettingManager } from './types'
import { claimKey, plainKey } from '../accessibility/keyboard'
import { getScope, isClosing } from '../lifecycle/instance'
import { listen, timeout } from '../lifecycle/resources'
import { settingScopeActive } from './activity'
import { focusSettingPanel, returnSettingFocus, settingFocusTargets } from './keyboard-focus'
import { settingPanelScope } from './panels'
import { settingScope } from './resources'

export function installSettingKeyboard(setting: SettingManager): void {
  const { art } = setting
  const scope = getScope(art).child()
  if (scope.closed)
    return
  const doc = () => setting.$parent.ownerDocument
  let enterLast = false
  const close = () => {
    setting.show = false
    if (!scope.closed && !isClosing(art))
      setting.render()
  }
  const changed = (show: boolean) => {
    if (scope.closed || isClosing(art))
      return
    if (show) {
      if (doc().activeElement === art.controls.setting && art.template.$player.classList.contains('art-keyboard-focus'))
        focusSettingPanel(setting, undefined, enterLast)
    }
    else if (setting.$parent.contains(doc().activeElement)) {
      returnSettingFocus(setting)
    }
  }
  art.on('setting', changed)
  scope.add(() => {
    art.off('setting', changed)
  })
  listen(scope, art.template.$player, 'keydown', (input) => {
    const event = input as KeyboardEvent
    if (!plainKey(event) || event.defaultPrevented || isClosing(art))
      return
    const target = event.target as HTMLElement
    if (target === art.controls.setting) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        claimKey(event)
        if (!setting.show) {
          enterLast = event.key === 'ArrowUp'
          try {
            setting.show = true
          }
          finally {
            enterLast = false
          }
        }
        else {
          focusSettingPanel(setting, undefined, event.key === 'ArrowUp')
        }
      }
      else if (event.key === 'Escape' && setting.show) {
        claimKey(event)
        close()
      }
      return
    }
    if (!setting.show || !setting.$parent.contains(target))
      return
    if (event.key === 'Escape') {
      claimKey(event)
      close()
      return
    }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key))
      return
    const row = target.closest<HTMLElement>('.art-setting-item')
    if (!row || (target !== row && !target.matches('button,a[href],[role="button"]')))
      return
    const panel = setting.active && setting.cache.get(setting.active)
    if (!panel)
      return
    const currentItem = setting.active?.find(item => item.$item === row)
    if (!settingScopeActive(settingPanelScope(panel)) || (currentItem && !settingScopeActive(settingScope(currentItem)))) {
      claimKey(event)
      return
    }
    const targets = settingFocusTargets(panel)
    const index = targets.indexOf(target)
    if (index < 0)
      return
    let next: number | undefined
    switch (event.key) {
      case 'ArrowDown':
        next = Math.min(index + 1, targets.length - 1)
        break
      case 'ArrowUp':
        next = Math.max(index - 1, 0)
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = targets.length - 1
        break
      case 'ArrowLeft': {
        const back = panel.querySelector<HTMLElement>('.art-setting-item-back')
        claimKey(event)
        back?.click()
        return
      }
      case 'ArrowRight': {
        claimKey(event)
        if (currentItem?.selector?.length)
          target.click()
        return
      }
      default:
        return
    }
    claimKey(event)
    if (next !== undefined)
      focusSettingPanel(setting, targets[next])
  })
  let pending = false
  listen(scope, setting.$parent, 'focusout', (event) => {
    const next = (event as FocusEvent).relatedTarget as Node | null
    if (next && (setting.$parent.contains(next) || next === art.controls.setting))
      return
    if (pending)
      return
    pending = true
    timeout(scope, () => {
      pending = false
      if (!scope.closed && !isClosing(art) && setting.show && !setting.$parent.contains(doc().activeElement) && doc().activeElement !== art.controls.setting)
        close()
    }, 0)
  })
}
