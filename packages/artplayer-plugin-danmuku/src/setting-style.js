import style from './style.less?inline'

if (typeof document !== 'undefined') {
  const id = 'artplayer-plugin-danmuku'
  const pending = Symbol.for('artplayer-plugin-danmuku.pending-style')
  let $style = document.getElementById(id) || document[pending]
  if (!$style) {
    $style = document.createElement('style')
    $style.id = id
    if (document.readyState === 'loading') {
      document[pending] = $style
      const ready = () => {
        document.removeEventListener('DOMContentLoaded', ready)
        if (document[pending] === $style)
          delete document[pending]
        const existing = document.getElementById(id)
        if (existing)
          existing.textContent = $style.textContent
        else
          (document.head || document.documentElement).appendChild($style)
      }
      document.addEventListener('DOMContentLoaded', ready, { once: true })
    }
    else {
      (document.head || document.documentElement).appendChild($style)
    }
  }
  $style.textContent = style
}
