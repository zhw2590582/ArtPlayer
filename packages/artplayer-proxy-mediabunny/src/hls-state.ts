import type { InputTrack } from 'mediabunny'
import type { PlaybackMedia } from './media'

async function getTrackBitrate(track: InputTrack): Promise<number> {
  return await track.getAverageBitrate() ?? await track.getBitrate() ?? 0
}

export async function getHlsState(media: PlaybackMedia | null) {
  if (!media?.isHls || !media.input)
    return null

  const [videoTracks, pairableAudioTracks] = await Promise.all([
    media.input.getVideoTracks(),
    media.videoTrack ? media.videoTrack.getPairableAudioTracks() : [],
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
    currentLevel: media.videoTrack ? levels.find(item => item.id === media.videoTrack?.id) ?? null : null,
    currentAudio: media.audioTrack ? audios.find(item => item.id === media.audioTrack?.id) ?? null : null,
    videoMode: media.videoMode ?? 'auto',
    audioMode: media.audioMode ?? 'auto',
  }
}
