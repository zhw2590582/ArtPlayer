import style from 'bundle-text:./style.less';
import danmuOn from 'bundle-text:./img/danmu-on.svg';
import danmuOff from 'bundle-text:./img/danmu-off.svg';
import danmuConfig from 'bundle-text:./img/danmu-config.svg';
import danmuStyle from 'bundle-text:./img/danmu-style.svg';

export default function setting(art, danmuku) {
    const {
        template: { $controlsCenter },
        constructor: {
            utils: { removeClass, addClass, append, setStyle, tooltip, query, inverseClass },
        },
    } = art;

    function getIcon(svg, key) {
        const icon = document.createElement('i');
        append(icon, svg);
        addClass(icon, 'art-icon');
        addClass(icon, `art-icon-${key}`);
        setStyle(icon, 'width', '22px');
        setStyle(icon, 'height', '22px');
        return icon;
    }

    const $danmuOn = getIcon(danmuOn, 'danmu-on');
    const $danmuOff = getIcon(danmuOff, 'danmu-off');
    const $danmuConfig = getIcon(danmuConfig, 'danmu-config');
    const $danmuStyle = getIcon(danmuStyle, 'danmu-config');

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
            const isCurrent = danmuku.option.color === item ? ' art-current' : '';
            return `<div class="art-danmuku-style-panel-color${isCurrent}" data-color="${item}" style="background-color:${item}"></div>`;
        });

        const $emitter = append(
            $controlsCenter,
            `
            <div class="art-danmuku-emitter">
                <div class="art-danmuku-style">
                    <div class="art-danmuku-style-panel">
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
                <input class="art-danmuku-input" maxlength="100" placeholder="发个弹幕见证当下" />
                <div class="art-danmuku-send">发送</div>
            </div>
            `,
        );

        const $style = query('.art-danmuku-style', $emitter);
        const $input = query('.art-danmuku-input', $emitter);
        const $send = query('.art-danmuku-send', $emitter);
        const $panel = query('.art-danmuku-style-panel', $emitter);
        const $modes = query('.art-danmuku-style-panel-modes', $emitter);
        const $colors = query('.art-danmuku-style-panel-colors', $emitter);

        if (art.option.backdrop) {
            addClass($panel, 'art-backdrop-filter');
        }

        let timer = null;
        let mode = danmuku.option.mode;
        let color = danmuku.option.color;
        append($style, $danmuStyle);

        function countdown(time) {
            if (time === 0) {
                timer = null;
                $send.innerText = '发送';
                removeClass($send, 'art-disabled');
            } else {
                $send.innerText = time;
                timer = setTimeout(() => countdown(time - 1), 1000);
            }
        }

        function onSend() {
            const text = $input.value.trim();
            if (!text || timer) return;

            const danmu = {
                text,
                mode,
                color,
                border: true,
            };

            $input.value = '';
            danmuku.emit(danmu);
            addClass($send, 'art-disabled');
            countdown(danmuku.option.timeout || 5);
            art.emit('artplayerPluginDanmuku:emit', danmu);
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

        art.on('resize', () => {
            setStyle($emitter, 'display', $controlsCenter.clientWidth < 150 ? 'none' : null);
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
                    html: '播放速度',
                    icon: '',
                    tooltip: '适中',
                    range: [5, 0, 10, 2.5],
                    onRange: function (item) {
                        danmuku.config({
                            speed: item.range,
                        });
                        return {
                            0: '极快',
                            2.5: '较快',
                            5: '适中',
                            7.5: '较慢',
                            10: '极慢',
                        }[item.range];
                    },
                },
                {
                    width: 200,
                    html: '字体大小',
                    icon: '',
                    tooltip: '适中',
                    range: [6, 2, 10, 2],
                    onRange: function (item) {
                        danmuku.config({
                            fontSize: item.range + '%',
                        });
                        return {
                            2: '极小',
                            5: '较小',
                            6: '适中',
                            8: '较大',
                            10: '极大',
                        }[item.range];
                    },
                },
                {
                    width: 200,
                    html: '不透明度',
                    icon: '',
                    tooltip: '100%',
                    range: [1, 0, 1, 0.01],
                    onRange: function (item) {
                        danmuku.config({
                            opacity: item.range,
                        });
                        return Math.floor(item.range * 100) + '%';
                    },
                },
                {
                    width: 200,
                    html: '显示范围',
                    icon: '',
                    tooltip: '3/4',
                    range: [50, 0, 75, 25],
                    onRange: function (item) {
                        danmuku.config({
                            margin: ['0%', item.range + '%'],
                        });
                        return {
                            0: '满屏',
                            25: '3/4',
                            50: '半屏',
                            75: '1/4',
                        }[item.range];
                    },
                },
                {
                    html: '弹幕防重叠',
                    icon: '',
                    tooltip: danmuku.option.antiOverlap ? '开启' : '关闭',
                    switch: danmuku.option.antiOverlap,
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
                    tooltip: danmuku.option.synchronousPlayback ? '开启' : '关闭',
                    switch: danmuku.option.synchronousPlayback,
                    onSwitch(item) {
                        danmuku.config({
                            synchronousPlayback: !item.switch,
                        });
                        item.tooltip = item.switch ? '关闭' : '开启';
                        return !item.switch;
                    },
                },
            ],
        });
    }

    art.on('ready', () => {
        addEmitter();
        addControl();
        addSetting();
    });
}

if (typeof document !== 'undefined') {
    if (!document.getElementById('artplayer-plugin-danmuku')) {
        const $style = document.createElement('style');
        $style.id = 'artplayer-plugin-danmuku';
        $style.textContent = style;
        document.head.appendChild($style);
    }
}
