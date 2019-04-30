import { append, setStyle } from './utils';

export default class Mask {
    constructor(art) {
        this.art = art;
        const { $mask } = art.template;
        const $playBig = append($mask, '<div class="art-playBig"></div>');
        append($playBig, art.icons.playBig);
    }

    show() {
        const { $mask } = this.art.template;
        setStyle($mask, 'display', 'flex');
        this.art.emit('mask:show', $mask);
    }

    hide() {
        const { $mask } = this.art.template;
        setStyle($mask, 'display', 'none');
        this.art.emit('mask:show', $mask);
    }
}
