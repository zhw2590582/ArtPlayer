const origins = new WeakMap<HTMLElement, HTMLElement>()

export function setOverlayOrigin(overlay: HTMLElement, origin?: HTMLElement): void {
  if (origin)
    origins.set(overlay, origin)
  else
    origins.delete(overlay)
}

export function resolveFocusOrigin(target: HTMLElement): HTMLElement {
  const visited = new Set<HTMLElement>()
  let current = target
  while (!visited.has(current)) {
    visited.add(current)
    let element: HTMLElement | null = current
    let origin: HTMLElement | undefined
    while (element && !origin) {
      origin = origins.get(element)
      element = element.parentElement
    }
    if (!origin)
      return current
    current = origin
  }
  return target
}
