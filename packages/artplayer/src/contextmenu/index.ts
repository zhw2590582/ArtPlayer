import type { ContextmenuHost } from './types'
import { ownEntry, releaseEntry } from '../component/resources'
import { controlEvents } from '../control/resources'
import { isClosing } from '../lifecycle/instance'
import { includeFromEvent, isMobile } from '../utils'
import Component from '../utils/component'
import aspectRatio from './aspectRatio'
import close from './close'
import flip from './flip'
import info from './info'
import { contextmenuKeyboard } from './keyboard'
import playbackRate from './playbackRate'
import { positionContextmenu } from './position'
import version from './version'

export default class Contextmenu extends Component<ContextmenuHost> {
  constructor(art: ContextmenuHost) {
    super(art)

    this.name = 'contextmenu'
    this.$parent = art.template.$contextmenu
    ownEntry(art, this.$parent)

    if (!isMobile) {
      this.init()
    }
  }

  init(): void {
    const {
      option,
      template: { $player, $contextmenu },
    } = this.art
    const { on, proxy } = controlEvents(this.art, $contextmenu)

    if (option.playbackRate) {
      this.add(
        playbackRate({
          name: 'playbackRate',
          index: 10,
        }),
      )
    }

    if (option.aspectRatio) {
      this.add(
        aspectRatio({
          name: 'aspectRatio',
          index: 20,
        }),
      )
    }

    if (option.flip) {
      this.add(
        flip({
          name: 'flip',
          index: 30,
        }),
      )
    }

    this.add(
      info({
        name: 'info',
        index: 40,
      }),
    )

    this.add(
      version({
        name: 'version',
        index: 50,
      }),
    )

    this.add(
      close({
        name: 'close',
        index: 60,
      }),
    )

    for (let index = 0; index < option.contextmenu.length; index++) {
      this.add(option.contextmenu[index]!)
    }

    if (isClosing(this.art))
      return
    releaseEntry($contextmenu)
    const scope = ownEntry(this.art, $contextmenu)
    const open = (x: number, y: number) => {
      this.show = true
      if (!scope.closed && !isClosing(this.art) && this.show)
        positionContextmenu(this.art, x, y)
    }
    const keyboard = contextmenuKeyboard(this, open)

    proxy($player, 'contextmenu', (event) => {
      if (!keyboard.pointer(event))
        return
      event.preventDefault()
      open(event.clientX, event.clientY)
    })

    proxy($player, 'click', (event) => {
      if (!includeFromEvent(event, $contextmenu)) {
        this.show = false
      }
    })

    on('blur', () => {
      this.show = false
    })
  }
}
