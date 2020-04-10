import { isMobile, userAgent } from './utils/compatibility';

export default class Whitelist {
    constructor(art) {
        const {
            constructor: { kindOf },
            option: { whitelist },
        } = art;
        this.ua = userAgent;
        this.isMobile = isMobile();
        this.state =
            !this.isMobile ||
            whitelist.some((item) => {
                switch (kindOf(item)) {
                    case 'string':
                        return this.ua.indexOf(item) > -1;
                    case 'function':
                        return item(this.ua);
                    case 'regexp':
                        return item.test(this.ua);
                    default:
                        return false;
                }
            });
    }
}
