import type Artplayer from 'artplayer'
import thumbnail from 'artplayer-plugin-auto-thumbnail'
import legacy from 'artplayer-plugin-auto-thumbnail/legacy'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
interface Option { url?: string, width?: number, number?: number, scale?: number }
interface Result { name: 'artplayerPluginAutoThumbnail' }
type HistoricalFactory = (option: Option) => (art: Artplayer) => Result
type ExactFactory = Assert<Equal<typeof thumbnail, HistoricalFactory>>
type ExactOption = Assert<Equal<Parameters<typeof thumbnail>, [option: Option]>>
type ExactResult = Assert<Equal<ReturnType<ReturnType<typeof thumbnail>>, Result>>
type ExactLegacy = Assert<Equal<typeof legacy, typeof thumbnail>>

declare const art: Artplayer
const result: Result = thumbnail({ url: '/video.mp4', width: 80, number: 12, scale: 0.5 })(art)
const replacement: typeof thumbnail = (_option: Option) => (_art: Artplayer) => result
const assignBack: HistoricalFactory = thumbnail
const legacyReplacement: typeof legacy = replacement
const moduleReplacement: typeof import('artplayer-plugin-auto-thumbnail') = { default: replacement }
const legacyName: Result['name'] = legacy({})(art).name
void [assignBack, legacyReplacement, moduleReplacement, legacyName]
export type { ExactFactory, ExactLegacy, ExactOption, ExactResult }
