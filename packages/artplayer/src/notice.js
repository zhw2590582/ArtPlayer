import { addClass, removeClass } from './utils';

export default class Notice {
    constructor(art) {
        this.art = art;
        this.time = 2000;
        this.timer = null;
    }

    set show(msg) {
        if (!msg) return removeClass($player, 'art-notice-show');
        const { $player, $noticeInner } = this.art.template;
        $noticeInner.innerText = msg instanceof Error ? msg.message.trim() : msg;
        addClass($player, 'art-notice-show');
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            $noticeInner.innerText = '';
            removeClass($player, 'art-notice-show');
        }, this.time);
    }
}
