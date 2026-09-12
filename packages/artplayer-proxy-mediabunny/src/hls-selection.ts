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

export async function selectQuality(host: SelectionHost, value: unknown): Promise<void> {
  const { input, media, loadSeq } = host
  if (!media?.isHls || !input || host.destroyed)
    return
  const current = () => !host.destroyed && host.loadSeq === loadSeq && host.input === input && host.media === media
  let selection: SelectedTracks
  try {
    const tracks = await input.getVideoTracks()
    if (!current())
      return
    const videoTrack = value === 'auto' ? await input.getPrimaryVideoTrack() : tracks.find(track => track.id === value) ?? media.videoTrack
    if (!current() || !videoTrack)
      return
    let audioTrack = media.audioTrack
    let audioMode = media.audioMode
    if (!audioTrack || !videoTrack.canBePairedWith(audioTrack)) {
      audioTrack = await videoTrack.getPrimaryPairableAudioTrack()
      audioMode = 'auto'
    }
    selection = { videoTrack, audioTrack, videoMode: value === 'auto' ? 'auto' : 'manual', audioMode }
  }
  catch (error) {
    if (!current())
      return
    throw error
  }
  if (current())
    await host.replaceTracks(selection)
}

export async function selectAudio(host: SelectionHost, value: unknown): Promise<void> {
  const { input, media, loadSeq } = host
  if (!media?.isHls || !input || host.destroyed)
    return
  const current = () => !host.destroyed && host.loadSeq === loadSeq && host.input === input && host.media === media
  let selection: SelectedTracks
  try {
    const tracks = await input.getAudioTracks()
    if (!current())
      return
    const audioTrack = value === 'auto'
      ? media.videoTrack ? await media.videoTrack.getPrimaryPairableAudioTrack() : await input.getPrimaryAudioTrack()
      : tracks.find(track => track.id === value) ?? media.audioTrack
    if (!current() || !audioTrack)
      return
    let videoTrack = media.videoTrack
    let videoMode = media.videoMode
    if (!videoTrack || !audioTrack.canBePairedWith(videoTrack)) {
      videoTrack = await audioTrack.getPrimaryPairableVideoTrack()
      videoMode = 'auto'
    }
    selection = { videoTrack, audioTrack, videoMode, audioMode: value === 'auto' ? 'auto' : 'manual' }
  }
  catch (error) {
    if (!current())
      return
    throw error
  }
  if (current())
    await host.replaceTracks(selection)
}
