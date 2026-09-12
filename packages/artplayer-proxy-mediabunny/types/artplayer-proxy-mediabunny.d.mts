import type Artplayer from 'artplayer'
import type { Option, Result } from './artplayer-proxy-mediabunny.js'

declare const artplayerProxyMediabunny: (option?: Option) => (art: Artplayer) => Result
export default artplayerProxyMediabunny
export type { HlsAudio, HlsLevel, HlsState, MediaBunnyCanvas, MediaBunnyPlayer, MediaBunnyShim, MediaListener, Option, Result, SyntheticFrameCallback, SyntheticFrameMetadata } from './artplayer-proxy-mediabunny.js'
