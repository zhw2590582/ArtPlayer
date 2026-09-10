import type { SettingCallback, SettingItem, SettingManager } from './types'
import { isClosing } from '../lifecycle/instance'
import { addClass, inverseClass } from '../utils/dom'
import { settingScopeActive } from './activity'
import { proxySetting, settingScope } from './resources'

export type SettingKind = 'button' | 'selector' | 'switch' | 'range'
const generations = new WeakMap<SettingItem, number>()

export function checkSetting(setting: SettingManager, target?: SettingItem | null): void {
  if (!target?.$parent)
    return
  target.$parent.tooltip = target.html
  setting.traverse((item) => {
    item.default = item === target
    if (item.default && item.$item)
      inverseClass(item.$item, 'art-current')
  }, target.$option)
  setting.render(target.$parents)
}

async function act(setting: SettingManager, item: SettingItem, element: HTMLDivElement, event: Event, callback: SettingCallback, target: SettingItem, property: 'switch' | 'tooltip', before?: () => void): Promise<void> {
  try {
    const scope = settingScope(item)
    const targetScope = settingScope(target)
    const generation = (generations.get(target) || 0) + 1
    generations.set(target, generation)
    const active = () => settingScopeActive(scope) && settingScopeActive(targetScope) && !isClosing(setting.art) && generations.get(target) === generation
    before?.()
    if (!active())
      return
    const value = await callback.call(setting.art, item, element, event)
    if (active())
      Reflect.set(target, property, value)
  }
  catch (error) {
    console.warn('ArtPlayer setting callback failed:', error)
  }
}

export function bindSettingActions(setting: SettingManager, item: SettingItem, element: HTMLDivElement, kind: SettingKind): void {
  const { art } = setting
  const scope = settingScope(item)
  const proxy = (target: EventTarget, name: string, callback: (event: Event) => unknown) => proxySetting(art, item, target, name, callback, scope)
  switch (kind) {
    case 'switch':
      if (item.onSwitch)
        proxy(element, 'click', event => act(setting, item, element, event, item.onSwitch!, item, 'switch'))
      break
    case 'range': {
      const range = item.$range
      if (range) {
        for (const [name, callback] of [['change', 'onRange'], ['input', 'onChange']] as const) {
          if (item[callback]) {
            proxy(range, name, event => act(setting, item, element, event, item[callback]!, item, 'tooltip', () => {
              item.range![0] = range.valueAsNumber
            }))
          }
        }
      }
      break
    }
    case 'selector':
      proxy(element, 'click', (event) => {
        if (item.selector?.length) {
          setting.render(item.selector)
        }
        else if (item.$parent?.onSelect) {
          return act(setting, item, element, event, item.$parent.onSelect, item.$parent, 'tooltip', () => setting.check(item))
        }
        else {
          setting.check(item)
        }
      })
      if (item.default)
        addClass(element, 'art-current')
      break
    case 'button':
      if (item.onClick)
        proxy(element, 'click', event => act(setting, item, element, event, item.onClick!, item, 'tooltip'))
      break
  }
}
