export default class Storage {
  declare name: string
  declare settings: Record<PropertyKey, unknown>

  constructor() {
    this.name = 'artplayer_settings'
    this.settings = {}
  }

  get(key?: PropertyKey): unknown {
    try {
      // Preserve JSON.parse(null), primitive payloads and truthy-key selection.
      const storage = (JSON.parse(window.localStorage.getItem(this.name) as string) || {}) as Record<PropertyKey, unknown>
      return key ? storage[key] : storage
    }
    catch {
      return key ? this.settings[key] : this.settings
    }
  }

  set(key: PropertyKey, value: unknown): void {
    try {
      const storage = Object.assign({}, this.get(), {
        [key]: value,
      })
      window.localStorage.setItem(this.name, JSON.stringify(storage))
    }
    catch {
      this.settings[key] = value
    }
  }

  del(key: PropertyKey): void {
    try {
      const storage = this.get() as Record<PropertyKey, unknown>
      delete storage[key]
      window.localStorage.setItem(this.name, JSON.stringify(storage))
    }
    catch {
      delete this.settings[key]
    }
  }

  clear(): void {
    try {
      window.localStorage.removeItem(this.name)
    }
    catch {
      this.settings = {}
    }
  }
}
