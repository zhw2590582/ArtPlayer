import { mergeDeep } from '../utils';
import zhCn from './zh-cn';

export default class I18n {
    constructor(art) {
        this.art = art;

        this.languages = {
            'zh-cn': zhCn,
        };

        this.language = {};

        this.update(art.option.i18n);
    }

    init() {
        const lang = this.art.option.lang.toLowerCase();
        this.language = this.languages[lang] || {};
    }

    get(key) {
        return this.language[key] || key;
    }

    update(value) {
        this.languages = mergeDeep(this.languages, value);
        this.init();
    }
}
