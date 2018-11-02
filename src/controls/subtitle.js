import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';

export default class Subtitle {
  constructor(option) {
    this.option = option;
  }

  apply(art) {
    const { $control } = this.option;
    const { events: { proxy }, i18n, subtitle } = art;
    this.$subtitle = append($control, icons.subtitle);
    tooltip(this.$subtitle, i18n.get('Hide subtitle'));
    proxy($control, 'click', () => {
      if (subtitle.isOpen) {
        subtitle.hide();
        setStyle(this.$subtitle, 'opacity', '1');
        tooltip(this.$subtitle, i18n.get('Show subtitle'));
      } else {
        subtitle.show();
        setStyle(this.$subtitle, 'opacity', '0.8');
        tooltip(this.$subtitle, i18n.get('Hide subtitle'));
      }
    });
  }
}
