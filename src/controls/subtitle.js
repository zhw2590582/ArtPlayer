import { append, tooltip, setStyle } from '../utils';
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
    setStyle(this.$subtitleClose, 'display', 'none');

    proxy(this.$subtitle, 'click', () => {
      subtitle.hide();
      setStyle(this.$subtitle, 'display', 'none');
      setStyle(this.$subtitleClose, 'display', 'block');
    });

    proxy(this.$subtitleClose, 'click', () => {
      subtitle.show();
      setStyle(this.$subtitle, 'display', 'block');
      setStyle(this.$subtitleClose, 'display', 'none');
    });
  }
}
