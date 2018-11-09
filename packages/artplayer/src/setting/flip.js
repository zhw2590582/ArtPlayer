import { append, inverseClass } from '../utils';

export default class Flip {
  constructor(option) {
    this.option = option;
  }

  apply(art, $setting) {
    const { i18n, events: { proxy }, player } = art;
    this.$header = $setting.querySelector('.art-setting-header');
    this.$body = $setting.querySelector('.art-setting-body');
    this.$btns = append(this.$body, `
      <div class="art-setting-btns">
        <div class="art-setting-btn current">
          <span data-flip="normal">${i18n.get('Normal')}</span>
        </div>
        <div class="art-setting-btn">
          <span data-flip="horizontal">${i18n.get('Horizontal')}</span>
        </div>
        <div class="art-setting-btn">
          <span data-flip="vertical">${i18n.get('Vertical')}</span>
        </div>
      </div>
    `);

    proxy(this.$btns, 'click', event => {
      const { target } = event;
      const { flip } = target.dataset;
      if (flip) {
        player.flip(flip);
        inverseClass(target, 'current');
      }
    });
  }
}
