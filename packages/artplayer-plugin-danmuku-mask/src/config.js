export default function maskConfig(option) {
  return {
    solutionPath: option.solutionPath || 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
    modelSelection: option.modelSelection || 1,
    smoothSegmentation: option.smoothSegmentation !== undefined ? option.smoothSegmentation : true,
    minDetectionConfidence: option.minDetectionConfidence || 0.5,
    minTrackingConfidence: option.minTrackingConfidence || 0.5,
    selfieMode: option.selfieMode || false,
    drawContour: option.drawContour || false,
    foregroundThreshold: option.foregroundThreshold || 0.5,
    opacity: option.opacity || 1,
    maskBlurAmount: option.maskBlurAmount || 3,
  }
}
