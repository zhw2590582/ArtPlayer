import type { SubscriptionHost } from './component/resources'
import { getScope, isClosing } from './lifecycle/instance'
import { addClass, removeClass } from './utils'

export interface NoticeSink {
  get show(): unknown
  set show(value: unknown)
}

interface NoticeHost extends SubscriptionHost<{ destroy: [] }> {
  constructor: { NOTICE_TIME: number }
  template: { $player: HTMLElement, $noticeInner: HTMLElement }
}

interface NoticeState {
  revision: number
  pending?: object
}

const states = new WeakMap<Notice, NoticeState>()

function cancelNotice(notice: Notice): void {
  const state = states.get(notice)!
  state.revision++
  state.pending = undefined
  if (notice.timer !== null) {
    clearTimeout(notice.timer)
    notice.timer = null
  }
}

export default class Notice implements NoticeSink {
  declare art: NoticeHost
  declare timer: ReturnType<typeof setTimeout> | null

  constructor(art: NoticeHost) {
    this.art = art
    this.timer = null
    states.set(this, { revision: 0 })
    const destroy = () => this.destroy()
    art.on('destroy', destroy)
    getScope(art).add(() => {
      art.off('destroy', destroy)
    })
    getScope(art).add(() => {
      this.destroy()
    })
  }

  destroy(): void {
    cancelNotice(this)
  }

  set show(msg: string | Error | false) {
    if (isClosing(this.art))
      return
    const state = states.get(this)!
    state.revision++
    const {
      constructor,
      template: { $player, $noticeInner },
    } = this.art

    if (msg) {
      cancelNotice(this)
      const revision = state.revision
      const active = () => !isClosing(this.art) && state.revision === revision
      $noticeInner.textContent = msg instanceof Error ? msg.message.trim() : msg
      if (!active())
        return
      addClass($player, 'art-notice-show')
      if (!active())
        return
      const delay = constructor.NOTICE_TIME
      if (!active())
        return
      const pending = {}
      state.pending = pending
      const timer = setTimeout(() => {
        if (isClosing(this.art) || state.pending !== pending)
          return
        state.pending = undefined
        const before = state.revision
        $noticeInner.textContent = ''
        if (!isClosing(this.art) && state.revision === before)
          removeClass($player, 'art-notice-show')
      }, delay)
      if (active())
        this.timer = timer
      else
        clearTimeout(timer)
    }
    else {
      removeClass($player, 'art-notice-show')
    }
  }

  get show(): boolean {
    const {
      template: { $player },
    } = this.art
    return $player.classList.contains('art-notice-show')
  }
}
