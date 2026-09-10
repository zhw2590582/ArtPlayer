import type { SettingEvents, SettingManager } from './types'
import { getScope, isClosing } from '../lifecycle/instance'
import { includeFromEvent } from '../utils/dom'

export function installSettingEvents(setting: SettingManager): void {
  const { art } = setting
  const scope = getScope(art).child()
  const on = <Name extends keyof SettingEvents>(name: Name, callback: (...args: SettingEvents[Name]) => unknown) => {
    if (scope.closed || isClosing(art))
      return
    const guarded = (...args: SettingEvents[Name]) => {
      if (!scope.closed && !isClosing(art))
        return callback(...args)
    }
    art.on(name, guarded)
    scope.add(() => {
      art.off(name, guarded)
    })
  }
  on('blur', () => {
    if (setting.show) {
      setting.show = false
      setting.render()
    }
  })
  on('focus', (event) => {
    const isControl = includeFromEvent(event, art.controls.setting)
    const isSetting = includeFromEvent(event, setting.$parent)
    if (setting.show && !isControl && !isSetting) {
      setting.show = false
      setting.render()
    }
  })
  on('resize', () => setting.resize())
  const resize = () => {
    if (!scope.closed && !isClosing(art))
      setting.resize()
  }
  const transitioned = art.proxy(setting.$parent, 'transitionend', (event) => {
    if (event.target === setting.$parent && (event as TransitionEvent).propertyName === 'bottom')
      resize()
  })
  scope.add(() => {
    art.events.remove(transitioned)
  })
  const { $player, $controls } = art.template
  if (!scope.closed && typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(resize)
    observer.observe($player)
    observer.observe($controls)
    scope.add(() => {
      observer.disconnect()
    })
  }
  if (!scope.closed && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(resize)
    if (typeof ResizeObserver === 'undefined')
      observer.observe($controls, { childList: true, subtree: true, attributes: true, characterData: true })
    // Controls can publish their measured height after our ResizeObserver callback.
    observer.observe($player, { attributes: true, attributeFilter: ['class', 'style'] })
    scope.add(() => {
      observer.disconnect()
    })
  }
}
