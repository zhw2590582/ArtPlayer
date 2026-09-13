const properties = new WeakMap()

export default class SettingLifecycle {
  constructor(art) {
    this.art = art
    this.closed = false
    this.disposers = new Set()
    this.cancelled = new Promise(resolve => this.cancel = resolve)
  }

  get active() {
    return !this.closed && !this.art.isDestroy
  }

  own(dispose) {
    if (this.closed)
      dispose()
    else this.disposers.add(dispose)
  }

  write(target, key, value, apply = value => target[key] = value) {
    if (!this.active)
      return
    const priority = () => typeof target.getPropertyPriority === 'function' ? target.getPropertyPriority(key) : undefined
    let keys = properties.get(target)
    if (!keys) {
      keys = new Map()
      properties.set(target, keys)
    }
    let entry = keys.get(key)
    if (!entry) {
      entry = {
        original: target[key],
        present: key in target || target[key] !== undefined,
        priority: priority(),
        owners: new Map(),
        apply,
      }
      keys.set(key, entry)
    }
    if (!entry.owners.has(this)) {
      this.own(() => {
        const owners = [...entry.owners.keys()]
        const current = owners[owners.length - 1] === this
        entry.owners.delete(this)
        // A later user write belongs to the host, not this settings instance.
        if (current && target[key] === entry.last && priority() === entry.lastPriority) {
          const values = [...entry.owners.values()]
          if (values.length) {
            entry.apply(values[values.length - 1])
            entry.last = target[key]
            entry.lastPriority = priority()
          }
          else if (entry.priority !== undefined) {
            target.setProperty(key, entry.original, entry.priority)
          }
          else if (entry.present) {
            entry.apply(entry.original)
          }
          else {
            delete target[key]
          }
        }
        if (!entry.owners.size) {
          keys.delete(key)
          if (!keys.size)
            properties.delete(target)
        }
      })
    }
    entry.owners.delete(this)
    entry.owners.set(this, value)
    entry.apply(value)
    entry.last = target[key]
    entry.lastPriority = priority()
  }

  on(name, callback) {
    if (!this.active)
      return
    const lifecycle = this
    function listener(...args) {
      if (lifecycle.active)
        return callback.apply(this, args)
    }
    const dispose = () => this.art.off(name, listener)
    this.own(dispose)
    try {
      this.art.on(name, listener)
      if (!this.active)
        dispose()
    }
    catch (error) {
      this.release(dispose)
      throw error
    }
  }

  proxy(target, name, callback) {
    if (!this.active)
      return
    const lifecycle = this
    function listener(...args) {
      if (lifecycle.active)
        return callback.apply(this, args)
    }
    let remove
    const dispose = () => {
      if (typeof remove === 'function') {
        const registry = this.art.events
        if (typeof registry?.remove === 'function' && registry.destroyEvents?.has(remove))
          registry.remove(remove)
        else remove()
      }
      else {
        target.removeEventListener?.(name, listener)
      }
    }
    this.own(dispose)
    try {
      remove = this.art.proxy(target, name, listener)
      if (!this.active)
        dispose()
    }
    catch (error) {
      this.release(dispose)
      throw error
    }
  }

  wait(value) {
    return Promise.race([value, this.cancelled])
  }

  release(dispose) {
    try {
      dispose()
    }
    catch (error) {
      console.warn('Failed to dispose danmuku setting resource:', error)
    }
  }

  close() {
    if (this.closed)
      return
    this.closed = true
    this.cancel()
    for (const dispose of this.disposers) {
      this.release(dispose)
    }
    this.disposers.clear()
  }
}
