import { append, setStyle } from './utils';

let id = 0;
export default class Layers {
  constructor(art) {
    this.art = art;
    this.add = this.add.bind(this);
    this.art.option.layers.filter(item => item.disable === false).forEach(this.add);
    this.init();
  }

  init() {
    const { refs, player, events: { proxy } } = this.art;
    proxy(refs.$layers, 'click', event => {
      if (event.path[0] === refs.$layers) {
        player.pause();
      }
    });
  }

  add(option, callback) {
    const { refs } = this.art;
    id++;

    const $layer = document.createElement('div');
    $layer.setAttribute('data-art-layer-id', id);
    $layer.setAttribute('class', `art-layer art-layer-${option.name || id}`);
    $layer.style.zIndex = option.index || id;
    append($layer, option.html);
    setStyle($layer, option.style || {});
    refs.$layers.appendChild($layer);
    this.art.emit('layers:add', $layer);
    callback && callback($layer);
  }

  show() {
    const { $layers } = this.art.refs;
    $layers.style.display = 'block';
    this.art.emit('layers:show', $layers);
  }

  hide() {
    const { $layers } = this.art.refs;
    $layers.style.display = 'none';
    this.art.emit('layers:hide', $layers);
  }
}
