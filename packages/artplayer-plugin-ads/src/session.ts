import type { Host, Icons, Options, Result, Utilities } from './types'
import type { View } from './view'
import { createCountdown } from './countdown'
import { createResources, report } from './resources'
import { createView } from './view'

export function createSession(art: Host, option: Options, icons: Icons, utils: Utilities): Result {
  const events = createResources(art)
  const lifetime = createResources(art)
  const template = art.template as Host['template'] & { $ads?: HTMLElement }
  let state: 'waiting' | 'active' | 'ended' | 'destroyed' = 'waiting'
  let initialized = false
  let armed = false
  let mediaReady = false
  let root: HTMLElement | undefined
  let view: View | undefined
  const clock = createCountdown(() => option.totalDuration, time => view?.render(time), skip)
  const active = () => state === 'active' && !art.isDestroy
  const destroyed = () => state === 'destroyed' || art.isDestroy

  function pauseVideo(video: HTMLVideoElement | null | undefined): void {
    try {
      video?.pause()
    }
    catch (error) { report(error) }
  }

  function requestPlay(start: () => unknown, rejected: (error: unknown) => void, late?: () => void): void {
    try {
      Promise.resolve(start()).then(() => {
        if (!active())
          late?.()
      }, rejected).catch(report)
    }
    catch (error) { rejected(error) }
  }

  function skip(): void {
    if (state === 'ended' || state === 'destroyed' || art.isDestroy)
      return
    state = 'ended'
    clock.stop()
    events.dispose()
    if (initialized) {
      requestPlay(() => art.play(), (error) => {
        if (state !== 'destroyed')
          report(error)
      })
      if (destroyed())
        return
      pauseVideo(view?.video)
      if (destroyed())
        return
      view?.hide()
    }
    if (!destroyed())
      art.emit('artplayerPluginAds:skip', option)
  }

  function disposeView(): void {
    const video = view?.video
    pauseVideo(video)
    if (video) {
      try {
        video.removeAttribute('src')
        video.load()
      }
      catch (error) { report(error) }
    }
    try {
      root?.remove()
    }
    catch (error) { report(error) }
    finally {
      if (root && template.$ads === root)
        delete template.$ads
    }
  }

  function destroy(): void {
    if (state === 'destroyed')
      return
    state = 'destroyed'
    clock.stop()
    events.dispose()
    lifetime.dispose()
    disposeView()
  }

  function init(): void {
    if (state !== 'waiting' || art.isDestroy)
      return
    state = 'active'
    initialized = true
    try {
      view = createView(template.$player, icons, option, utils, (node) => {
        root = node
        template.$ads = node
      })
      if (!active()) {
        disposeView()
        return
      }
      art.pause()
      if (!active())
        return
      const current = view
      const document = root!.ownerDocument
      current.fullscreen(art.fullscreen)
      current.bind(events, {
        skip,
        click() {
          if (option.url)
            (document.defaultView || window).open(option.url)
          if (active())
            art.emit('artplayerPluginAds:click', option)
        },
        fullscreen() {
          art.fullscreen = !art.fullscreen
          if (active())
            current.fullscreen(art.fullscreen)
        },
      })
      events.on('fullscreen', () => current.fullscreen(art.fullscreen))
      const visibility = () => document.hidden ? clock.pause() : clock.play()
      events.dom(document, 'visibilitychange', visibility)
      // Support the newer core event bridge as well; the clock deduplicates resume.
      events.on('document:visibilitychange', visibility)
      const ready = () => {
        if (!active() || mediaReady)
          return
        mediaReady = true
        clock.start()
        if (document.hidden)
          clock.pause()
        if (current.video) {
          const video = current.video
          requestPlay(() => video.play(), (error) => {
            if (active()) {
              report(error)
              skip()
            }
          }, () => pauseVideo(video))
        }
        if (active())
          current.ready()
      }
      if (current.video) {
        events.dom(current.video, 'error', skip)
        events.dom(current.video, 'loadedmetadata', ready)
        // Observe readiness/failure before initiating a potentially cached request.
        current.video.src = option.video!
      }
      else {
        ready()
      }
    }
    catch (error) {
      destroy()
      throw error
    }
  }

  try {
    lifetime.on('destroy', destroy)
    events.on('ready', () => {
      if (armed || state !== 'waiting')
        return
      armed = true
      events.on('play', init)
      events.on('video:playing', init)
    })
    if (art.isDestroy)
      destroy()
  }
  catch (error) {
    destroy()
    throw error
  }

  return { name: 'artplayerPluginAds', skip, pause: clock.pause, play: clock.play }
}
