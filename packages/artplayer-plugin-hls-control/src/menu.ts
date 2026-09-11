import type { DisplayConfig, MenuHost, MenuModel, MenuState, SelectorItem } from './types'

export function createMenu<Engine extends { currentLevel: number, audioTrack: number }>(art: MenuHost, name: string, field: 'currentLevel' | 'audioTrack', icon: string, active: (hls: Engine) => boolean, select: <T>(callback: () => T) => T) {
  let current: MenuState<Engine> | undefined
  const owned = { control: false, setting: false }

  function remove(surface: 'control' | 'setting'): void {
    if (!owned[surface])
      return
    owned[surface] = false
    art[surface === 'control' ? 'controls' : 'setting'].remove(name)
  }

  function clear(): void {
    current = undefined
    remove('control')
    remove('setting')
  }

  function check(state: MenuState<Engine>, item: SelectorItem): void {
    for (const entry of state.model.selector)
      entry.default = entry === item
    if (state.config.control)
      art.controls.check(item)
    if (state !== current || !active(state.hls))
      return
    if (state.config.setting)
      art.setting.check(item)
  }

  function update(hls: Engine, config: DisplayConfig, model: MenuModel | null, force: boolean): void {
    if (!model) {
      clear()
      return
    }
    const previous = current
    const selectedIndex = model.selector.findIndex(item => item.default)
    // Equal lengths below protect the same-index reads in the comparison.
    const reusable = !force && previous?.hls === hls && previous.model.title === model.title
      && (selectedIndex !== -1 || (!previous.model.selector.some(item => item.default) && previous.model.html === model.html))
      && owned.control === Boolean(config.control) && owned.setting === Boolean(config.setting)
      && previous.model.selector.length === model.selector.length
      && previous.model.selector.every((item, index) => item.html === model.selector[index]!.html && item.value === model.selector[index]!.value)
    if (reusable) {
      previous.config = config
      const target = previous.model.selector[selectedIndex]
      if (target && (!target.default || previous.model.html !== model.html)) {
        previous.model.html = model.html
        check(previous, target)
      }
      return
    }
    const state = { hls, config, model }
    current = state
    const valid = () => current === state && active(hls)
    const onSelect = (item: SelectorItem) => select(() => {
      if (!valid())
        return item.html
      hls[field] = item.value
      if (!valid())
        return item.html
      model.html = item.html
      art.notice.show = `${model.title}: ${item.html}`
      if (valid())
        check(state, item)
      return item.html
    })
    if (config.control) {
      owned.control = true
      art.controls.update({ name, position: 'right', html: model.html, style: { padding: '0 10px' }, selector: model.selector, onSelect })
    }
    else {
      remove('control')
    }
    if (!valid())
      return
    if (config.setting) {
      owned.setting = true
      art.setting.update({ name, tooltip: model.html, html: model.title, icon, width: 200, selector: model.selector, onSelect })
    }
    else {
      remove('setting')
    }
  }

  function invalidate(): void {
    current = undefined
  }
  return { update, clear, invalidate }
}
