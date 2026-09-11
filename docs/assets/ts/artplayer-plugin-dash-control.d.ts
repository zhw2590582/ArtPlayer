// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginDashControlDefinitions {
  export interface QualityLevel {
    height: number
    width?: number
    id?: string | number
    qualityIndex?: number
    bitrate?: number
    bitrateInKbit?: number
  }
  export interface AudioTrack {
    id?: string | number
    index?: number
    lang?: string
  }
  export interface Config<Item extends object = object> {
    control?: boolean
    setting?: boolean
    title?: string
    auto?: string
    /** Called without a receiver or index, with the original SDK object. */
    getName?: (item: Item) => string
  }
  export interface Option<Level extends object = QualityLevel, Track extends object = AudioTrack> {
    quality?: Config<Level>
    audio?: Config<Track>
  }
  export interface Result {
    name: 'artplayerPluginDashControl'
    update: () => void
  }
  export function artplayerPluginDashControl<Level extends object = QualityLevel, Track extends object = AudioTrack>(option?: Option<Level, Track>): (art: Artplayer) => Result
  // Preserve the required last signature for historical Parameters<typeof factory>[0] consumers.
  export function artplayerPluginDashControl<Level extends object = QualityLevel, Track extends object = AudioTrack>(option: Option<Level, Track>): (art: Artplayer) => Result
}
declare const artplayerPluginDashControl: typeof artplayerPluginDashControlDefinitions.artplayerPluginDashControl
declare namespace artplayerPluginDashControl {
  export type QualityLevel = artplayerPluginDashControlDefinitions.QualityLevel
  export type AudioTrack = artplayerPluginDashControlDefinitions.AudioTrack
  export type Config<Item extends object = object> = artplayerPluginDashControlDefinitions.Config<Item>
  export type Option<Level extends object = QualityLevel, Track extends object = AudioTrack> = artplayerPluginDashControlDefinitions.Option<Level, Track>
  export type Result = artplayerPluginDashControlDefinitions.Result
}
export = artplayerPluginDashControl
export as namespace artplayerPluginDashControl;
