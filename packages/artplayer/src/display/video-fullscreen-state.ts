import type { OptionalMediaCapabilities } from '../media/types'

type Video = HTMLElement & OptionalMediaCapabilities

const abandoned = new WeakSet<Video>()

export function videoIsFullscreen(video: Video, observed = false): boolean {
  if (typeof video.webkitPresentationMode === 'string')
    return video.webkitPresentationMode === 'fullscreen'
  if (typeof video.webkitDisplayingFullscreen === 'boolean')
    return video.webkitDisplayingFullscreen
  return video.ownerDocument.fullscreenElement === video || observed
}

export function clearAbandonedVideo(video: Video): void {
  abandoned.delete(video)
  video.removeEventListener('webkitbeginfullscreen', releaseAbandonedVideo)
  video.removeEventListener('webkitpresentationmodechanged', releaseAbandonedVideo)
}

function releaseAbandonedVideo(this: Video, event: Event): void {
  if (!abandoned.has(this) || !videoIsFullscreen(this, event.type === 'webkitbeginfullscreen'))
    return
  clearAbandonedVideo(this)
  try {
    this.webkitExitFullscreen?.()
  }
  catch {}
}

export function abandonVideo(video: Video): void {
  abandoned.add(video)
  // The listener is held by the video itself, with no instance or scope closure.
  video.addEventListener('webkitbeginfullscreen', releaseAbandonedVideo)
  video.addEventListener('webkitpresentationmodechanged', releaseAbandonedVideo)
}

export function isAbandonedVideo(video: Video): boolean {
  return abandoned.has(video)
}
