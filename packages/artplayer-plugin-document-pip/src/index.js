import style from 'bundle-text:./style.less'

export default function artplayerPluginDocumentPip(userOptions = {}) {
  const options = {
    width: 480,
    height: 270,
    fallbackToVideoPiP: true,
    placeholder: `Playing in Document Picture-in-Picture`,
    ...userOptions,
  }

  return (art) => {
    const isSupported = 'documentPictureInPicture' in window
      && typeof window.documentPictureInPicture?.requestWindow === 'function'

    const { proxy, icons, i18n, template: { $player }, constructor: { utils: { append, tooltip, addClass, removeClass } } } = art

    const state = {
      win: null,
      originalParent: null,
      originalNext: null,
      currentDoc: null,
      placeholder: null,
    }

    function copyStylesTo(targetDoc) {
      const base = targetDoc.createElement('style')
      base.textContent = `
        html, body { margin:0; padding:0; width:100%; height:100%; background:#000; overflow:hidden; }
        #__art_dpip_root { position:absolute; inset:0; display:flex; }
        #__art_dpip_root > * { width:100% !important; height:100% !important; }
      `
      targetDoc.head.appendChild(base)
      if (!targetDoc.querySelector('meta[name="viewport"]')) {
        const meta = targetDoc.createElement('meta')
        meta.name = 'viewport'
        meta.content = 'width=device-width,initial-scale=1'
        targetDoc.head.appendChild(meta)
      }

      try {
        document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
          const clone = targetDoc.createElement('link')
          clone.rel = 'stylesheet'
          clone.href = link.href
          if (link.media)
            clone.media = link.media
          if (link.crossOrigin)
            clone.crossOrigin = link.crossOrigin
          if (link.referrerPolicy)
            clone.referrerPolicy = link.referrerPolicy
          targetDoc.head.appendChild(clone)
        })
      }
      catch { }

      try {
        document.querySelectorAll('style').forEach((style) => {
          const clone = targetDoc.createElement('style')
          clone.textContent = style.textContent
          targetDoc.head.appendChild(clone)
        })
      }
      catch { }
    }

    async function open() {
      if (!isSupported && options.fallbackToVideoPiP) {
        art.pip = true
        console.warn('[artplayer-plugin-document-pip] Document Picture-in-Picture is not supported, falling back to Video Picture-in-Picture')
        return
      }

      if (state.win)
        return

      try {
        const pipWin = await window.documentPictureInPicture.requestWindow({
          width: options.width,
          height: options.height,
        })

        state.win = pipWin
        state.currentDoc = pipWin.document

        state.placeholder = document.createElement('div')
        state.placeholder.className = 'artplayer-document-pip-placeholder'
        state.placeholder.style.cssText = `display:flex;justify-content:center;align-items:center;width:100%;height:100%;`
        state.placeholder.textContent = options.placeholder
        state.originalParent = $player.parentNode
        state.originalNext = $player.nextSibling
        state.originalParent.insertBefore(state.placeholder, state.originalNext)

        const root = pipWin.document.createElement('div')
        root.id = '__art_dpip_root'
        pipWin.document.body.appendChild(root)

        copyStylesTo(pipWin.document)

        const adopted = pipWin.document.adoptNode($player)
        root.appendChild(adopted)
        state.currentDoc = pipWin.document

        const onResize = () => art.resize?.()
        const onClose = () => close()

        pipWin.addEventListener('resize', onResize)
        pipWin.addEventListener('pagehide', onClose)
        pipWin.addEventListener('unload', onClose)

        state.cleanup = () => {
          pipWin.removeEventListener('resize', onResize)
          pipWin.removeEventListener('pagehide', onClose)
          pipWin.removeEventListener('unload', onClose)
        }

        addClass($player, 'artplayer-document-pip')
        art.events.bindGlobalEvents?.()
        art.emit('document-pip', true)
      }
      catch (err) {
        art.notice.show = 'Document Picture-in-Picture open failed'
        console.warn('[artplayer-plugin-document-pip] open failed:', err)
      }
    }

    function restoreToOriginalDocument() {
      if (!state.placeholder)
        return
      const backDoc = state.placeholder.ownerDocument || document
      const adoptedBack = backDoc.adoptNode($player)
      state.originalParent.insertBefore(adoptedBack, state.placeholder)
      state.placeholder.remove()
      state.placeholder = null
      state.currentDoc = backDoc
    }

    function close() {
      if (!state.win)
        return
      try {
        state.cleanup?.()
        restoreToOriginalDocument()
        state.win.close()
        state.win = null
        removeClass($player, 'artplayer-document-pip')
        art.events.bindGlobalEvents?.()
        art.emit('document-pip', false)
      }
      catch (err) {
        art.notice.show = 'Document Picture-in-Picture close failed'
        console.warn('[artplayer-plugin-document-pip] close failed:', err)
      }
    }

    function toggle() {
      if (state.win) {
        close()
      }
      else {
        open()
      }
    }

    art.controls.add({
      name: 'document-pip',
      position: 'right',
      index: 40,
      tooltip: art.i18n.get('PIP Mode'),
      mounted: ($control) => {
        append($control, icons.pip)
        proxy($control, 'click', toggle)
        art.on('document-pip', (value) => {
          tooltip($control, i18n.get(value ? 'Exit PIP Mode' : 'PIP Mode'))
        })
      },
    })

    art.on('destroy', close)

    return {
      name: 'artplayerPluginDocumentPip',
      get isSupported() { return isSupported },
      get isActive() { return !!state.win },
      open,
      close,
      toggle,
    }
  }
}

if (typeof window !== 'undefined') {
  window.artplayerPluginDocumentPip = artplayerPluginDocumentPip
}

if (typeof document !== 'undefined') {
  const id = 'artplayer-plugin-document-pip'
  let $style = document.getElementById(id)
  if (!$style) {
    $style = document.createElement('style')
    $style.id = id
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.head.appendChild($style)
      })
    }
    else {
      (document.head || document.documentElement).appendChild($style)
    }
  }
  $style.textContent = style
}
