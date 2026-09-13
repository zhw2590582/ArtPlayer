export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'disconnecting'

export interface ChromecastOptions {
  url?: string
  sdk?: string
  icon?: string
  mimeType?: string
  onStateChange?: (this: ChromecastOptions, state: ConnectionState) => void
  onCastAvailable?: (this: ChromecastOptions, available: boolean) => void
  onCastStart?: (this: ChromecastOptions) => void
  onError?: (this: ChromecastOptions, error: unknown) => void
}

export interface MediaInfo {
  contentId: string
  contentType: string
}

export interface LoadRequest { media: MediaInfo }
export interface CastSession { loadMedia: (request: LoadRequest) => PromiseLike<unknown> }
export interface SessionEvent { sessionState: string, session?: CastSession | null }
export interface AvailabilityEvent { castState: string }

export interface CastContext {
  setOptions: (options: { receiverApplicationId: string, autoJoinPolicy: string }) => void
  getCurrentSession: () => CastSession | null
  requestSession: () => PromiseLike<unknown>
  addEventListener: (name: string, listener: (event: SessionEvent & AvailabilityEvent) => void) => void
  removeEventListener: (name: string, listener: (event: SessionEvent & AvailabilityEvent) => void) => void
}

export interface CastSdk {
  framework: {
    CastContext: { getInstance: () => CastContext }
    CastContextEventType: { SESSION_STATE_CHANGED: string, CAST_STATE_CHANGED: string }
    SessionState: Record<string, string>
    CastState: Record<string, string>
  }
  media: {
    DEFAULT_MEDIA_RECEIVER_APP_ID: string
    MediaInfo: new (url: string, mimeType: string) => MediaInfo
    LoadRequest: new (media: MediaInfo) => LoadRequest
  }
  autoJoinPolicy: string
}

export interface CastWindow extends Window {
  cast?: { framework?: CastSdk['framework'] }
  chrome?: { cast?: { media?: CastSdk['media'], AutoJoinPolicy?: { ORIGIN_SCOPED: string } } }
  __onGCastApiAvailable?: (available: boolean, errorInfo?: string) => void
}
