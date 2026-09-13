import type Artplayer from 'artplayer'

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

declare const artplayerPluginChromecast: (option: Option) => (art: Artplayer) => Chromecast

export default artplayerPluginChromecast
