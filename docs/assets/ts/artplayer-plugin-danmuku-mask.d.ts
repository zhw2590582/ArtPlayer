// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginDanmukuMaskDefinitions {
  export interface Option {
    solutionPath?: string
    modelSelection?: number
    smoothSegmentation?: boolean
    minDetectionConfidence?: number
    minTrackingConfidence?: number
    selfieMode?: boolean
    drawContour?: boolean
    foregroundThreshold?: number
    opacity?: number
    maskBlurAmount?: number
  }
  export interface Result {
    name: 'artplayerPluginDanmukuMask'
    start: () => Promise<void>
    stop: () => void
  }
  export const artplayerPluginDanmukuMask: (option?: Option) => (art: Artplayer) => Result
}
declare const artplayerPluginDanmukuMask: typeof artplayerPluginDanmukuMaskDefinitions.artplayerPluginDanmukuMask
declare namespace artplayerPluginDanmukuMask { }
export = artplayerPluginDanmukuMask
export as namespace artplayerPluginDanmukuMask;
