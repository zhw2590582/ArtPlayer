import type { Cleanup, Valid } from './types'

export function runCleanups(actions: Cleanup[], current: Valid = () => true): void {
  let failed = false
  let failure: unknown
  for (const action of actions) {
    if (!current())
      break
    try {
      action()
    }
    catch (error) {
      if (!failed) {
        failed = true
        failure = error
      }
    }
  }
  if (failed)
    throw failure
}
