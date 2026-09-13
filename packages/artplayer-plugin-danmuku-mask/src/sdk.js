import * as bodySegmentation from '@tensorflow-models/body-segmentation'
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-cpu'

export async function loadSegmenter(config, active) {
  try {
    await tf.setBackend('webgl')
  }
  catch (error) {
    if (!active())
      return null
    console.warn('WebGL backend not available, falling back to CPU', error.message)
    await tf.setBackend('cpu')
  }
  if (!active())
    return null
  try {
    return await bodySegmentation.createSegmenter(bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation, {
      runtime: 'mediapipe',
      modelType: 'general',
      solutionPath: config.solutionPath,
      modelSelection: config.modelSelection,
      smoothSegmentation: config.smoothSegmentation,
      minDetectionConfidence: config.minDetectionConfidence,
      minTrackingConfidence: config.minTrackingConfidence,
      selfieMode: config.selfieMode,
    })
  }
  catch (error) {
    if (active())
      console.error('Error initializing segmenter:', error)
    return null
  }
}

export async function releaseSegmenter(segmenter) {
  try {
    await segmenter.dispose()
  }
  catch (error) {
    console.warn('Failed to dispose danmuku mask segmenter:', error)
  }
}

export const toBinaryMask = (...args) => bodySegmentation.toBinaryMask(...args)
export const drawMask = (...args) => bodySegmentation.drawMask(...args)
