export default class Whitelist {
    constructor(art) {
        const {
            constructor: { kindOf },
            option: { whitelist },
        } = art;
        this.ua = navigator.userAgent;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.ua);
        this.state =
            !this.isMobile ||
            whitelist.some(item => {
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
