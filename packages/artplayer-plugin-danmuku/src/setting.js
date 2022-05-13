import danmuOn from 'bundle-text:./img/danmu-on.svg';
import danmuOff from 'bundle-text:./img/danmu-off.svg';

export default function setting(art, danmuku) {
    const { addClass, append, setStyle, tooltip } = art.constructor.utils;

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

    art.on('ready', () => {
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

        art.setting.add({
            name: 'danmuku',
            html: '弹幕设置',
            selector: [
                {
                    html: '弹幕防重叠',
                    icon: '',
                    switch: danmuku.option.antiOverlap,
                    onSwitch(item) {
                        danmuku.config({
                            antiOverlap: !item.switch,
                        });
                        return !item.switch;
                    },
                },
                {
                    html: '同步视频速度',
                    icon: '',
                    switch: danmuku.option.synchronousPlayback,
                    onSwitch(item) {
                        danmuku.config({
                            synchronousPlayback: !item.switch,
                        });
                        return !item.switch;
                    },
                },
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
            ],
        });
    });
}
