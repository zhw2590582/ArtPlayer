import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';

export default class Danmu {
  constructor(option) {
    this.option = option;
  }

  apply(art) {
    const { $control } = this.option;
    const { events: { proxy }, i18n, danmu } = art;
    this.$danmu = append($control, icons.danmu);
    tooltip(this.$danmu, i18n.get('Hide danmu'));
    proxy($control, 'click', () => {
      if (danmu.isOpen) {
        danmu.hide();
        setStyle(this.$danmu, 'opacity', '1');
        tooltip(this.$danmu, i18n.get('Show danmu'));
      } else {
        danmu.show();
        setStyle(this.$danmu, 'opacity', '0.8');
        tooltip(this.$danmu, i18n.get('Hide danmu'));
      }
    });
  }
}
