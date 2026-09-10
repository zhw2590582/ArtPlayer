import type { LayoutHost, PauseHost, PlayHost } from '../../packages/artplayer/src/media/hosts'
import type { CanvasMedia, MediaSurface, NativeMedia } from '../../packages/artplayer/src/media/types'
import durationMix from '../../packages/artplayer/src/player/durationMix'
import pauseMix from '../../packages/artplayer/src/player/pauseMix'
import playingMix from '../../packages/artplayer/src/player/playingMix'
import playMix from '../../packages/artplayer/src/player/playMix'
import rectMix from '../../packages/artplayer/src/player/rectMix'

const native: NativeMedia = document.createElement('video')
const canvas: CanvasMedia = Object.assign(document.createElement('canvas'), {
  src: null,
  currentSrc: null,
  currentTime: 0,
  duration: 10,
  paused: true,
  ended: false,
  readyState: 0,
  videoWidth: 320,
  videoHeight: 180,
  buffered: { length: 0, start: (_index: number) => 0, end: (_index: number) => 0 },
  volume: 1,
  muted: false,
  playbackRate: 1,
  play: () => 'sync-result',
  pause: () => 42,
  load: () => {},
})
function useSurface(media: MediaSurface) {
  // @ts-expect-error Proxy capability is optional, including on older native browsers.
  media.requestPictureInPicture()
  media.requestPictureInPicture?.()
  void media.textTracks?.[0]?.activeCues
  // @ts-expect-error A media surface cannot be passed off as a complete native video.
  const video: HTMLVideoElement = media
  void video
}
useSurface(native)
useSurface(canvas)
// @ts-expect-error A raw canvas lacks the proxy's media implementation.
const incomplete: MediaSurface = document.createElement('canvas')
void incomplete

const shared = { i18n: { get: (key: string) => key }, notice: { show: '' }, emit: (_name: 'play' | 'pause') => {} }
const playHost: PlayHost<{ play: () => string }> = { ...shared, template: { $video: { play: () => 'sync-result' } }, option: { mutex: false }, constructor: { instances: [] } }
playMix(playHost)
const result: Promise<string> = playHost.play()
const pauseHost: PauseHost<{ pause: () => number }> = { ...shared, template: { $video: { pause: () => 42 } } }
pauseMix(pauseHost)
const paused: number = pauseHost.pause()
// @ts-expect-error Pausing is not forced to return a Promise.
const wrong: Promise<void> = pauseHost.pause()
void [result, paused, wrong]

const mediaHost = { template: { $video: canvas } }
playingMix(mediaHost)
durationMix(mediaHost)
const state: boolean = mediaHost.playing
const duration: number = mediaHost.duration
const layout: LayoutHost = { template: { $player: document.createElement('div') } }
rectMix(layout)
const width: number = layout.width
// @ts-expect-error Read-only getter properties cannot be assigned.
layout.width = 2
void [state, duration, width]
