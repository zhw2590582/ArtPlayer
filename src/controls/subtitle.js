import { append, tooltip } from '../utils';
import icons from '../icons';

export default class Subtitle {
  constructor(option) {
    this.option = option;
  }

  apply(art) {
    const { events: { proxy }, subtitle, i18n } = art;
    this.$subtitle = append(this.option.$control, icons.subtitle);
    this.$subtitleClose = append(this.option.$control, icons.subtitleClose);
    tooltip(this.$subtitle, i18n.get('Hide subtitle'));
    tooltip(this.$subtitleClose, i18n.get('Show subtitle'));
    this.$subtitleClose.style.display = 'none';

    proxy(this.$subtitle, 'click', () => {
      subtitle.hide();
      this.$subtitle.style.display = 'none';
      this.$subtitleClose.style.display = 'block';
    });

    proxy(this.$subtitleClose, 'click', () => {
      subtitle.show();
      this.$subtitle.style.display = 'block';
      this.$subtitleClose.style.display = 'none';
    });
  }
}
