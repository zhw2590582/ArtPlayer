import type { RuntimeConstructor } from 'artplayer-tool-iframe'
import type Public from 'artplayer-tool-iframe'
import Implementation from '../../packages/artplayer-tool-iframe/src/index'

// @ts-expect-error Historical callback is non-null; actual runtime permits null. Keep this legacy mismatch explicit.
const oldView: typeof Public = Implementation
const actualView: RuntimeConstructor = Implementation
void [oldView, actualView]
