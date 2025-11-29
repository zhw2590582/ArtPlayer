import { addClass, removeClass } from './utils'

export default class Notice {
  constructor(art) {
    this.art = art
    this.timer = null

    art.on('destroy', () => this.destroy())
  }

  destroy() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  set show(msg) {
    const {
      constructor,
      template: { $player, $noticeInner },
    } = this.art

    if (msg) {
      $noticeInner.textContent = msg instanceof Error ? msg.message.trim() : msg
      addClass($player, 'art-notice-show')
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        $noticeInner.textContent = ''
        removeClass($player, 'art-notice-show')
      }, constructor.NOTICE_TIME)
    }
    else {
      removeClass($player, 'art-notice-show')
    }
  }

  get show() {
    const {
      template: { $player },
    } = this.art
    return $player.classList.contains('art-notice-show')
  }
}
