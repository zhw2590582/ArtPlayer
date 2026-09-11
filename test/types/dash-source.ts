import type PublicFactory from 'artplayer-plugin-dash-control'
import factory from '../../packages/artplayer-plugin-dash-control/src/index'

const compatible: typeof PublicFactory = factory
const implementation: typeof factory = compatible
implementation({ quality: { getName: level => `${level.height}p` }, audio: { getName: track => track.lang || String(track.id) } })
compatible()
// @ts-expect-error Source and public declaration reject invalid formatter results.
factory({ quality: { getName: () => 1 } })
