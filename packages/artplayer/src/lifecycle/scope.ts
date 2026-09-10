export type Cleanup = () => undefined

export class ResourceCleanupError extends Error {
  constructor(readonly errors: unknown[]) {
    super('Failed to release ArtPlayer resources')
    this.name = 'ResourceCleanupError'
  }
}

export default class ResourceScope {
  private cleanups = new Set<() => void>()
  private disposed = false

  get closed(): boolean {
    return this.disposed
  }

  add(cleanup: Cleanup): () => void {
    let active = true
    const release = () => {
      if (!active)
        return
      active = false
      this.cleanups.delete(release)
      cleanup()
    }
    if (this.closed)
      release()
    else
      this.cleanups.add(release)
    return release
  }

  child(): ResourceScope {
    const child = new ResourceScope()
    const release = this.add(() => {
      child.dispose()
    })
    child.add(() => {
      release()
    })
    return child
  }

  dispose(): void {
    if (this.closed)
      return
    this.disposed = true
    const errors: unknown[] = []
    // Unwind dependencies; release removes each registration before invoking it.
    for (const release of Array.from(this.cleanups).reverse()) {
      try {
        release()
      }
      catch (error) {
        if (error instanceof ResourceCleanupError)
          errors.push(...error.errors)
        else
          errors.push(error)
      }
    }
    if (errors.length)
      throw new ResourceCleanupError(errors)
  }
}
