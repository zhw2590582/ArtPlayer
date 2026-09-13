// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginChromecastDefinitions {
  export interface Option {
    url?: string
    sdk?: string
    icon?: string
    mimeType?: string
  }
  export interface Chromecast {
    name: 'artplayerPluginChromecast'
  }
  /** Published 1.1.0 result; actual registration is asynchronous. */
  export type Result = Chromecast
  export type Factory = (option: Option) => (art: Artplayer) => Chromecast
  export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'disconnecting'
  export interface RuntimeOption extends Option {
    onStateChange?: (this: RuntimeOption, state: ConnectionState) => void
    onCastAvailable?: (this: RuntimeOption, available: boolean) => void
    onCastStart?: (this: RuntimeOption) => void
    onError?: (this: RuntimeOption, error: unknown) => void
  }
  export interface RuntimeResult extends Chromecast {
    /** Last raw SDK SessionState, initially null; not the normalized callback state. */
    getCastState: () => string | null
    /** Whether this controller retains a session; does not prove receiver playback. */
    isCasting: () => boolean
  }
  export interface RuntimeFactory {
    (option: RuntimeOption): (art: Artplayer) => Promise<RuntimeResult>
    default: RuntimeFactory
  }
  export const artplayerPluginChromecast: (option: Option) => (art: Artplayer) => Chromecast
}
declare const artplayerPluginChromecast: typeof artplayerPluginChromecastDefinitions.artplayerPluginChromecast
declare namespace artplayerPluginChromecast {
  export type Option = artplayerPluginChromecastDefinitions.Option
  export type Chromecast = artplayerPluginChromecastDefinitions.Chromecast
  export type Result = artplayerPluginChromecastDefinitions.Result
  export type Factory = artplayerPluginChromecastDefinitions.Factory
  export type ConnectionState = artplayerPluginChromecastDefinitions.ConnectionState
  export type RuntimeOption = artplayerPluginChromecastDefinitions.RuntimeOption
  export type RuntimeResult = artplayerPluginChromecastDefinitions.RuntimeResult
  export type RuntimeFactory = artplayerPluginChromecastDefinitions.RuntimeFactory
}
export = artplayerPluginChromecast
export as namespace artplayerPluginChromecast;
