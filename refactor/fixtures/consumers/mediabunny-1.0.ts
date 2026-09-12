import Artplayer from 'artplayer'
import factory from 'artplayer-proxy-mediabunny'

type Option = Parameters<typeof factory>[0]
const art = new Artplayer({ container: '#player', url: 'movie.mp4', proxy: factory() })
const replacement: typeof factory = (_option?: Option) => (_art: Artplayer) => document.createElement('canvas')
const canvas: ReturnType<ReturnType<typeof factory>> = document.createElement('canvas')
factory()
factory(undefined)
factory({ volume: 0.7, source: new Blob([]), loadTimeout: 1000 })(art)
void [replacement, canvas]
