import { append, tooltip, setStyle } from '../utils';
import icons from '../icons';

export default class Setting {
  constructor(option) {
    this.option = option;
  }

  apply(art, $control) {
    const { events: { proxy }, i18n, setting } = art;
    this.$setting = append($control, icons.setting);
    tooltip(this.$setting, i18n.get('Show setting'));
    proxy($control, 'click', () => {
      if (setting.isOpen) {
        setting.hide();
        setStyle(this.$setting, 'opacity', '1');
        tooltip(this.$setting, i18n.get('Show setting'));
      } else {
        setting.show();
        setStyle(this.$setting, 'opacity', '0.8');
        tooltip(this.$setting, i18n.get('Hide setting'));
      }
    });
  }
}
