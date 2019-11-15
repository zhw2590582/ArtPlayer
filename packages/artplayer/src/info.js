import { addClass, removeClass, queryAll } from './utils';

export default class Info {
    constructor(art) {
        this.art = art;
        this.timer = null;

        const {
            template: { $infoPanel, $infoClose },
            events: { proxy },
        } = art;

        this.types = queryAll('[data-video]', $infoPanel);

        proxy($infoClose, 'click', () => {
            this.show = false;
        });

        this.art.on('destroy', () => {
            clearTimeout(this.timer);
        });
    }

    readInfo() {
        const { $video } = this.art.template;
        this.types.forEach(item => {
            const value = $video[item.dataset.video];
            item.innerHTML = typeof value === 'number' ? value.toFixed(2) : value;
        });
    }

    loop() {
        this.readInfo();
        this.timer = setTimeout(() => {
            this.readInfo();
            this.loop();
        }, 1000);
    }

    set show(value) {
        const { $player } = this.art.template;
        if (value) {
            this.state = true;
            addClass($player, 'artplayer-info-show');
            clearTimeout(this.timer);
            this.loop();
            this.art.emit('info:show');
        } else {
            this.state = false;
            removeClass($player, 'artplayer-info-show');
            clearTimeout(this.timer);
            this.art.emit('info:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
