import {
  ALL_FORMATS,
  BlobSource,
  HLS_FORMATS,
  Input,
  ReadableStreamSource,
  UrlSource,
} from 'mediabunny'

const M3U8_RE = /\.m3u8(?:$|[?#])/i

export function isHlsSource(src) {
  return typeof src === 'string' && M3U8_RE.test(src)
}

export function normalizeSource(src) {
  if (typeof src === 'string')
    return new UrlSource(src)
  if (src instanceof Blob)
    return new BlobSource(src)
  if (typeof ReadableStream !== 'undefined' && src instanceof ReadableStream) {
    return new ReadableStreamSource(src)
  }
  return src ?? null
}

export function createInput(src) {
  const source = normalizeSource(src)
  if (!source)
    return null

  return new Input({
    source,
    formats: isHlsSource(src) ? HLS_FORMATS : ALL_FORMATS,
  })
}

export async function resolveDuration({ input, videoTrack, audioTrack }) {
  const tracks = [videoTrack, audioTrack].filter(Boolean)
  const referenceTrack = videoTrack || audioTrack
  const isLive = Boolean(referenceTrack && await referenceTrack.isLive())

  let duration = Number.NaN
  if (tracks.length > 0) {
    duration = await input.getDurationFromMetadata(tracks, { skipLiveWait: true })
    if (duration === null && !isLive) {
      duration = await input.computeDuration(tracks, { skipLiveWait: true })
    }
  }

  return isLive ? Number.POSITIVE_INFINITY : duration ?? Number.NaN
}

export async function selectPlaybackTracks(input, src) {
  const videoTrack = await input.getPrimaryVideoTrack()
  const audioTrack = videoTrack
    ? await videoTrack.getPrimaryPairableAudioTrack()
    : await input.getPrimaryAudioTrack()
  const duration = await resolveDuration({ input, videoTrack, audioTrack })

  return {
    input,
    videoTrack,
    audioTrack,
    duration,
    isLive: Number.isFinite(duration) ? false : Boolean((videoTrack || audioTrack) && await (videoTrack || audioTrack).isLive()),
    isHls: isHlsSource(src),
    videoMode: isHlsSource(src) ? 'auto' : 'manual',
    audioMode: isHlsSource(src) ? 'auto' : 'manual',
  }
}

async function getTrackBitrate(track) {
  return await track.getAverageBitrate() ?? await track.getBitrate() ?? 0
}

export async function getHlsState(media) {
  if (!media?.isHls || !media.input)
    return null

  const [videoTracks, pairableAudioTracks] = await Promise.all([
    media.input.getVideoTracks(),
    media.videoTrack
      ? media.videoTrack.getPairableAudioTracks()
      : [],
  ])

  const [levels, audios] = await Promise.all([
    Promise.all(videoTracks.map(async (track, index) => ({
      id: track.id,
      track,
      index,
      name: await track.getName(),
      height: await track.getDisplayHeight(),
      bitrate: await getTrackBitrate(track),
    }))),
    Promise.all(pairableAudioTracks.map(async (track, index) => {
      const name = await track.getName()
      const language = await track.getLanguageCode()
      return {
        id: track.id,
        track,
        index,
        name,
        lang: language,
        language,
        bitrate: await getTrackBitrate(track),
      }
    })),
  ])

  return {
    levels,
    audios,
    currentLevel: media.videoTrack ? levels.find(item => item.id === media.videoTrack.id) ?? null : null,
    currentAudio: media.audioTrack ? audios.find(item => item.id === media.audioTrack.id) ?? null : null,
    videoMode: media.videoMode ?? 'auto',
    audioMode: media.audioMode ?? 'auto',
  }
}
