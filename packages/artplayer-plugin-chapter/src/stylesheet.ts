import style from './style.less?inline'

export function installStyle() {
  if (typeof document === 'undefined')
    return

  const id = 'artplayer-plugin-chapter'
  const install = () => {
    let element = document.getElementById(id)
    if (!element) {
      element = document.createElement('style')
      element.id = id
      ;(document.head || document.documentElement).appendChild(element)
    }
    element.textContent = style
  }
  if (document.getElementById(id) || document.readyState !== 'loading')
    install()
  else
    document.addEventListener('DOMContentLoaded', install, { once: true })
}
