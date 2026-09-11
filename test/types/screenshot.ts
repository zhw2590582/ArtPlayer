import type { CaptureMedia } from '../../packages/artplayer/src/capture/frame'
import type { ScreenshotHost } from '../../packages/artplayer/src/player/screenshotMix'
import type Artplayer from '../../packages/artplayer/types/artplayer'
import screenshotMix from '../../packages/artplayer/src/player/screenshotMix'

declare const art: Artplayer
declare const host: ScreenshotHost
declare const video: HTMLVideoElement
const media: CaptureMedia = video
const data: Promise<string> = art.getDataURL()
const blob: Promise<string> = art.getBlobUrl()
const screenshot: Promise<string> = art.screenshot('frame')
const installed: void = screenshotMix(host)
// @ts-expect-error Screenshot names remain strings.
art.screenshot(123)
// @ts-expect-error Captures return promises, not synchronous data URLs.
const sync: string = art.getDataURL()
export { blob, data, installed, media, screenshot, sync }
