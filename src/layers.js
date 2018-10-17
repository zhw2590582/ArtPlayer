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

    refs.$layers.insertAdjacentHTML('beforeend', `
      <div
        data-art-layer-id="${id}"
        class="art-layer art-layer-${option.name || id}"
        style="z-index: ${option.index || id}"
      >
        ${option.html || ''}
      </div>
    `);

    const $layer = refs.$layers.querySelector(`[data-art-layer-id="${id}"]`);
    callback && callback($layer);
  }

  show() {
    this.art.refs.$layers.style.display = 'block';
  }

  hide() {
    this.art.refs.$layers.style.display = 'none';
  }
}
