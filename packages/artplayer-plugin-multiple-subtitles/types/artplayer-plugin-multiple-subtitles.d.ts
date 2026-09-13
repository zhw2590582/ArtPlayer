import type Artplayer from 'artplayer'

export interface TrackOption {
  url?: string
  name?: string
  type?: 'vtt' | 'srt' | 'ass'
  encoding?: string
  onParser?: (...args: object[]) => object
}

export interface Option {
  subtitles: TrackOption[]
}

export interface RuntimeOption {
  subtitles?: TrackOption[]
}

export interface LegacyResult {
  name: 'multipleSubtitles'
}

export interface Result extends LegacyResult {
  tracks: (names?: string[]) => void
  reset: () => void
}

/** Historical synchronous extraction; actual registration is asynchronous. */
export type Factory = (option: Option) => (art: Artplayer) => LegacyResult

/** Accurate runtime view available through the /runtime entry. */
export interface RuntimeFactory {
  (option: RuntimeOption): (art: Artplayer) => Promise<Result>
  default: RuntimeFactory
}

/** Preserve existing parameter extraction and replacement-function compatibility. */
declare function artplayerPluginMultipleSubtitles(option: Option): (art: Artplayer) => LegacyResult

export default artplayerPluginMultipleSubtitles
