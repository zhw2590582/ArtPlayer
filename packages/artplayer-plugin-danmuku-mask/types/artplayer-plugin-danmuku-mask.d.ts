import type Artplayer from 'artplayer'

export = artplayerPluginDanmukuMask
export as namespace artplayerPluginDanmukuMask;

interface Option {
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

interface Result {
  name: 'artplayerPluginDanmukuMask'
  start: () => Promise<void>
  stop: () => void
}

declare const artplayerPluginDanmukuMask: (option?: Option) => (art: Artplayer) => Result
