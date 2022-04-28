import { addClass, removeClass } from './utils';

export default class Notice {
    constructor(art) {
        this.art = art;
        this.timer = null;
    }

    set show(msg) {
        const {
            constructor,
            template: { $player, $noticeInner },
        } = this.art;

        if (msg) {
            $noticeInner.innerText = msg instanceof Error ? msg.message.trim() : msg;
            addClass($player, 'art-notice-show');
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                $noticeInner.innerText = '';
                removeClass($player, 'art-notice-show');
            }, constructor.NOTICE_TIME);
        } else {
            removeClass($player, 'art-notice-show');
        }
    }
}
