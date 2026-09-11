import type Artplayer from 'artplayer'
import type { AudioTrack, Option, QualityLevel, Result } from 'artplayer-plugin-dash-control'
import type { MediaInfo, MediaPlayerClass, Representation } from 'dashjs'
import dash from 'artplayer-plugin-dash-control'

export type SDKInputs = [Representation, MediaInfo, MediaPlayerClass]
declare const sdk: MediaPlayerClass
export const levels = sdk.getRepresentationsByType('video')
export const tracks = sdk.getTracksFor('audio')

// Candidate plugin consumer.
declare const art: Artplayer
const option: Option<Representation, MediaInfo> = {
  quality: { getName: level => `${level.id}:${level.height}` },
  audio: { getName: track => `${track.lang}:${track.index}` },
}
const result: Result = dash(option)(art)
const synchronous: void = result.update()
dash({ quality: { getName: (level: Representation) => String(level.bandwidth) }, audio: { getName: (track: MediaInfo) => track.lang || String(track.id) } })
const defaultTrack: AudioTrack = tracks[0]!
const defaultLevel: QualityLevel = levels[0]!
const legacy: Parameters<typeof dash>[0]['quality'] = { getName: (level: object) => String(level) }
// @ts-expect-error SDK quality formatters must return strings.
dash<Representation, MediaInfo>({ quality: { getName: level => level.height } })
// @ts-expect-error Actual SDK fields must not become any.
dash<Representation, MediaInfo>({ audio: { getName: track => track.nonexistentArtplayerField } })
void [synchronous, legacy, defaultTrack, defaultLevel]
