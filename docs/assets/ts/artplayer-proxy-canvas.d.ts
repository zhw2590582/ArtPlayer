// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerProxyCanvas {
  /** Runs after drawing and bitmap release, before the draw event. */
  type Option = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => void
  /** Preserve the exact published return type and its assignability. */
  type Result = HTMLCanvasElement
  /** Opt-in view of supported enumerable media members; native Canvas members win. */
  type MediaCanvas = HTMLCanvasElement & Pick<HTMLVideoElement, Exclude<keyof HTMLVideoElement, keyof HTMLCanvasElement>>
  interface Callable {
    /** Keep Parameters extraction optional, as published in 1.1.0. */
    (option?: Option): (art: Artplayer) => Result
  }
  interface Factory extends Callable {
    /** Same factory, for historical require(package).default calls. */
    readonly default: Factory
  }
}
declare const artplayerProxyCanvas: artplayerProxyCanvas.Factory
export = artplayerProxyCanvas
export as namespace artplayerProxyCanvas;
