export function createRebuildQueue(build) {
  let pending = false
  let active
  return () => {
    pending = true
    if (!active) {
      active = Promise.resolve().then(async () => {
        while (pending) {
          pending = false
          await build()
        }
      }).finally(() => { active = undefined })
    }
    return active
  }
}
