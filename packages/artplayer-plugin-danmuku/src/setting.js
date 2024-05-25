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

        const { setStyle } = this.utils;
        const { $controlsCenter } = art.template;
        setStyle($controlsCenter, 'display', 'flex');

        this.template = {
            $controlsCenter,
            $mount: $controlsCenter,
            $danmuku: null,
            $toggle: null,
            $modes: null,
            $opacity: null,
            $opacitySlider: null,
            $opacityValue: null,
            $area: null,
            $areaSlider: null,
            $areaValue: null,
            $font: null,
            $fontSlider: null,
            $fontValue: null,
            $speed: null,
            $speedSlider: null,
            $speedValue: null,
            $input: null,
            $send: null,
        };

        this.initTemplate();
        this.initEvents();
    }

    get outside() {
        return this.template.$mount !== this.template.$controlsCenter;
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
                        <div class="apd-config-mode">
                            <div class="apd-title">按类型屏蔽</div>
                            <div class="apd-modes">
                                <div data-mode="0" class="apd-mode">
                                    ${$mode_0_off}${$mode_0_on}
                                    <div>滚动</div>
                                </div>
                                <div data-mode="1" class="apd-mode">
                                    ${$mode_1_off}${$mode_1_on}
                                    <div>顶部</div>
                                </div>
                                <div data-mode="2" class="apd-mode">
                                    ${$mode_2_off}${$mode_2_on}
                                    <div>底部</div>
                                </div>
                            </div>
                        </div>
                        <div class="apd-config-slider apd-config-opacity">
                            <div class="apd-title">不透明度</div>
                            <div class="apd-slider"></div>
                            <div class="apd-value">100%</div>
                        </div>
                        <div class="apd-config-slider apd-config-area">
                            <div class="apd-title">显示区域</div>
                            <div class="apd-slider"></div>
                            <div class="apd-value">3/4</div>
                        </div>
                        <div class="apd-config-slider apd-config-font">
                            <div class="apd-title">弹幕字号</div>
                            <div class="apd-slider"></div>
                            <div class="apd-value">170%</div>
                        </div>
                        <div class="apd-config-slider apd-config-speed">
                            <div class="apd-title">弹幕速度</div>
                            <div class="apd-slider"></div>
                            <div class="apd-value">极快</div>
                        </div>
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

    setData(key, value) {
        const { $player } = this.art.template;
        const { $mount } = this.template;
        $player.dataset[key] = value;
        if (this.outside) {
            $mount.dataset[key] = value;
        }
    }

    initTemplate() {
        const { createElement, tooltip } = this.utils;

        const $danmuku = createElement('div');
        $danmuku.className = 'artplayer-plugin-danmuku';
        $danmuku.innerHTML = this.TEMPLATE;
        this.template.$danmuku = $danmuku;

        const $toggleOn = this.query('.apd-toggle-on');
        const $toggleOff = this.query('.apd-toggle-off');
        tooltip($toggleOn, '关闭弹幕');
        tooltip($toggleOff, '开启弹幕');

        this.template.$toggle = this.query('.apd-toggle');
        this.template.$modes = this.query('.apd-modes');

        this.template.$opacity = this.query('.apd-config-opacity');
        this.template.$opacitySlider = this.query('.apd-config-opacity .apd-slider');
        this.template.$opacityValue = this.query('.apd-config-opacity .apd-value');

        this.createSlider({
            min: 0,
            max: 100,
            type: 'opacity',
            container: this.template.$opacitySlider,
            onChange: (value) => this.onOpacityChange(value),
            steps: [],
        });

        this.template.$area = this.query('.apd-config-area');
        this.template.$areaSlider = this.query('.apd-config-area .apd-slider');
        this.template.$areaValue = this.query('.apd-config-area .apd-value');

        this.createSlider({
            min: 0,
            max: 4,
            type: 'area',
            container: this.template.$areaSlider,
            onChange: (value) => this.onAreaChange(value),
            steps: [
                {
                    name: '1/4',
                },
                {
                    name: '半屏',
                },
                {
                    name: '3/4',
                },
                {
                    name: '不重叠',
                },
                {
                    name: '不限',
                },
            ],
        });

        this.template.$font = this.query('.apd-config-font');
        this.template.$fontSlider = this.query('.apd-config-font .apd-slider');
        this.template.$fontValue = this.query('.apd-config-font .apd-value');

        this.createSlider({
            min: 50,
            max: 170,
            type: 'font',
            container: this.template.$fontSlider,
            onChange: (value) => this.onFontChange(value),
            steps: [],
        });

        this.template.$speed = this.query('.apd-config-speed');
        this.template.$speedSlider = this.query('.apd-config-speed .apd-slider');
        this.template.$speedValue = this.query('.apd-config-speed .apd-value');

        this.template.$input = this.query('.apd-input');
        this.template.$send = this.query('.apd-send');

        this.mount(this.option.mount);
    }

    initEvents() {
        const { option } = this;
        const { $toggle, $modes } = this.template;

        this.art.proxy($toggle, 'click', () => {
            option.visible = !option.visible;
            this.danmuku[option.visible ? 'show' : 'hide']();
            this.initState();
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
            this.initState();
        });
    }

    initState() {
        const { option } = this;
        this.setData('danmukuVisible', option.visible);
        this.setData('danmukuMode0', option.modes.includes(0));
        this.setData('danmukuMode1', option.modes.includes(1));
        this.setData('danmukuMode2', option.modes.includes(2));
    }

    onOpacityChange(opacity) {
        //
    }

    onAreaChange(area) {
        //
    }

    onFontChange(font) {
        //
    }

    createSlider() {
        //
    }

    mount(target) {
        this.template.$mount = target;
        target.appendChild(this.template.$danmuku);
        this.initState();
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
