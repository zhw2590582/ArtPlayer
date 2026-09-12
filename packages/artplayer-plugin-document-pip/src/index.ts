import type Artplayer from 'artplayer'
import type PublicPlugin from '../types/artplayer-plugin-document-pip'
import type { WindowApi } from './window-session'
import { createControl } from './control'
import { createProjection } from './projection'
import { releaseAll } from './resources'
import { installStyle } from './styles'
import { createWindowSession } from './window-session'

type Option = Parameters<typeof PublicPlugin>[0]

export default function artplayerPluginDocumentPip(userOptions: Option = {}) {
  const options = { width: 480, height: 270, fallbackToVideoPiP: true, placeholder: 'Playing in Document Picture-in-Picture', ...userOptions }
  return (art: Artplayer) => {
    const browser = window as Window & { documentPictureInPicture?: WindowApi }
    const isSupported = 'documentPictureInPicture' in browser && typeof browser.documentPictureInPicture?.requestWindow === 'function'
    let host: (Artplayer & { resize?: () => void }) | null = art
    let player: HTMLElement | null = art.template.$player
    let closed = art.isDestroy
    const utils = (art.constructor as typeof Artplayer).utils
    const alive = () => !closed && !!host && !host.isDestroy
    const session = createWindowSession({
      alive,
      request: () => browser.documentPictureInPicture!.requestWindow({ width: options.width, height: options.height }),
      project: document => createProjection(player!, document, options.placeholder),
      activate(active) {
        if (!host || !player)
          return
        if (active)
          utils.addClass(player, 'artplayer-document-pip')
        else
          utils.removeClass(player, 'artplayer-document-pip')
        if (!alive())
          return
        host.events.bindGlobalEvents?.()
        if (alive())
          host.emit('document-pip', active)
      },
      resize: () => {
        if (alive())
          host!.emit('resize')
      },
      nativeResize: () => {
        if (alive())
          host!.resize?.()
      },
      report(action, error) {
        if (!alive())
          return
        host!.notice.show = `Document Picture-in-Picture ${action} failed`
        console.warn(`[artplayer-plugin-document-pip] ${action} failed:`, error)
      },
    })
    async function open() {
      if (!alive())
        return
      if (!isSupported && options.fallbackToVideoPiP) {
        host!.pip = true
        console.warn('[artplayer-plugin-document-pip] Document Picture-in-Picture is not supported, falling back to Video Picture-in-Picture')
        return
      }
      return session.open()
    }
    function toggle() {
      if (!alive())
        return
      if (session.active || session.opening)
        void session.close()
      else
        void open()
    }
    let control: ReturnType<typeof createControl> | null = createControl(art, toggle, alive)
    function destroy() {
      if (closed)
        return
      closed = true
      const current = host
      const previousControl = control
      control = null
      const errors = releaseAll([session.destroy, () => previousControl?.destroy(), () => current?.off('destroy', destroy)])
      host = null
      player = null
      if (errors.length)
        console.warn('[artplayer-plugin-document-pip] cleanup failed:', errors[0])
    }
    const result = {
      name: 'artplayerPluginDocumentPip' as const,
      get isSupported() { return isSupported },
      get isActive() { return session.active },
      open,
      close: session.close,
      toggle,
    }
    if (closed) {
      host = null
      player = null
      return result
    }
    try {
      art.on('destroy', destroy)
      if (alive())
        control?.mount()
      else
        art.off('destroy', destroy)
    }
    catch (error) {
      destroy()
      throw error
    }
    return result
  }
}

if (typeof document !== 'undefined')
  installStyle(document)
