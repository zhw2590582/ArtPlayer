import type { CastContext, CastSdk, CastWindow } from './types'

const DEFAULT_SDK = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
interface Subscriber { ready: (sdk: CastSdk) => void, resolve: (sdk: CastSdk) => void, reject: (error: unknown) => void }
interface Loading { subscribers: Set<Subscriber>, cancel: () => void }
const pending = new WeakMap<CastWindow, Loading>()
const configured = new WeakSet<CastContext>()

function ready(host: CastWindow): CastSdk | undefined {
  const framework = host.cast?.framework
  const api = host.chrome?.cast
  if (typeof framework?.CastContext?.getInstance === 'function'
    && framework.CastContextEventType && framework.SessionState && framework.CastState
    && typeof api?.media?.MediaInfo === 'function' && typeof api.media.LoadRequest === 'function'
    && api.AutoJoinPolicy) { return { framework, media: api.media, autoJoinPolicy: api.AutoJoinPolicy.ORIGIN_SCOPED } }
}

export function configure(sdk: CastSdk): CastContext {
  const context = sdk.framework.CastContext.getInstance()
  if (!configured.has(context)) {
    context.setOptions({ receiverApplicationId: sdk.media.DEFAULT_MEDIA_RECEIVER_APP_ID, autoJoinPolicy: sdk.autoJoinPolicy })
    configured.add(context)
  }
  return context
}

function lease(loading: Loading, onReady: (sdk: CastSdk) => void) {
  let subscriber!: Subscriber
  const promise = new Promise<CastSdk>((resolve, reject) => {
    subscriber = { ready: onReady, resolve, reject }
    loading.subscribers.add(subscriber)
  })
  let released = false
  return { promise, release: () => {
    if (released)
      return
    released = true
    loading.subscribers.delete(subscriber)
    subscriber.reject(new Error('Cast initialization cancelled'))
    if (!loading.subscribers.size)
      loading.cancel()
  } }
}

export function loadSdk(src: string | undefined, onReady: (sdk: CastSdk) => void) {
  const host = window as CastWindow
  const loaded = ready(host)
  if (loaded) {
    const promise = new Promise<CastSdk>((resolve, reject) => {
      try {
        onReady(loaded)
        resolve(loaded)
      }
      catch (error) {
        reject(error)
      }
    })
    return { promise, release: () => {} }
  }
  const existing = pending.get(host)
  if (existing)
    return lease(existing, onReady)

  const loading: Loading = { subscribers: new Set(), cancel: () => finish(undefined, new Error('Cast initialization cancelled')) }
  pending.set(host, loading)
  const subscription = lease(loading, onReady)
  const previous = host.__onGCastApiAvailable
  let script: HTMLScriptElement | undefined
  let timer: number | undefined
  let settled = false
  function finish(sdk?: CastSdk, error?: unknown) {
    if (settled)
      return
    settled = true
    if (timer !== undefined)
      host.clearTimeout(timer)
    pending.delete(host)
    if (host.__onGCastApiAvailable === available)
      host.__onGCastApiAvailable = previous
    if (script) {
      script.onload = null
      script.onerror = null
      if (!sdk)
        script.remove()
    }
    for (const subscriber of loading.subscribers) {
      try {
        if (sdk) {
          subscriber.ready(sdk)
          subscriber.resolve(sdk)
        }
        else {
          subscriber.reject(error)
        }
      }
      catch (error) {
        subscriber.reject(error)
      }
    }
    loading.subscribers.clear()
  }
  function available(value: boolean, errorInfo?: string) {
    // The page's existing consumer keeps its callback and its exception semantics.
    // Always settle our own waiters even if that consumer throws.
    try {
      previous?.call(host, value, errorInfo)
    }
    finally {
      const sdk = value ? ready(host) : undefined
      finish(sdk, new Error('Cast API is not available'))
    }
  }
  host.__onGCastApiAvailable = available
  try {
    timer = host.setTimeout(() => finish(undefined, new Error('Timed out initializing Cast API')), 30000)
    script = document.createElement('script')
    script.src = src || DEFAULT_SDK
    script.onerror = error => finish(undefined, error)
    script.onload = () => {
      const sdk = ready(host)
      if (sdk)
        finish(sdk)
    }
    document.body.appendChild(script)
  }
  catch (error) {
    finish(undefined, error)
  }
  return subscription
}
