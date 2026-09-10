import type { ContextmenuFactory, ContextmenuOption } from './types'

export default function close(option: ContextmenuOption): ContextmenuFactory {
  return art => ({
    ...option,
    html: art.i18n.get('Close'),
    click: (contextmenu) => {
      contextmenu.show = false
    },
  })
}
