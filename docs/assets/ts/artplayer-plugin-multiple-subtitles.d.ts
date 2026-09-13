// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginMultipleSubtitlesDefinitions {
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
  export function artplayerPluginMultipleSubtitles(option: Option): (art: Artplayer) => LegacyResult
}
declare const artplayerPluginMultipleSubtitles: typeof artplayerPluginMultipleSubtitlesDefinitions.artplayerPluginMultipleSubtitles
declare namespace artplayerPluginMultipleSubtitles {
  export type TrackOption = artplayerPluginMultipleSubtitlesDefinitions.TrackOption
  export type Option = artplayerPluginMultipleSubtitlesDefinitions.Option
  export type RuntimeOption = artplayerPluginMultipleSubtitlesDefinitions.RuntimeOption
  export type LegacyResult = artplayerPluginMultipleSubtitlesDefinitions.LegacyResult
  export type Result = artplayerPluginMultipleSubtitlesDefinitions.Result
  export type Factory = artplayerPluginMultipleSubtitlesDefinitions.Factory
  export type RuntimeFactory = artplayerPluginMultipleSubtitlesDefinitions.RuntimeFactory
}
export = artplayerPluginMultipleSubtitles
export as namespace artplayerPluginMultipleSubtitles;
