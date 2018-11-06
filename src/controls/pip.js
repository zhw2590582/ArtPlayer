import { append } from '../utils';

export default class Pip {
  constructor(option) {
    this.option = option;
  }

  apply(art, $control) {
    const { events: { proxy }, i18n, player } = art;
    this.$pip = append($control, '画中画');
    proxy($control, 'click', () => {
      player.pipToggle();
    });
  }
}
