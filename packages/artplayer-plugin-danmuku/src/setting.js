import style from 'bundle-text:./style.less';
import danmuOn from 'bundle-text:./img/danmu-on.svg';
import danmuOff from 'bundle-text:./img/danmu-off.svg';
import danmuConfig from 'bundle-text:./img/danmu-config.svg';
import danmuStyle from 'bundle-text:./img/danmu-style.svg';

export default function setting(art, danmuku) {
    const { option } = danmuku;
    const {
        template: { $controlsCenter, $player },
        constructor: {
            utils: { removeClass, addClass, append, setStyle, tooltip, query, inverseClass },
        },
    } = art;

    function getIcon(svg, key) {
        const icon = document.createElement('i');
        append(icon, svg);
        addClass(icon, 'art-icon');
        addClass(icon, `art-icon-${key}`);
        return icon;
    }

    const $danmuOn = getIcon(danmuOn, 'danmu-on');
    const $danmuOff = getIcon(danmuOff, 'danmu-off');
    const $danmuConfig = getIcon(danmuConfig, 'danmu-config');
    const $danmuStyle = getIcon(danmuStyle, 'danmu-style');

    function addEmitter() {
        const colors = [
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
        ].map((item) => {
            const isCurrent = option.color === item ? ' art-current' : '';
            return `<div class="art-danmuku-style-panel-color${isCurrent}" data-color="${item}" style="background-color:${item}"></div>`;
        });

        const $emitter = append(
            $controlsCenter,
            `
            <div class="art-danmuku-emitter" style="max-width: ${option.maxWidth ? `${option.maxWidth}px` : '100%'}; display:${option.showInput ? 'flex' : 'none'};">
                <div class="art-danmuku-left">
                    <div class="art-danmuku-style">
                        <div class="art-danmuku-style-panel">
                            <div class="art-danmuku-style-panel-inner">
                                <div class="art-danmuku-style-panel-title">模式</div>
                                <div class="art-danmuku-style-panel-modes">
                                    <div class="art-danmuku-style-panel-mode art-current" data-mode="0">滚动</div>
                                    <div class="art-danmuku-style-panel-mode" data-mode="1">静止</div>
                                </div>
                                <div class="art-danmuku-style-panel-title">颜色</div>
                                <div class="art-danmuku-style-panel-colors">
                                    ${colors.join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <input class="art-danmuku-input" maxlength="${option.maxLength}" placeholder="发个弹幕见证当下" />
                </div>
                <div class="art-danmuku-send">发送</div>
            </div>
            `,
        );

        const $style = query('.art-danmuku-style', $emitter);
        const $input = query('.art-danmuku-input', $emitter);
        const $send = query('.art-danmuku-send', $emitter);
        const $panel = query('.art-danmuku-style-panel-inner', $emitter);
        const $modes = query('.art-danmuku-style-panel-modes', $emitter);
        const $colors = query('.art-danmuku-style-panel-colors', $emitter);
        const $layer = option.mount || append($player, '<div class="art-layer-danmuku-emitter"></div>');

        if (art.option.backdrop) {
            addClass($panel, 'art-backdrop-filter');
        }

        if (option.theme) {
            addClass($emitter, `art-danmuku-theme-${option.theme}`);
        }

        let timer = null;
        let mode = option.mode;
        let color = option.color;
        append($style, $danmuStyle);

        function countdown(time) {
            if (time <= 0) {
                timer = null;
                $send.innerText = '发送';
                removeClass($send, 'art-disabled');
            } else {
                $send.innerText = time;
                timer = setTimeout(() => countdown(time - 1), 1000);
            }
        }

        function onSend() {
            const danmu = {
                mode,
                color,
                border: true,
                text: $input.value.trim(),
            };

            if (timer === null && option.beforeEmit(danmu)) {
                $input.value = '';
                danmuku.emit(danmu);
                addClass($send, 'art-disabled');
                countdown(option.lockTime);
                art.emit('artplayerPluginDanmuku:emit', danmu);
            }
        }

        function onResize() {
            if ($controlsCenter.clientWidth < option.minWidth) {
                append($layer, $emitter);
                setStyle($layer, 'display', 'flex');
                addClass($emitter, 'art-danmuku-mount');

                if (!option.mount) {
                    setStyle($player, 'marginBottom', '40px');
                }
            } else {
                append($controlsCenter, $emitter);
                setStyle($layer, 'display', 'none');
                removeClass($emitter, 'art-danmuku-mount');

                if (!option.mount) {
                    setStyle($player, 'marginBottom', null);
                }
            }
        }

        art.proxy($send, 'click', onSend);

        art.proxy($input, 'keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                onSend();
            }
        });

        art.proxy($modes, 'click', (event) => {
            const { dataset } = event.target;
            if (dataset.mode) {
                mode = Number(dataset.mode);
                inverseClass(event.target, 'art-current');
            }
        });

        art.proxy($colors, 'click', (event) => {
            const { dataset } = event.target;
            if (dataset.color) {
                color = dataset.color;
                inverseClass(event.target, 'art-current');
            }
        });

        onResize();
        art.on('resize', onResize);

        art.on('destroy', () => {
            if (option.mount && $emitter.parentElement === option.mount) {
                option.mount.removeChild($emitter);
            }
        });
    }

    function addControl() {
        art.controls.add({
            position: 'right',
            name: 'danmuku',
            click: function () {
                if (danmuku.isHide) {
                    danmuku.show();
                    art.notice.show = '弹幕显示';
                    setStyle($danmuOn, 'display', null);
                    setStyle($danmuOff, 'display', 'none');
                } else {
                    danmuku.hide();
                    art.notice.show = '弹幕隐藏';
                    setStyle($danmuOn, 'display', 'none');
                    setStyle($danmuOff, 'display', null);
                }
            },
            mounted($ref) {
                append($ref, $danmuOn);
                append($ref, $danmuOff);
                tooltip($ref, '弹幕开关');
                setStyle($danmuOff, 'display', 'none');
            },
        });
    }

    function addSetting() {
        art.setting.add({
            name: 'danmuku',
            html: '弹幕设置',
            tooltip: '更多',
            icon: $danmuConfig,
            selector: [
                {
                    width: 200,
                    html: '持续时间',
                    icon: '',
                    tooltip: parseInt(option.speed)+'秒',
                    range : [parseInt(option.speed), 1, 10, 1],
                    onRange: function (item) {
                        danmuku.config({
                            speed: item.range
                        });
                        return item.range+'秒';
                    }
                },
                {
                    width: 200,
                    html: '字体大小',
                    icon: '',
                    tooltip: option.fontSize,
                    range : [parseInt(option.fontSize), 1, 30, 1],
                    onRange: function (item) {
                        danmuku.config({
                            fontSize: item.range+'%'
                        });
                        return item.range+'%';
                    }
                },
                {
                    width: 200,
                    html: '不透明度',
                    icon: '',
                    tooltip: parseInt(option.opacity*100)+'%',
                    range : [parseInt(option.opacity*100), 0, 100, 1],
                    onRange: function (item) {
                        danmuku.config({
                            opacity: item.range/100
                        });
                        return item.range+'%';
                    }
                },
                {
                    width: 200,
                    html: '距屏幕上端',
                    icon: '',
                    tooltip:option.margin[0],
                    range : [parseInt(option.margin[0]), 0, 100, 1],
                    onRange: function (item) {
                        danmuku.config({
                            margin: [item.range+'%',option.margin[1]]
                        });
                        return item.range+'%';
                    }
                },
                {
                    width: 200,
                    html: '距屏幕下端',
                    icon: '',
                    tooltip:option.margin[1],
                    range : [parseInt(option.margin[1]), 0, 100, 1],
                    onRange: function (item) {
                        danmuku.config({
                            margin: [option.margin[0],item.range+'%']
                        });
                        return item.range+'%';
                    }
                },
                {
                    html: '弹幕防重叠',
                    icon: '',
                    tooltip: option.antiOverlap ? '开启' : '关闭',
                    switch: option.antiOverlap,
                    onSwitch(item) {
                        danmuku.config({
                            antiOverlap: !item.switch,
                        });
                        item.tooltip = item.switch ? '关闭' : '开启';
                        return !item.switch;
                    },
                },
                {
                    html: '同步视频速度',
                    icon: '',
                    tooltip: option.synchronousPlayback ? '开启' : '关闭',
                    switch: option.synchronousPlayback,
                    onSwitch(item) {
                        danmuku.config({
                            synchronousPlayback: !item.switch,
                        });
                        item.tooltip = item.switch ? '关闭' : '开启';
                        return !item.switch;
                    },
                },
                {
                    html: '显示输入框',
                    icon: '',
                    tooltip: option.showInput ? '显示' : '隐藏',
                    switch: option.showInput,
                    onSwitch(item) {
                        danmuku.config({
                            showInput: !item.switch,
                        });
                        item.tooltip = item.switch ? '隐藏' : '显示';
                        return !item.switch;
                    },
                },
            ],
        });
    }

    addEmitter();
    addControl();
    addSetting();
}

if (typeof document !== 'undefined') {
    if (!document.getElementById('artplayer-plugin-danmuku')) {
        const $style = document.createElement('style');
        $style.id = 'artplayer-plugin-danmuku';
        $style.textContent = style;
        document.head.appendChild($style);
    }
}
