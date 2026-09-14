import type Artplayer from 'artplayer'
import type { WorkspaceContext } from '../types/runtime-api.js'

export type Utilities = Pick<typeof Artplayer.utils, 'createElement' | 'setStyles'>
export type { CompatibilityOptions, WorkspaceContext as Context, RequestConfig, RuntimeResult as Result } from '../types/runtime-api.js'
export type Callback = (context: WorkspaceContext) => unknown
