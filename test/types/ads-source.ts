import type { Factory, RuntimeFactory } from 'artplayer-plugin-ads'
import factory from '../../packages/artplayer-plugin-ads/src/index'

const compatible: Factory = factory
const precise: RuntimeFactory = factory
const acceptsCompatible: typeof factory = compatible
void [compatible, precise, acceptsCompatible]
