import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';

export default class Danmu {
  constructor(option) {
    this.option = option;
  }

  apply(art) {
    const { events: { proxy }, danmu, i18n } = art;
    this.$danmu = append(this.option.$control, icons.danmu);
    this.$danmuClose = append(this.option.$control, icons.danmuClose);
    tooltip(this.$danmu, i18n.get('Hide danmu'));
    tooltip(this.$danmuClose, i18n.get('Show danmu'));
    setStyle(this.$danmuClose, 'display', 'none');

    proxy(this.$danmu, 'click', () => {
      danmu.hide();
      setStyle(this.$danmu, 'display', 'none');
      setStyle(this.$danmuClose, 'display', 'flex');
    });

    proxy(this.$danmuClose, 'click', () => {
      danmu.show();
      setStyle(this.$danmu, 'display', 'flex');
      setStyle(this.$danmuClose, 'display', 'none');
    });
  }
}
