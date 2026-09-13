import maskConfig from './config'
import MaskController from './controller'

export default function artplayerPluginDanmukuMask(option = {}) {
  return (art) => {
    const { template: { $video, $danmuku } } = art
    const controller = new MaskController(art, maskConfig(option), { $video, $danmuku })
    async function startSegmentation() {
      await controller.start()
    }
    function stopSegmentation() {
      controller.stop()
    }
    return {
      name: 'artplayerPluginDanmukuMask',
      start: startSegmentation,
      stop: stopSegmentation,
    }
  }
}
