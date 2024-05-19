import style from 'bundle-text:./style.less';
import $on from 'bundle-text:./img/on.svg';
import $off from 'bundle-text:./img/off.svg';
import $config from 'bundle-text:./img/config.svg';
import $style from 'bundle-text:./img/style.svg';

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
            $input: null,
            $send: null,
        };

        this.initTemplate();
        this.initEvents();
        this.initState();
    }

    static get DEFAULT() {
        return {
            show: true,
            maxLength: 200,
            placeholder: '发个友善的弹幕见证当下',
            toggleOn: '关闭弹幕',
            toggleOff: '开启弹幕',
            send: '发送',
        };
    }

    get TEMPLATE() {
        const { config } = this;

        return `
            <div class="apd-toggle">
                <div class="apd-icon apd-toggle-on">${$on}</div>
                <div class="apd-icon apd-toggle-off">${$off}</div>
            </div>
            <div class="apd-config">
                <div class="apd-config-icon">${$config}</div>
                <div class="apd-config-panel">
                    <div class="apd-config-panel-inner">1234</div>
                </div>
            </div>
            <div class="apd-emitter">
                <div class="apd-style">
                    <div class="apd-style-icon">${$style}</div>
                    <div class="apd-style-panel">
                        <div class="apd-style-panel-inner">1234</div>
                    </div>
                </div>
                <input class="apd-input" placeholder="${config.placeholder}" autocomplete="off" maxLength="${config.maxLength}" />
                <div class="apd-send">${config.send}</div>
            </div>
        `;
    }

    initTemplate() {
        const { setStyle, createElement, query, tooltip } = this.utils;
        const { $container } = this.template;
        const { config } = this;

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
        tooltip($toggleOn, config.toggleOn);
        tooltip($toggleOff, config.toggleOff);
        this.initToggle();

        const $input = query('.apd-input', $danmuku);
        this.template.$input = $input;

        const $send = query('.apd-send', $danmuku);
        this.template.$send = $send;

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
        setStyle(config.show ? $toggleOn : $toggleOff, 'display', 'flex');
    }

    mount(target) {
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
