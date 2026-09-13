import type Artplayer from 'artplayer'
import type { RuntimeFactory, RuntimeResult } from '../../../packages/artplayer-plugin-jassub/types/runtime-api.js'
import factory from '../../../packages/artplayer-plugin-jassub/src'

declare const art: Artplayer
const registration: RuntimeResult = factory()(art)
const publicFactory: RuntimeFactory = factory
export { publicFactory, registration }
