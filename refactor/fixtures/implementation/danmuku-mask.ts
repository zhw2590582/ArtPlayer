import type Artplayer from 'artplayer'
import factory from '../../../packages/artplayer-plugin-danmuku-mask/src'

declare const art: Artplayer
const registration: { name: string, start: () => Promise<void>, stop: () => void } = factory({ opacity: 0, smoothSegmentation: false })(art)
export { registration }
