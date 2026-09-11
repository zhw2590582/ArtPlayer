import type { Cleanup, Host } from './types'

export function report(error: unknown): void {
  console.warn('Artplayer Ads:', error)
}

export function createResources(host: Pick<Host, 'on' | 'off'>) {
  const cleaners: Cleanup[] = []
  let closed = false

  function install(add: Cleanup, remove: Cleanup): void {
    if (closed)
      return
    cleaners.push(remove)
    try {
      add()
    }
    finally {
      // A custom host/target can destroy the owner while registration is executing.
      if (closed)
        remove()
    }
  }

  return {
    on(name: string, callback: Cleanup) {
      const listener = () => {
        if (!closed)
          callback()
      }
      install(() => {
        host.on(name, listener)
      }, () => {
        host.off(name, listener)
      })
    },
    dom(target: EventTarget, name: string, callback: Cleanup) {
      const listener = () => {
        if (!closed)
          callback()
      }
      install(() => target.addEventListener(name, listener), () => target.removeEventListener(name, listener))
    },
    dispose() {
      if (closed)
        return
      closed = true
      for (const clean of cleaners.splice(0).reverse()) {
        try {
          clean()
        }
        catch (error) { report(error) }
      }
    },
  }
}

export type Resources = ReturnType<typeof createResources>
