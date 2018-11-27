import optionValidator from 'option-validator';

export default class Whitelist {
    constructor(art) {
        const { whitelist } = art.option;
        const { userAgent } = window.navigator;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        this.state =
            !isMobile ||
            whitelist.some(item => {
                const type = optionValidator.kindOf(item);
                let result = false;
                switch (type) {
                    case 'string':
                        result = userAgent.indexOf(item) > -1;
                        break;
                    case 'function':
                        result = item(userAgent);
                        break;
                    case 'regexp':
                        result = item.test(userAgent);
                        break;
                    default:
                        break;
                }
                return result;
            });
    }
}
