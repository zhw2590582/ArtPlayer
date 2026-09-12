export function forwardMedia(canvas: HTMLCanvasElement, video: HTMLVideoElement, active: () => boolean, invalidate: () => void, mount: () => void): void {
  const methods = new Map<string, (...args: unknown[]) => unknown>()
  for (const name in canvas) {
    const value: unknown = Reflect.get(canvas, name)
    if (typeof value === 'function')
      methods.set(name, (...args) => Reflect.apply(value, canvas, args))
  }
  for (const name in video) {
    if (name in canvas)
      continue
    Object.defineProperty(canvas, name, {
      get() {
        const value: unknown = Reflect.get(video, name)
        if (typeof value !== 'function')
          return value
        return (...args: unknown[]) => {
          if (!active())
            return name === 'play' ? Promise.resolve() : undefined
          if (name === 'load')
            invalidate()
          if (name === 'play')
            mount()
          return Reflect.apply(value, video, args)
        }
      },
      set(value: unknown) {
        if (!active())
          return
        if (name === 'src' || name === 'srcObject')
          invalidate()
        Reflect.set(video, name, value)
      },
      configurable: true,
      enumerable: true,
    })
  }
  for (const [name, method] of methods)
    Reflect.set(canvas, name, method)
}
