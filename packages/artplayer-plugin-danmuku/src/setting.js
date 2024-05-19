import style from 'bundle-text:./style.less';

export default class Setting {
    constructor(art, danmuku) {
        this.art = art;
        this.danmuku = danmuku;
        this.option = danmuku.option;
        this.init();
    }

    init() {
        console.log('setting init');
    }

    addEmitter() {
        console.log('setting addEmitter');
    }

    mount(target) {
        //
    }
}

if (typeof document !== 'undefined') {
    if (!document.getElementById('artplayer-plugin-danmuku')) {
        const $style = document.createElement('style');
        $style.id = 'artplayer-plugin-danmuku';
        $style.textContent = style;
        document.head.appendChild($style);
    }
}
