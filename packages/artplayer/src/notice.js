import { addClass, removeClass } from './utils';

export default class Notice {
    constructor(art) {
        this.art = art;
        this.time = 1000;
        this.timer = null;
    }

    set show(msg) {
        const { $player, $noticeInner } = this.art.template;
        $noticeInner.innerText = msg instanceof Error ? msg.message.trim() : msg;
        addClass($player, 'art-notice-show');
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            removeClass($player, 'art-notice-show');
        }, this.time);
    }
}
