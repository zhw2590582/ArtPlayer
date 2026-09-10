import type { SwitchHost, SwitchMethods } from '../source/types'
import { switchSource } from '../source/switch'
import { def } from '../utils'

export default function switchMix(art: SwitchHost): asserts art is SwitchHost & SwitchMethods {
  const switchUrl = (url: string) => switchSource(art, url, 0)
  def(art, 'switchQuality', { value: (url: string) => switchSource(art, url, art.currentTime) })
  def(art, 'switchUrl', { value: switchUrl })
  def(art, 'switch', { set: switchUrl })
}
