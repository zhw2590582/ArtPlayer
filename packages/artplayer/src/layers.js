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
      const { refs: { $layers }, events: { proxy } } = this.art;
      id++;
      const name = item.name || `layer${id}`;
      const $layer = document.createElement('div');
      $layer.setAttribute('class', `art-layer art-layer-${name}`);
      setStyle($layer, 'z-index', item.index || id);
      append($layer, item.html);
      setStyles($layer, item.style || {});
      if (item.click) {
        proxy($layer, 'click', event => {
          event.preventDefault();
          item.click.call(this, event);
          this.art.emit('layers:click', $layer);
        });
      }
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
