import type { ContextmenuHost } from '../contextmenu/types'
import type { ControlHost } from '../control/types'
import type { LayerHost } from '../layer'
import type { MediaSurface } from '../media/types'
import type { PluginFactory } from '../plugins/types'
import type { SettingItem } from '../setting/types'
import type { UrlHost } from '../source/types'
import type { OptionInput, ResolvedOption } from './types'
import resolveOption from './resolve'

interface RuntimeCallbacks<Host> {
  proxy?: (this: Host, art: Host) => unknown
  plugins: PluginFactory<Host>[]
  customType: UrlHost<MediaSurface, Host>['option']['customType']
  layers: LayerHost['option']['layers']
  controls: ControlHost['option']['controls']
  contextmenu: ContextmenuHost['option']['contextmenu']
  settings: SettingItem[]
}

export type RuntimeOption<Host> = Omit<ResolvedOption, keyof RuntimeCallbacks<Host>> & RuntimeCallbacks<Host>

export default function resolveRuntimeOption<Host>(input: OptionInput, defaults: ResolvedOption): RuntimeOption<Host> {
  // The external declaration facade and internal module views describe the same
  // caller-owned callbacks. Do not wrap, clone or rebind their runtime identity.
  // All non-callback options still derive directly from the validated merge type.
  return resolveOption(input, defaults) as unknown as RuntimeOption<Host>
}
