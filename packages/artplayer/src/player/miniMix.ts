import type { MiniHost, MiniProperty } from '../display/types'
import { mini } from '../display/mini'
import { def } from '../utils'

export default function miniMix(art: MiniHost): asserts art is MiniHost & MiniProperty {
  def(art, 'mini', mini(art))
}
