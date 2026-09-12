import type { ImaSdk } from '@alugha/ima'
import type Artplayer from 'artplayer'
import type { Context, RequestConfig, Utilities } from './types'
import { createRequest, Player, PlayerOptions } from './sdk'
import { createContainer } from './view'

interface Owner {
  container: HTMLDivElement
  player: Player | null
  listeners: [string, EventListener][]
  playing: boolean
  released: boolean
}

export function createSession(art: Artplayer, ima: ImaSdk, utils: Utilities, closed: () => boolean) {
  const { $video, $player } = art.template
  const adsRenderingSettings = new ima.AdsRenderingSettings()
  adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true
  adsRenderingSettings.enablePreloading = true
  const playerOptions = new PlayerOptions()
  let current: Owner | null = null
  let initializing = false
  let releasing = 0

  const live = (owner: Owner) => current === owner && !owner.released && !closed()

  function release(owner: Owner): void {
    if (current === owner)
      current = null
    owner.released = true
    owner.playing = false
    const player = owner.player
    owner.player = null
    const listeners = owner.listeners.splice(0)
    let failed = false
    let failure: unknown
    const attempt = (cleanup: () => void) => {
      try {
        cleanup()
      }
      catch (error) {
        if (!failed) {
          failed = true
          failure = error
        }
        else {
          console.error('VAST cleanup error:', error)
        }
      }
    }
    releasing++
    try {
      if (player) {
        for (const [name, callback] of listeners)
          attempt(() => player.removeEventListener(name, callback))
        attempt(() => player.destroy())
      }
      attempt(() => {
        if (owner.container.parentNode)
          owner.container.parentNode.removeChild(owner.container)
      })
    }
    finally {
      releasing--
    }
    if (failed)
      throw failure
  }

  function init(): Player | null {
    if (closed() || releasing)
      return null
    if (initializing)
      throw new Error('VAST initialization is already in progress')
    if (current?.player)
      return current.player
    initializing = true
    let owner: Owner | undefined
    try {
      owner = { container: createContainer(utils), player: null, listeners: [], playing: false, released: false }
      current = owner
      if (!live(owner)) {
        release(owner)
        return null
      }
      $player.appendChild(owner.container)
      if (!live(owner)) {
        release(owner)
        return null
      }
      owner.player = new Player(ima, $video, owner.container, adsRenderingSettings, playerOptions)
      if (!live(owner)) {
        release(owner)
        return null
      }
      const allocated = owner
      for (const [name, playing] of [
        ['AdContentPauseRequested', true],
        ['AdContentResumeRequested', false],
        ['AdStarted', true],
        ['AdError', false],
      ] as const) {
        const callback: EventListener = (event) => {
          if (!live(allocated))
            return
          if (name === 'AdError')
            console.error('VAST Ad Error:', (event as CustomEvent<unknown>).detail)
          allocated.playing = playing
          allocated.container.style.display = playing ? 'block' : 'none'
        }
        owner.listeners.push([name, callback])
        owner.player.addEventListener(name, callback)
        if (!live(owner)) {
          release(owner)
          return null
        }
      }
      return owner.player
    }
    catch (error) {
      if (owner) {
        try {
          release(owner)
        }
        catch (cleanupError) { console.error('VAST cleanup error:', cleanupError) }
      }
      throw error
    }
    finally {
      initializing = false
    }
  }

  function play(field: 'adTagUrl' | 'adsResponse', value: string, config: RequestConfig): void {
    if (closed() || current?.playing)
      return
    const player = init()
    const owner = current
    if (!player || !owner)
      return
    const request = createRequest(ima, field, value, config)
    // Request constructors and config accessors may synchronously destroy or replace the session.
    if (live(owner) && owner.player === player)
      player.playAds(request)
  }

  function destroy(): void {
    if (current)
      release(current)
  }

  const context: Context = {
    art,
    playUrl: (url, config = {}) => play('adTagUrl', url, config),
    playRes: (response, config = {}) => play('adsResponse', response, config),
    init,
    ima,
    adsRenderingSettings,
    playerOptions,
    get imaPlayer() { return current?.player || null },
    get container() { return current?.container || null },
  }
  return { context, destroy }
}
