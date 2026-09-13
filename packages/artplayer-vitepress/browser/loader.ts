export function parameters(url: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const part of new URL(url).search.slice(1).split('&')) {
    const index = part.indexOf('=')
    if (index >= 0)
      result[part.slice(0, index)] = part.slice(index + 1)
  }
  return result
}

function suspendDefine(host: Window): () => void {
  const descriptor = Object.getOwnPropertyDescriptor(host, 'define')
  if (descriptor?.configurable === false) {
    if (!('value' in descriptor) || !descriptor.writable)
      throw new Error('Cannot temporarily suspend the AMD loader')
    Object.defineProperty(host, 'define', { value: undefined })
  }
  else {
    Object.defineProperty(host, 'define', { value: undefined, configurable: true, writable: true, enumerable: descriptor?.enumerable ?? true })
  }
  return () => {
    if (descriptor)
      Object.defineProperty(host, 'define', descriptor)
    else Reflect.deleteProperty(host, 'define')
  }
}

export function createLibraryLoader(host: Window = window) {
  const loaded = new Set<string>()
  let queue: Promise<unknown> = Promise.resolve()
  let cancel: (() => void) | undefined
  let disposed = false
  const ensureActive = () => {
    if (disposed)
      throw new Error('Documentation loader was disposed')
  }
  function load(url: string, script: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      const element = host.document.createElement(script ? 'script' : 'link')
      let restore: (() => void) | undefined
      let settled = false
      function finish(error?: Error) {
        if (settled)
          return
        settled = true
        element.removeEventListener('load', success)
        element.removeEventListener('error', failure)
        cancel = undefined
        try {
          restore?.()
        }
        catch (cause) {
          error = new Error(`Failed to restore AMD loader: ${String(cause)}`)
        }
        if (error) {
          element.remove()
          reject(error)
        }
        else {
          resolve()
        }
      }
      function success() {
        finish()
      }
      function failure() {
        finish(new Error(`Loading ${script ? 'script' : 'style'} failed: ${url}`))
      }
      element.addEventListener('load', success)
      element.addEventListener('error', failure)
      cancel = () => finish(new Error(`Cancelled documentation dependency: ${url}`))
      try {
        ensureActive()
        if (script) {
          restore = suspendDefine(host)
          const node = element as HTMLScriptElement
          node.type = 'text/javascript'
          node.src = url
          node.async = false
        }
        else {
          const node = element as HTMLLinkElement
          node.rel = 'stylesheet'
          node.href = url
        }
        host.document.head.appendChild(element)
      }
      catch (cause) {
        finish(cause instanceof Error ? cause : new Error(String(cause)))
      }
    })
  }
  return {
    loadLibraries(encoded: string = ''): Promise<string[]> {
      const work = queue.then(async () => {
        ensureActive()
        const urls = decodeURIComponent(encoded).split(/\r?\n/).map(url => url.trim()).filter(Boolean)
        const result: string[] = []
        for (const url of urls) {
          ensureActive()
          const absolute = new URL(url, host.location.href)
          const extension = absolute.pathname.toLowerCase().split('.').pop()
          if (extension !== 'js' && extension !== 'css')
            continue
          if (!loaded.has(absolute.href)) {
            await load(absolute.href, extension === 'js')
            loaded.add(absolute.href)
          }
          result.push(url)
        }
        return result
      })
      queue = work.catch(() => {})
      return work
    },
    dispose(): void {
      disposed = true
      cancel?.()
      loaded.clear()
    },
  }
}

export async function exampleSource(name: string, request: typeof fetch = fetch): Promise<string> {
  const response = await request(`./assets/example/${name}.js`)
  if (!response.ok)
    throw new Error(`Loading example failed: ${name} (${response.status})`)
  return response.text()
}
