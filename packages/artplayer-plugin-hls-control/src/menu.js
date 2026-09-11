export function createMenu(art, name, field, icon, active, select) {
  let current
  const owned = { control: false, setting: false }

  function remove(surface) {
    if (!owned[surface])
      return
    owned[surface] = false
    art[surface === 'control' ? 'controls' : 'setting'].remove(name)
  }

  function clear() {
    current = undefined
    remove('control')
    remove('setting')
  }

  function check(state, item) {
    for (const entry of state.model.selector)
      entry.default = entry === item
    if (state.config.control)
      art.controls.check(item)
    if (state !== current || !active(state.hls))
      return
    if (state.config.setting)
      art.setting.check(item)
  }

  function update(hls, config, model, force) {
    if (!model) {
      clear()
      return
    }
    const previous = current
    const selectedIndex = model.selector.findIndex(item => item.default)
    const reusable = !force && previous?.hls === hls && previous.model.title === model.title
      && (selectedIndex !== -1 || (!previous.model.selector.some(item => item.default) && previous.model.html === model.html))
      && owned.control === Boolean(config.control) && owned.setting === Boolean(config.setting)
      && previous.model.selector.length === model.selector.length
      && previous.model.selector.every((item, index) => item.html === model.selector[index].html && item.value === model.selector[index].value)
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
    const onSelect = item => select(() => {
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

  function invalidate() {
    current = undefined
  }
  return { update, clear, invalidate }
}
