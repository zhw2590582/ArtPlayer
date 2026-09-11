import type { SubscriptionHost } from '../component/resources'
import type { ComponentHost } from '../component/types'
import type ResourceScope from '../lifecycle/scope'
import { isClosing } from '../lifecycle/instance'
import { timeout } from '../lifecycle/resources'

export interface InfoHost extends ComponentHost, SubscriptionHost<{ destroy: [] }> {
  template: { $player: HTMLElement, $infoPanel: HTMLElement, $infoClose: HTMLElement, $video: object }
  constructor: { INFO_LOOP_TIME: number }
  proxy: ComponentHost['events']['proxy']
}

export function pollInfo(art: InfoHost, scope: ResourceScope, close: () => void): void {
  const active = () => !scope.closed && !isClosing(art)
  const fail = (error: unknown): never => {
    try {
      scope.dispose()
    }
    catch (cleanupError) {
      console.warn('Failed to release info polling resources:', cleanupError)
    }
    throw error
  }
  try {
    const { proxy, constructor, template: { $infoPanel, $infoClose, $video } } = art
    const cleanup = proxy($infoClose, 'click', () => {
      if (active())
        close()
    })
    scope.add(() => {
      art.events.remove(cleanup)
    })
    const items = Array.from($infoPanel.querySelectorAll<HTMLElement>('[data-video]'))
    const destroy = () => scope.dispose()
    art.on('destroy', destroy)
    scope.add(() => {
      art.off('destroy', destroy)
    })
    const loop = () => {
      try {
        for (const item of items) {
          if (!active())
            return
          const value: unknown = Reflect.get($video, item.dataset.video ?? 'undefined')
          if (!active())
            return
          const raw = typeof value === 'number' ? value.toFixed(2) : value
          if (!active())
            return
          if (item.textContent !== raw) {
            // Match the DOM nullable-string conversion, including Symbol errors.
            const text = raw == null ? null : `${raw}`
            if (!active())
              return
            item.textContent = text
          }
        }
        if (active())
          timeout(scope, loop, constructor.INFO_LOOP_TIME)
      }
      catch (error) {
        fail(error)
      }
    }
    if (active())
      loop()
  }
  catch (error) {
    fail(error)
  }
}
