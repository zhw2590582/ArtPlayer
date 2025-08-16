export default function artplayerPluginPip(userOptions = {}) {
  const options = {
    width: 480,
    height: 270,
    placeholder: `Playing in Document Picture-in-Picture`,
    ...userOptions,
  }

  return (art) => {
    if (!('documentPictureInPicture' in window)) {
      art.notice.show = 'Document Picture-in-Picture is not supported'
      return
    }

    const { proxy, icons, i18n, template: { $container }, constructor: { utils: { append, tooltip } } } = art

    const state = {
      win: null,
      originalParent: null,
      originalNext: null,
      currentDoc: null,
      placeholder: null,
    }

    function copyStylesTo(targetDoc) {
      const baseStyle = `
            html, body { margin:0; padding:0; width:100%; height:100%; background:#000; overflow:hidden; }
            #__art_dpip_root { position:absolute; inset:0; display:flex; }
            #__art_dpip_root > * { width:100% !important; height:100% !important; }
        `

      const $style = document.querySelector('#artplayer-style')
      const clone = targetDoc.createElement('style')
      clone.textContent = baseStyle + $style.textContent
      targetDoc.head.appendChild(clone)

      const meta = targetDoc.createElement('meta')
      meta.name = 'viewport'
      meta.content = 'width=device-width,initial-scale=1'
      targetDoc.head.appendChild(meta)
    }

    async function open() {
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
        state.placeholder.className = 'artplayer-pip-placeholder'
        state.placeholder.style.cssText = `display:flex;justify-content:center;align-items:center;width:100%;height:100%;`
        state.placeholder.textContent = options.placeholder
        state.originalParent = $container.parentNode
        state.originalNext = $container.nextSibling
        state.originalParent.insertBefore(state.placeholder, state.originalNext)

        const root = pipWin.document.createElement('div')
        root.id = '__art_dpip_root'
        pipWin.document.body.appendChild(root)

        copyStylesTo(pipWin.document)

        const adopted = pipWin.document.adoptNode($container)
        root.appendChild(adopted)
        state.currentDoc = pipWin.document

        const onResize = () => art.resize?.()
        const onPageHide = () => close()

        pipWin.addEventListener('resize', onResize)
        pipWin.addEventListener('pagehide', onPageHide)

        state.cleanup = () => {
          pipWin.removeEventListener('resize', onResize)
          pipWin.removeEventListener('pagehide', onPageHide)
        }

        art.emit('document-pip', true)
      }
      catch (err) {
        art.notice.show = 'Document Picture-in-Picture open failed'
        console.warn('[artplayer-plugin-pip] open failed:', err)
      }
    }

    function restoreToOriginalDocument() {
      if (!state.placeholder)
        return
      const backDoc = state.placeholder.ownerDocument || document
      const adoptedBack = backDoc.adoptNode($container)
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
        art.emit('document-pip', false)
      }
      catch (err) {
        art.notice.show = 'Document Picture-in-Picture close failed'
        console.warn('[artplayer-plugin-pip] close failed:', err)
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
      name: 'artplayerPluginPip',
      open,
      close,
      toggle,
    }
  }
}

if (typeof window !== 'undefined') {
  window.artplayerPluginPip = artplayerPluginPip
}
