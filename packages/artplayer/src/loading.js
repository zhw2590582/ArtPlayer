import { append } from './utils';

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
            $player.classList.add('artplayer-loading-show');
            this.art.emit('loading:show');
        } else {
            this.state = false;
            $player.classList.remove('artplayer-loading-show');
            this.art.emit('loading:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
