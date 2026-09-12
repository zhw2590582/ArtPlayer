import { cleanupAll, revoke, stateFor } from './lifecycle'

export function loadSource(tool, file) {
  const state = stateFor(tool)
  if (!file || state.closed)
    return
  const initialEpoch = state.epoch
  const video = tool.video
  const support = video.canPlayType(file.type)
  tool.errorHandle(support === 'maybe' || support === 'probably', `Playback of this file format is not supported: ${file.type}`)
  if (state.closed || state.epoch !== initialEpoch)
    return
  const url = URL.createObjectURL(file)
  state.sourceUrls.add(url)
  if (state.closed || state.epoch !== initialEpoch) {
    revoke(state.sourceUrls, url)
    return
  }
  const epoch = ++state.epoch
  const initialWait = !state.sourceUrl && !tool.file && state.job?.adopt(epoch)
  if (!initialWait)
    state.job?.cancel('source changed')
  state.loading = true
  const current = () => !state.closed && state.epoch === epoch
  const previousListeners = state.sourceListeners
  const listeners = []
  state.sourceListeners = listeners
  let pendingCleanup = () => {}
  let reported = false
  const error = () => {
    if (!current() || reported || (video.currentSrc && video.currentSrc !== url))
      return
    reported = true
    state.loading = false
    const failure = new Error(`Unable to load video: media error ${video.error?.code || 0}`)
    if (state.job)
      state.job.fail(failure)
    else
      tool.emit('error', failure.message)
  }
  const ready = () => {
    if (current() && (!video.currentSrc || video.currentSrc === url)) {
      state.loading = false
      state.job?.ready()
    }
  }
  try {
    cleanupAll(previousListeners.splice(0))
    if (!current()) {
      revoke(state.sourceUrls, url)
      return
    }
    for (const [name, callback] of [['error', error], ['loadedmetadata', ready]]) {
      pendingCleanup = () => video.removeEventListener(name, callback)
      listeners.push(pendingCleanup)
      video.addEventListener(name, callback)
      if (!current()) {
        cleanupAll([pendingCleanup, ...listeners.splice(0)])
        revoke(state.sourceUrls, url)
        return
      }
    }
    tool.videoUrl = url
    tool.file = file
    tool.emit('file', file)
    if (!current()) {
      revoke(state.sourceUrls, url)
      return
    }
    video.src = url
    if (!current()) {
      revoke(state.sourceUrls, url)
      return
    }
    state.sourceUrl = url
    for (const previous of [...state.sourceUrls]) {
      if (previous !== url)
        revoke(state.sourceUrls, previous)
    }
    if (current())
      tool.emit('video', video)
  }
  catch (error) {
    if (current()) {
      state.loading = false
      state.job?.cancel('source setup failed')
    }
    try {
      cleanupAll([pendingCleanup, ...listeners.splice(0)])
    }
    catch {}
    revoke(state.sourceUrls, url)
    throw error
  }
}

export function replaceThumbnail(tool, blob, live) {
  const state = stateFor(tool)
  const url = URL.createObjectURL(blob)
  state.thumbnailUrls.add(url)
  if (!live()) {
    revoke(state.thumbnailUrls, url)
    return null
  }
  const previous = new Set([...state.thumbnailUrls, tool.thumbnailUrl])
  state.thumbnailUrl = url
  tool.thumbnailUrl = url
  for (const old of previous) {
    if (old && old !== url)
      revoke(state.thumbnailUrls, old)
  }
  return live() ? url : null
}
