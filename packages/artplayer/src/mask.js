import { append, addClass, removeClass } from './utils';

export default class Mask {
    constructor(art) {
        this.art = art;
        const { $mask } = art.template;
        const $playBig = append($mask, '<div class="art-state"></div>');
        append($playBig, art.icons.state);
    }

    set show(value) {
        const { $player } = this.art.template;
        if (value) {
            this.state = true;
            addClass($player, 'artplayer-mask-show');
            this.art.emit('mask:show');
        } else {
            this.state = false;
            removeClass($player, 'artplayer-mask-show');
            this.art.emit('mask:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
