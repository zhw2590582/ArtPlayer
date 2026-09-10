import type { CanvasMedia, NativeMedia } from '../../packages/artplayer/src/media/types'
import type { SourceMedia, SwitchHost, UrlHost } from '../../packages/artplayer/src/source/types'
import switchMix from '../../packages/artplayer/src/player/switchMix'
import urlMix from '../../packages/artplayer/src/player/urlMix'

declare const native: NativeMedia
declare const canvas: CanvasMedia
const sourceMedia: SourceMedia[] = [native, canvas]
void sourceMedia

declare const switching: SwitchHost
switchMix(switching)
const pending: Promise<void> = switching.switchQuality('movie.mp4')
void pending
switching.switch = 'movie.mp4'
// @ts-expect-error Source URLs remain strings.
switching.switchUrl(42)
// @ts-expect-error Switching does not resolve with a media element or success boolean.
const wrong: Promise<boolean> = switching.switchUrl('movie.mp4')
void wrong

interface CustomHost extends UrlHost<CanvasMedia, CustomHost> {
  extension: number
}
declare const custom: CustomHost
custom.option.customType.canvas = function (video, url, art) {
  this satisfies CustomHost
  const owner: CustomHost = art
  const surface: HTMLCanvasElement = video
  const source: string = url
  void [owner, surface, source]
  // @ts-expect-error A canvas proxy is not a native video element.
  const wrongMedia: HTMLVideoElement = video
  void wrongMedia
}
urlMix<CanvasMedia, CustomHost>(custom)
