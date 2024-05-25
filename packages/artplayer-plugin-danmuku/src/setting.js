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
            $margin: null,
            $marginSlider: null,
            $marginValue: null,
            $fontSize: null,
            $fontSizeSlider: null,
            $fontSizeValue: null,
            $speed: null,
            $speedSlider: null,
            $speedValue: null,
            $input: null,
            $send: null,
        };

        this.slider = {
            opacity: null,
            margin: null,
            fontSize: null,
            speed: null,
        };

        this.initTemplate();
        this.initSliders();
        this.initEvents();
        this.mount(this.option.mount);
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
                            <div class="apd-value"></div>
                        </div>
                        <div class="apd-config-slider apd-config-margin">
                            <div class="apd-title">显示区域</div>
                            <div class="apd-slider"></div>
                            <div class="apd-value"></div>
                        </div>
                        <div class="apd-config-slider apd-config-fontSize">
                            <div class="apd-title">弹幕字号</div>
                            <div class="apd-slider"></div>
                            <div class="apd-value"></div>
                        </div>
                        <div class="apd-config-slider apd-config-speed">
                            <div class="apd-title">弹幕速度</div>
                            <div class="apd-slider"></div>
                            <div class="apd-value"></div>
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

    get MARGIN() {
        return [
            {
                name: '1/4',
                value: [10, '75%'],
            },
            {
                name: '半屏',
                value: [10, '50%'],
            },
            {
                name: '3/4',
                value: [10, '25%'],
            },
            {
                name: '满屏',
                value: [10, 10],
            },
        ];
    }

    get SPEED() {
        return [
            {
                name: '极慢',
                value: 10,
            },
            {
                name: '较慢',
                value: 7.5,
            },
            {
                name: '适中',
                value: 5,
            },
            {
                name: '较快',
                value: 2.5,
            },
            {
                name: '极快',
                value: 1,
            },
        ];
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

        this.template.$margin = this.query('.apd-config-margin');
        this.template.$marginSlider = this.query('.apd-config-margin .apd-slider');
        this.template.$marginValue = this.query('.apd-config-margin .apd-value');

        this.template.$fontSize = this.query('.apd-config-fontSize');
        this.template.$fontSizeSlider = this.query('.apd-config-fontSize .apd-slider');
        this.template.$fontSizeValue = this.query('.apd-config-fontSize .apd-value');

        this.template.$speed = this.query('.apd-config-speed');
        this.template.$speedSlider = this.query('.apd-config-speed .apd-slider');
        this.template.$speedValue = this.query('.apd-config-speed .apd-value');

        this.template.$input = this.query('.apd-input');
        this.template.$send = this.query('.apd-send');
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

    initSliders() {
        this.slider.opacity = this.createSlider({
            min: 0,
            max: 100,
            steps: [],
            container: this.template.$opacitySlider,
            onChange: (index) => {
                const { $opacityValue } = this.template;
                $opacityValue.textContent = `${index}%`;
                this.danmuku.config({
                    opacity: index / 100,
                });
            },
        });

        this.slider.margin = this.createSlider({
            min: 0,
            max: 3,
            steps: this.MARGIN,
            container: this.template.$marginSlider,
            onChange: (index) => {
                const margin = this.MARGIN[index];
                const { $marginValue } = this.template;
                $marginValue.textContent = margin.name;
                this.danmuku.config({
                    margin: margin.value,
                });
            },
        });

        this.slider.fontSize = this.createSlider({
            min: 1,
            max: 25,
            steps: [],
            container: this.template.$fontSizeSlider,
            onChange: (index) => {
                const { $fontSizeValue } = this.template;
                $fontSizeValue.textContent = `${index}%`;
                this.danmuku.config({
                    fontSize: `${index}%`,
                });
            },
        });

        this.slider.speed = this.createSlider({
            min: 0,
            max: 4,
            steps: this.SPEED,
            container: this.template.$speedSlider,
            onChange: (index) => {
                const speed = this.SPEED[index];
                const { $speedValue } = this.template;
                $speedValue.textContent = speed.name;
                this.danmuku.config({
                    speed: speed.value,
                });
            },
        });
    }

    createSlider({ min, max, container, onChange, steps = [] }) {
        const { query, clamp } = this.utils;

        container.innerHTML = `
            <div class="apd-slider-line">
                <div class="apd-slider-points">
                    ${steps.map(() => `<div class="apd-slider-point"></div>`).join('')}
                </div>
                <div class="apd-slider-progress"></div>
            </div>
            <div class="apd-slider-dot"></div>
            <div class="apd-slider-steps">
                ${steps.map((step) => (step.hide ? '' : `<div class="apd-slider-step">${step.name}</div>`)).join('')}
            </div>
        `;

        const $dot = query('.apd-slider-dot', container);
        const $progress = query('.apd-slider-progress', container);

        let isDroging = false;

        function init(index) {
            const percentage = (index - min) / (max - min);
            $dot.style.left = `${percentage * 100}%`;
            if (steps.length === 0) {
                $progress.style.width = $dot.style.left;
            }
        }

        function updateLeft(event) {
            const { left, width } = container.getBoundingClientRect();
            const value = clamp(event.clientX - left, 0, width);
            const index = Math.round((value / width) * (max - min) + min);
            init(index);
            onChange(index);
        }

        this.art.proxy(container, 'click', (event) => {
            updateLeft(event);
        });

        this.art.proxy(container, 'mousedown', (event) => {
            isDroging = event.button === 0;
        });

        this.art.on('document:mousemove', (event) => {
            if (isDroging) {
                updateLeft(event);
            }
        });

        this.art.on('document:mouseup', (event) => {
            if (isDroging) {
                isDroging = false;
                updateLeft(event);
            }
        });

        return {
            min,
            max,
            init,
            steps,
            onChange,
            container,
        };
    }

    mount(target) {
        this.template.$mount = target;
        this.option.mount = target;
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
