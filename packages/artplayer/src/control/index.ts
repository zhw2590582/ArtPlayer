import type { EntryInput, EntryOption, EventCleanup, SelectorItem } from '../component/types'
import type { ControlHost } from './types'
import { ownEntry } from '../component/resources'
import { getScope, isClosing } from '../lifecycle/instance'
import {
  addClass,
  errorHandle,
  includeFromEvent,
  isMobile,
  removeClass,
} from '../utils'
import Component from '../utils/component'
import { installControls } from './builtins'
import { observeControlLayout } from './layout'
import { controlEvents } from './resources'
import { checkSelector, renderSelector } from './selector'

export default class Control extends Component<ControlHost> {
  declare isHover: boolean
  declare timer: number

  constructor(art: ControlHost) {
    super(art)

    this.isHover = false
    this.name = 'control'
    this.timer = Date.now()

    const { constructor } = art
    const { $player, $bottom } = this.art.template
    ownEntry(art, $bottom)
    const { on } = controlEvents(art, $bottom)

    on('mousemove', () => {
      if (!isMobile) {
        this.show = true
      }
    })

    on('click', () => {
      if (isMobile) {
        this.toggle()
      }
      else {
        this.show = true
      }
    })

    on('document:mousemove', (event) => {
      this.isHover = includeFromEvent(event, $bottom)
    })

    on('video:timeupdate', () => {
      if (
        !art.setting.show
        && !this.isHover
        && !art.isInput
        && art.playing
        && this.show
        && Date.now() - this.timer >= constructor.CONTROL_HIDE_TIME
      ) {
        this.show = false
      }
    })

    on('control', (state) => {
      if (state) {
        removeClass($player, 'art-hide-cursor')
        addClass($player, 'art-hover')
        this.timer = Date.now()
      }
      else {
        addClass($player, 'art-hide-cursor')
        removeClass($player, 'art-hover')
      }
    })

    this.init()
    if (!getScope(art).closed)
      observeControlLayout(art)
  }

  init(): void {
    installControls(this)
  }

  override add(getOption: EntryInput<ControlHost>): undefined {
    if (isClosing(this.art))
      return
    const option = typeof getOption === 'function' ? getOption(this.art) : getOption
    const { $progress, $controlsLeft, $controlsRight } = this.art.template

    switch (option.position) {
      case 'top':
        this.$parent = $progress
        break
      case 'left':
        this.$parent = $controlsLeft
        break
      case 'right':
        this.$parent = $controlsRight
        break
      default:
        errorHandle(false, `Control option.position must one of 'top', 'left', 'right'`)
        break
    }

    super.add(option)
  }

  check(target?: SelectorItem): void {
    checkSelector(target)
  }

  override selector(option: EntryOption<ControlHost>, $ref: HTMLDivElement, events: EventCleanup[]): void {
    renderSelector(this.art, target => this.check(target), option, $ref, events)
  }
}
