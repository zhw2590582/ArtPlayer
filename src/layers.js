let id = 0;
export default class Layers {
  constructor(art) {
    this.art = art;
  }

  add(option) {
    const { refs } = this.art;
    id++;
    refs.$layers.insertAdjacentHTML('beforeend', `
      <div data-layer-index="${id}" class="art-layer art-layer-${option.name}" style="z-index: ${option.index || id}">
        ${option.html}
      </div>
    `);
  }
}
