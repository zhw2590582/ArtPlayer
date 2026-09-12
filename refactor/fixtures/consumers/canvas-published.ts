import Artplayer from 'artplayer'
import canvas from 'artplayer-proxy-canvas'

const callback = (context: CanvasRenderingContext2D, video: HTMLVideoElement) => context.drawImage(video, 0, 0)
const art = new Artplayer({ container: '#player', url: 'video.mp4', proxy: canvas(callback) })
const result = canvas(callback)(art)
const actual: HTMLCanvasElement = result
const context: CanvasRenderingContext2D | null = result.getContext('2d')
const accepted: Parameters<typeof canvas>[0] = callback
const originalResult: ReturnType<ReturnType<typeof canvas>> = document.createElement('canvas')
void [actual, context, accepted, originalResult]
