import type Artplayer from 'artplayer'
import type { Factory, Result, RuntimeFactory } from '../../../packages/artplayer-plugin-auto-thumbnail/types/runtime-api'
import factory from '../../../packages/artplayer-plugin-auto-thumbnail/src'

declare const art: Artplayer
const registration: Promise<Result> = factory({ width: 80, number: 5 })(art)
const publicFactory: Factory = factory
const runtimeFactory: RuntimeFactory = factory
export { publicFactory, registration, runtimeFactory }
