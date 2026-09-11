import type { SubscriptionHost } from '../component/resources'

export interface HotkeyHost extends SubscriptionHost<{ 'document:keydown': [KeyboardEvent] }> {
  constructor: { SEEK_STEP: number, VOLUME_STEP: number }
  option: { hotkey?: boolean }
  template: { $player: HTMLElement }
  isFocus: boolean
  fullscreenWeb: boolean
  backward: number
  forward: number
  volume: number
  toggle: () => unknown
  emit: (name: 'hotkey' | 'keydown', event: KeyboardEvent) => unknown
}

export type HotkeyCallback<Host> = (this: Host, event: KeyboardEvent) => unknown
