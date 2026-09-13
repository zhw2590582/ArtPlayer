import type Artplayer from 'artplayer'
import type { Option } from 'artplayer'
import type { ComponentProps } from 'react'
import Player from './src/Player'

const option: Partial<Option> = { url: '/pattern.mp4' }
const props: ComponentProps<typeof Player> = {
  option,
  getInstance(art: Artplayer) { art.pause() },
  style: { width: 640 },
  className: 'consumer-container',
  onClick(event) { event.currentTarget.dataset.clicked = 'yes' },
}
export const valid = <Player {...props} />
export const optional = <Player option={{}} />
// @ts-expect-error The historical callback receives a player, not a media element.
export const wrongCallback = <Player option={option} getInstance={(video: HTMLVideoElement) => video.pause()} />
// @ts-expect-error Native div attributes retain their original types.
export const wrongStyle = <Player option={option} style="width: 640px" />
// @ts-expect-error Player options still enforce field types.
export const wrongOption = <Player option={{ url: 123 }} />
