import type { Input, InputAudioTrack, InputVideoTrack } from 'mediabunny'
import type { PlaybackMedia } from './media'
import { isHlsSource } from './input'

export async function resolveDuration({ input, videoTrack, audioTrack }: Pick<PlaybackMedia, 'input' | 'videoTrack' | 'audioTrack'>): Promise<number> {
  const tracks = [videoTrack, audioTrack].filter((track): track is InputVideoTrack | InputAudioTrack => track !== null)
  const referenceTrack = videoTrack || audioTrack
  const isLive = Boolean(referenceTrack && await referenceTrack.isLive())

  let duration: number | null = Number.NaN
  if (tracks.length > 0) {
    duration = await input.getDurationFromMetadata(tracks, { skipLiveWait: true })
    if (duration === null && !isLive)
      duration = await input.computeDuration(tracks, { skipLiveWait: true })
  }
  return isLive ? Number.POSITIVE_INFINITY : duration ?? Number.NaN
}

export async function selectPlaybackTracks(input: Input, src: unknown): Promise<PlaybackMedia> {
  const videoTrack = await input.getPrimaryVideoTrack()
  const audioTrack = videoTrack
    ? await videoTrack.getPrimaryPairableAudioTrack()
    : await input.getPrimaryAudioTrack()
  const duration = await resolveDuration({ input, videoTrack, audioTrack })
  const referenceTrack = videoTrack || audioTrack
  const isHls = isHlsSource(src)

  return {
    input,
    videoTrack,
    audioTrack,
    duration,
    isLive: Number.isFinite(duration) ? false : Boolean(referenceTrack && await referenceTrack.isLive()),
    isHls,
    videoMode: isHls ? 'auto' : 'manual',
    audioMode: isHls ? 'auto' : 'manual',
  }
}
