// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginAudioTrackDefinitions {
  export interface Option {
    /**
     * Audio track URL
     */
    url: string
    /**
     * Time offset in seconds between video and audio
     * Positive value means audio plays ahead of video
     * Negative value means audio plays behind video
     * @default 0
     */
    offset?: number
    /**
     * Synchronization threshold in seconds
     * @default 0.3
     */
    sync?: number
  }
  export type UpdateOption = Partial<Option>
  export interface Result {
    name: 'artplayerPluginAudioTrack'
    /**
     * The audio element
     */
    audio: HTMLAudioElement
    /**
     * Historical update signature. Runtime also accepts partial options.
     * Import the /runtime entry for the precise partial-update signature.
     */
    update: (option: Option) => void
  }
  export interface RuntimeResult extends Result {
    /** Update selected fields without replacing the audio element. */
    update: (option: UpdateOption) => void
  }
  /** Precise typing for the same runtime factory, without changing legacy inference. */
  export type RuntimeFactory = (option: Option) => (art: Artplayer) => RuntimeResult
  export function artplayerPluginAudioTrack(option: Option): (art: Artplayer) => Result
}
declare const artplayerPluginAudioTrack: typeof artplayerPluginAudioTrackDefinitions.artplayerPluginAudioTrack
declare namespace artplayerPluginAudioTrack {
  export type Option = artplayerPluginAudioTrackDefinitions.Option
  export type UpdateOption = artplayerPluginAudioTrackDefinitions.UpdateOption
  export type Result = artplayerPluginAudioTrackDefinitions.Result
  export type RuntimeResult = artplayerPluginAudioTrackDefinitions.RuntimeResult
  export type RuntimeFactory = artplayerPluginAudioTrackDefinitions.RuntimeFactory
}
export = artplayerPluginAudioTrack
export as namespace artplayerPluginAudioTrack;
