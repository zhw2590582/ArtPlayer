import type { Subtitle, Utils } from 'artplayer'
import type { Lifetime, OwnedURL, RenderHost } from './types'

export default function createRenderer(art: RenderHost, lifetime: Lifetime, unescape: Utils['unescape']): (vtt: string) => void {
  let current: OwnedURL | null = null
  function own(url: string): OwnedURL {
    let freed = false
    let release: () => unknown = () => {}
    const entry: OwnedURL = {
      free() {
        if (freed)
          return
        freed = true
        release()
        URL.revokeObjectURL(url)
      },
    }
    release = lifetime.own(entry.free)
    return entry
  }
  return (vtt) => {
    if (lifetime.closed)
      return
    // Allocate before replacing the active URL so allocation failure preserves it.
    const url = URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' }))
    const entry = own(url)
    if (lifetime.closed)
      return
    const previous = current
    let option: Subtitle | undefined
    let escape: boolean | undefined
    let configured = false
    current = entry
    try {
      // ArtPlayer merges subtitle defaults; preserve errors for invalid custom hosts.
      option = art.option.subtitle!
      escape = option.escape
      if (lifetime.closed || current !== entry)
        return
      option.escape = false
      configured = true
      const config = { ...option, url, type: 'vtt', onVttLoad: unescape }
      if (lifetime.closed || current !== entry)
        return
      const pending = art.subtitle.init(config)
      // Selection stays void and registration does not await the host's media loading.
      Promise.resolve(pending).catch((error) => {
        if (current === entry) {
          current = null
          entry.free()
        }
        if (!lifetime.closed)
          console.warn('Failed to initialize multiple subtitles:', error)
      })
    }
    catch (error) {
      if (current === entry) {
        current = previous
        if (configured && option!.escape === false)
          option!.escape = escape
      }
      entry.free()
      throw error
    }
    finally {
      if (previous !== current)
        previous?.free()
      if (entry !== current)
        entry.free()
    }
  }
}
