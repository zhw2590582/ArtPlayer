import { createApp } from 'vue';
import App from './App.vue';

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
