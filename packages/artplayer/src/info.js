import { getScope } from './lifecycle/instance'
import { timeout } from './lifecycle/resources'
import { isMobile, queryAll } from './utils'
import Component from './utils/component'

export default class Info extends Component {
  constructor(art) {
    super(art)
    this.name = 'info'

    if (!isMobile) {
      this.init()
    }
  }

  init() {
    const {
      proxy,
      constructor,
      template: { $infoPanel, $infoClose, $video },
    } = this.art

    proxy($infoClose, 'click', () => {
      this.show = false
    })

    let cancel = () => {}
    const $types = queryAll('[data-video]', $infoPanel) || []
    this.art.on('destroy', () => cancel())
    const scope = getScope(this.art)

    function loop() {
      for (let index = 0; index < $types.length; index++) {
        const item = $types[index]
        const value = $video[item.dataset.video]
        const textContent = typeof value === 'number' ? value.toFixed(2) : value
        if (item.textContent !== textContent) {
          item.textContent = textContent
        }
      }
      cancel = timeout(scope, loop, constructor.INFO_LOOP_TIME)
    }

    loop()
  }
}
