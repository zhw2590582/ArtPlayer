import type { AutoHeightHost, AutoSizeHost } from '../../packages/artplayer/src/display/sizing-types'
import { containSize, proportionalHeight } from '../../packages/artplayer/src/display/sizing'
import autoHeightMix from '../../packages/artplayer/src/player/autoHeightMix'
import autoSizeMix from '../../packages/artplayer/src/player/autoSizeMix'

declare const sizeHost: AutoSizeHost
declare const heightHost: AutoHeightHost
autoSizeMix(sizeHost)
autoHeightMix(heightHost)
const height: number | undefined = proportionalHeight(640, { width: 1920, height: 1080 })
const size = containSize({ width: 640, height: 480 }, 16 / 9)
if (size) {
  const axis: 'width' | 'height' = size.axis
  sizeHost.emit('autoSize', { width: size.width, height: size.height })
  void axis
}
// @ts-expect-error The internal measurement cannot be a CSS string.
heightHost.emit('autoHeight', '360px')
// @ts-expect-error Dimensions must describe both axes.
proportionalHeight(640, { width: 1920 })
export { height }
