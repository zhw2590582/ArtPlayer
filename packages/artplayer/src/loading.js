import { append } from './utils';

export default class Loading {
    constructor(art) {
        this.art = art;
        const { $loading } = art.template;
        append($loading, art.icons.loading);
    }

    show() {
        const { $player } = this.art.template;
        this.state = true;
        $player.classList.add('artplayer-loading-show');
        this.art.emit('loading:show');
    }

    hide() {
        const { $player } = this.art.template;
        this.state = false;
        $player.classList.remove('artplayer-loading-show');
        this.art.emit('loading:hide');
    }
}
