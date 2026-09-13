import style from './style.less?inline'

if (typeof document !== 'undefined') {
  const id = 'artplayer-plugin-danmuku'
  const pending = Symbol.for('artplayer-plugin-danmuku.pending-style')
  const styleDocument = document as Document & { [key: symbol]: HTMLElement | undefined }
  let $style = document.getElementById(id) || styleDocument[pending]
  if (!$style) {
    $style = document.createElement('style')
    $style.id = id
    if (document.readyState === 'loading') {
      styleDocument[pending] = $style
      const ready = () => {
        document.removeEventListener('DOMContentLoaded', ready)
        if (styleDocument[pending] === $style)
          delete styleDocument[pending]
        const existing = document.getElementById(id)
        if (existing)
          existing.textContent = $style!.textContent
        else
          (document.head || document.documentElement).appendChild($style!)
      }
      document.addEventListener('DOMContentLoaded', ready, { once: true })
    }
    else {
      (document.head || document.documentElement).appendChild($style!)
    }
  }
  $style.textContent = style
}
