interface Option {
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

interface Result {
  name: 'artplayerPluginAudioTrack'
  /**
   * The audio element
   */
  audio: HTMLAudioElement
}

declare const artplayerPluginAudioTrack: (option: Option) => (art: Artplayer) => Result

export default artplayerPluginAudioTrack

export = artplayerPluginAudioTrack
export as namespace artplayerPluginAudioTrack;
