import { userAgent, isMobile } from './utils';

export default class Whitelist {
    constructor(art) {
        this.art = art;
    }

    get state() {
        const {
            constructor: { kindOf },
            option: { whitelist },
        } = this.art;
        return (
            !isMobile ||
            whitelist.some((item) => {
                switch (kindOf(item)) {
                    case 'string':
                        return item === '*' || userAgent.indexOf(item) > -1;
                    case 'function':
                        return item(userAgent);
                    case 'regexp':
                        return item.test(userAgent);
                    default:
                        return false;
                }
            })
        );
    }
}
