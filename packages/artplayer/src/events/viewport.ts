export function inViewport(element: HTMLElement, offset: number): boolean {
  const rect = element.getBoundingClientRect()
  const document = element.ownerDocument
  const window = document.defaultView
  const height = window?.innerHeight || document.documentElement.clientHeight
  const width = window?.innerWidth || document.documentElement.clientWidth
  // Retain the historical edge/gap calculations while using the actual owner viewport.
  const vertical = rect.top - offset <= height && rect.top + rect.height + offset >= 0
  const horizontal = rect.left - offset <= width + offset && rect.left + rect.width + offset >= 0
  return vertical && horizontal
}
