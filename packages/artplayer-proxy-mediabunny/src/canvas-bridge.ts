import type VideoShim from './VideoShim'

export function bridgeCanvas(canvas: HTMLCanvasElement, shim: VideoShim): void {
  const methods = new Map<string, (...args: unknown[]) => unknown>()
  // Dynamic forwarding is intentional: own and direct-prototype members are historical API.
  const native = canvas as unknown as Record<string, unknown>
  const members = shim as unknown as Record<string, unknown>
  for (const name in canvas) {
    if (typeof native[name] === 'function') {
      // Preserve the historical second read, including accessor side effects and binding errors.
      const method = native[name] as (...args: unknown[]) => unknown
      methods.set(name, method.bind(canvas))
    }
  }
  const names = new Set([
    ...Object.getOwnPropertyNames(shim),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(shim)),
  ])
  for (const name of names) {
    if (name === 'constructor' || name in canvas)
      continue
    Object.defineProperty(canvas, name, {
      get() {
        const value = members[name]
        return typeof value === 'function' ? value.bind(shim) : value
      },
      set(value: unknown) {
        members[name] = value
      },
      configurable: true,
      enumerable: true,
    })
  }
  for (const [name, method] of methods)
    native[name] = (...args: unknown[]) => method(...args)
}
