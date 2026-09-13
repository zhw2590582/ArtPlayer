import type { BodySegmenter } from '@tensorflow-models/body-segmentation'
import type { Active, MaskConfig, SegmenterConfig } from './types'
import * as bodySegmentation from '@tensorflow-models/body-segmentation'
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-cpu'

export async function loadSegmenter(config: MaskConfig, active: Active): Promise<BodySegmenter | null> {
  try {
    await tf.setBackend('webgl')
  }
  catch (error) {
    if (!active())
      return null
    // Keep the historical message property read, including non-Error rejection behavior.
    console.warn('WebGL backend not available, falling back to CPU', (error as { message: unknown }).message)
    await tf.setBackend('cpu')
  }
  if (!active())
    return null
  try {
    // Validate the full legacy object without dropping keys absent from the SDK config union.
    return await bodySegmentation.createSegmenter(bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation, {
      runtime: 'mediapipe',
      modelType: 'general',
      solutionPath: config.solutionPath,
      modelSelection: config.modelSelection,
      smoothSegmentation: config.smoothSegmentation,
      minDetectionConfidence: config.minDetectionConfidence,
      minTrackingConfidence: config.minTrackingConfidence,
      selfieMode: config.selfieMode,
    } satisfies SegmenterConfig as SegmenterConfig)
  }
  catch (error) {
    if (active())
      console.error('Error initializing segmenter:', error)
    return null
  }
}

export async function releaseSegmenter(segmenter: BodySegmenter): Promise<void> {
  try {
    await segmenter.dispose()
  }
  catch (error) {
    console.warn('Failed to dispose danmuku mask segmenter:', error)
  }
}

export const toBinaryMask = (...args: Parameters<typeof bodySegmentation.toBinaryMask>) => bodySegmentation.toBinaryMask(...args)
export const drawMask = (...args: Parameters<typeof bodySegmentation.drawMask>) => bodySegmentation.drawMask(...args)
