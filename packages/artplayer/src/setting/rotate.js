import { append, inverseClass } from '../utils';

export default class Rotate {
  constructor(option) {
    this.option = option;
  }

  apply(art, $setting) {
    const { events: { proxy }, player } = art;
    this.$header = $setting.querySelector('.art-setting-header');
    this.$body = append($setting, `
      <div class="art-setting-body">
        <span class="art-setting-btn" data-rotate="0">0°</span>
        <span class="art-setting-btn" data-rotate="90">90°</span>
        <span class="art-setting-btn" data-rotate="180">180°</span>
        <span class="art-setting-btn" data-rotate="270">270°</span>
      </div>
    `);

    proxy(this.$body, 'click', event => {
      const { target } = event;
      const { rotate } = target.dataset;
      if (rotate) {
        player.rotate(Number(rotate));
        inverseClass(target, 'current');
      }
    });
  }
}
