let id = 0;
export default class Layers {
  constructor(art) {
    this.art = art;
    this.add = this.add.bind(this);
    this.art.option.layers.forEach(this.add);
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
}
