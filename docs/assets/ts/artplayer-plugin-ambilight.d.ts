// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginAmbilightDefinitions {
  export interface Option {
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
  export interface Result {
    name: 'artplayerPluginAmbilight'
    /** Start sampling; does nothing after the player is destroyed. */
    start: () => void
    /** Stop sampling while retaining the last colors. */
    stop: () => void
  }
  /** Published 1.1.0 factory shape; the options argument remains required. */
  export type Callable = (option: Option) => (art: Artplayer) => Result
  export type Factory = Callable
  /** Accurate optional invocation and CommonJS self alias, exposed by /runtime. */
  export interface RuntimeFactory {
    (option?: Option): (art: Artplayer) => Result
    readonly default: RuntimeFactory
  }
  export const artplayerPluginAmbilight: (option: Option) => (art: Artplayer) => Result
}
declare const artplayerPluginAmbilight: typeof artplayerPluginAmbilightDefinitions.artplayerPluginAmbilight
declare namespace artplayerPluginAmbilight {
  export type Option = artplayerPluginAmbilightDefinitions.Option
  export type Result = artplayerPluginAmbilightDefinitions.Result
  export type Callable = artplayerPluginAmbilightDefinitions.Callable
  export type Factory = artplayerPluginAmbilightDefinitions.Factory
  export type RuntimeFactory = artplayerPluginAmbilightDefinitions.RuntimeFactory
}
export = artplayerPluginAmbilight
export as namespace artplayerPluginAmbilight;
