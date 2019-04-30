export default class Notice {
    constructor(art) {
        this.art = art;
        this.timer = null;
    }

    show(msg, autoHide = true, time = 1000) {
        const { $player, $noticeInner } = this.art.template;
        this.state = true;
        $player.classList.add('artplayer-notice-show');
        $noticeInner.innerHTML = msg instanceof Error ? msg.message.trim() : msg;
        clearTimeout(this.timer);
        if (autoHide) {
            this.timer = setTimeout(() => {
                this.hide();
            }, time);
        }
        this.art.emit('notice:show');
    }

    hide() {
        const { $player } = this.art.template;
        this.state = false;
        $player.classList.remove('artplayer-notice-show');
        this.art.emit('notice:hide');
    }
}
