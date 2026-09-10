import type { SubscriptionHost } from '../component/resources'
import type { ComponentHost, EntryInput, EntryOption } from '../component/types'
import type { UIEvents } from '../control/types'

export interface ContextmenuHost extends ComponentHost, SubscriptionHost<UIEvents> {
  template: { $player: HTMLDivElement, $contextmenu: HTMLDivElement }
  option: { playbackRate: boolean, aspectRatio: boolean, flip: boolean, contextmenu: EntryInput<ContextmenuHost>[] }
  constructor: { CONTEXTMENU: boolean, PLAYBACK_RATE: number[], ASPECT_RATIO: string[], FLIP: string[] }
  i18n: { get: (key: string) => string }
  info: { show: boolean }
  playbackRate: number
  aspectRatio: string
  flip: string
}

export type ContextmenuOption = EntryOption<ContextmenuHost>
export type ContextmenuFactory = (art: ContextmenuHost) => ContextmenuOption
