import { append } from './utils';

export default class Mask {
    constructor(art) {
        this.art = art;
        const { $mask } = art.template;
        const $playBig = append($mask, '<div class="art-state"></div>');
        append($playBig, art.icons.state);
    }

    show() {
        const { $player } = this.art.template;
        this.state = true;
        $player.classList.add('artplayer-mask-show');
        this.art.emit('mask:show');
    }

    hide() {
        const { $player } = this.art.template;
        this.state = false;
        $player.classList.remove('artplayer-mask-show');
        this.art.emit('mask:show');
    }
}
