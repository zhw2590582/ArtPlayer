import style from 'bundle-text:./style.less';
import $on from 'bundle-text:./img/on.svg';
import $off from 'bundle-text:./img/off.svg';
import $config from 'bundle-text:./img/config.svg';

export default class Setting {
    constructor(art, danmuku) {
        this.art = art;
        this.danmuku = danmuku;
        this.utils = art.constructor.utils;
        this.config = { ...Setting.DEFAULT, ...danmuku.option.setting };

        this.template = {
            $container: art.template.$controlsCenter,
            $danmuku: null,
            $toggle: null,
            $toggleOn: null,
            $toggleOff: null,
        };

        this.initTemplate();
        this.initEvents();
        this.initState();
    }

    static get DEFAULT() {
        return {
            show: true,
        };
    }

    get TEMPLATE() {
        return `
            <div class="apd-toggle">
                <div class="apd-toggle-on">${$on}</div>
                <div class="apd-toggle-off">${$off}</div>
            </div>
            <div class="apd-config">
                ${$config}
            </div>
            <div class="">123</div>
        `;
    }

    initTemplate() {
        const { setStyle, createElement, query, tooltip } = this.utils;
        const { $container } = this.template;

        const $danmuku = createElement('div');
        $danmuku.className = 'artplayer-plugin-danmuku';
        $danmuku.innerHTML = this.TEMPLATE;
        this.template.$danmuku = $danmuku;

        const $toggle = query('.apd-toggle', $danmuku);
        const $toggleOn = query('.apd-toggle-on', $danmuku);
        const $toggleOff = query('.apd-toggle-off', $danmuku);
        this.template.$toggle = $toggle;
        this.template.$toggleOn = $toggleOn;
        this.template.$toggleOff = $toggleOff;
        tooltip($toggleOn, '关闭弹幕');
        tooltip($toggleOff, '开启弹幕');
        this.initToggle();

        this.mount($container);
        setStyle($container, 'display', 'flex');
    }

    initEvents() {
        const { config } = this;

        this.art.proxy(this.template.$toggle, 'click', () => {
            config.show = !config.show;
            this.initToggle();
            this.danmuku[config.show ? 'show' : 'hide']();
        });
    }

    initState() {
        const { config } = this;
        this.danmuku[config.show ? 'show' : 'hide']();
    }

    initToggle() {
        const { config } = this;
        const { setStyle } = this.utils;
        const { $toggleOn, $toggleOff } = this.template;
        setStyle(config.show ? $toggleOff : $toggleOn, 'display', 'none');
        setStyle(config.show ? $toggleOn : $toggleOff, 'display', 'block');
    }

    mount(target) {
        if (!target) return;
        target.appendChild(this.template.$danmuku);
    }
}

if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-danmuku';
    const $style = document.getElementById(id);
    if ($style) {
        $style.textContent = style;
    } else {
        const $style = document.createElement('style');
        $style.id = id;
        $style.textContent = style;
        document.head.appendChild($style);
    }
}
