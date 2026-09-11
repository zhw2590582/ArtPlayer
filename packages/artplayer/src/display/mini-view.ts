import type ResourceScope from '../lifecycle/scope'
import type { MiniHost } from './types'
import { keyboardButton } from '../accessibility/button'
import { claimKey, plainKey } from '../accessibility/keyboard'
import { isClosing } from '../lifecycle/instance'
import { listen } from '../lifecycle/resources'
import { silencePromise } from '../utils/error'
import { miniDrag } from './mini-drag'

export interface MiniView {
  element: HTMLElement
  cancelDrag: () => void
  fresh: boolean
  focus?: () => void
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
    keyboardButton(scope, close, () => close.click(), active)
    keyboardButton(scope, state, () => (art.playing ? pause : play).click(), active)
    const closeLabel = art.i18n.get('Close')
    if (scope.closed || isClosing(art))
      return
    close.setAttribute('aria-label', closeLabel)
    const groupLabel = art.i18n.get('Mini Player')
    if (scope.closed || isClosing(art))
      return
    element.setAttribute('role', 'group')
    element.setAttribute('aria-label', groupLabel)
    listen(scope, element, 'keydown', (input) => {
      const event = input as KeyboardEvent
      if (active() && plainKey(event) && !event.defaultPrevented && event.key === 'Escape') {
        claimKey(event)
        hide()
      }
    })
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
      const label = art.i18n.get(art.playing ? 'Pause' : 'Play')
      if (scope.closed || isClosing(art))
        return
      state.setAttribute('aria-label', label)
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
      return { element, cancelDrag, fresh: true, focus: () => close.focus({ preventScroll: true }) }
  }
  catch (error) {
    scope.dispose()
    if (art.template.$mini === element)
      delete art.template.$mini
    throw error
  }
}
