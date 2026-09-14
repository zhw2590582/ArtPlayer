export function createRebuildQueue(build: () => void | Promise<void>): () => Promise<void> {
  let pending = false
  let active: Promise<void> | undefined
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
