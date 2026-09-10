import type { ComponentHost, EntryInput } from './component/types'
import Component from './utils/component'

export interface LayerHost extends ComponentHost {
  option: { layers: EntryInput<LayerHost>[] }
  template: { $player: HTMLElement, $layer: HTMLElement }
}

export default class Layer extends Component<LayerHost> {
  constructor(art: LayerHost) {
    super(art)
    const { option, template: { $layer } } = art
    this.name = 'layer'
    this.$parent = $layer
    for (let index = 0; index < option.layers.length; index++)
      this.add(option.layers[index]!)
  }
}
