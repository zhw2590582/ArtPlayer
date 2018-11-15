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
    const layer = typeof item === 'function' ? item(this.art) : item;
    if (!layer.disable) {
      id++;
      const { refs: { $layers }, events: { proxy } } = this.art;
      const name = layer.name || `layer${id}`;
      const $layer = document.createElement('div');
      $layer.classList.value = `art-layer art-layer-${name}`;
      setStyles($layer, layer.style || {});
      append($layer, layer.html);
      if (layer.click) {
        proxy($layer, 'click', event => {
          event.preventDefault();
          layer.click.call(this, event);
          this.art.emit('layers:click', $layer);
        });
      }
      insertByIndex($layers, $layer, layer.index || id);
      this[name] = $layer;
      item.callback && item.callback($layer);
      callback && callback($layer);
      this.art.emit('layers:add', $layer);
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
