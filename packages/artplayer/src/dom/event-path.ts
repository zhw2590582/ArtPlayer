interface EventPathSource {
  target: EventTarget | null
  composedPath?: () => EventTarget[]
}

export function getComposedPath(event: EventPathSource): EventTarget[] {
  if (event.composedPath)
    return event.composedPath()
  const path: EventTarget[] = []
  let node = event.target
  while (node) {
    path.push(node)
    node = (node as EventTarget & { parentNode?: EventTarget | null }).parentNode ?? null
  }
  if (typeof window !== 'undefined' && !path.includes(window))
    path.push(window)
  return path
}

export function includeFromEvent(event: EventPathSource, target: EventTarget | null | undefined): boolean {
  return getComposedPath(event).includes(target as EventTarget)
}
