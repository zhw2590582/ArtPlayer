// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginAutoThumbnailDefinitions {
  export interface Option {
    url?: string
    width?: number
    number?: number
    scale?: number
  }
  export interface Result {
    name: 'artplayerPluginAutoThumbnail'
  }
  export const artplayerPluginAutoThumbnail: (option: Option) => (art: Artplayer) => Result
}
declare const artplayerPluginAutoThumbnail: typeof artplayerPluginAutoThumbnailDefinitions.artplayerPluginAutoThumbnail
declare namespace artplayerPluginAutoThumbnail { }
export = artplayerPluginAutoThumbnail
export as namespace artplayerPluginAutoThumbnail;
