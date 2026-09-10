import type { SubtitleView } from './types'
import { releaseSubtitleURL, subtitleState } from './state'

export function replaceSubtitleTrack(subtitle: SubtitleView, kind: string, url: string): void {
  const state = subtitleState(subtitle)
  if (state.scope.closed)
    return
  const revision = ++state.trackRevision
  const { art } = subtitle
  const { template } = art
  const previous = template.$track
  const parent = previous.parentNode
  const next = previous.nextSibling
  const track = document.createElement('track')
  const scope = state.scope.child()
  scope.add(() => {
    track.onload = null
    track.onerror = null
  })
  let committed = false
  try {
    track.default = true
    track.kind = kind
    track.src = url
    track.label = art.option.subtitle.name || 'Artplayer'
    track.track.mode = 'hidden'
    track.onload = () => {
      if (!scope.closed && template.$track === track)
        art.emit('subtitleLoad', subtitle.cues, subtitle.option)
    }
    track.onerror = () => {
      if (!scope.closed && template.$track === track)
        art.notice.show = new Error('Failed to load subtitle track')
    }
    if (scope.closed || state.trackRevision !== revision) {
      scope.dispose()
      return
    }
    previous.remove()
    template.$video.appendChild(track)
    template.$track = track
    const textTrack = subtitle.textTrack
    const cleanup = textTrack
      ? art.proxy(textTrack, 'cuechange', () => {
          if (!scope.closed && template.$track === track)
            subtitle.update()
        })
      : () => {}
    scope.add(() => {
      art.events.remove(cleanup)
    })
    if (scope.closed || state.trackRevision !== revision) {
      scope.dispose()
      track.remove()
      return
    }
    const previousScope = state.track
    state.track = scope
    subtitle.destroyEvent = cleanup
    previous.onload = null
    previous.onerror = null
    committed = true
    try {
      previousScope?.dispose()
    }
    finally {
      if (state.ownedURL && state.ownedURL !== url)
        releaseSubtitleURL(state)
    }
  }
  catch (error) {
    if (committed)
      throw error
    scope.dispose()
    track.remove()
    if (state.scope.closed || state.trackRevision !== revision)
      throw error
    template.$track = previous
    if (parent)
      parent.insertBefore(previous, next?.parentNode === parent ? next : null)
    throw error
  }
}
