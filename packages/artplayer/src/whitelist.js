import { userAgent, isMobile } from './utils';

export default class Whitelist {
    constructor(art) {
        this.art = art;
    }

    get state() {
        const {
            option,
            constructor: { kindOf },
        } = this.art;

        return (
            !isMobile ||
            !option.whitelist.length ||
            option.whitelist.some((item) => {
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
