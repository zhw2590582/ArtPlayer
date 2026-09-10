import type { PluginFactory } from '../../types/plugin'
import type { ResolvedOption } from '../option/types'

export type { PluginFactory } from '../../types/plugin'

export type PluginRegistration<Result, Registry>
  = unknown extends Result ? Registry | Promise<Registry>
    : Result extends Promise<unknown> ? Promise<Registry> : Registry

export interface PluginHost<Host> {
  option: Pick<ResolvedOption, 'miniProgressBar' | 'isLive' | 'lock' | 'autoPlayback' | 'autoOrientation' | 'fastForward'> & {
    plugins: PluginFactory<Host>[]
  }
}

export interface BuiltinRegistry<Host extends PluginHost<Host>> {
  art: Host
  add: (plugin: PluginFactory<Host>) => unknown
}
