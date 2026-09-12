export type Disposer = () => void

export function releaseAll(releases: Disposer[]): unknown[] {
  const errors: unknown[] = []
  for (const release of releases) {
    try {
      release()
    }
    catch (error) { errors.push(error) }
  }
  return errors
}

export function createDelay() {
  let finish!: () => void
  const promise = new Promise<void>((resolve) => {
    finish = resolve
  })
  let timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
    timer = null
    finish()
  }, 100)
  return {
    promise,
    cancel() {
      if (timer !== null)
        clearTimeout(timer)
      timer = null
      finish()
    },
  }
}
