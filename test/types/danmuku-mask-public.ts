import Artplayer from 'artplayer'
import mask from 'artplayer-plugin-danmuku-mask'
import legacy from 'artplayer-plugin-danmuku-mask/legacy'

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
interface Result { name: 'artplayerPluginDanmukuMask', start: () => Promise<void>, stop: () => void }
type Factory = (option?: Option) => (art: Artplayer) => Result
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type Arguments = Assert<Equal<Parameters<typeof mask>, [option?: Option]>>
type Registration = Assert<Equal<ReturnType<ReturnType<typeof mask>>, Result>>
const replacement: Factory = () => () => ({ name: 'artplayerPluginDanmukuMask', async start() {}, stop() {} })
const toOld: Factory = mask
const fromOld: typeof mask = replacement
const legacyReplacement: typeof legacy = replacement
const option: Option = { solutionPath: '/models', modelSelection: 0, smoothSegmentation: false, minDetectionConfidence: 0, minTrackingConfidence: 0, selfieMode: false, drawContour: false, foregroundThreshold: 0, opacity: 0, maskBlurAmount: 0 }
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [mask(), mask(option), legacy(undefined)] })
const result = mask(option)(art)
const name: 'artplayerPluginDanmukuMask' = result.name
const starting: Promise<void> = result.start()
const stopped: void = result.stop()
void [toOld, fromOld, legacyReplacement, name, starting, stopped]
export type { Arguments, Registration }
