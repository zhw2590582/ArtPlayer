import style from 'bundle-text:./style.less';
import $on from 'bundle-text:./img/on.svg';
import $off from 'bundle-text:./img/off.svg';
import $config from 'bundle-text:./img/config.svg';
import $style from 'bundle-text:./img/style.svg';
import $mode_0_off from 'bundle-text:./img/mode_0_off.svg';
import $mode_0_on from 'bundle-text:./img/mode_0_on.svg';
import $mode_1_off from 'bundle-text:./img/mode_1_off.svg';
import $mode_1_on from 'bundle-text:./img/mode_1_on.svg';
import $mode_2_off from 'bundle-text:./img/mode_2_off.svg';
import $mode_2_on from 'bundle-text:./img/mode_2_on.svg';

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
        };
    }

    get TEMPLATE() {
        const { config } = this;

        return `
            <div class="apd-toggle">
                ${$on}${$off}
            </div>
            <div class="apd-config">
                ${$config}
                <div class="apd-config-panel">
                    <div class="apd-config-panel-inner">
                        <div>按类型屏蔽</div>
                        <div class="apd-config-mode">
                            <div>
                                ${$mode_0_off}
                                ${$mode_0_on}
                            </div>
                            <div>
                                ${$mode_1_off}
                                ${$mode_1_on}
                            </div>
                            <div>
                                ${$mode_2_off}
                                ${$mode_2_on}
                            </div>
                        </div>
                        <div>不透明度</div>
                        <div>显示区域</div>
                        <div>弹幕字号</div>
                        <div>弹幕速度</div>
                    </div>
                </div>
            </div>
            <div class="apd-emitter">
                <div class="apd-style">
                    ${$style}
                    <div class="apd-style-panel">
                        <div class="apd-style-panel-inner">1234</div>
                    </div>
                </div>
                <input class="apd-input" placeholder="发个友善的弹幕见证当下" autocomplete="off" maxLength="${config.maxLength}" />
                <div class="apd-send">发送</div>
            </div>
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

        const $mode_0_off = query('.apd-mode-0-off', $danmuku);
        const $mode_0_on = query('.apd-mode-0-on', $danmuku);
        const $mode_1_off = query('.apd-mode-1-off', $danmuku);
        const $mode_1_on = query('.apd-mode-1-on', $danmuku);
        const $mode_2_off = query('.apd-mode-2-off', $danmuku);
        const $mode_2_on = query('.apd-mode-2-on', $danmuku);
        this.initMode();

        const $input = query('.apd-input', $danmuku);
        this.template.$input = $input;

        const $send = query('.apd-send', $danmuku);
        this.template.$send = $send;

        setStyle($container, 'display', 'flex');
        this.mount();
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

    initMode() {
        //
    }

    mount(target = this.template.$container) {
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
