export interface JassubOption {
  workerUrl: string
  wasmUrl: string
  modernWasmUrl: string
  subUrl?: string
  subContent?: string
  timeOffset?: number
  debug?: boolean
  prescaleFactor?: number
  prescaleHeightLimit?: number
  maxRenderHeight?: number
  fonts?: string[] | Uint8Array[]
  availableFonts?: Record<string, Uint8Array | string>
  fallbackFont?: string
  useLocalFonts?: boolean
  libassMemoryLimit?: number
  libassGlyphLimit?: number
  [key: string]: any
}

export interface JassubInstance {
  resize: (force?: boolean, width?: number, height?: number, top?: number, left?: number) => Promise<void>
  setVideo: (video: HTMLVideoElement) => Promise<void>
  destroy: () => Promise<void>
  [key: string]: any
}

interface Result {
  name: 'artplayerPluginJassub'
  instance: JassubInstance
}

declare const artplayerPluginJassub: (option: JassubOption) => (art: Artplayer) => Result

export default artplayerPluginJassub

export = packages\artplayerPluginJassub\types\artplayerPluginJassub;
export as namespace packages\artplayerPluginJassub\types\artplayerPluginJassub;