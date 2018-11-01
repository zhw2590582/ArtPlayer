import { append } from '../utils';

export default class Quality {
  constructor(option) {
    this.option = option;
  }

  apply(art) {
    this.art = art;
    const { option, events: { proxy, hover }, player } = this.art;
    const defaultQuality = option.quality.find(item => item.default) || option.quality[0];
    const $qualityName = append(this.option.$control, `<div class="art-quality-name">${defaultQuality.name}</div>`);
    const qualityList = option.quality.map((item, index) => `<div class="art-quality-item" data-index="${index}">${item.name}</div>`).join('');
    const $qualitys = append(this.option.$control, `<div class="art-qualitys">${qualityList}</div>`);

    hover(this.option.$control, () => {
      this.option.$control.classList.add('hover');
    }, () => {
      this.option.$control.classList.remove('hover');
    });

    proxy($qualitys, 'click', event => {
      const { url, name } = option.quality[event.target.dataset.index];
      if (url && name) {
        player.switch(url, name);
        $qualityName.innerHTML = name;
      }
    });
  }
}
