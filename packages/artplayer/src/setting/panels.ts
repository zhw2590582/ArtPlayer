import type ResourceScope from '../lifecycle/scope'
import type { SettingItem, SettingManager } from './types'
import { getScope } from '../lifecycle/instance'

const scopes = new WeakMap<HTMLDivElement, ResourceScope>()

export function ownSettingPanel(setting: SettingManager, option: SettingItem[], panel: HTMLDivElement): ResourceScope {
  const scope = getScope(setting.art).child()
  scopes.set(panel, scope)
  scope.add(() => {
    if (setting.cache.get(option) === panel)
      setting.cache.delete(option)
    panel.remove()
  })
  return scope
}

export function settingPanelScope(panel: HTMLDivElement): ResourceScope {
  const scope = scopes.get(panel)
  if (!scope)
    throw new Error('Setting panel has not been registered')
  return scope
}

export function releaseSettingPanel(panel: HTMLDivElement): void {
  const scope = scopes.get(panel)
  if (scope)
    scope.dispose()
  else
    panel.remove()
}
