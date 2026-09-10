import type { ContextmenuFactory, ContextmenuOption } from './types'
import { controlEvents } from '../control/resources'
import { inverseClass, query } from '../utils'

export default function playbackRate(option: ContextmenuOption): ContextmenuFactory {
  return (art) => {
    const {
      i18n,
      constructor: { PLAYBACK_RATE },
    } = art

    const html = PLAYBACK_RATE.map(
      item => `<span data-value="${item}">${item === 1 ? i18n.get('Normal') : item.toFixed(1)}</span>`,
    ).join('')

    return {
      ...option,
      html: `${i18n.get('Play Speed')}: ${html}`,
      click: (contextmenu, event) => {
        const value = event.target instanceof HTMLElement ? event.target.dataset.value : undefined
        if (value) {
          art.playbackRate = Number(value)
          contextmenu.show = false
        }
      },
      mounted: ($panel) => {
        const { on } = controlEvents(art, $panel)
        const $default = query('[data-value="1"]', $panel)
        if ($default)
          inverseClass($default, 'art-current')
        on('video:ratechange', () => {
          const $current = Array.from($panel.querySelectorAll('span')).find(
            item => Number(item.dataset.value) === art.playbackRate,
          )
          if ($current) {
            inverseClass($current, 'art-current')
          }
        })
      },
    }
  }
}
