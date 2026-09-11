import type { ComponentHost, Entry, EntryInput, EntryOption, EventCleanup } from '../component/types'
import validator from 'option-validator'
import { keyboardButton } from '../accessibility/button'
import { renderEntry } from '../component/dom'
import { captureComponentFocus } from '../component/focus'
import { ownEntry, releaseEntry } from '../component/resources'
import { isClosing } from '../lifecycle/instance'
import { ComponentOption } from '../scheme'
import { addClass, hasClass, removeClass } from './dom'
import { errorHandle } from './error'

const removing = new WeakSet<object>()

export default class Component<Host extends ComponentHost = ComponentHost> {
  declare id: number
  declare art: Host
  declare cache: Map<string, Entry<Host>>
  declare name?: string
  declare $parent?: HTMLElement
  selector?(option: EntryOption<Host>, element: HTMLDivElement, events: EventCleanup[]): void

  constructor(art: Host) {
    this.id = 0
    this.art = art
    this.cache = new Map()
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
    this.update = this.update.bind(this)
  }

  get show(): boolean {
    return hasClass(this.art.template.$player, `art-${this.name}-show`)
  }

  set show(value: boolean) {
    const { $player } = this.art.template
    const className = `art-${this.name}-show`
    if (value)
      addClass($player, className)
    else
      removeClass($player, className)
    this.art.emit(this.name!, value)
  }

  toggle(): void {
    this.show = !this.show
  }

  add(getOption: EntryInput<Host>): HTMLDivElement | undefined {
    if (isClosing(this.art))
      return
    const option = typeof getOption === 'function' ? getOption(this.art) : getOption
    if (isClosing(this.art))
      return
    option.html = option.html || ''
    validator(option, ComponentOption)
    if (!this.$parent || !this.name || option.disable)
      return
    const name = option.name || `${this.name}${this.id}`
    const cache = this.cache
    errorHandle(!cache.has(name), `Can't add an existing [${name}] to the [${this.name}]`)
    this.id += 1
    const $ref = document.createElement('div')
    const scope = ownEntry(this.art, $ref)
    const events: EventCleanup[] = []
    const previous = Object.getOwnPropertyDescriptor(this, name)
    let aliased = false
    scope.add(() => {
      for (const event of events)
        this.art.events.remove(event)
    })
    try {
      if (scope.closed)
        return
      renderEntry($ref, this.$parent, this.name, name, this.id, option)
      if (scope.closed)
        return
      if (option.click) {
        const actionable = (this.name === 'control' && !option.selector) || (this.name === 'contextmenu' && !$ref.querySelector('[data-value]'))
        if (actionable && !$ref.querySelector('button,input,select,textarea,a[href],[tabindex],[contenteditable]'))
          keyboardButton(scope, $ref)
        const cleanup = this.art.events.proxy($ref, 'click', (event) => {
          if (scope.closed)
            return
          event.preventDefault()
          option.click!.call(this.art, this, event)
        })
        events.push(cleanup)
      }
      if (option.selector && ['left', 'right'].includes(option.position!))
        this.selector!(option, $ref, events)
      if (scope.closed)
        return
      assignAlias(this, name, $ref)
      aliased = true
      cache.set(name, { $ref, events, option })
      if (option.mounted)
        option.mounted.call(this.art, $ref)
      return $ref
    }
    catch (error) {
      try {
        releaseEntry($ref)
      }
      catch (cleanupError) {
        console.warn('ArtPlayer component cleanup failed:', cleanupError)
      }
      if (cache.get(name)?.$ref === $ref)
        cache.delete(name)
      if (aliased && (this as unknown as Record<string, unknown>)[name] === $ref) {
        if (previous)
          Object.defineProperty(this, name, previous)
        else
          delete (this as unknown as Record<string, unknown>)[name]
      }
      $ref.remove()
      throw error
    }
  }

  remove(name: string): void {
    errorHandle(this.cache.has(name), `Can't find [${name}] from the [${this.name}]`)
    const item = this.cache.get(name)!
    if (removing.has(item))
      return
    const restoreFocus = captureComponentFocus(this, item.$ref)
    removing.add(item)
    try {
      if (item.option.beforeUnmount)
        item.option.beforeUnmount.call(this.art, item.$ref)
      try {
        releaseEntry(item.$ref)
      }
      finally {
        if (this.cache.get(name) === item) {
          this.cache.delete(name)
          delete (this as unknown as Record<string, unknown>)[name]
        }
        item.$ref.remove()
      }
    }
    finally {
      removing.delete(item)
      restoreFocus()
    }
  }

  update(option: EntryOption<Host>): ReturnType<this['add']> {
    const restoreFocus = captureComponentFocus(this, this.cache.get(option.name!)?.$ref, option.name)
    try {
      if (this.cache.has(option.name!)) {
        const item = this.cache.get(option.name!)!
        option = Object.assign(item.option, option)
        this.remove(option.name!)
      }
      // add is polymorphic: Control intentionally returns undefined.
      return this.add(option) as ReturnType<this['add']>
    }
    finally {
      restoreFocus()
    }
  }
}

function assignAlias(owner: object, name: string, value: HTMLElement): void {
  const aliases = owner as Record<string, unknown>
  if (name === '__proto__')
    Object.defineProperty(aliases, name, { value, enumerable: true, configurable: true, writable: true })
  else
    aliases[name] = value
}
