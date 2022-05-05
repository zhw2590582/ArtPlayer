import style from 'bundle-text:./style.less';
import { createApp } from 'vue';
import App from './App.vue';

if (typeof document !== 'undefined') {
    if (!document.getElementById('artplayer-plugin-danmuku-style')) {
        const $style = document.createElement('style');
        $style.id = 'artplayer-plugin-danmuku-style';
        $style.textContent = style;
        document.head.appendChild($style);
    }
}

export default class Control {
    constructor(art, danmuku) {
        this.art = art;
        this.danmuku = danmuku;
        this.apps = new Map();
    }

    mount($el) {
        const that = this;
        const app = createApp(App);

        app.use({
            install(app) {
                app.config.globalProperties.$art = that.art;
                app.config.globalProperties.$danmuku = that.danmuku;
            },
        });

        app.mount($el);
        this.apps.set($el, app);

        return app;
    }

    unmount($el) {
        const app = this.apps.get($el);
        if (app) {
            app.unmount();
            this.apps.delete($el);
        }
    }
}
