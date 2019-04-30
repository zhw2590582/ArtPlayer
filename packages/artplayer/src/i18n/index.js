import { mergeDeep } from '../utils';
import zhCn from './zh-cn';
import zhTw from './zh-tw';

export default class I18n {
    constructor(art) {
        this.art = art;
        this.languages = {
            'zh-cn': zhCn,
            'zh-tw': zhTw,
        };
        this.init();
    }

    init() {
        this.language = this.languages[this.art.option.lang.toLowerCase()] || {};
    }

    get(key) {
        return this.language[key] || key;
    }

    update(value) {
        this.languages = mergeDeep(this.languages, value);
        this.init();
    }
}
