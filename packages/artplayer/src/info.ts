import type { InfoHost } from './info/poll'
import type ResourceScope from './lifecycle/scope'
import { pollInfo } from './info/poll'
import { getScope, isClosing } from './lifecycle/instance'
import { isMobile } from './utils'
import Component from './utils/component'

const states = new WeakMap<Info, { scope?: ResourceScope, revision: number }>()

export default class Info extends Component<InfoHost> {
  constructor(art: InfoHost) {
    super(art)
    this.name = 'info'
    states.set(this, { revision: 0 })
    if (!isMobile)
      this.init()
  }

  init(): void {
    const state = states.get(this)!
    const revision = ++state.revision
    state.scope?.dispose()
    if (isClosing(this.art) || state.revision !== revision)
      return
    const scope = getScope(this.art).child()
    state.scope = scope
    scope.add(() => {
      if (state.scope === scope)
        state.scope = undefined
    })
    pollInfo(this.art, scope, () => {
      this.show = false
    })
  }
}
