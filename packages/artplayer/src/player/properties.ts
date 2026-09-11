import type { Thumbnails } from '../../types/option'
import type { QualityItem } from '../control/types'
import type { PipProperty } from '../display/types'
import type { RectState } from '../media/hosts'
import type { Position, SeekMethods, StateProperty } from '../media/playback'
import type { SwitchMethods } from '../source/types'
import type { AttributeMethods } from './attrMix'
import type { CssVariableMethods } from './cssVarMix'

// Runtime descriptors installed by Player, distinct from each installer's inputs.
// Declaring these on the entry must never emit class fields before installation.
export interface PlayerProperties extends AttributeMethods, CssVariableMethods, Position, SeekMethods, SwitchMethods, RectState, PipProperty, StateProperty {
  get url(): string | null
  set url(value: string)
  play: () => Promise<unknown>
  pause: () => unknown
  toggle: () => unknown
  volume: number
  muted: boolean
  playbackRate: number
  aspectRatio: string
  flip: string
  fullscreen?: boolean
  fullscreenWeb: boolean
  mini: boolean
  readonly loaded: number
  readonly loadedTime: number
  readonly played: number
  readonly playing: boolean
  autoSize: () => void
  autoHeight: () => void
  poster: string
  theme: string
  type: string
  subtitleOffset: number
  airplay: () => void
  get quality(): undefined
  set quality(value: QualityItem[])
  thumbnails: Thumbnails
  getDataURL: () => Promise<string>
  getBlobUrl: () => Promise<string>
  screenshot: (name?: string) => Promise<string>
}
