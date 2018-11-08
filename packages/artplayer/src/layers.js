import { append, setStyles, setStyle, insertByIndex } from './utils';

let id = 0;
export default class Layers {
  constructor(art) {
    id = 0;
    this.art = art;
    this.add = this.add.bind(this);
    this.art.option.layers.forEach(item => {
      this.add(item);
    });
  }

  add(item, callback) {
    if (!item.disable) {
      const { refs: { $layers } } = this.art;
      id++;
      const $layer = document.createElement('div');
      $layer.setAttribute('class', `art-layer art-layer-${item.name || id}`);
      setStyle($layer, 'z-index', item.index || id);
      append($layer, item.html);
      setStyles($layer, item.style || {});
      this.art.emit('layers:add', $layer);
      callback && callback($layer);
      insertByIndex($layers, $layer, item.index || id);
    }
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
