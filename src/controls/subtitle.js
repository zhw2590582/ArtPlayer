import { append, tooltip } from '../utils';
import icons from '../icons';

export default class Subtitle {
  constructor(option) {
    this.option = option;
  }

  apply(art) {
    const { events: { proxy }, subtitle, i18n } = art;
    this.$subtitle = append(this.option.$control, icons.subtitle);
    tooltip(this.$subtitle, i18n.get('Hide subtitle'));

    proxy(this.$subtitle, 'click', () => {
      if (subtitle.isShow) {
        subtitle.hide();
        tooltip(this.$subtitle, i18n.get('Show subtitle'));
        this.$subtitle.style.opacity = '.5';
      } else {
        subtitle.show();
        tooltip(this.$subtitle, i18n.get('Hide subtitle'));
        this.$subtitle.style.opacity = '1';
      }
    });
  }
}
