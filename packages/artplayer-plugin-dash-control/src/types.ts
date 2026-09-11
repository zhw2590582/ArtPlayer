import type { AudioTrack, Config } from '../types/artplayer-plugin-dash-control'

export type Label = string | number | null | undefined
export type Identifier = string | number
export type Valid = () => boolean
export type Cleanup = () => void
export type EventName = 'ready' | 'restart' | 'destroy'
export type SDKEventName = 'qualityChangeRequested' | 'qualityChangeRendered' | 'trackChangeRendered' | 'streamUpdated' | 'streamInitialized' | 'playbackTimeUpdated' | 'streamTeardownComplete'

export interface QualityFields {
  height?: number
  id?: Identifier
  qualityIndex?: number
}

export type AudioFields = AudioTrack

export interface Dash<Level extends object = object, Track extends object = object> {
  on?: (name: SDKEventName, callback: Cleanup) => unknown
  off?: (name: SDKEventName, callback: Cleanup) => unknown
  getVideoElement: () => object | null
  getSettings: () => { streaming: { abr: { autoSwitchBitrate: { video: boolean } } } }
  updateSettings: (settings: { streaming: { abr: { autoSwitchBitrate: { video: boolean } } } }) => unknown
  getRepresentationsByType?: (type: 'video') => (Level & QualityFields)[] | null | undefined
  getCurrentRepresentationForType?: (type: 'video') => (Level & QualityFields) | null | undefined
  setRepresentationForTypeById?: (type: 'video', id: Identifier | undefined) => unknown
  getBitrateInfoListFor?: (type: 'video') => (Level & QualityFields)[] | null | undefined
  getQualityFor?: (type: 'video') => number
  setQualityFor?: (type: 'video', index: number | undefined) => unknown
  getTracksFor: (type: 'audio') => (Track & AudioFields)[] | null | undefined
  getCurrentTrackFor: (type: 'audio') => (Track & AudioFields) | null | undefined
  setCurrentTrack: (track: Track & AudioFields) => unknown
}

export interface SelectorItem {
  html: Label
  default: boolean
}

export interface QualityItem extends SelectorItem {
  value: number | 'auto' | undefined
  id?: Identifier
}

export interface AudioItem<Track extends object> extends SelectorItem {
  value: Track & AudioFields
}

export interface QualityAdapter<Level extends object> {
  levels: () => (Level & QualityFields)[] | null | undefined
  current: (levels: (Level & QualityFields)[]) => (Level & QualityFields) | null | undefined
  item: (level: Level & QualityFields, index: number, selected: (Level & QualityFields) | null | undefined, automatic: boolean) => Omit<QualityItem, 'html'>
  select: (item: QualityItem, valid: Valid) => void
}

export interface MenuModel<Item extends SelectorItem> {
  html: Label
  title: string
  selector: Item[]
  select: (item: Item, valid: Valid) => unknown
}

export interface MenuOption<Item extends SelectorItem> {
  name: string
  html: Label
  selector: Item[]
  onSelect: (item: Item) => Label
  position?: 'right'
  style?: { padding: string }
  tooltip?: Label
  icon?: string
  width?: number
}

export interface Registry {
  update: <Item extends SelectorItem>(option: MenuOption<Item>) => unknown
  remove: (name: string) => unknown
  check: (item: SelectorItem) => unknown
  cache?: { get?: (name: string) => { option?: { onSelect?: unknown } } | undefined }
  find?: (name: string) => { onSelect?: unknown } | undefined
}

export interface MenuHost {
  controls: Registry
  setting: Registry
  notice: { show: string }
}

export interface Host<Level extends object, Track extends object> extends MenuHost {
  template: { $video: object }
  constructor: { utils: { errorHandle: (condition: unknown, message: string) => void } }
  isDestroy?: boolean
  dash?: Dash<Level, Track>
  on: (name: EventName, callback: Cleanup) => unknown
  off: (name: EventName, callback: Cleanup) => unknown
}

export type DisplayConfig = Pick<Config, 'control' | 'setting'>
