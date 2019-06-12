export default class Whitelist {
    constructor(art) {
        const { kindOf } = art.constructor;
        const { whitelist } = art.option;
        this.userAgent = window.navigator.userAgent;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.userAgent);
        this.state =
            !this.isMobile ||
            whitelist.some(item => {
                const type = kindOf(item);
                switch (type) {
                    case 'string':
                        return this.userAgent.indexOf(item) > -1;
                    case 'function':
                        return item(this.userAgent);
                    case 'regexp':
                        return item.test(this.userAgent);
                    default:
                        return false;
                }
            });
    }
}
