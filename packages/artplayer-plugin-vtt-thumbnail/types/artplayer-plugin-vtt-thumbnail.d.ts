import type Artplayer from 'artplayer'

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
declare function artplayerPluginVttThumbnail(option: Option): (art: Artplayer) => Result
export default artplayerPluginVttThumbnail
