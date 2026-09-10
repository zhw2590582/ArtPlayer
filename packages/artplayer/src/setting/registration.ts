import type { SettingItem } from './types'

const registrations = new WeakMap<SettingItem, object>()

export function cancelSettingAdd(item: SettingItem): void {
  registrations.delete(item)
}

export function beginSettingAdd(item: SettingItem): { current: () => boolean, finish: () => void } {
  const token = {}
  registrations.set(item, token)
  const current = () => registrations.get(item) === token
  return {
    current,
    finish() {
      if (current())
        registrations.delete(item)
    },
  }
}
