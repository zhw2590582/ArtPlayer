import type { MiniView } from './mini-view'
import type { Placement } from './placement'
import type { MiniHost } from './types'
import { getScope, isClosing } from '../lifecycle/instance'
import { miniFocus } from './mini-focus'
import { miniGeometry, miniPosition } from './mini-layout'
import { createMiniView } from './mini-view'
import { capturePlacement, restorePlacement } from './placement'

export function mini(art: MiniHost): PropertyDescriptor {
  const { $player, $video } = art.template
  const scope = getScope(art).child()
  let view: MiniView | undefined
  let placement: Placement | undefined
  let revision = 0
  let creating = false
  let queued = false
  const active = () => !isClosing(art) && $player.classList.contains('art-mini')
  const focus = miniFocus(art)

  function restore() {
    if (placement) {
      const saved = placement
      const current = revision
      placement = undefined
      try {
        restorePlacement(saved)
      }
      catch (error) {
        if (current === revision && !placement)
          placement = saved
        throw error
      }
    }
  }

  function hide() {
    if (isClosing(art))
      return
    const current = ++revision
    queued = false
    const restoreFocus = focus.leaving(art.template.$mini)
    restore()
    if (isClosing(art) || current !== revision)
      return
    view?.cancelDrag()
    $player.classList.remove('art-mini')
    if (art.template.$mini) {
      art.template.$mini.style.display = 'none'
      restoreFocus()
      if (!isClosing(art) && current === revision)
        art.emit('mini', false)
    }
  }

  scope.add(() => {
    revision++
    try {
      restore()
    }
    finally {
      view?.cancelDrag()
      $player.classList.remove('art-mini')
    }
  })

  function show(): void {
    if (isClosing(art))
      return
    const current = ++revision
    if (creating) {
      queued = true
      return
    }
    const enterFocus = focus.entering()
    art.state = 'mini'
    if (isClosing(art) || current !== revision)
      return
    placement ??= capturePlacement($video)
    $player.classList.add('art-mini')
    try {
      if (!view) {
        creating = true
        try {
          view = createMiniView(art, scope, active, hide)
        }
        finally {
          creating = false
        }
      }
      if (queued) {
        queued = false
        show()
        return
      }
      if (!view || isClosing(art))
        return
      if (current !== revision) {
        if (!active())
          view.element.style.display = 'none'
        return
      }
      if (view.fresh)
        view.element.prepend($video)
      else
        view.element.append($video)
      if (isClosing(art) || current !== revision)
        return
      view.element.style.display = view.fresh ? '' : 'flex'
      view.fresh = false
      const top = art.storage.get('top')
      const left = art.storage.get('left')
      const position = miniPosition(left, top, miniGeometry(view.element))
      if (isClosing(art) || current !== revision)
        return
      view.element.style.left = `${position.left}px`
      view.element.style.top = `${position.top}px`
      if (position.reset) {
        art.storage.set('top', position.top)
        if (isClosing(art) || current !== revision)
          return
        art.storage.set('left', position.left)
      }
      if (!isClosing(art) && current === revision)
        enterFocus(view.focus)
      if (!isClosing(art) && current === revision)
        art.emit('mini', true)
    }
    catch (error) {
      const pendingReentry = queued
      queued = false
      if (!isClosing(art) && (current === revision || pendingReentry)) {
        restore()
        $player.classList.remove('art-mini')
        if (view)
          view.element.style.display = 'none'
      }
      throw error
    }
  }
  return {
    get: active,
    set(value: boolean): void {
      if (value)
        show()
      else
        hide()
    },
  }
}
