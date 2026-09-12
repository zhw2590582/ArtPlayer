import Artplayer from 'artplayer'
import factory from 'artplayer-proxy-mediabunny'

const art = new Artplayer({ container: '#player', url: 'movie.mp4', proxy: factory() })
type Option = NonNullable<Parameters<typeof factory>[0]>
type HistoricalFactory = (option?: Option) => (art: Artplayer) => HTMLCanvasElement
const assignOld: HistoricalFactory = factory
const assignNew: typeof factory = (_option?: Option) => (_art: Artplayer) => document.createElement('canvas')
const initializer: ReturnType<typeof factory> = () => document.createElement('canvas')
const canvas: ReturnType<ReturnType<typeof factory>> = document.createElement('canvas')
const options: Option = {
  source: new ReadableStream<Uint8Array>(),
  loadTimeout: 1000,
  timeupdateInterval: 250,
  avSyncTolerance: 0.12,
  dropLateFrames: false,
  poster: 'poster.jpg',
  preflightRange: false,
  volume: 0.7,
  muted: false,
  autoplay: false,
  loop: false,
  crossOrigin: 'anonymous',
  m3u8: {
    quality: { control: true, setting: true, title: 'Quality', auto: 'Auto', getName: level => `${level.id}/${level.index}/${level.name}/${level.height}/${level.bitrate}` },
    audio: { control: true, setting: true, title: 'Audio', auto: 'Auto', getName: track => `${track.id}/${track.index}/${track.name}/${track.lang}/${track.language}/${track.bitrate}` },
  },
}
factory()
factory(undefined)
factory(options)(art).getContext('2d')
factory({ source: new Blob([]) })
factory({ source: 'movie.mp4' })
void [assignOld, assignNew, initializer, canvas]
