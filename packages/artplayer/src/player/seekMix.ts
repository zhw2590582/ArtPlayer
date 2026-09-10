import type { SeekHost, SeekMethods } from '../media/playback'
import { def, secondToTime } from '../utils'

export default function seekMix(art: SeekHost): asserts art is SeekHost & SeekMethods {
  const { notice } = art
  def(art, 'seek', {
    set(time: number | string) {
      art.currentTime = time
      if (art.duration)
        notice.show = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`
      art.emit('seek', art.currentTime, time)
    },
  })
  // The seek descriptor is installed above; preserve forwarding through it.
  const target = art as SeekHost & SeekMethods
  def(art, 'forward', {
    set(time: number) {
      target.seek = art.currentTime + time
    },
  })
  def(art, 'backward', {
    set(time: number) {
      target.seek = art.currentTime - time
    },
  })
}
