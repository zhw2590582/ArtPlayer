// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginAds {
  interface Translations {
    close: string
    countdown: string
    detail: string
    canBeClosed: string
  }
  /** Implemented options. Video takes precedence over HTML. */
  interface Option {
    html?: string
    video?: string
    url?: string
    /** Seconds before the close button becomes available. @default 5 */
    playDuration?: number
    /** Total advertisement duration in seconds. @default 10 */
    totalDuration?: number
    /** Initial ad-video mute state. @default false */
    muted?: boolean
    /** All four fields replace the default translation object together. */
    i18n?: Translations
  }
  /** Historical published declaration. String durations still fail runtime validation. */
  interface LegacyOption extends Omit<Option, 'totalDuration'> {
    /** @deprecated Incorrect in the old declaration; use a numeric duration. */
    totalDuration?: string
  }
  /** Historical unpublished workspace declaration; these fields are not runtime aliases. */
  interface WorkspaceOption extends Option {
    /** @deprecated Ignored by the runtime. Use html or video instead. */
    source: string
    /** @deprecated Ignored by the runtime. Images are supplied through html. */
    type: 'video' | 'image' | 'html'
  }
  /** Input acceptance for both historical declaration families. */
  interface CompatOption extends Omit<Option, 'totalDuration'> {
    /** @deprecated The string branch exists for old types only and is rejected at runtime. */
    totalDuration?: number | string
    /** @deprecated Ignored by the runtime. Use html or video instead. */
    source?: string
    /** @deprecated Ignored by the runtime. Images are supplied through html. */
    type?: 'video' | 'image' | 'html'
  }
  interface Result {
    name: 'artplayerPluginAds'
    /** Complete once; before initialization this cancels the pending preroll. */
    skip: () => void
    /** Pause only the countdown, leaving ad video playback unchanged. */
    pause: () => void
    /** Resume only the countdown without adding extra timers. */
    play: () => void
  }
  interface Callable {
    (option?: Option): (art: Artplayer) => Result
    /** @deprecated Compatibility with erroneous old string-duration declarations only. */
    (option: LegacyOption): (art: Artplayer) => Result
    (option: WorkspaceOption): (art: Artplayer) => Result
    (option?: CompatOption): (art: Artplayer) => Result
    /** Required final signature keeps Parameters extraction free of top-level undefined. */
    (option: CompatOption): (art: Artplayer) => Result
  }
  interface Factory extends Callable {
    /** Same function; supports historical require(package).default calls. */
    readonly default: Callable
  }
  interface RuntimeCallable {
    (option?: Option): (art: Artplayer) => Result
    (option: Option): (art: Artplayer) => Result
  }
  /** Accurate typing for the identical implementation at /runtime. */
  interface RuntimeFactory extends RuntimeCallable {
    readonly default: RuntimeCallable
  }
}
declare const artplayerPluginAds: artplayerPluginAds.Factory
export = artplayerPluginAds
export as namespace artplayerPluginAds;
