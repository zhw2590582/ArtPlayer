import { append, tooltip } from '../utils';
import icons from '../icons';

export default class Pip {
  constructor(option) {
    this.option = option;
  }

  apply(art, $control) {
    const { events: { proxy }, i18n, player } = art;
    this.$pip = append($control, icons.pip);
    tooltip(this.$pip, i18n.get('Mini player'));
    proxy($control, 'click', () => {
      player.pipEnabled();
    });
  }
}
