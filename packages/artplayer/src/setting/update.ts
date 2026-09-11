import type { SettingItem, SettingManager } from './types'
import { getScope, isClosing } from '../lifecycle/instance'
import { ResourceCleanupError } from '../lifecycle/scope'
import captureTemplate from '../lifecycle/template-rollback'
import { inverseClass } from '../utils/dom'
import { pauseSettingScope } from './activity'
import { captureSettingItem } from './checkpoint'
import { captureSettingFocus } from './keyboard-focus'
import { releaseSettingPanel, settingPanelScope } from './panels'
import { cancelSettingAdd } from './registration'
import { suspendSettingItem } from './resources'

const pending = new WeakMap<SettingItem, () => void>()

function finish(cleanups: (() => void)[]): void {
  const errors: unknown[] = []
  for (const cleanup of cleanups) {
    try {
      cleanup()
    }
    catch (error) {
      if (error instanceof ResourceCleanupError)
        errors.push(...error.errors)
      else
        errors.push(error)
    }
  }
  if (errors.length)
    throw new ResourceCleanupError(errors)
}

function suspendTree(setting: SettingManager, root: SettingItem): { items: Set<SettingItem>, resume: () => void, dispose: () => void } {
  const items = new Set<SettingItem>()
  const panels = new Set<HTMLDivElement>()
  const collect = (item: SettingItem) => {
    if (items.has(item))
      return
    items.add(item)
    if (item.selector) {
      const panel = setting.cache.get(item.selector)
      if (panel)
        panels.add(panel)
      item.selector.forEach(collect)
    }
  }
  collect(root)
  const suspended: NonNullable<ReturnType<typeof suspendSettingItem>>[] = []
  const unpause: (() => void)[] = []
  try {
    for (const item of items) {
      const suspension = suspendSettingItem(setting.art, item)
      if (suspension)
        suspended.push(suspension)
    }
    for (const panel of panels)
      unpause.push(pauseSettingScope(settingPanelScope(panel)))
  }
  catch (error) {
    try {
      finish([...suspended.reverse().map(item => item.resume), ...unpause])
    }
    catch (cleanupError) {
      console.warn('ArtPlayer setting restore failed:', cleanupError)
    }
    throw error
  }
  let active = true
  return {
    items,
    resume() {
      if (!active)
        return
      active = false
      finish([...suspended.reverse().map(item => item.resume), ...unpause])
    },
    dispose() {
      if (!active)
        return
      active = false
      finish([...suspended.reverse().map(item => item.dispose), ...Array.from(panels).reverse().map(panel => () => releaseSettingPanel(panel)), ...unpause])
    },
  }
}

// A newer operation restores the pending one before applying its own changes.
export function cancelSettingUpdate(item: SettingItem): void {
  pending.get(item)?.()
}

export function captureSettingUpdate(item: SettingItem): () => boolean {
  const operation = pending.get(item)
  return () => !operation || pending.get(item) === operation
}

function assignSetting(item: SettingItem, target: SettingItem, current: () => boolean): void {
  for (const key of Reflect.ownKeys(target)) {
    if (!current())
      return
    const descriptor = Object.getOwnPropertyDescriptor(target, key)
    if (!descriptor?.enumerable || !current())
      continue
    const value: unknown = Reflect.get(target, key)
    if (!current())
      return
    if (!Reflect.set(item, key, value))
      throw new TypeError(`Cannot assign setting item property [${String(key)}]`)
  }
}

export function updateSetting(setting: SettingManager, target: SettingItem): SettingItem {
  const item = setting.find(target.name)
  if (isClosing(setting.art))
    return item || target
  if (!item)
    return setting.add(target)
  const restoreFocus = captureSettingFocus(setting)
  cancelSettingAdd(item)
  cancelSettingUpdate(item)
  const restoreItem = captureSettingItem(item)
  const element = item.$item
  const parent = element?.parentNode
  const next = element?.nextSibling
  const restoreTemplate = element ? captureTemplate(element) : undefined
  const previous = setting.active
  const layout = ['height', 'width', 'left', 'right'].map(key => [key, setting.$parent.style.getPropertyValue(key), setting.$parent.style.getPropertyPriority(key)] as const)
  const tree = suspendTree(setting, item)
  let active = true
  let rendered = false
  const cancel = () => {
    if (!active)
      return
    active = false
    for (const affected of tree.items) {
      if (pending.get(affected) === cancel)
        pending.delete(affected)
    }
    if (isClosing(setting.art)) {
      tree.dispose()
      return
    }
    const replacement = item.$item
    try {
      finish([
        tree.resume,
        () => {
          if (replacement && replacement !== element)
            replacement.remove()
        },
        restoreItem,
        () => restoreTemplate?.(),
        () => {
          if (parent && element)
            parent.insertBefore(element, next?.parentNode === parent ? next : null)
        },
        () => setting.format(),
        () => {
          if (rendered) {
            setting.active = previous
            if (previous && setting.cache.has(previous))
              inverseClass(setting.cache.get(previous)!, 'art-current')
            for (const [key, value, priority] of layout)
              setting.$parent.style.setProperty(key, value, priority)
          }
        },
      ])
      restoreFocus(element)
    }
    catch (error) {
      console.warn('ArtPlayer setting restore failed:', error)
    }
  }
  const current = () => active && !isClosing(setting.art) && pending.get(item) === cancel
  for (const affected of tree.items)
    pending.set(affected, cancel)
  const release = getScope(setting.art).add(() => {
    active = false
    for (const affected of tree.items) {
      if (pending.get(affected) === cancel)
        pending.delete(affected)
    }
    tree.dispose()
  })
  try {
    assignSetting(item, target, current)
    if (!current())
      return item
    setting.format()
    if (!current())
      return item
    setting.createItem(item, true)
    if (!current())
      return item
    rendered = true
    setting.render()
    if (!current())
      return item
    active = false
    for (const affected of tree.items) {
      if (pending.get(affected) === cancel)
        pending.delete(affected)
    }
    tree.dispose()
    restoreFocus(item.$item)
    return item
  }
  catch (error) {
    if (current())
      cancel()
    throw error
  }
  finally {
    release()
  }
}
