import type { Input } from 'mediabunny'
import type { PlaybackMedia } from './media'

export type SelectedTracks = Pick<PlaybackMedia, 'videoTrack' | 'audioTrack' | 'videoMode' | 'audioMode'>
interface SelectionHost {
  input: Input | null
  media: PlaybackMedia | null
  destroyed: boolean
  loadSeq: number
  replaceTracks: (tracks: SelectedTracks) => Promise<void>
}
type ResolveTracks = (input: Input, media: PlaybackMedia, value: unknown, current: () => boolean) => Promise<SelectedTracks | null>

const requests = new WeakMap<SelectionHost, object>()
async function select(host: SelectionHost, value: unknown, resolve: ResolveTracks): Promise<void> {
  const { input, loadSeq } = host
  if (!host.media?.isHls || !input || host.destroyed)
    return
  const token = {}
  requests.set(host, token)
  const current = () => !host.destroyed && host.loadSeq === loadSeq && host.input === input && requests.get(host) === token
  while (current()) {
    const media: PlaybackMedia | null = host.media
    if (!media?.isHls)
      return
    let selection: SelectedTracks | null
    try {
      selection = await resolve(input, media, value, current)
    }
    catch (error) {
      if (!current())
        return
      if (host.media === media)
        throw error
      continue
    }
    if (!current())
      return
    if (host.media !== media)
      continue
    if (selection) {
      try {
        await host.replaceTracks(selection)
      }
      catch (error) {
        if (current())
          throw error
      }
    }
    return
  }
}

async function quality(input: Input, media: PlaybackMedia, value: unknown, current: () => boolean): Promise<SelectedTracks | null> {
  const tracks = await input.getVideoTracks()
  if (!current())
    return null
  const videoTrack = value === 'auto' ? await input.getPrimaryVideoTrack() : tracks.find(track => track.id === value) ?? media.videoTrack
  if (!current() || !videoTrack)
    return null
  let audioTrack = media.audioTrack
  let audioMode = media.audioMode
  if (!audioTrack || !videoTrack.canBePairedWith(audioTrack)) {
    audioTrack = await videoTrack.getPrimaryPairableAudioTrack()
    audioMode = 'auto'
  }
  return { videoTrack, audioTrack, videoMode: value === 'auto' ? 'auto' : 'manual', audioMode }
}

async function audio(input: Input, media: PlaybackMedia, value: unknown, current: () => boolean): Promise<SelectedTracks | null> {
  const tracks = await input.getAudioTracks()
  if (!current())
    return null
  const audioTrack = value === 'auto'
    ? media.videoTrack ? await media.videoTrack.getPrimaryPairableAudioTrack() : await input.getPrimaryAudioTrack()
    : tracks.find(track => track.id === value) ?? media.audioTrack
  if (!current() || !audioTrack)
    return null
  let videoTrack = media.videoTrack
  let videoMode = media.videoMode
  if (!videoTrack || !audioTrack.canBePairedWith(videoTrack)) {
    videoTrack = await audioTrack.getPrimaryPairableVideoTrack()
    videoMode = 'auto'
  }
  return { videoTrack, audioTrack, videoMode, audioMode: value === 'auto' ? 'auto' : 'manual' }
}

export function selectQuality(host: SelectionHost, value: unknown): Promise<void> {
  return select(host, value, quality)
}

export function selectAudio(host: SelectionHost, value: unknown): Promise<void> {
  return select(host, value, audio)
}
