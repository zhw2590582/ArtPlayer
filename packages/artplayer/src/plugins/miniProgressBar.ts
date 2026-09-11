import type { SubscriptionHost } from '../component/resources'
import { eventSubscriptions } from '../events/subscriptions'
import { addClass, removeClass } from '../utils'

export interface MiniProgressHost extends SubscriptionHost<{ control: [boolean] }> {
  template: { $player: HTMLElement }
}

export default function miniProgressBar(art: MiniProgressHost): { name: string } {
  eventSubscriptions<{ control: [boolean] }>(art)('control', (state) => {
    if (state) {
      removeClass(art.template.$player, 'art-mini-progress-bar')
    }
    else {
      addClass(art.template.$player, 'art-mini-progress-bar')
    }
  })

  return { name: 'mini-progress-bar' }
}
