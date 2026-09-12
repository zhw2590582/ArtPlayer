import style from './style.less?inline'

export function installStyle(document: Document): void {
  const id = 'artplayer-plugin-document-pip'
  const existing = document.getElementById(id)
  if (existing) {
    existing.textContent = style
    return
  }
  const element = document.createElement('style')
  element.id = id
  element.textContent = style
  const insert = () => {
    document.removeEventListener('DOMContentLoaded', insert)
    const current = document.getElementById(id)
    if (current)
      current.textContent = style
    else
      (document.head || document.documentElement).appendChild(element)
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', insert)
  else
    insert()
}

export function copyStyles(source: Document, target: Document, own: (node: HTMLElement) => void, alive: () => boolean): void {
  const append = (node: HTMLElement) => {
    if (!alive())
      return
    own(node)
    target.head.appendChild(node)
    if (!alive())
      node.remove()
  }
  const base = target.createElement('style')
  base.textContent = `
    html, body { margin:0; padding:0; width:100%; height:100%; background:#000; overflow:hidden; }
    #__art_dpip_root { position:absolute; inset:0; display:flex; }
    #__art_dpip_root > * { width:100% !important; height:100% !important; }
  `
  append(base)
  if (!target.querySelector('meta[name="viewport"]')) {
    const meta = target.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'width=device-width,initial-scale=1'
    append(meta)
  }
  try {
    source.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]').forEach((link) => {
      const clone = target.createElement('link')
      clone.rel = 'stylesheet'
      clone.href = link.href
      if (link.media)
        clone.media = link.media
      if (link.crossOrigin)
        clone.crossOrigin = link.crossOrigin
      if (link.referrerPolicy)
        clone.referrerPolicy = link.referrerPolicy
      append(clone)
    })
  }
  catch { /* Preserve best-effort copying when stylesheets are inaccessible. */ }
  try {
    source.querySelectorAll('style').forEach((element) => {
      const clone = target.createElement('style')
      clone.textContent = element.textContent
      append(clone)
    })
  }
  catch { /* A page may restrict access to its style nodes. */ }
}
