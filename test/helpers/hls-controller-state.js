// Self-contained so the fixed-SDK diagnostic can install this function in a page.
// These private fields are evidence only, never dependencies of a player plugin.
export function snapshotHlsControllers(hls) {
  const ranges = source => source && Array.from({ length: source.length }, (_, index) => [source.start(index), source.end(index)])
  const fragment = value => value && ({ sn: value.sn, level: value.level, type: value.type, start: value.start, duration: value.duration })
  const controller = value => value && ({
    state: value.state,
    level: value.level,
    nextLoadPosition: value.nextLoadPosition,
    altAudio: value.altAudio,
    mediaBuffer: value.mediaBuffer === value.videoBuffer && value.videoBuffer ? 'video' : value.mediaBuffer === value.media && value.media ? 'media' : 'other',
    buffered: ranges(value.mediaBuffer?.buffered),
    current: fragment(value.fragCurrent),
    previous: fragment(value.fragPrevious),
  })
  try {
    const audio = hls?.audioStreamController || hls?.networkControllers?.find(value => value.playlistType === 'audio')
    const tracker = hls?.streamController?.fragmentTracker || audio?.fragmentTracker
    const bufferController = hls?.bufferController
    const buffers = Array.isArray(bufferController?.sourceBuffers)
      ? bufferController.sourceBuffers
      : bufferController?.sourceBuffer && Object.entries(bufferController.sourceBuffer)
    return {
      main: controller(hls?.streamController),
      audio: controller(audio),
      mediaSourceState: hls?.bufferController?.mediaSource?.readyState,
      buffers: buffers?.map(([type, source]) => ({ type, updating: source?.updating, buffered: ranges(source?.buffered) })),
      endList: tracker && Object.fromEntries(Object.entries(tracker.endListFragments || {}).map(([type, entity]) => [type, { fragment: fragment(entity.body), buffered: !!entity.buffered, loaded: !!entity.loaded }])),
      tracked: tracker && Object.entries(tracker.fragments || {}).map(([key, entity]) => ({ key, buffered: !!entity?.buffered, loaded: !!entity?.loaded })),
    }
  }
  catch (error) {
    return { diagnosticError: String(error) }
  }
}
