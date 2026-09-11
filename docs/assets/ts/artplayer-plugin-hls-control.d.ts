// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginHlsControlDefinitions {
  export interface QualityLevel {
    height: number
    name?: string
  }
  export interface AudioTrack {
    id: number
    name: string
    lang?: string
    language?: string
  }
  export interface Config<Item extends object = object> {
    control?: boolean
    setting?: boolean
    title?: string
    auto?: string
    /** Plain callback; current-label calls omit index. SDK objects retain their identity. */
    getName?: (item: Item, index?: number) => string
  }
  export interface Option<Level extends object = QualityLevel, Track extends object = AudioTrack> {
    quality?: Config<Level>
    audio?: Config<Track>
  }
  export interface Result {
    name: 'artplayerPluginHlsControl'
    update: () => void
  }
  export function artplayerPluginHlsControl<Level extends object = QualityLevel, Track extends object = AudioTrack>(option?: Option<Level, Track>): (art: Artplayer) => Result
  // Keep the required last signature for historical Parameters<typeof factory>[0] consumers.
  export function artplayerPluginHlsControl<Level extends object = QualityLevel, Track extends object = AudioTrack>(option: Option<Level, Track>): (art: Artplayer) => Result
}
declare const artplayerPluginHlsControl: typeof artplayerPluginHlsControlDefinitions.artplayerPluginHlsControl
declare namespace artplayerPluginHlsControl {
  export type QualityLevel = artplayerPluginHlsControlDefinitions.QualityLevel
  export type AudioTrack = artplayerPluginHlsControlDefinitions.AudioTrack
  export type Config<Item extends object = object> = artplayerPluginHlsControlDefinitions.Config<Item>
  export type Option<Level extends object = QualityLevel, Track extends object = AudioTrack> = artplayerPluginHlsControlDefinitions.Option<Level, Track>
  export type Result = artplayerPluginHlsControlDefinitions.Result
}
export = artplayerPluginHlsControl
export as namespace artplayerPluginHlsControl;
