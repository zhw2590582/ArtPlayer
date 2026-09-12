// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginAmbilight {
  interface Option {
    /** CSS blur radius. @default '50px' */
    blur?: string
    /** Grid cell opacity. @default 0.5 */
    opacity?: number
    /** Maximum sampling frequency in frames per second. @default 10 */
    frequency?: number
    /** Historical input retained for compatibility; runtime uses a fixed z-index of 9. */
    zIndex?: number
    /** Background color transition duration in seconds. @default 0.3 */
    duration?: number
  }
  interface Result {
    name: 'artplayerPluginAmbilight'
    /** Start sampling; does nothing after the player is destroyed. */
    start: () => void
    /** Stop sampling while retaining the last colors. */
    stop: () => void
  }
  interface Callable {
    (option?: Option): (art: Artplayer) => Result
    /** Keep Parameters extraction identical to the published 1.1.0 signature. */
    (option: Option): (art: Artplayer) => Result
  }
  interface Factory extends Callable {
    /** Same function, including historical require(package).default calls. */
    readonly default: Factory
  }
}
declare const artplayerPluginAmbilight: artplayerPluginAmbilight.Factory
export = artplayerPluginAmbilight
export as namespace artplayerPluginAmbilight;
