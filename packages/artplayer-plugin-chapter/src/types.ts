import type artplayerPluginChapter from '../types/artplayer-plugin-chapter'

export type Option = NonNullable<Parameters<typeof artplayerPluginChapter>[0]>
export type Chapter = NonNullable<Option['chapters']>[number]
export type Result = ReturnType<ReturnType<typeof artplayerPluginChapter>>
export type Bar = 'hover' | 'loaded' | 'played'
