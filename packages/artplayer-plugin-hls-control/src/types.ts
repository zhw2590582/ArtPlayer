import type { Config } from '../types/artplayer-plugin-hls-control'

export interface LevelFields {
  height?: number
  name?: string
}

export interface AudioFields {
  id: number
  name?: string
  lang?: string
  language?: string
}

export type SdkEvent = 'MANIFEST_PARSED' | 'LEVELS_UPDATED' | 'LEVEL_SWITCHED' | 'AUDIO_TRACKS_UPDATED' | 'AUDIO_TRACK_SWITCHED' | 'DESTROYING'
export type Cleanup = () => void

export interface Hls<Level extends object = object, Track extends object = object> {
  media: object | null
  levels: (Level & LevelFields)[]
  audioTracks: (Track & AudioFields)[]
  currentLevel: number
  audioTrack: number
  autoLevelEnabled?: boolean
  constructor?: { Events?: Partial<Record<SdkEvent, unknown>> }
  on?: (event: string, callback: Cleanup) => unknown
  off?: (event: string, callback: Cleanup) => unknown
}

export interface SelectorItem {
  html: string | undefined
  value: number
  default: boolean
}

export interface MenuModel {
  html: string | undefined
  title: string
  selector: SelectorItem[]
}

export interface MenuOption {
  name: string
  html: string | undefined
  selector: SelectorItem[]
  onSelect: (item: SelectorItem) => string | undefined
  position?: 'right'
  style?: { padding: string }
  tooltip?: string
  icon?: string
  width?: number
}

export interface Registry {
  update: (option: MenuOption) => unknown
  remove: (name: string) => unknown
  check: (item: SelectorItem) => unknown
}

export interface MenuHost {
  controls: Registry
  setting: Registry
  notice: { show: string }
}

export interface Host<Level extends object, Track extends object> extends MenuHost {
  template: { $video: object }
  constructor: { utils: { errorHandle: (condition: unknown, message: string) => void } }
  hls?: Hls<Level, Track>
  on: (event: 'ready' | 'restart' | 'destroy', callback: Cleanup) => unknown
  off: (event: 'ready' | 'restart' | 'destroy', callback: Cleanup) => unknown
}

export type DisplayConfig = Pick<Config, 'control' | 'setting'>
export interface MenuState<Engine> {
  hls: Engine
  config: DisplayConfig
  model: MenuModel
}
