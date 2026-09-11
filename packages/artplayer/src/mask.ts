import type { SubscriptionHost } from './component/resources'
import type { ComponentHost } from './component/types'
import { appendElement } from './component/dom'
import { getFinalizationScope, isClosing } from './lifecycle/instance'
import { setStyle, silencePromise } from './utils'
import Component from './utils/component'

export interface MaskHost extends ComponentHost, SubscriptionHost<{ destroy: [] }> {
  template: { $player: HTMLElement, $state: HTMLElement }
  icons: { state: string | Element, error: string | Element }
  play: () => unknown
}

export default class Mask extends Component<MaskHost> {
  constructor(art: MaskHost) {
    super(art)

    this.name = 'mask'
    const { template, icons, events } = art

    const stateIcon = icons.state
    if (isClosing(art))
      return
    const $state = appendElement(template.$state, stateIcon)
    const errorIcon = icons.error
    if (isClosing(art))
      return
    const $error = appendElement(template.$state, errorIcon)

    setStyle($error, 'display', 'none')

    let terminalEventHandled = false
    const destroy = () => {
      setStyle($state, 'display', 'none')
      setStyle($error, 'display', null)
      if (isClosing(art))
        terminalEventHandled = true
    }
    art.on('destroy', destroy)
    getFinalizationScope(art).add(() => {
      try {
        if (!terminalEventHandled)
          destroy()
      }
      finally {
        art.off('destroy', destroy)
      }
    })

    if (!isClosing(art)) {
      events.proxy(template.$state, 'click', () => {
        if (!isClosing(art))
          silencePromise(art.play())
      })
    }
  }
}
