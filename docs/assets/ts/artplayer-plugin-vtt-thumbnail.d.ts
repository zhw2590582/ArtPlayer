// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginVttThumbnailDefinitions {
  export interface Option {
    vtt?: string
    style?: Partial<CSSStyleDeclaration>
  }
  export interface Result {
    name: 'artplayerPluginVttThumbnail'
  }
  /** Historical factory type. Actual registration is asynchronous. */
  export type Factory = (option: Option) => (art: Artplayer) => Result
  /** Accurate runtime view available without casts through the /runtime entry. */
  export interface RuntimeFactory {
    (option: Option): (art: Artplayer) => Promise<Result>
    default: RuntimeFactory
  }
  /** Preserve historical extraction and replacement-function compatibility. */
  export function artplayerPluginVttThumbnail(option: Option): (art: Artplayer) => Result
}
declare const artplayerPluginVttThumbnail: typeof artplayerPluginVttThumbnailDefinitions.artplayerPluginVttThumbnail
declare namespace artplayerPluginVttThumbnail {
  export type Option = artplayerPluginVttThumbnailDefinitions.Option
  export type Result = artplayerPluginVttThumbnailDefinitions.Result
  export type Factory = artplayerPluginVttThumbnailDefinitions.Factory
  export type RuntimeFactory = artplayerPluginVttThumbnailDefinitions.RuntimeFactory
}
export = artplayerPluginVttThumbnail
export as namespace artplayerPluginVttThumbnail;
