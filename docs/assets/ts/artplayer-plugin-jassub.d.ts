// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginJassubDefinitions {
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
  export interface Result {
    name: 'artplayerPluginJassub'
    instance: JassubInstance
  }
  export const artplayerPluginJassub: (option: JassubOption) => (art: Artplayer) => Result
}
declare const artplayerPluginJassub: typeof artplayerPluginJassubDefinitions.artplayerPluginJassub
declare namespace artplayerPluginJassub {
  export type JassubOption = artplayerPluginJassubDefinitions.JassubOption
  export type JassubInstance = artplayerPluginJassubDefinitions.JassubInstance
}
export = artplayerPluginJassub
export as namespace artplayerPluginJassub;
