export function ownMedia(video: HTMLVideoElement, parent: () => HTMLElement | null | undefined, active: () => boolean) {
  let mounted = false
  return {
    mount() {
      if (mounted || !active())
        return
      const target = parent()
      if (!target)
        return
      video.setAttribute('aria-hidden', 'true')
      video.tabIndex = -1
      video.playsInline = true
      // Keep media connected before playback without adding another visible player.
      Object.assign(video.style, { position: 'absolute', width: 'auto', height: 'auto', opacity: '0', pointerEvents: 'none', left: '0', top: '0' })
      target.appendChild(video)
      mounted = true
      if (!active())
        video.remove()
    },
    destroy() {
      const failures: unknown[] = []
      const clearObject = () => {
        video.srcObject = null
      }
      for (const release of [() => video.pause(), () => video.removeAttribute('src'), clearObject, () => video.load(), () => video.remove()]) {
        try {
          release()
        }
        catch (error) { failures.push(error) }
      }
      mounted = false
      if (failures.length)
        throw failures[0]
    },
  }
}
