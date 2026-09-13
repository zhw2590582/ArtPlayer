import type Artplayer from 'artplayer'
import factory from '../../../packages/artplayer-plugin-auto-thumbnail/src'

declare const art: Artplayer
const registration: Promise<{ name: string }> = factory({ width: 80, number: 5 })(art)
export { registration }
