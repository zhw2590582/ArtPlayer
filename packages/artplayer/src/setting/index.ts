import type { SettingHost, SettingItem, SettingManager } from './types'
import { getScope, isClosing } from '../lifecycle/instance'
import { ResourceCleanupError } from '../lifecycle/scope'
import { errorHandle } from '../utils'
import Component from '../utils/component'
import aspectRatio from './aspectRatio'
import { installSettingEvents } from './events'
import flip from './flip'
import { resizeSetting } from './layout'
import { findItem, formatTree, registerTreeOwner, releaseTreeOwner, traverseTree } from './model'
import playbackRate from './playbackRate'
import { beginSettingAdd, cancelSettingAdd } from './registration'
import { createSettingHeader, createSettingItem, renderSetting } from './render'
import { releaseSettingTree } from './resources'
import { checkSetting } from './selection'
import subtitleOffset from './subtitleOffset'
import { cancelSettingUpdate, updateSetting } from './update'

// Keep the exact runtime inheritance; Setting overrides the registry operations and cache.
const SettingBase: new (art: SettingHost) => Pick<Component<SettingHost>, 'id' | 'art' | 'show' | 'toggle'> = Component

export default class Setting extends SettingBase implements SettingManager {
  declare name: string
  declare $parent: HTMLElement
  declare cache: Map<SettingItem[], HTMLDivElement>
  declare active: SettingItem[] | null
  declare option: SettingItem[]

  constructor(art: SettingHost) {
    super(art)

    const {
      option,
      template: { $setting },
    } = art

    this.name = 'setting'
    this.$parent = $setting

    this.id = 0
    this.active = null
    this.cache = new Map()
    this.option = [...this.builtin, ...option.settings]
    const scope = getScope(art)
    registerTreeOwner(this, scope)
    scope.add(() => {
      releaseTreeOwner(this)
    })

    if (option.setting) {
      this.format()
      this.render()

      installSettingEvents(this)
    }
  }

  get builtin(): SettingItem[] {
    const result: SettingItem[] = []
    const { option } = this.art

    if (option.playbackRate) {
      result.push(playbackRate(this.art))
    }

    if (option.aspectRatio) {
      result.push(aspectRatio(this.art))
    }

    if (option.flip) {
      result.push(flip(this.art))
    }

    if (option.subtitleOffset) {
      result.push(subtitleOffset(this.art))
    }

    return result
  }

  traverse(callback: (item: SettingItem) => void, option = this.option): void {
    traverseTree(option, callback)
  }

  check(target?: SettingItem | null): void {
    checkSetting(this, target)
  }

  format(option = this.option, parent?: SettingItem, parents?: SettingItem[], names: string[] = []): void {
    this.option = formatTree(this, option, parent, parents, names)
  }

  find(name = ''): SettingItem | null {
    return findItem(this.option, name)
  }

  resize(): void {
    resizeSetting(this)
  }

  inactivate(item: SettingItem): void {
    releaseSettingTree(this, item)
  }

  remove(name: string): void {
    const item = this.find(name)!
    errorHandle(item, `Can't find [${name}] in the [setting]`)
    this.traverse((item) => {
      cancelSettingAdd(item)
      cancelSettingUpdate(item)
    }, [item])
    const index = item.$option!.indexOf(item)
    item.$option!.splice(index, 1)
    const element = item.$item
    const failures: unknown[] = []
    for (const cleanup of [() => this.inactivate(item), () => element?.remove(), () => this.render()]) {
      try {
        cleanup()
      }
      catch (error) {
        if (error instanceof ResourceCleanupError)
          failures.push(...error.errors)
        else
          failures.push(error)
      }
    }
    if (failures.length)
      throw new ResourceCleanupError(failures)
  }

  update(target: SettingItem): SettingItem {
    return updateSetting(this, target)
  }

  add<Item extends SettingItem>(item: Item, option: SettingItem[] = this.option): Item {
    if (isClosing(this.art))
      return item
    let registered = false
    this.traverse((existing) => {
      registered ||= existing === item
    })
    const index = option.length
    const registration = registered ? undefined : beginSettingAdd(item)
    let formatted = false
    try {
      option.push(item)
      this.format()
      formatted = true
      this.createItem(item)
      this.render()
    }
    catch (error) {
      if (isClosing(this.art) || (registration && !registration.current()))
        throw error
      if (option[index] === item)
        option.splice(index, 1)
      if (!registered && formatted) {
        try {
          this.inactivate(item)
        }
        catch (cleanupError) {
          console.warn('ArtPlayer setting cleanup failed:', cleanupError)
        }
        item.$item?.remove()
      }
      throw error
    }
    finally {
      registration?.finish()
    }
    return item
  }

  createHeader(item: SettingItem): void {
    createSettingHeader(this, item)
  }

  createItem(item: SettingItem, isUpdate = false): void {
    createSettingItem(this, item, isUpdate)
  }

  render(option = this.option): void {
    renderSetting(this, option)
  }
}
