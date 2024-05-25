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
        this.option = danmuku.option;

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

    get TEMPLATE() {
        const { option } = this;

        return `
            <div class="apd-toggle">
                ${$on}${$off}
            </div>
            <div class="apd-config">
                ${$config}
                <div class="apd-config-panel">
                    <div class="apd-config-panel-inner">
                        <div>按类型屏蔽</div>
                        <div class="apd-modes">
                            <div data-mode="0" class="apd-mode">
                                ${$mode_0_off}
                                ${$mode_0_on}
                            </div>
                            <div data-mode="1" class="apd-mode">
                                ${$mode_1_off}
                                ${$mode_1_on}
                            </div>
                            <div data-mode="2" class="apd-mode">
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
                <input class="apd-input" placeholder="发个友善的弹幕见证当下" autocomplete="off" maxLength="${option.maxLength}" />
                <div class="apd-send">发送</div>
            </div>
        `;
    }

    query(selector) {
        const { query } = this.utils;
        const { $danmuku } = this.template;
        return query(selector, $danmuku);
    }

    initTemplate() {
        const { option } = this;
        const { $player } = this.art.template;
        const { $container } = this.template;
        const { setStyle, createElement, tooltip } = this.utils;

        const $danmuku = createElement('div');
        $danmuku.className = 'artplayer-plugin-danmuku';
        $danmuku.innerHTML = this.TEMPLATE;
        this.template.$danmuku = $danmuku;

        const $toggle = this.query('.apd-toggle');
        const $toggleOn = this.query('.apd-toggle-on');
        const $toggleOff = this.query('.apd-toggle-off');
        this.template.$toggle = $toggle;
        this.template.$toggleOn = $toggleOn;
        this.template.$toggleOff = $toggleOff;
        tooltip($toggleOn, '关闭弹幕');
        tooltip($toggleOff, '开启弹幕');
        $player.dataset.danmukuVisible = option.visible;

        this.template.$modes = this.query('.apd-modes');
        $player.dataset.danmukuMode0 = option.modes.includes(0);
        $player.dataset.danmukuMode1 = option.modes.includes(1);
        $player.dataset.danmukuMode2 = option.modes.includes(2);

        const $input = this.query('.apd-input');
        this.template.$input = $input;

        const $send = this.query('.apd-send');
        this.template.$send = $send;

        setStyle($container, 'display', 'flex');
        this.mount();
    }

    initEvents() {
        const { option } = this;
        const { $player } = this.art.template;
        const { $toggle, $modes } = this.template;

        this.art.proxy($toggle, 'click', () => {
            option.visible = !option.visible;
            this.danmuku[option.visible ? 'show' : 'hide']();
            $player.dataset.danmukuVisible = option.visible;
        });

        this.art.proxy($modes, 'click', (event) => {
            const $mode = event.target.closest('.apd-mode');
            if (!$mode) return;
            const mode = Number($mode.dataset.mode);
            if (option.modes.includes(mode)) {
                option.modes = option.modes.filter((m) => m !== mode);
            } else {
                option.modes.push(mode);
            }
            $player.dataset[`danmukuMode${mode}`] = option.modes.includes(mode);
        });
    }

    initState() {
        const { option } = this;
        this.danmuku[option.visible ? 'show' : 'hide']();
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
