import type Artplayer from 'artplayer'

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

declare function artplayerPluginAudioTrack(option: Option): (art: Artplayer) => Result

export default artplayerPluginAudioTrack
