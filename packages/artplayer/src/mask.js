import { append, addClass, removeClass } from './utils';

export default class Mask {
    constructor(art) {
        this.art = art;
        const { $state } = art.template;
        append($state, art.icons.state);
    }

    set show(value) {
        const { $player } = this.art.template;
        if (value) {
            this.state = true;
            addClass($player, 'art-mask-show');
            this.art.emit('mask:show');
        } else {
            this.state = false;
            removeClass($player, 'art-mask-show');
            this.art.emit('mask:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
