export interface MiniGeometry {
  width: number
  height: number
  viewportWidth: number
  viewportHeight: number
}

export function clampMini(left: number, top: number, geometry: MiniGeometry): { left: number, top: number } {
  const maxLeft = Math.max(0, geometry.viewportWidth - geometry.width)
  const maxTop = Math.max(0, geometry.viewportHeight - geometry.height)
  return { left: Math.max(0, Math.min(left, maxLeft)), top: Math.max(0, Math.min(top, maxTop)) }
}

export function miniPosition(left: unknown, top: unknown, geometry: MiniGeometry): { left: number, top: number, reset: boolean } {
  if (typeof left === 'number' && Number.isFinite(left) && typeof top === 'number' && Number.isFinite(top)
    && left >= 0 && top >= 0 && left + geometry.width <= geometry.viewportWidth && top + geometry.height <= geometry.viewportHeight) { return { left, top, reset: false } }
  return { ...clampMini(geometry.viewportWidth - geometry.width - 50, geometry.viewportHeight - geometry.height - 50, geometry), reset: true }
}

export function miniGeometry(element: HTMLElement): MiniGeometry {
  const { width, height } = element.getBoundingClientRect()
  const view = element.ownerDocument.defaultView!
  return { width, height, viewportWidth: view.innerWidth, viewportHeight: view.innerHeight }
}
