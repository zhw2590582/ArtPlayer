import type { ComponentHost } from './component/types'
import { appendElement } from './component/dom'
import { isClosing } from './lifecycle/instance'
import Component from './utils/component'

export interface LoadingHost extends ComponentHost {
  template: { $player: HTMLElement, $loading: HTMLElement }
  icons: { loading: string | Element }
}

export default class Loading extends Component<LoadingHost> {
  constructor(art: LoadingHost) {
    super(art)
    this.name = 'loading'
    const icon = art.icons.loading
    if (!isClosing(art))
      appendElement(art.template.$loading, icon)
  }
}
