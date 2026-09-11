import type PublicFactory from 'artplayer-plugin-hls-control'
import factory from '../../packages/artplayer-plugin-hls-control/src/index'

const compatible: typeof PublicFactory = factory
const implementation: typeof factory = compatible
implementation({ quality: { getName: level => `${level.height}P` }, audio: { getName: track => track.name } })
compatible()
// @ts-expect-error Source and public declaration both reject non-string formatter results.
factory({ quality: { getName: () => 1 } })
