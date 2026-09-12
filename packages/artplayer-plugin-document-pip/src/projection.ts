import { releaseAll } from './resources'
import { copyStyles } from './styles'

export function createProjection(player: HTMLElement, target: Document, text: string | undefined) {
  const source = player.ownerDocument
  const parent = player.parentNode
  const next = player.nextSibling
  if (!parent)
    throw new Error('Document Picture-in-Picture requires a mounted player')
  const placeholder = source.createElement('div')
  placeholder.className = 'artplayer-document-pip-placeholder'
  placeholder.style.cssText = 'display:flex;justify-content:center;align-items:center;width:100%;height:100%;'
  placeholder.textContent = text ?? ''
  const root = target.createElement('div')
  root.id = '__art_dpip_root'
  const nodes: HTMLElement[] = []
  let closed = false
  const restore = () => {
    // Insertion adopts atomically; never detach the player before validating the anchor.
    const anchor = placeholder.parentNode === parent ? placeholder : next?.parentNode === parent ? next : null
    if (player.parentNode !== parent || player.nextSibling !== anchor) {
      try {
        parent.insertBefore(player, anchor)
      }
      catch (error) {
        // Keep a recoverable node in the original document if its parent rejects insertion.
        source.body.appendChild(player)
        throw error
      }
    }
  }
  const cleanup = () => {
    const errors = releaseAll([restore, () => placeholder.remove(), ...nodes.splice(0).map(node => () => node.remove()), () => root.remove()])
    if (errors.length)
      throw errors[0]
  }
  return {
    mount() {
      if (closed)
        return
      parent.insertBefore(placeholder, next?.parentNode === parent ? next : null)
      if (!closed)
        target.body.appendChild(root)
      if (!closed)
        copyStyles(source, target, node => nodes.push(node), () => !closed)
      if (!closed) {
        const adopted = target.adoptNode(player)
        if (!closed)
          root.appendChild(adopted)
      }
      if (closed)
        cleanup()
    },
    destroy() {
      if (closed)
        return
      closed = true
      cleanup()
    },
  }
}
