export function supportsFlex(): boolean {
  const div = document.createElement('div')
  div.style.display = 'flex'
  return div.style.display === 'flex'
}

export function getRect(el: Pick<Element, 'getBoundingClientRect'>): DOMRect {
  return el.getBoundingClientRect()
}

export function isInViewport(el: Pick<Element, 'getBoundingClientRect'>, offset = 0): boolean {
  const rect = el.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth
  const vertInView = rect.top - offset <= windowHeight && rect.top + rect.height + offset >= 0
  const horInView = rect.left - offset <= windowWidth + offset && rect.left + rect.width + offset >= 0
  return vertInView && horInView
}

export function getSafeAreaInsets(): { top: number, right: number, bottom: number, left: number } {
  const div = document.createElement('div')
  div.style.cssText
    = 'position:fixed;top:env(safe-area-inset-top,0px);right:env(safe-area-inset-right,0px);bottom:env(safe-area-inset-bottom,0px);left:env(safe-area-inset-left,0px);pointer-events:none;visibility:hidden;'
  try {
    document.body.appendChild(div)
    const style = getComputedStyle(div)
    return {
      top: Number.parseFloat(style.top) || 0,
      right: Number.parseFloat(style.right) || 0,
      bottom: Number.parseFloat(style.bottom) || 0,
      left: Number.parseFloat(style.left) || 0,
    }
  }
  finally {
    div.remove()
  }
}
