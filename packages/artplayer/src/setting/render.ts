import type { SettingKind } from './selection'
import type { SettingItem, SettingManager, SettingRange } from './types'
import { keyboardButton } from '../accessibility/button'
import { appendElement } from '../component/dom'
import { isClosing } from '../lifecycle/instance'
import { timeout } from '../lifecycle/resources'
import { addClass, append, def, has, inverseClass, setStyle } from '../utils'
import { settingScopeActive } from './activity'
import { captureSettingItem, rememberSettingState } from './checkpoint'
import { captureSettingFocus } from './keyboard-focus'
import { nameSettingRange, settingItemKeyboard } from './keyboard-item'
import { ownSettingPanel, releaseSettingPanel, settingPanelScope } from './panels'
import { ownSettingItem, proxySetting, settingItemOwner } from './resources'
import { bindSettingActions } from './selection'
import { captureSettingUpdate } from './update'

const navigations = new WeakMap<SettingManager, number>()

function bindContent(item: SettingItem, key: 'icon' | 'html' | 'tooltip', element: HTMLDivElement): void {
  def(item, `$${key}`, { configurable: true, get: () => element })
  def(item, key, {
    configurable: true,
    get: () => element.innerHTML,
    set(value: unknown) {
      element.innerHTML = ''
      append(element, value)
      if (key === 'html')
        nameSettingRange(item)
    },
  })
}

export function createSettingHeader(setting: SettingManager, item: SettingItem): void {
  if (!setting.cache.has(item.$option!))
    return
  const $panel = setting.cache.get(item.$option!)!

  const {
    icons: { arrowLeft },
    constructor: { SETTING_ITEM_HEIGHT },
  } = setting.art

  const $item = document.createElement('div')
  setStyle($item, 'height', `${SETTING_ITEM_HEIGHT}px`)
  addClass($item, 'art-setting-item')
  addClass($item, 'art-setting-item-back')
  const $left = appendElement($item, '<div class="art-setting-item-left"></div>')
  const $icon = document.createElement('div')
  addClass($icon, 'art-setting-item-left-icon')
  append($icon, arrowLeft)
  append($left, $icon)
  append($left, item.$parent!.html)
  proxySetting(setting.art, item.$parent!, $item, 'click', () => setting.render(item.$parents), settingPanelScope($panel))
  const scope = settingPanelScope($panel)
  if (!$item.querySelector('button,input,select,textarea,a[href],[tabindex],[contenteditable]'))
    keyboardButton(scope, $item, () => $item.click(), () => settingScopeActive(scope) && !isClosing(setting.art))
  $item.setAttribute('aria-label', `${setting.art.i18n.get('Back')}: ${$item.textContent?.trim() || ''}`)
  append($panel, $item)
}

export function createSettingItem(setting: SettingManager, item: SettingItem, isUpdate = false): void {
  const currentUpdate = captureSettingUpdate(item)
  if (!setting.cache.has(item.$option!))
    return
  const $panel = setting.cache.get(item.$option!)!
  const oldItem = item.$item

  let type: SettingKind = 'selector'

  if (has(item, 'switch')) {
    type = 'switch'
  }

  if (has(item, 'range')) {
    type = 'range'
  }

  if (has(item, 'onClick')) {
    type = 'button'
  }

  const { icons, constructor } = setting.art

  if (!currentUpdate())
    return
  const scope = ownSettingItem(setting.art, item, settingPanelScope($panel))
  const current = () => settingScopeActive(scope) && !isClosing(setting.art) && currentUpdate()
  if (!current())
    return
  const $item = document.createElement('div')
  try {
    rememberSettingState(item)
    addClass($item, 'art-setting-item')
    setStyle($item, 'height', `${constructor.SETTING_ITEM_HEIGHT}px`)

    $item.dataset.name = item.name || ''
    $item.dataset.value = String(item.value || '')
    if (!current())
      return

    const $left = appendElement($item, '<div class="art-setting-item-left"></div>')
    const $right = appendElement($item, '<div class="art-setting-item-right"></div>')

    const $icon = document.createElement('div')
    addClass($icon, 'art-setting-item-left-icon')

    switch (type) {
      case 'button':
      case 'switch':
      case 'range': {
        const icon = item.icon || icons.config
        if (!current())
          return
        append($icon, icon)
        break
      }
      case 'selector':
        if (item.selector?.length) {
          const icon = item.icon || icons.config
          if (!current())
            return
          append($icon, icon)
        }
        else {
          append($icon, icons.check)
        }
        break
      default:
        break
    }

    append($left, $icon)

    if (!current())
      return
    bindContent(item, 'icon', $icon)

    const $html = document.createElement('div')
    addClass($html, 'art-setting-item-left-text')
    const html = item.html || ''
    if (!current())
      return
    append($html, html)
    append($left, $html)

    bindContent(item, 'html', $html)

    const $tooltip = document.createElement('div')
    addClass($tooltip, 'art-setting-item-right-tooltip')
    const tooltip = item.tooltip || ''
    if (!current())
      return
    append($tooltip, tooltip)
    append($right, $tooltip)

    bindContent(item, 'tooltip', $tooltip)

    switch (type) {
      case 'switch': {
        const $switch = document.createElement('div')
        addClass($switch, 'art-setting-item-right-icon')
        const $switchOn = appendElement($switch, icons.switchOn)
        const $switchOff = appendElement($switch, icons.switchOff)
        const initialSwitch = item.switch
        if (!current())
          return
        setStyle(initialSwitch ? $switchOff : $switchOn, 'display', 'none')
        append($right, $switch)

        def(item, '$switch', {
          configurable: true,
          get: () => $switch,
        })

        let $switchValue = item.switch
        if (!current())
          return
        rememberSettingState(item, () => {
          const value = $switchValue
          return () => {
            $switchValue = value
          }
        })
        def(item, 'switch', {
          configurable: true,
          get: () => $switchValue,
          set(value) {
            $switchValue = value
            $item.setAttribute('aria-checked', String(Boolean(value)))
            if (value) {
              setStyle($switchOff, 'display', 'none')
              setStyle($switchOn, 'display', null)
            }
            else {
              setStyle($switchOff, 'display', null)
              setStyle($switchOn, 'display', 'none')
            }
          },
        })
        break
      }
      case 'range':
        {
          const $state = document.createElement('div')
          addClass($state, 'art-setting-item-right-icon')
          const $range = document.createElement('input')
          $range.type = 'range'
          append($state, $range)
          for (const [index, key] of ['value', 'min', 'max', 'step'].entries()) {
            const value = item.range![index]
            if (!current())
              return
            Reflect.set($range, key, String(value))
          }
          addClass($range, 'art-setting-range')
          append($right, $state)

          def(item, '$range', {
            configurable: true,
            get: () => $range,
          })

          let $rangeValue = [...item.range!]
          if (!current())
            return
          rememberSettingState(item, () => {
            const value = $rangeValue
            const values = [...value]
            const input = { min: $range.min, max: $range.max, step: $range.step, value: $range.value }
            return () => {
              value.splice(0, value.length, ...values)
              $rangeValue = value
              Object.assign($range, input)
            }
          })
          def(item, 'range', {
            configurable: true,
            get: () => $rangeValue,
            set(value: SettingRange) {
              $rangeValue = [...value]
              $range.value = String(value[0])
              $range.min = String(value[1])
              $range.max = String(value[2])
              $range.step = String(value[3])
            },
          })
        }
        break
      case 'selector':
        if (item.selector?.length) {
          const $state = document.createElement('div')
          addClass($state, 'art-setting-item-right-icon')
          append($state, icons.arrowRight)
          append($right, $state)
        }
        break
      default:
        break
    }

    if (!current())
      return
    bindSettingActions(setting, item, $item, type)
    if (!current())
      return

    def(item, '$item', {
      configurable: true,
      get: () => $item,
    })
    settingItemKeyboard(setting, item, $item, type, scope)

    if (isUpdate) {
      if (oldItem?.parentNode)
        oldItem.replaceWith($item)
      else
        append($panel, $item)
    }
    else {
      append($panel, $item)
    }

    if (item.mounted && current()) {
      timeout(scope, () => {
        if (isClosing(setting.art))
          return
        try {
          const result = item.mounted?.call(setting.art, $item, item)
          void Promise.resolve(result).catch(error => console.warn('ArtPlayer setting mounted failed:', error))
        }
        catch (error) {
          console.warn('ArtPlayer setting mounted failed:', error)
        }
      }, 0)
    }
  }
  catch (error) {
    try {
      scope.dispose()
    }
    catch (cleanupError) {
      console.warn('ArtPlayer setting cleanup failed:', cleanupError)
    }
    $item.remove()
    throw error
  }
}

export function renderSetting(setting: SettingManager, option = setting.option): void {
  if (isClosing(setting.art))
    return
  const restoreFocus = captureSettingFocus(setting)
  const cached = setting.cache.get(option)
  if (cached && !settingScopeActive(settingPanelScope(cached)))
    return
  const navigation = (navigations.get(setting) || 0) + 1
  navigations.set(setting, navigation)
  const currentNavigation = () => navigations.get(setting) === navigation && !isClosing(setting.art)
  const previous = setting.active
  const previousLayout = ['height', 'width', 'left', 'right'].map(key => [key, setting.$parent.style.getPropertyValue(key), setting.$parent.style.getPropertyPriority(key)] as const)
  const restoreNavigation = () => {
    setting.active = previous
    if (previous && setting.cache.has(previous))
      inverseClass(setting.cache.get(previous)!, 'art-current')
    for (const [key, value, priority] of previousLayout)
      setting.$parent.style.setProperty(key, value, priority)
  }
  setting.active = option
  if (cached) {
    try {
      inverseClass(cached, 'art-current')
      setting.resize()
    }
    catch (error) {
      if (currentNavigation() && setting.cache.get(option) === cached && !settingPanelScope(cached).closed)
        restoreNavigation()
      throw error
    }
  }
  else {
    const $panel = document.createElement('div')
    setting.cache.set(option, $panel)
    const scope = ownSettingPanel(setting, option, $panel)
    const current = () => !scope.closed && !isClosing(setting.art) && setting.cache.get(option) === $panel
    const checkpoints: { item: SettingItem, restore: () => void }[] = []
    try {
      if (!current())
        return
      addClass($panel, 'art-setting-panel')
      $panel.setAttribute('role', 'group')
      $panel.setAttribute('aria-label', option[0]?.$parent?.$html?.textContent || setting.art.i18n.get('Settings'))
      append(setting.$parent, $panel)
      inverseClass($panel, 'art-current')

      if (option[0]?.$parent)
        setting.createHeader(option[0])

      for (let index = 0; index < option.length && current(); index++) {
        const item = option[index]!
        checkpoints.push({ item, restore: captureSettingItem(item) })
        setting.createItem(item)
      }
      if (!current())
        return
      setting.resize()
    }
    catch (error) {
      const restore = current()
      const restoreActive = setting.active === option && currentNavigation()
      try {
        releaseSettingPanel($panel)
      }
      catch (cleanupError) {
        console.warn('ArtPlayer setting cleanup failed:', cleanupError)
      }
      if (restore && !isClosing(setting.art)) {
        for (const checkpoint of checkpoints.reverse()) {
          if (settingItemOwner(checkpoint.item) === scope) {
            try {
              checkpoint.restore()
            }
            catch (restoreError) {
              console.warn('ArtPlayer setting restore failed:', restoreError)
            }
          }
        }
        if (restoreActive)
          restoreNavigation()
      }
      throw error
    }
  }
  if (currentNavigation())
    restoreFocus(previous?.[0]?.$parent?.$item)
}
