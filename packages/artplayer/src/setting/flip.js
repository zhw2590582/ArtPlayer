import { append, inverseClass } from '../utils';

export default class Flip {
  constructor(option) {
    this.option = option;
  }

  apply(art, $setting) {
    const { i18n, events: { proxy }, player } = art;
    this.$header = $setting.querySelector('.art-setting-header');
    this.$body = append($setting, `
      <div class="art-setting-body">
        <span class="art-setting-btn" data-flip="horizontal">${i18n.get('Horizontal')}</span>
        <span class="art-setting-btn" data-flip="vertical">${i18n.get('Vertical')}</span>
      </div>
    `);

    proxy(this.$body, 'click', event => {
      const { target } = event;
      const { flip } = target.dataset;
      if (flip) {
        player.flip(flip);
        inverseClass(target, 'current');
      }
    });
  }
}
