let id = 0;
export default class Layers {
  constructor(art) {
    this.art = art;
    this.add = this.add.bind(this);
    this.art.option.layers.forEach(this.add);
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

    if (option.html instanceof Element) {
      $layer.appendChild(option.html);
    } else {
      $layer.innerHTML = option.html;
    }

    if (option.style) {
      Object.keys(option.style).forEach(key => {
        $layer.style[key] = option.style[key];
      });
    }

    refs.$layers.appendChild($layer);
    callback && callback($layer);
  }

  show() {
    this.art.refs.$layers.style.display = 'block';
  }

  hide() {
    this.art.refs.$layers.style.display = 'none';
  }
}
