import type { ContextmenuFactory, ContextmenuOption } from './types'
import { controlEvents } from '../control/resources'
import { capitalize, inverseClass, query } from '../utils'

export default function flip(option: ContextmenuOption): ContextmenuFactory {
  return (art) => {
    const {
      i18n,
      constructor: { FLIP },
    } = art

    const html = FLIP.map(item => `<span data-value="${item}">${i18n.get(capitalize(item))}</span>`).join('')

    return {
      ...option,
      html: `${i18n.get('Video Flip')}: ${html}`,
      click: (contextmenu, event) => {
        const value = event.target instanceof HTMLElement ? event.target.dataset.value : undefined
        if (value) {
          art.flip = value.toLowerCase()
          contextmenu.show = false
        }
      },
      mounted: ($panel) => {
        const { on } = controlEvents(art, $panel)
        const $default = query('[data-value="normal"]', $panel)
        if ($default) {
          inverseClass($default, 'art-current')
        }
        on('flip', (value) => {
          const $current = Array.from($panel.querySelectorAll('span')).find(item => item.dataset.value === value)
          if ($current) {
            inverseClass($current, 'art-current')
          }
        })
      },
    }
  }
}
