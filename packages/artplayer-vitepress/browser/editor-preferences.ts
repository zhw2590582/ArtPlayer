export type Preference = 'prod' | 'ts' | 'code' | 'log'

export function readPreference(
  key: Preference,
  storage: () => Storage = () => localStorage,
): boolean {
  try {
    return storage().getItem(key) === 'true'
  }
  catch {
    return false
  }
}

export function writePreference(
  key: Preference,
  value: boolean,
  storage: () => Storage = () => localStorage,
): boolean {
  try {
    storage().setItem(key, value ? 'true' : 'false')
    return true
  }
  catch {
    return false
  }
}
