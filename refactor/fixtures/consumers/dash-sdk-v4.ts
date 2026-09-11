import type Artplayer from 'artplayer'
import type { AudioTrack, Option, QualityLevel, Result } from 'artplayer-plugin-dash-control'
import type { BitrateInfo, MediaInfo, MediaPlayerClass } from 'dashjs'
import dash from 'artplayer-plugin-dash-control'

export type SDKInputs = [BitrateInfo, MediaInfo, MediaPlayerClass]
declare const sdk: MediaPlayerClass
export const levels = sdk.getBitrateInfoListFor('video')
export const tracks = sdk.getTracksFor('audio')

// Candidate plugin consumer.
declare const art: Artplayer
const option: Option<BitrateInfo, MediaInfo> = {
  quality: { getName: level => `${level.qualityIndex}:${level.height}` },
  audio: { getName: track => `${track.lang}:${track.index}` },
}
const result: Result = dash(option)(art)
const synchronous: void = result.update()
dash({ quality: { getName: (level: BitrateInfo) => String(level.bitrate) }, audio: { getName: (track: MediaInfo) => track.lang || String(track.id) } })
const defaultTrack: AudioTrack = tracks[0]!
const defaultLevel: QualityLevel = levels[0]!
const legacy: Parameters<typeof dash>[0]['quality'] = { getName: (level: object) => String(level) }
// @ts-expect-error SDK quality formatters must return strings.
dash<BitrateInfo, MediaInfo>({ quality: { getName: level => level.height } })
// @ts-expect-error Actual SDK fields must not become any.
dash<BitrateInfo, MediaInfo>({ audio: { getName: track => track.nonexistentArtplayerField } })
void [synchronous, legacy, defaultTrack, defaultLevel]
