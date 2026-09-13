// Support both the core's ESM/default and CommonJS export= declarations.
type CoreModule = typeof import('artplayer')
type Artplayer = CoreModule extends { default: { prototype: infer Instance } }
  ? Instance
  : CoreModule extends { prototype: infer Instance } ? Instance : never

export interface Option {
  url?: string
  width?: number
  number?: number
  scale?: number
  /** Historical option; sheet height is derived from the video's aspect ratio. */
  height?: number
}

export interface Result {
  name: 'artplayerPluginAutoThumbnail'
}

/** Registration resolves before frame extraction and progressive sheet updates. */
export type Factory = (option: Option) => (art: Artplayer) => Promise<Result>
