// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginDocumentPipDefinitions {
  export interface Option {
    /** Requested window width. @default 480 */
    width?: number
    /** Requested window height. @default 270 */
    height?: number
    /** Text displayed in the original player container while the window is active. */
    placeholder?: string
    /** Use the core video PiP property when Document PiP is unavailable. @default true */
    fallbackToVideoPiP?: boolean
  }
  /** Historical assignable result; preserved for direct and extracted return types. */
  export interface Result {
    name: 'artplayerPluginDocumentPip'
    /** Runtime is a readonly capability snapshot; the published field stays assignable. */
    isSupported: boolean
    /** Runtime is a readonly live getter; the published field stays assignable. */
    isActive: boolean
    /** Runtime returns Promise<void>; the published void action remains assignable here. */
    open: () => void
    /** Runtime returns Promise<void>; the published void action remains assignable here. */
    close: () => void
    toggle: () => void
  }
  /** Exact view of an unmodified runtime result. */
  export interface AsyncResult extends Omit<Result, 'isSupported' | 'isActive' | 'open' | 'close'> {
    readonly isSupported: boolean
    readonly isActive: boolean
    open: () => Promise<void>
    close: () => Promise<void>
  }
  /** Exact published factory signature, including compatibility with replacement functions. */
  export type Factory = (option: Option) => (art: Artplayer) => Result
  /** Opt-in runtime view with omitted options, self default and precise async actions. */
  export interface RuntimeFactory {
    (option?: Option): (art: Artplayer) => AsyncResult
    readonly default: RuntimeFactory
  }
  /** Keep the published callable type; use RuntimeFactory explicitly for its broader runtime shape. */
  export function artplayerPluginDocumentPip(option: Option): (art: Artplayer) => Result
}
declare const artplayerPluginDocumentPip: typeof artplayerPluginDocumentPipDefinitions.artplayerPluginDocumentPip
declare namespace artplayerPluginDocumentPip {
  export type Option = artplayerPluginDocumentPipDefinitions.Option
  export type Result = artplayerPluginDocumentPipDefinitions.Result
  export type AsyncResult = artplayerPluginDocumentPipDefinitions.AsyncResult
  export type Factory = artplayerPluginDocumentPipDefinitions.Factory
  export type RuntimeFactory = artplayerPluginDocumentPipDefinitions.RuntimeFactory
}
export = artplayerPluginDocumentPip
export as namespace artplayerPluginDocumentPip;
