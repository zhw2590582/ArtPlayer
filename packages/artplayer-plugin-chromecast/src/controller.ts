import type Artplayer from 'artplayer'
import type { AvailabilityEvent, CastContext, CastSdk, CastSession, ChromecastOptions, ConnectionState, SessionEvent } from './types'
import icon from './cast.svg?raw'
import { loadMedia } from './media'
import { configure, loadSdk } from './sdk'

export function createController(art: Artplayer, option: ChromecastOptions) {
  let disposed = false
  let sdk: CastSdk | undefined
  let context: CastContext | undefined
  let session: CastSession | null = null
  let state: string | null = null
  let activeClick: Promise<void> | undefined
  let releaseLoader: (() => void) | undefined
  let generation = 0
  let operationStarted = false
  let cancelOperation: (() => void) | undefined
  let cancel!: () => void
  const cancelled = new Promise<undefined>((resolve) => {
    cancel = () => resolve(undefined)
  })
  let element: HTMLElement | undefined
  const active = () => !disposed && !art.isDestroy
  const update = (value: ConnectionState) => {
    option.onStateChange?.(value)
    if (!active())
      return
    const button = element?.querySelector<HTMLElement>('.art-icon-cast')
    if (button)
      button.style.color = value === 'connected' ? 'red' : value === 'connecting' || value === 'disconnecting' ? 'orange' : 'white'
  }
  const onSession = (event: SessionEvent) => {
    if (!active() || !sdk)
      return
    state = event.sessionState
    const states = sdk.framework.SessionState
    if (state === states.NO_SESSION || state === states.SESSION_ENDED || state === states.SESSION_START_FAILED) {
      if (state !== states.NO_SESSION || operationStarted) {
        generation++
        cancelOperation?.()
      }
      session = null
      update('disconnected')
    }
    else {
      if (state === states.SESSION_ENDING || (session && event.session && event.session !== session)) {
        generation++
        cancelOperation?.()
      }
      session = event.session || null
      if (state === states.SESSION_STARTING)
        update('connecting')
      else if (state === states.SESSION_ENDING)
        update('disconnecting')
      else if (state === states.SESSION_STARTED || state === states.SESSION_RESUMED)
        update('connected')
    }
  }
  const onAvailability = (event: AvailabilityEvent) => {
    if (!active() || !sdk)
      return
    const states = sdk.framework.CastState
    if (event.castState === states.NO_DEVICES_AVAILABLE)
      option.onCastAvailable?.(false)
    else if (event.castState === states.NOT_CONNECTED || event.castState === states.CONNECTING || event.castState === states.CONNECTED)
      option.onCastAvailable?.(true)
  }
  const detach = () => {
    const ownedContext = context
    const ownedSdk = sdk
    context = undefined
    sdk = undefined
    if (ownedContext && ownedSdk) {
      const events = ownedSdk.framework.CastContextEventType
      const errors: unknown[] = []
      try {
        ownedContext.removeEventListener(events.SESSION_STATE_CHANGED, onSession)
      }
      catch (error) {
        errors.push(error)
      }
      try {
        ownedContext.removeEventListener(events.CAST_STATE_CHANGED, onAvailability)
      }
      catch (error) {
        errors.push(error)
      }
      if (errors.length)
        throw errors[0]
    }
  }
  const destroy = () => {
    if (disposed)
      return
    disposed = true
    cancel()
    const release = releaseLoader
    releaseLoader = undefined
    const errors: unknown[] = []
    for (const cleanup of [release, detach, () => art.off('destroy', destroy)]) {
      try {
        cleanup?.()
      }
      catch (error) {
        errors.push(error)
      }
    }
    session = null
    // ArtPlayer owns removal of its controls at player destruction.
    element = undefined
    if (errors.length)
      throw errors[0]
  }
  async function cast() {
    const epoch = generation
    const currentOperation = () => active() && generation === epoch
    let stop!: () => void
    const superseded = new Promise<undefined>((resolve) => {
      stop = () => resolve(undefined)
    })
    cancelOperation = stop
    let failureNotice = 'Failed to initialize Cast API'
    try {
      if (!sdk || !context) {
        const loading = loadSdk(option.sdk, (available) => {
          if (!currentOperation())
            return
          sdk = available
          context = configure(sdk)
          if (!currentOperation())
            return
          const events = sdk.framework.CastContextEventType
          try {
            context.addEventListener(events.SESSION_STATE_CHANGED, onSession)
            if (active())
              context.addEventListener(events.CAST_STATE_CHANGED, onAvailability)
          }
          catch (error) {
            try {
              detach()
            }
            catch {
              // Preserve the setup error; detach already tried both subscriptions.
            }
            throw error
          }
        })
        releaseLoader = loading.release
        await Promise.race([loading.promise, cancelled, superseded])
        loading.release()
        releaseLoader = undefined
      }
      if (!currentOperation() || !context || !sdk)
        return
      failureNotice = 'Error connecting to cast session'
      operationStarted = true
      let current = context.getCurrentSession()
      if (!currentOperation())
        return
      if (!current) {
        await Promise.race([context.requestSession(), cancelled, superseded])
        if (!currentOperation())
          return
        current = context.getCurrentSession()
      }
      if (!currentOperation())
        return
      if (!current)
        throw new Error('No active Cast session')
      session = current
      failureNotice = 'Error casting media'
      await Promise.race([loadMedia(sdk, current, option, art.option.url), cancelled, superseded])
      if (currentOperation()) {
        art.notice.show = 'Casting started'
        option.onCastStart?.()
      }
    }
    catch (error) {
      if (currentOperation()) {
        art.notice.show = failureNotice
        option.onError?.(error)
        throw error
      }
    }
    finally {
      releaseLoader?.()
      releaseLoader = undefined
      if (cancelOperation === stop)
        cancelOperation = undefined
      operationStarted = false
    }
  }
  const click = () => {
    if (!active())
      return Promise.resolve()
    if (!activeClick) {
      let resolve!: () => void
      let reject!: (error: unknown) => void
      activeClick = new Promise<void>((yes, no) => {
        resolve = yes
        reject = no
      })
      // ArtPlayer's DOM dispatcher ignores click results. Observe rejection there
      // while retaining the original rejecting Promise for programmatic callers.
      activeClick.catch(() => {})
      // Publish the guard before SDK setup can synchronously replay an event and
      // reenter click through a user's onStateChange callback.
      cast().then(() => {
        activeClick = undefined
        resolve()
      }, (error) => {
        activeClick = undefined
        reject(error)
      })
    }
    return activeClick
  }
  art.controls.add({
    name: 'chromecast',
    position: 'right',
    tooltip: 'Chromecast',
    html: `<i class="art-icon art-icon-cast">${option.icon || icon}</i>`,
    mounted(control) {
      if (active())
        element = control
    },
    click,
  })
  art.on('destroy', destroy)
  if (art.isDestroy)
    destroy()
  return { name: 'artplayerPluginChromecast', getCastState: () => state, isCasting: () => session !== null }
}
