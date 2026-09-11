import type { ContextmenuFactory, ContextmenuOption } from './types'
import { controlEvents } from '../control/resources'
import { inverseClass, query } from '../utils'
import { keyboardChoices, updateChoices } from './choices'

export default function aspectRatio(option: ContextmenuOption): ContextmenuFactory {
  return (art) => {
    const {
      i18n,
      constructor: { ASPECT_RATIO },
    } = art

    const html = ASPECT_RATIO.map(
      item => `<span data-value="${item}">${item === 'default' ? i18n.get('Default') : item}</span>`,
    ).join('')
    const label = i18n.get('Aspect Ratio')

    return {
      ...option,
      html: `${label}: ${html}`,
      click: (contextmenu, event) => {
        const value = event.target instanceof HTMLElement ? event.target.dataset.value : undefined
        if (value) {
          art.aspectRatio = value
          contextmenu.show = false
        }
      },
      mounted: ($panel) => {
        const { on } = controlEvents(art, $panel)
        const $default = query('[data-value="default"]', $panel)
        if ($default) {
          inverseClass($default, 'art-current')
        }
        keyboardChoices($panel, label)
        on('aspectRatio', (value) => {
          const $current = Array.from($panel.querySelectorAll('span')).find(item => item.dataset.value === value)
          if ($current) {
            inverseClass($current, 'art-current')
            updateChoices($panel)
          }
        })
      },
    }
  }
}
