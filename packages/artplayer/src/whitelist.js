import optionValidator from 'option-validator';

export default class Whitelist {
    constructor(art) {
        const { whitelist } = art.option;
        this.userAgent = window.navigator.userAgent;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.userAgent);
        this.state =
            !this.isMobile ||
            whitelist.some(item => {
                const type = optionValidator.kindOf(item);
                let result = false;
                switch (type) {
                    case 'string':
                        result = this.userAgent.indexOf(item) > -1;
                        break;
                    case 'function':
                        result = item(this.userAgent);
                        break;
                    case 'regexp':
                        result = item.test(this.userAgent);
                        break;
                    default:
                        break;
                }
                return result;
            });
    }
}
