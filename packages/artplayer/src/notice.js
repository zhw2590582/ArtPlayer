import { addClass, removeClass } from './utils';

export default class Notice {
    constructor(art) {
        this.art = art;
        this.timer = null;
    }

    show(msg, autoHide = true, time = 1000) {
        const { $player, $noticeInner } = this.art.template;
        $noticeInner.innerHTML = msg instanceof Error ? msg.message.trim() : msg;
        clearTimeout(this.timer);
        if (autoHide) {
            this.timer = setTimeout(() => {
                this.hide();
            }, time);
        }
        addClass($player, 'art-notice-show');
        this.art.emit('notice:toggle', true);
    }

    hide() {
        const { $player } = this.art.template;
        removeClass($player, 'art-notice-show');
        this.art.emit('notice:toggle', true);
    }
}
