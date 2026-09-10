import type { MediaHost } from '../media/hosts'
import { def } from '../utils'

type LoadedHost = MediaHost<Pick<HTMLMediaElement, 'duration' | 'buffered'>>
interface LoadedState {
  readonly loaded: number
  readonly loadedTime: number
}

export default function loadedMix(art: LoadedHost): asserts art is LoadedHost & LoadedState {
  const { $video } = art.template
  const target = art as LoadedHost & LoadedState
  def(art, 'loaded', { get: () => target.loadedTime / $video.duration })
  def(art, 'loadedTime', {
    get: () => $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0,
  })
}
