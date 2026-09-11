import type ResourceScope from '../lifecycle/scope'
import type { MiniHost } from './types'
import { listen } from '../lifecycle/resources'
import { silencePromise } from '../utils/error'
import { miniDrag } from './mini-drag'

export interface MiniView {
  element: HTMLElement
  cancelDrag: () => void
  fresh: boolean
}

export function createMiniView(art: MiniHost, parent: ResourceScope, active: () => boolean, hide: () => void): MiniView | undefined {
  const scope = parent.child()
  if (scope.closed)
    return
  const existing = art.template.$mini
  if (existing) {
    const display = existing.style.display
    scope.add(() => {
      existing.style.display = display
    })
    return { element: existing, cancelDrag: () => {}, fresh: false }
  }
  const document = art.template.$player.ownerDocument
  const element = document.createElement('div')
  element.className = 'art-mini-popup'
  scope.add(() => {
    element.remove()
  })
  try {
    const close = document.createElement('div')
    close.className = 'art-mini-close'
    close.append(art.icons.close)
    if (scope.closed)
      return
    const state = document.createElement('div')
    state.className = 'art-mini-state'
    const play = art.icons.play
    const pause = art.icons.pause
    if (scope.closed)
      return
    state.append(play, pause)
    element.append(close, state)
    listen(scope, close, 'click', hide)
    listen(scope, play, 'click', () => {
      silencePromise(art.play())
    })
    listen(scope, pause, 'click', () => {
      art.pause()
    })
    const update = () => {
      if (scope.closed)
        return
      play.style.display = art.playing ? 'none' : 'flex'
      pause.style.display = art.playing ? 'flex' : 'none'
    }
    update()
    for (const name of ['video:playing', 'video:pause', 'video:timeupdate'] as const) {
      art.on(name, update)
      scope.add(() => {
        art.off(name, update)
      })
    }
    const cancelDrag = miniDrag(art, element, scope, active)
    if (scope.closed)
      return
    art.template.$mini = element
    document.body.append(element)
    if (!scope.closed)
      return { element, cancelDrag, fresh: true }
  }
  catch (error) {
    scope.dispose()
    if (art.template.$mini === element)
      delete art.template.$mini
    throw error
  }
}
