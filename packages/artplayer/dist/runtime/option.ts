import type { OptionInput as LegacyOptionInput, Thumbnails } from '../option'
import type { ComponentInput, ControlInput } from './component'
import type { MediaSurface } from './media'
import type { PluginFactory } from './plugin'
import type { Languages } from './services'
import type { SettingItem } from './setting'
import type { SubtitleOption } from './subtitle'

/** Callback receivers are the unchanged player instance selected by this view. */
export interface OptionInput<Host> extends Omit<LegacyOptionInput, 'container' | 'proxy' | 'plugins' | 'layers' | 'controls' | 'contextmenu' | 'settings' | 'customType' | 'i18n' | 'icons'> {
  container: string | HTMLDivElement
  proxy?: (this: Host, art: Host) => MediaSurface | undefined
  plugins?: PluginFactory<Host>[]
  layers?: ComponentInput<Host>[]
  controls?: ControlInput<Host>[]
  contextmenu?: ComponentInput<Host>[]
  settings?: SettingItem<Host>[]
  customType?: Record<string, ((this: Host, video: MediaSurface, url: string, art: Host) => unknown) | undefined>
  i18n?: Languages
  icons?: Record<string, string | HTMLElement | undefined>
}

/** Defaults are merged once; later setters may replace thumbnails with a partial input. */
export interface Option<Host> extends Omit<Required<OptionInput<Host>>, 'proxy' | 'subtitle' | 'thumbnails'> {
  proxy: OptionInput<Host>['proxy']
  subtitle: SubtitleOption
  thumbnails: Thumbnails
}
