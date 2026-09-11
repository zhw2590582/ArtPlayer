import type { EntryOption, EventCleanup, SelectorItem } from '../component/types'
import type { ControlHost } from './types'
import { appendElement } from '../component/dom'
import { entryScope } from '../component/resources'
import { trackSelection } from '../component/selection'
import { addClass, append, def, errorHandle, getComposedPath, inverseClass } from '../utils'
import { selectorKeyboard } from './selector-keyboard'

interface Binding {
  option: EntryOption<ControlHost>
  item: HTMLDivElement
  value: HTMLDivElement
  owner: HTMLDivElement
  refresh?: (restore?: boolean) => void
}
const bindings = new WeakMap<SelectorItem, Binding>()

function bind(item: SelectorItem, binding: Binding): void {
  const previous = bindings.get(item)
  errorHandle(!previous || entryScope(previous.owner).closed, 'Cannot share selector items between active controls')
  if (!previous) {
    def(item, '$control_option', { get: () => bindings.get(item)!.option.selector })
    def(item, '$control_item', { get: () => bindings.get(item)!.item })
    def(item, '$control_value', { get: () => bindings.get(item)!.value })
  }
  bindings.set(item, binding)
}

// WebIDL keeps legacy numeric/Element coercion and null-to-empty innerHTML behavior.
function setHTML(element: HTMLElement, value: unknown): void {
  element.innerHTML = value as string
}

export function checkSelector(target?: SelectorItem): void {
  if (!target)
    return
  const restore = target.$control_value!.contains(target.$control_value!.ownerDocument.activeElement)
  setHTML(target.$control_value!, target.html)
  for (let index = 0; index < target.$control_option!.length; index++) {
    const item = target.$control_option![index]!
    item.default = item === target
    const element = item.$control_item!
    element.setAttribute(element.getAttribute('role') === 'option' ? 'aria-selected' : 'aria-current', String(item.default))
    if (item.default)
      inverseClass(item.$control_item!, 'art-current')
  }
  bindings.get(target)?.refresh?.(restore)
}

export function renderSelector(art: ControlHost, check: (target?: SelectorItem) => void, option: EntryOption<ControlHost>, $ref: HTMLDivElement, events: EventCleanup[]): void {
  const { proxy } = art.events
  const scope = entryScope($ref)
  const selector = option.selector!
  addClass($ref, 'art-control-selector')
  const $value = document.createElement('div')
  addClass($value, 'art-selector-value')
  append($value, option.html)
  $ref.textContent = ''
  append($ref, $value)
  const $list = appendElement($ref, '<div class="art-selector-list"></div>')
  for (let index = 0; index < selector.length; index++) {
    const item = selector[index]!
    const $item = document.createElement('div')
    addClass($item, 'art-selector-item')
    if (item.default)
      addClass($item, 'art-current')
    $item.dataset.index = String(index)
    $item.dataset.value = String(item.value)
    setHTML($item, item.html)
    append($list, $item)
    bind(item, { option, item: $item, value: $value, owner: $ref })
  }
  let generation = 0
  const event = proxy($list, 'click', async (event) => {
    if (scope.closed)
      return
    const path = getComposedPath(event)
    const item = option.selector!.find(item => path.includes(item.$control_item!))
    if (!item)
      return
    const current = ++generation
    const active = () => !scope.closed && current === generation
    const release = scope.add(trackSelection(event, active))
    try {
      check(item)
      if (scope.closed)
        return
      if (option.onSelect) {
        const value = await option.onSelect.call(art, item, item.$control_item!, event)
        if (active()) {
          const restore = $value.contains($value.ownerDocument.activeElement)
          setHTML($value, value)
          bindings.get(item)?.refresh?.(restore)
        }
      }
    }
    catch (error) {
      console.warn('ArtPlayer selector failed:', error)
    }
    finally {
      release()
    }
  })
  events.push(event)
  const refresh = selectorKeyboard(scope, $ref, $value, $list, String(option.tooltip || option.name || $value.textContent || art.i18n.get('Open')))
  for (const item of selector)
    bindings.get(item)!.refresh = refresh
}
