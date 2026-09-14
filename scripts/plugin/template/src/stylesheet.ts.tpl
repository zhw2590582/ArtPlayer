import css from './style.less?inline'

// The stylesheet belongs to the module, not individual player instances.
if (typeof document !== 'undefined') {
  const id = 'artplayer-plugin-{{name}}'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = css
    ;(document.head || document.documentElement).appendChild(style)
  }
}
