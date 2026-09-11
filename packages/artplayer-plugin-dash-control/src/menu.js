export function createMenu(art, name, icon) {
  let current
  const owned = new Map()

  function remove(surface, callback = owned.get(surface)) {
    if (!callback || owned.get(surface) !== callback)
      return
    owned.delete(surface)
    const registry = art[surface]
    if (surface === 'controls' && registry.cache?.get && registry.cache.get(name)?.option?.onSelect !== callback)
      return
    if (surface === 'setting' && registry.find && registry.find(name)?.onSelect !== callback)
      return
    registry.remove(name)
  }

  function clear() {
    current = undefined
    let failure
    for (const [surface, callback] of [...owned]) {
      try {
        remove(surface, callback)
      }
      catch (error) {
        failure ||= error
      }
    }
    if (failure)
      throw failure
  }

  function update(config, model, active) {
    if (!model) {
      clear()
      return
    }
    const state = {}
    current = state
    const valid = () => state === current && active()
    const onSelect = (item) => {
      if (!valid())
        return item.html
      model.select(item, valid)
      if (!valid())
        return item.html
      art.notice.show = `${model.title}: ${item.html}`
      if (valid() && config.control)
        art.controls.check(item)
      if (valid() && config.setting)
        art.setting.check(item)
      return item.html
    }
    if (config.control) {
      owned.set('controls', onSelect)
      art.controls.update({ name, position: 'right', html: model.html, style: { padding: '0 10px' }, selector: model.selector, onSelect })
    }
    else {
      remove('controls')
    }
    if (!valid())
      return
    if (config.setting) {
      owned.set('setting', onSelect)
      art.setting.update({ name, tooltip: model.html, html: model.title, icon, width: 200, selector: model.selector, onSelect })
    }
    else {
      remove('setting')
    }
  }

  return { update, clear }
}
