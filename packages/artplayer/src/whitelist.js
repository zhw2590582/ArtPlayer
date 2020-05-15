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
                        return item === '*' || art.ua.indexOf(item) > -1;
                    case 'function':
                        return item(art.ua);
                    case 'regexp':
                        return item.test(art.ua);
                    default:
                        return false;
                }
            });
    }
}
