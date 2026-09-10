import type ResourceScope from './scope'

export function listen(scope: ResourceScope, target: EventTarget, name: string, callback: EventListenerOrEventListenerObject, options: AddEventListenerOptions = {}): () => void {
  const { capture = false, once = false, signal } = options
  if (scope.closed || signal?.aborted)
    return () => {}
  let release = () => {}
  function listener(this: EventTarget, event: Event) {
    if (once)
      release()
    if (scope.closed)
      return
    if (typeof callback === 'function')
      callback.call(this, event)
    else
      callback.handleEvent(event)
  }
  target.addEventListener(name, listener, options)
  release = scope.add(() => {
    try {
      target.removeEventListener(name, listener, capture)
    }
    finally {
      signal?.removeEventListener('abort', release)
    }
  })
  signal?.addEventListener('abort', release, { once: true })
  return release
}

export function timeout(scope: ResourceScope, callback: () => void, delay: number): () => void {
  if (scope.closed)
    return () => {}
  let pending = true
  let release = () => {}
  const timer = setTimeout(() => {
    if (!pending)
      return
    release()
    if (!scope.closed)
      callback()
  }, delay)
  release = scope.add(() => {
    pending = false
    clearTimeout(timer)
  })
  return release
}

export function animationFrame(scope: ResourceScope, callback: FrameRequestCallback): () => void {
  if (scope.closed)
    return () => {}
  let pending = true
  let release = () => {}
  const frame = requestAnimationFrame((time) => {
    if (!pending)
      return
    release()
    if (!scope.closed)
      callback(time)
  })
  release = scope.add(() => {
    pending = false
    cancelAnimationFrame(frame)
  })
  return release
}

export function requestController(scope: ResourceScope): AbortController | undefined {
  if (typeof AbortController === 'undefined')
    return undefined
  const controller = new AbortController()
  scope.add(() => {
    controller.abort()
  })
  return controller
}

export function objectURL(scope: ResourceScope, blob: Blob): string {
  const url = URL.createObjectURL(blob)
  scope.add(() => {
    URL.revokeObjectURL(url)
  })
  return url
}
