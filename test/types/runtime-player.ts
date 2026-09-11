import type { CanvasMedia, MediaSurface, NativeMedia } from '../../packages/artplayer/public/runtime/media'
import type { Player } from '../../packages/artplayer/public/runtime/player'
import type { MediaSurface as SourceMedia } from '../../packages/artplayer/src/media/types'
import type { PlayerProperties } from '../../packages/artplayer/src/player/properties'

declare const actual: PlayerProperties
declare const media: SourceMedia
declare const native: Player<NativeMedia>
declare const canvas: Player<CanvasMedia>
const publicPlayer: Player = actual
const publicMedia: MediaSurface = media
const internalMedia: SourceMedia = publicMedia
const commands: undefined[] = [publicPlayer.seek, publicPlayer.forward, publicPlayer.backward, publicPlayer.switch, publicPlayer.quality]
const pip: Element | null | boolean = publicPlayer.pip
const url: string | null = publicPlayer.url
const nativePlay: Promise<void> = native.play()
const nativePause: void = native.pause()
const nativeToggle: void | Promise<void> = native.toggle()
const proxyPlay: Promise<unknown> = canvas.play()
publicPlayer.seek = '1.5'
publicPlayer.forward = 2
publicPlayer.quality = [{ html: document.createElement('span'), url: '/video.mp4' }]
publicPlayer.pip = true
// @ts-expect-error Commands do not have the historical fictitious numeric getters.
const position: number = publicPlayer.seek
// @ts-expect-error Accurate write types are not widened just to satisfy TS 4.3's accessor restriction.
publicPlayer.quality = undefined
// @ts-expect-error A native PiP element is a result, not a supported setter input.
publicPlayer.pip = document.createElement('video')
// @ts-expect-error The proxy play result cannot be assumed to be a native void result.
const proxyNative: Promise<void> = canvas.play()
type Assert<Condition extends true> = Condition
type Complete = Assert<Exclude<keyof PlayerProperties, keyof Player> extends never ? true : false>
type NoInventedProperties = Assert<Exclude<keyof Player, keyof PlayerProperties> extends never ? true : false>
export type { Complete, NoInventedProperties }
export { commands, internalMedia, nativePause, nativePlay, nativeToggle, pip, position, proxyNative, proxyPlay, url }
