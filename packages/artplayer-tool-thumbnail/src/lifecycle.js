const states = new WeakMap()

export function stateFor(tool) {
  if (!states.has(tool)) {
    states.set(tool, {
      closed: false,
      epoch: 0,
      inputEpoch: 0,
      job: null,
      video: null,
      sourceUrl: null,
      thumbnailUrl: null,
      sourceUrls: new Set(),
      thumbnailUrls: new Set(),
      sourceListeners: [],
      loading: false,
    })
  }
  return states.get(tool)
}

export function cancellation(reason) {
  const error = new Error(`Thumbnail task cancelled: ${reason}`)
  error.name = 'AbortError'
  return error
}

export function revoke(urls, url) {
  if (!url)
    return
  urls.delete(url)
  URL.revokeObjectURL(url)
}

export function cleanupAll(callbacks) {
  let failure
  for (const callback of callbacks) {
    try {
      callback()
    }
    catch (error) {
      failure ||= error
    }
  }
  if (failure)
    throw failure
}

export function closeState(tool, reason = 'destroyed') {
  const state = stateFor(tool)
  if (state.closed)
    return false
  state.closed = true
  state.epoch++
  state.job?.cancel(reason)
  return true
}

export function releaseMedia(tool) {
  const state = stateFor(tool)
  const sources = new Set([...state.sourceUrls, tool.videoUrl])
  const thumbnails = new Set([...state.thumbnailUrls, tool.thumbnailUrl])
  const media = []
  for (const video of new Set([state.video, tool.video])) {
    if (video) {
      media.push(
        () => video.pause?.(),
        () => video.removeAttribute?.('src'),
        () => video.load?.(),
        () => video.parentNode?.removeChild(video),
      )
    }
  }
  cleanupAll([
    ...state.sourceListeners.splice(0),
    ...media,
    ...[...sources].map(url => () => revoke(state.sourceUrls, url)),
    ...[...thumbnails].map(url => () => revoke(state.thumbnailUrls, url)),
  ])
}
