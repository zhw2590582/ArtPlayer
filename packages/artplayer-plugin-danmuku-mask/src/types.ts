import type { BodySegmenter, MediaPipeSelfieSegmentationMediaPipeModelConfig } from '@tensorflow-models/body-segmentation'

// Owned implementation contracts; the historical public entrypoint is maintained separately.
export interface MaskOptions {
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

export type MaskConfig = Required<MaskOptions>
export type Active = () => boolean

// These legacy extra keys are passed through even where the current adapter ignores them.
export type SegmenterConfig = MediaPipeSelfieSegmentationMediaPipeModelConfig & Pick<MaskConfig, 'modelSelection' | 'smoothSegmentation' | 'minDetectionConfidence' | 'minTrackingConfidence' | 'selfieMode'>

export interface MaskNodes {
  $video: HTMLVideoElement
  $danmuku: HTMLElement
}

export interface MaskHost {
  isDestroy: boolean
  template: MaskNodes
  on: (event: 'ready' | 'destroy', callback: () => void) => unknown
  off: (event: 'ready' | 'destroy', callback: () => void) => unknown
}

export interface MaskOutput {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

export interface MaskRun {
  running: boolean
  initializing: boolean
  busy: boolean
  frame: number | null
  segmenter: BodySegmenter | null
  output: MaskOutput | null
  cancel: () => void
  started: Promise<void> | null
  releasing?: Promise<void>
}
