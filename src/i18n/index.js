import ZHCN from "./zh-CN";
import ZHTW from "./zh-TW";
import EN from "./en";
import JP from "./jp";

const i18nMap = {
  "zh": ZHCN,
  "zh-CN": ZHCN,
  "zh-TW": ZHTW,
  "en": EN,
  "jp": JP
};

export default class I18n {
  constructor({ option }) {
    this.language = i18nMap[option.language || "en"];
  }

  get(key) {
    return this.language[key] || key;
  }
}
