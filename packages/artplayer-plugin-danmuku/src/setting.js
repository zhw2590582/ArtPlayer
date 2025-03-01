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
import $check_on from 'bundle-text:./img/check_on.svg';
import $check_off from 'bundle-text:./img/check_off.svg';

export default class Setting {
    constructor(art, danmuku) {
        this.art = art;
        this.danmuku = danmuku;
        this.utils = art.constructor.utils;

        const { setStyle } = this.utils;
        const { $controlsCenter } = art.template;
        setStyle($controlsCenter, 'display', 'flex');

        this.template = {
            $controlsCenter,
            $mount: $controlsCenter,
            $danmuku: null,
            $toggle: null,
            $config: null,
            $configPanel: null,
            $configModes: null,
            $style: null,
            $stylePanel: null,
            $styleModes: null,
            $colors: null,
            $opacitySlider: null,
            $opacityValue: null,
            $marginSlider: null,
            $marginValue: null,
            $fontSizeSlider: null,
            $fontSizeValue: null,
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

        this.emitting = false;
        this.isLock = false;
        this.timer = null;

        this.createTemplate();
        this.createSliders();
        this.createEvents();

        this.mount(this.option.mount);

        art.on('resize', () => this.resize());
        art.on('fullscreen', (state) => this.onFullscreen(state));
        art.on('fullscreenWeb', (state) => this.onFullscreen(state));

        art.proxy(this.template.$config, 'mouseenter', () => {
            this.onMouseEnter({
                $control: this.template.$config,
                $panel: this.template.$configPanel,
            });
        });

        art.proxy(this.template.$style, 'mouseenter', () => {
            this.onMouseEnter({
                $control: this.template.$style,
                $panel: this.template.$stylePanel,
            });
        });
    }

    static get icons() {
        return {
            $on,
            $off,
            $config,
            $style,
            $mode_0_off,
            $mode_0_on,
            $mode_1_off,
            $mode_1_on,
            $mode_2_off,
            $mode_2_on,
            $check_on,
            $check_off,
        };
    }

    get option() {
        return this.danmuku.option;
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
                            按类型屏蔽
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
                        <div class="apd-config-other">
                            <div class="apd-other apd-anti-overlap">
                                ${$check_on}${$check_off}
                                防止弹幕重叠
                            </div>
                            <div class="apd-other apd-sync-video">
                                ${$check_on}${$check_off}
                                同步视频速度
                            </div>
                        </div>
                        <div class="apd-config-slider apd-config-opacity">
                            不透明度
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-margin">
                            显示区域
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-fontSize">
                            弹幕字号
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-speed">
                            弹幕速度
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="apd-emitter">
                <div class="apd-style">
                    ${$style}
                    <div class="apd-style-panel">
                        <div class="apd-style-panel-inner">
                            <div class="apd-style-mode">
                                模式
                                <div class="apd-modes">
                                    <div data-mode="0" class="apd-mode">
                                        ${$mode_0_on}
                                        <div>滚动</div>
                                    </div>
                                    <div data-mode="1" class="apd-mode">
                                        ${$mode_1_on}
                                        <div>顶部</div>
                                    </div>
                                    <div data-mode="2" class="apd-mode">
                                        ${$mode_2_on}
                                        <div>底部</div>
                                    </div>
                                </div>
                            </div>
                            <div class="apd-style-color">
                                颜色
                                <div class="apd-colors">
                                    ${this.COLOR.map((color) => `<div data-color="${color}" class="apd-color" style="background-color: ${color}"></div>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <input class="apd-input" placeholder="发个友善的弹幕见证当下" autocomplete="off" maxLength="${option.maxLength}" />
                <div class="apd-send">发送</div>
            </div>
        `;
    }

    get OPACITY() {
        return {
            min: 0,
            max: 100,
            steps: [],
            ...this.option.OPACITY,
        };
    }

    get FONT_SIZE() {
        return {
            min: 12,
            max: 120,
            steps: [],
            ...this.option.FONT_SIZE,
        };
    }

    get MARGIN() {
        return {
            min: 0,
            max: 3,
            steps: [
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
            ],
            ...this.option.MARGIN,
        };
    }

    get SPEED() {
        return {
            min: 0,
            max: 4,
            steps: [
                {
                    name: '极慢',
                    value: 10,
                },
                {
                    name: '较慢',
                    value: 7.5,
                    hide: true,
                },
                {
                    name: '适中',
                    value: 5,
                },
                {
                    name: '较快',
                    value: 2.5,
                    hide: true,
                },
                {
                    name: '极快',
                    value: 1,
                },
            ],
            ...this.option.SPEED,
        };
    }

    get COLOR() {
        return this.option.COLOR.length
            ? this.option.COLOR
            : [
                  '#FE0302',
                  '#FF7204',
                  '#FFAA02',
                  '#FFD302',
                  '#FFFF00',
                  '#A0EE00',
                  '#00CD00',
                  '#019899',
                  '#4266BE',
                  '#89D5FF',
                  '#CC0273',
                  '#222222',
                  '#9B9B9B',
                  '#FFFFFF',
              ];
    }

    query(selector) {
        const { query } = this.utils;
        const { $danmuku } = this.template;
        return query(selector, $danmuku);
    }

    append(el, target) {
        const { append } = this.utils;
        const children = [...el.children];
        if (children.some((item) => item === target)) return;
        append(el, target);
    }

    setData(key, value) {
        const { $player } = this.art.template;
        const { $mount } = this.template;
        $player.dataset[key] = value;
        if (this.outside) {
            $mount.dataset[key] = value;
        }
    }

    createTemplate() {
        const { createElement, tooltip } = this.utils;

        const $danmuku = createElement('div');
        $danmuku.className = 'artplayer-plugin-danmuku';
        $danmuku.innerHTML = this.TEMPLATE;

        this.template.$danmuku = $danmuku;
        this.template.$toggle = this.query('.apd-toggle');
        this.template.$config = this.query('.apd-config');
        this.template.$configPanel = this.query('.apd-config-panel');
        this.template.$configModes = this.query('.apd-config-mode .apd-modes');
        this.template.$style = this.query('.apd-style');
        this.template.$stylePanel = this.query('.apd-style-panel');
        this.template.$styleModes = this.query('.apd-style-mode .apd-modes');
        this.template.$colors = this.query('.apd-colors');
        this.template.$antiOverlap = this.query('.apd-anti-overlap');
        this.template.$syncVideo = this.query('.apd-sync-video');
        this.template.$opacitySlider = this.query('.apd-config-opacity .apd-slider');
        this.template.$opacityValue = this.query('.apd-config-opacity .apd-value');
        this.template.$marginSlider = this.query('.apd-config-margin .apd-slider');
        this.template.$marginValue = this.query('.apd-config-margin .apd-value');
        this.template.$fontSizeSlider = this.query('.apd-config-fontSize .apd-slider');
        this.template.$fontSizeValue = this.query('.apd-config-fontSize .apd-value');
        this.template.$speedSlider = this.query('.apd-config-speed .apd-slider');
        this.template.$speedValue = this.query('.apd-config-speed .apd-value');
        this.template.$input = this.query('.apd-input');
        this.template.$send = this.query('.apd-send');

        const { $toggle } = this.template;

        this.art.on('artplayerPluginDanmuku:show', () => {
            tooltip($toggle, '关闭弹幕');
        });

        this.art.on('artplayerPluginDanmuku:hide', () => {
            tooltip($toggle, '打开弹幕');
        });
    }

    createEvents() {
        const { $toggle, $configModes, $styleModes, $colors, $antiOverlap, $syncVideo, $send, $input } = this.template;

        this.art.proxy($toggle, 'click', () => {
            this.danmuku.config({
                visible: !this.option.visible,
            });
            this.reset();
        });

        this.art.proxy($configModes, 'click', (event) => {
            const $mode = event.target.closest('.apd-mode');
            if (!$mode) return;
            const mode = Number($mode.dataset.mode);
            if (this.option.modes.includes(mode)) {
                this.danmuku.config({
                    modes: this.option.modes.filter((m) => m !== mode),
                });
            } else {
                this.danmuku.config({
                    modes: [...this.option.modes, mode],
                });
            }
            this.reset();
        });

        this.art.proxy($antiOverlap, 'click', () => {
            this.danmuku.config({
                antiOverlap: !this.option.antiOverlap,
            });
            this.reset();
        });

        this.art.proxy($syncVideo, 'click', () => {
            this.danmuku.config({
                synchronousPlayback: !this.option.synchronousPlayback,
            });
            this.reset();
        });

        this.art.proxy($styleModes, 'click', (event) => {
            const $mode = event.target.closest('.apd-mode');
            if (!$mode) return;
            const mode = Number($mode.dataset.mode);
            this.danmuku.config({
                mode: mode,
            });
            this.reset();
        });

        this.art.proxy($colors, 'click', (event) => {
            const $color = event.target.closest('.apd-color');
            if (!$color) return;
            this.danmuku.config({
                color: $color.dataset.color,
            });
            this.reset();
        });

        this.art.proxy($send, 'click', () => this.emit());

        this.art.proxy($input, 'keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.emit();
            }
        });
    }

    createSliders() {
        this.slider.opacity = this.createSlider({
            ...this.OPACITY,
            container: this.template.$opacitySlider,
            findIndex: () => {
                return Math.round(this.option.opacity * 100);
            },
            onChange: (index) => {
                const { $opacityValue } = this.template;
                $opacityValue.textContent = `${index}%`;
                this.danmuku.config({
                    opacity: index / 100,
                });
            },
        });

        this.slider.margin = this.createSlider({
            ...this.MARGIN,
            container: this.template.$marginSlider,
            findIndex: () => {
                return this.MARGIN.steps.findIndex(
                    (item) => item.value[0] === this.option.margin[0] && item.value[1] === this.option.margin[1],
                );
            },
            onChange: (index) => {
                const margin = this.MARGIN.steps[index];
                if (!margin) return;
                const { $marginValue } = this.template;
                $marginValue.textContent = margin.name;
                this.danmuku.config({
                    margin: margin.value,
                });
            },
        });

        this.slider.fontSize = this.createSlider({
            ...this.FONT_SIZE,
            container: this.template.$fontSizeSlider,
            findIndex: () => {
                return this.danmuku.fontSize;
            },
            onChange: (index) => {
                const { $fontSizeValue } = this.template;
                $fontSizeValue.textContent = `${index}px`;
                if (index === this.danmuku.fontSize) return;
                this.danmuku.config({
                    fontSize: index,
                });
            },
        });

        this.slider.speed = this.createSlider({
            ...this.SPEED,
            container: this.template.$speedSlider,
            findIndex: () => {
                return this.SPEED.steps.findIndex((item) => item.value === this.option.speed);
            },
            onChange: (index) => {
                const speed = this.SPEED.steps[index];
                if (!speed) return;
                const { $speedValue } = this.template;
                $speedValue.textContent = speed.name;
                this.danmuku.config({
                    speed: speed.value,
                });
            },
        });
    }

    createSlider({ min, max, container, findIndex, onChange, steps = [] }) {
        const { query, clamp, setStyle } = this.utils;

        setStyle(container, 'touch-action', 'none');

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

        function reset(index = findIndex()) {
            if (index < min || index > max) return;
            const percentage = (index - min) / (max - min);
            $dot.style.left = `${percentage * 100}%`;
            if (steps.length === 0) {
                $progress.style.width = $dot.style.left;
            }
            onChange(index);
        }

        function updateLeft(event) {
            const { top, height, left, width } = container.getBoundingClientRect();
            if (this.art.isRotate) {
                const value = clamp(event.clientY - top, 0, height);
                const index = Math.round((value / height) * (max - min) + min);
                reset(index);
            } else {
                const value = clamp(event.clientX - left, 0, width);
                const index = Math.round((value / width) * (max - min) + min);
                reset(index);
            }
        }

        this.art.proxy(container, 'click', (event) => {
            updateLeft.call(this, event);
        });

        this.art.proxy(container, 'pointerdown', (event) => {
            isDroging = event.button === 0;
        });

        this.art.proxy(document, 'pointermove', (event) => {
            if (isDroging) {
                updateLeft.call(this, event);
            }
        });

        this.art.proxy(document, 'pointerup', (event) => {
            if (isDroging) {
                isDroging = false;
                updateLeft.call(this, event);
            }
        });

        return { reset };
    }

    onFullscreen(state) {
        const { $danmuku, $controlsCenter, $mount } = this.template;
        if (this.outside) {
            if (state) {
                this.append($controlsCenter, $danmuku);
            } else {
                this.append($mount, $danmuku);
            }
        } else {
            this.append($controlsCenter, $danmuku);
        }
    }

    onMouseEnter({ $control, $panel }) {
        const { $player } = this.art.template;
        const controlRect = $control.getBoundingClientRect();
        const panelRect = $panel.getBoundingClientRect();
        const playerRect = $player.getBoundingClientRect();

        const half = panelRect.width / 2 - controlRect.width / 2;
        const left = playerRect.left - (controlRect.left - half);
        const right = controlRect.right + half - playerRect.right;

        if (left > 0) {
            $panel.style.left = `${-half + left}px`;
        } else if (right > 0) {
            $panel.style.left = `${-half - right}px`;
        } else {
            $panel.style.left = `${-half}px`;
        }
    }

    async emit() {
        const { $input } = this.template;

        const text = $input.value.trim();
        if (!text.length) return;
        if (this.isLock) return;
        if (this.emitting) return;

        const danmu = {
            text: text,
            mode: this.option.mode,
            color: this.option.color,
            time: this.art.currentTime,
        };

        try {
            this.emitting = true;
            const state = await this.option.beforeEmit(danmu);
            this.emitting = false;

            if (state !== true) return;

            danmu.border = true;
            delete danmu.time;
            this.danmuku.emit(danmu);
            $input.value = '';

            this.lock();
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            this.emitting = false;
        }
    }

    lock() {
        const { addClass } = this.utils;
        const { $send } = this.template;

        this.isLock = true;
        let time = this.option.lockTime;
        $send.innerText = time;
        addClass($send, 'apd-lock');

        const loop = () => {
            this.timer = setTimeout(() => {
                if (time === 0) {
                    this.unlock();
                } else {
                    time -= 1;
                    $send.innerText = time;
                    loop();
                }
            }, 1000);
        };

        loop();
    }

    unlock() {
        const { removeClass } = this.utils;
        const { $send } = this.template;
        clearTimeout(this.timer);
        this.isLock = false;
        $send.innerText = '发送';
        removeClass($send, 'apd-lock');
    }

    resize() {
        if (this.outside) return;
        if (this.art.fullscreen) return;
        if (this.art.fullscreenWeb) return;
        const { $player, $controlsCenter } = this.art.template;
        const { $danmuku } = this.template;
        if (this.art.width < this.option.width) {
            this.append($player, $danmuku);
        } else {
            this.append($controlsCenter, $danmuku);
        }
    }

    reset() {
        const { inverseClass, tooltip } = this.utils;
        const { $toggle, $colors } = this.template;

        this.slider.opacity.reset();
        this.slider.margin.reset();
        this.slider.fontSize.reset();
        this.slider.speed.reset();

        this.setData('danmukuVisible', this.option.visible);
        this.setData('danmukuMode', this.option.mode);
        this.setData('danmukuColor', this.option.color);
        this.setData('danmukuMode0', this.option.modes.includes(0));
        this.setData('danmukuMode1', this.option.modes.includes(1));
        this.setData('danmukuMode2', this.option.modes.includes(2));
        this.setData('danmukuAntiOverlap', this.option.antiOverlap);
        this.setData('danmukuSyncVideo', this.option.synchronousPlayback);
        this.setData('danmukuTheme', this.option.theme);
        this.setData('danmukuEmitter', this.option.emitter);

        const colors = $colors.children;
        const $color = Array.from(colors).find((item) => item.dataset.color === this.option.color.toUpperCase());
        $color && inverseClass($color, 'apd-active');

        tooltip($toggle, this.option.visible ? '关闭弹幕' : '打开弹幕');

        this.resize();
    }

    mount(target) {
        const { errorHandle } = this.utils;
        const $el = typeof target === 'string' ? document.querySelector(target) : target;
        errorHandle($el, `Can not find the mount point: ${target}`);
        this.append($el, this.template.$danmuku);
        this.template.$mount = $el;
        this.reset();
    }
}

if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-danmuku';
    let $style = document.getElementById(id);
    if (!$style) {
        $style = document.createElement('style');
        $style.id = id;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.head.appendChild($style);
            });
        } else {
            (document.head || document.documentElement).appendChild($style);
        }
    }
    $style.textContent = style;
}
