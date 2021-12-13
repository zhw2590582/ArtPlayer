import { userAgent, isMobile } from './utils';

export default class Whitelist {
    constructor(art) {
        const {
            constructor: { kindOf },
            option: { whitelist },
        } = art;
        this.state =
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
            });
    }
}
