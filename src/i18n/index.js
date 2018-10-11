import ZHCN from './zh-CN';
import ZHTW from './zh-TW';
import EN from './en';
import JP from './jp';

const i18nMap = {
  zh: ZHCN,
  'zh-cn': ZHCN,
  'zh-tw': ZHTW,
  en: EN,
  jp: JP
};

export default class I18n {
  constructor({ option }) {
    this.language = i18nMap[option.lang.toLowerCase()] || i18nMap.en;
  }

  get(key) {
    return this.language[key] || key;
  }
}
