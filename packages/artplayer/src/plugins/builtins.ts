import type { BuiltinRegistry, PluginHost } from './types'
import { isClosing } from '../lifecycle/instance'
import { isMobile } from '../utils/compatibility'
import autoOrientation from './autoOrientation'
import autoPlayback from './autoPlayback'
import fastForward from './fastForward'
import lock from './lock'
import miniProgressBar from './miniProgressBar'

export type BuiltinHost = Parameters<typeof miniProgressBar>[0]
  & Parameters<typeof lock>[0]
  & Parameters<typeof autoPlayback>[0]
  & Parameters<typeof autoOrientation>[0]
  & Parameters<typeof fastForward>[0]

export default function installBuiltins<Host extends PluginHost<Host> & BuiltinHost>(registry: BuiltinRegistry<Host>, option: PluginHost<Host>['option']): void {
  // Read each condition at its original turn; earlier plugins may change options.
  if (!isClosing(registry.art) && option.miniProgressBar && !option.isLive)
    registry.add(miniProgressBar)
  if (!isClosing(registry.art) && option.lock && isMobile)
    registry.add(lock)
  if (!isClosing(registry.art) && option.autoPlayback && !option.isLive)
    registry.add(autoPlayback)
  if (!isClosing(registry.art) && option.autoOrientation && isMobile)
    registry.add(autoOrientation)
  if (!isClosing(registry.art) && option.fastForward && isMobile && !option.isLive)
    registry.add(fastForward)
}
