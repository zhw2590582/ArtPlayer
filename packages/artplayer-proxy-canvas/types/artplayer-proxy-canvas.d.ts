import type Artplayer from 'artplayer'

/** Runs after drawing and bitmap release, before the draw event. */
export type Option = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => void

/** Preserve the exact published 1.1.0 return type and its assignability. */
export type Result = HTMLCanvasElement

export type Factory = (option?: Option) => (art: Artplayer) => Result
export type Callable = Factory

/** Explicit view of forwarded media members; native Canvas members win. */
export type MediaCanvas = HTMLCanvasElement & Pick<HTMLVideoElement, Exclude<keyof HTMLVideoElement, keyof HTMLCanvasElement>>

/** Opt-in runtime identity; the historical root factory has no required properties. */
export interface RuntimeFactory extends Factory {
  readonly default: RuntimeFactory
}

declare const artplayerProxyCanvas: (option?: Option) => (art: Artplayer) => Result

export default artplayerProxyCanvas
