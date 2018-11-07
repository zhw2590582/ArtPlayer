import { append, setStyles, setStyle } from './utils';

let id = 0;
export default class Layers {
  constructor(art) {
    this.art = art;
    this.add = this.add.bind(this);
    this.art.option.layers.filter(item => !item.disable).forEach(this.add);
  }

  add(option, callback) {
    const { refs: { $layers } } = this.art;
    id++;
    const $layer = document.createElement('div');
    $layer.dataset.artLayerIndex = option.index || id;
    $layer.setAttribute('class', `art-layer art-layer-${option.name || id}`);
    setStyle($layer, 'z-index', option.index || id);
    append($layer, option.html);
    setStyles($layer, option.style || {});
    $layers.appendChild($layer);
    this.art.emit('layers:add', $layer);
    callback && callback($layer);
  }

  show() {
    const { $layers } = this.art.refs;
    setStyle($layers, 'display', 'block');
    this.art.emit('layers:show', $layers);
  }

  hide() {
    const { $layers } = this.art.refs;
    setStyle($layers, 'display', 'none');
    this.art.emit('layers:hide', $layers);
  }
}
