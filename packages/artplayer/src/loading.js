import { append, addClass, removeClass } from './utils';

export default class Loading {
    constructor(art) {
        this.art = art;
        const { $loading } = art.template;
        append($loading, art.icons.loading);
    }

    set show(value) {
        const { $player } = this.art.template;
        if (value) {
            this.state = true;
            addClass($player, 'art-loading-show');
            this.art.emit('loading:show');
        } else {
            this.state = false;
            removeClass($player, 'art-loading-show');
            this.art.emit('loading:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
