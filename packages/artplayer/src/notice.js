import { setStyle } from './utils';

export default class Notice {
    constructor(art) {
        this.art = art;
        this.timer = null;
    }

    show(msg, autoHide = true, time = 1000) {
        const { $notice, $noticeInner } = this.art.template;
        setStyle($notice, 'display', 'block');
        $noticeInner.innerHTML = msg instanceof Error ? msg.message.trim() : msg;
        clearTimeout(this.timer);
        if (autoHide) {
            this.timer = setTimeout(() => {
                this.hide();
            }, time);
        }
        this.art.emit('notice:show', $notice);
    }

    hide() {
        const { $notice } = this.art.template;
        setStyle($notice, 'display', 'none');
        this.art.emit('notice:hide', $notice);
    }
}
