// Frozen own-source regression fixture: ccf77c4e packages/artplayer/src/utils/dom.js
// Function SHA-256: bbf533f90288190b5f058e5dfed1a25856ccfeaf3a3b6aba5d2c7f74ce947bda
export function getSafeAreaInsets() {
  const div = document.createElement('div')
  div.style.cssText
    = 'position:fixed;top:env(safe-area-inset-top,0px);right:env(safe-area-inset-right,0px);bottom:env(safe-area-inset-bottom,0px);left:env(safe-area-inset-left,0px);pointer-events:none;visibility:hidden;'
  document.body.appendChild(div)
  const style = getComputedStyle(div)
  const insets = {
    top: Number.parseFloat(style.top) || 0,
    right: Number.parseFloat(style.right) || 0,
    bottom: Number.parseFloat(style.bottom) || 0,
    left: Number.parseFloat(style.left) || 0,
  }
  div.remove()
  return insets
}
