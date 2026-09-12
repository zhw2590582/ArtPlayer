import type { DisplayConfig, Label, MenuHost, MenuModel, SelectorItem } from './m3u8-types'

export function releaseAll(actions: (() => void)[]): void {
  const failures: unknown[] = []
  for (const action of actions) {
    try {
      action()
    }
    catch (error) { failures.push(error) }
  }
  if (failures.length)
    throw failures[0]
}

export default function createMenu(art: MenuHost, name: string, icon: string) {
  const owned = { control: false, setting: false }
  let model: MenuModel | null = null
  function remove(surface: 'control' | 'setting'): void {
    if (!owned[surface])
      return
    owned[surface] = false
    if (surface === 'control') {
      if (art.controls.cache.has(name))
        art.controls.remove(name)
    }
    else if (art.setting.find(name)) {
      art.setting.remove(name)
    }
  }
  function clear(): void {
    model = null
    releaseAll([() => remove('control'), () => remove('setting')])
  }
  function update(next: MenuModel | null, config: DisplayConfig, active: () => boolean, select: (item: SelectorItem, title: string) => Promise<Label>): void {
    if (!next) {
      clear()
      return
    }
    model = next
    const valid = () => model === next && active()
    const onSelect = async (item: SelectorItem): Promise<Label> => {
      if (!valid() || !next.selector.some(entry => entry.value === item.value))
        return item.html
      return select(item, next.title)
    }
    if (config.control) {
      owned.control = true
      art.controls.update({ name, position: 'right', html: next.html, style: { padding: '0 10px' }, selector: next.selector, onSelect })
    }
    else {
      remove('control')
    }
    if (!valid())
      return
    if (config.setting) {
      owned.setting = true
      art.setting.update({ name, tooltip: next.html, html: next.title, icon, width: 200, selector: next.selector, onSelect })
    }
    else {
      remove('setting')
    }
  }
  return { update, clear }
}
