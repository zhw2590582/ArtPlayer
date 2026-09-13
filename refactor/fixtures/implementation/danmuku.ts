import type { RuntimeFactory } from 'artplayer-plugin-danmuku/runtime'
import factory from '../../../packages/artplayer-plugin-danmuku/src'

// Compile with the package configuration: the implementation imports Worker assets.
const implementation: RuntimeFactory = factory
export { implementation }
