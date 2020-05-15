export default class Whitelist {
    constructor(art) {
        const {
            constructor: { kindOf },
            option: { whitelist },
        } = art;
        this.state =
            !art.isMobile ||
            whitelist.some((item) => {
                switch (kindOf(item)) {
                    case 'string':
                        return item === '*' || art.userAgent.indexOf(item) > -1;
                    case 'function':
                        return item(art.userAgent);
                    case 'regexp':
                        return item.test(art.userAgent);
                    default:
                        return false;
                }
            });
    }
}
