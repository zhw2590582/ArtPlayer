import Artplayer from 'artplayer'
import chromecast from 'artplayer-plugin-chromecast'

interface Option { url?: string, sdk?: string, icon?: string, mimeType?: string }
interface Result { name: 'artplayerPluginChromecast' }
type Factory = (option: Option) => (art: Artplayer) => Result
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type SameArguments = Assert<Equal<Parameters<typeof chromecast>, [option: Option]>>
type SameResult = Assert<Equal<ReturnType<ReturnType<typeof chromecast>>, Result>>
const replacement: Factory = (_option: Option) => (_art: Artplayer) => ({ name: 'artplayerPluginChromecast' })
const toOld: Factory = chromecast
const fromOld: typeof chromecast = replacement
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [chromecast({})] })
const name: 'artplayerPluginChromecast' = chromecast({ url: '/cast.mp4', sdk: '/sdk.js', icon: '<b>Cast</b>', mimeType: 'video/mp4' })(art).name
void [toOld, fromOld, name]
export type { SameArguments, SameResult }
