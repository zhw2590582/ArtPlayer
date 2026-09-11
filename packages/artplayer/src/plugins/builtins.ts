import type { BuiltinRegistry, PluginFactory, PluginHost } from './types'
import { isClosing } from '../lifecycle/instance'
import { isMobile } from '../utils/compatibility'
import autoOrientation from './autoOrientation'
import autoPlayback from './autoPlayback'
import fastForward from './fastForward'
import lock from './lock'
import miniProgressBar from './miniProgressBar'

export default function installBuiltins<Host extends PluginHost<Host>>(registry: BuiltinRegistry<Host>, option: PluginHost<Host>['option']): void {
  // Read each condition at its original turn; earlier plugins may change options.
  if (!isClosing(registry.art) && option.miniProgressBar && !option.isLive)
    registry.add(miniProgressBar)
  if (!isClosing(registry.art) && option.lock && isMobile)
    registry.add(lock)
  if (!isClosing(registry.art) && option.autoPlayback && !option.isLive)
    registry.add(autoPlayback)
  if (!isClosing(registry.art) && option.autoOrientation && isMobile) {
    // The JS constructor supplies the complete host before builtin installation.
    registry.add(autoOrientation as unknown as PluginFactory<Host>)
  }
  if (!isClosing(registry.art) && option.fastForward && isMobile && !option.isLive)
    registry.add(fastForward)
}
