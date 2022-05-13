import style from 'bundle-text:./style.less';
import danmuOn from 'bundle-text:./img/danmu-on.svg';
import danmuOff from 'bundle-text:./img/danmu-off.svg';
import danmuConfig from 'bundle-text:./img/danmu-config.svg';
import danmuStyle from 'bundle-text:./img/danmu-style.svg';

export default function setting(art, danmuku) {
    const {
        template: { $controlsCenter },
        constructor: {
            utils: { removeClass, addClass, append, setStyle, tooltip, query },
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
        const $emitter = append(
            $controlsCenter,
            `
            <div class="art-danmuku-emitter">
                <div class="art-danmuku-style"></div>
                <input class="art-danmuku-input" maxlength="100" placeholder="发个弹幕见证当下" />
                <div class="art-danmuku-send">发送</div>
            </div>
            `,
        );

        const $style = query('.art-danmuku-style', $emitter);
        const $input = query('.art-danmuku-input', $emitter);
        const $send = query('.art-danmuku-send', $emitter);

        let timer = null;
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
                mode: 0,
                color: '#ffffff',
                border: true,
            };

            countdown(5);
            $input.value = '';
            danmuku.emit(danmu);
            addClass($send, 'art-disabled');
            art.emit('artplayerPluginDanmuku:emit', danmu);
        }

        art.proxy($send, 'click', onSend);
        art.proxy($input, 'keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                onSend();
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
                    html: '播放速度',
                    icon: '',
                    tooltip: '适中',
                    selector: [
                        {
                            html: '极慢',
                            time: 10,
                        },
                        {
                            html: '较慢',
                            time: 7.5,
                        },
                        {
                            default: true,
                            html: '适中',
                            time: 5,
                        },
                        {
                            html: '较快',
                            time: 2.5,
                        },
                        {
                            html: '极快',
                            time: 1,
                        },
                    ],
                    onSelect: function (item) {
                        danmuku.config({
                            speed: item.time,
                        });
                        return item.html;
                    },
                },
                {
                    width: 200,
                    html: '字体大小',
                    icon: '',
                    tooltip: '适中',
                    selector: [
                        {
                            html: '极小',
                            fontSize: '2%',
                        },
                        {
                            html: '较小',
                            fontSize: '4%',
                        },
                        {
                            default: true,
                            html: '适中',
                            fontSize: '6%',
                        },
                        {
                            html: '较大',
                            fontSize: '8%',
                        },
                        {
                            html: '极大',
                            fontSize: '10%',
                        },
                    ],
                    onSelect: function (item) {
                        danmuku.config({
                            fontSize: item.fontSize,
                        });
                        return item.html;
                    },
                },
                {
                    width: 200,
                    html: '不透明度',
                    icon: '',
                    tooltip: '100%',
                    selector: [
                        {
                            default: true,
                            opacity: 1,
                            html: '100%',
                        },
                        {
                            opacity: 0.75,
                            html: '75%',
                        },
                        {
                            opacity: 0.5,
                            html: '50%',
                        },
                        {
                            opacity: 0.25,
                            html: '25%',
                        },
                        {
                            opacity: 0,
                            html: '0%',
                        },
                    ],
                    onSelect: function (item) {
                        danmuku.config({
                            opacity: item.opacity,
                        });
                        return item.html;
                    },
                },
                {
                    width: 200,
                    html: '显示范围',
                    icon: '',
                    tooltip: '3/4',
                    selector: [
                        {
                            html: '1/4',
                            margin: ['2%', '75%'],
                        },
                        {
                            html: '半屏',
                            margin: ['2%', '50%'],
                        },
                        {
                            default: true,
                            html: '3/4',
                            margin: ['2%', '25%'],
                        },
                        {
                            html: '满屏',
                            margin: ['2%', '2%'],
                        },
                    ],
                    onSelect: function (item) {
                        danmuku.config({
                            margin: item.margin,
                        });
                        return item.html;
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
