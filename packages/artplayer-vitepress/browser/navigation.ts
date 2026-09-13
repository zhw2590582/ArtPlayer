export function isDevelopment(hostname: string): boolean {
  return ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname.toLowerCase())
}

export function runCodeUrl(location: Pick<Location, 'hostname'>, libraries: string, code: string): string {
  const hostname = location.hostname === '::1' ? '[::1]' : location.hostname
  const origin = isDevelopment(hostname) ? `http://${hostname}:8082` : 'https://artplayer.org'
  return `${origin}/?libs=${encodeURIComponent(libraries)}&code=${encodeURIComponent(code)}`
}

export function languageDestination(url: string, language: string, initialized: boolean, englishPaths: readonly string[]): { remember: boolean, target: string | null } {
  const current = new URL(url)
  if (initialized || isDevelopment(current.hostname) || language.toLowerCase().startsWith('zh') || !language || !current.pathname.startsWith('/document/'))
    return { remember: false, target: null }
  if (current.pathname.startsWith('/document/en/'))
    return { remember: true, target: null }
  const relative = current.pathname.slice('/document/'.length)
  const counterpart = englishPaths.includes(relative)
  const target = new URL(counterpart ? `/document/en/${relative}` : '/document/en/', current.origin)
  if (counterpart) {
    target.search = current.search
    target.hash = current.hash
  }
  return { remember: true, target: target.href }
}

export function installNavigation(host: Window, englishPaths: readonly string[]): void {
  const marker = 'run-code-init'
  if (Reflect.get(host, marker))
    return
  Reflect.set(host, marker, true)
  host.document.addEventListener('click', (event) => {
    const element = event.target instanceof Element ? event.target : null
    const button = element?.closest('.run-code, [classname="run-code"]')
    const code = button?.nextElementSibling?.querySelector<HTMLElement>('pre code')
    if (!(button instanceof HTMLElement) || !code)
      return
    event.preventDefault()
    // eslint-disable-next-line unicorn/prefer-dom-node-text-content -- Preserve the existing rendered Run Code text, including visible line breaks.
    const text = code.innerText ?? code.textContent ?? ''
    host.open(runCodeUrl(host.location, button.dataset.libs || '', text))
  })
  try {
    const result = languageDestination(host.location.href, host.navigator.language, !!host.localStorage.getItem('lang-init'), englishPaths)
    if (result.remember)
      host.localStorage.setItem('lang-init', 'true')
    if (result.target)
      host.location.href = result.target
  }
  catch {
    // Storage may be unavailable. Keep the requested page instead of risking a redirect loop.
  }
}
