import type { ContextmenuFactory, ContextmenuOption } from './types'

export default function info(option: ContextmenuOption): ContextmenuFactory {
  return art => ({
    ...option,
    html: art.i18n.get('Video Info'),
    click: (contextmenu) => {
      art.info.show = true
      contextmenu.show = false
    },
  })
}
