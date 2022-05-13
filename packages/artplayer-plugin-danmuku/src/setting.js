import danmuOn from 'bundle-text:./img/danmu-on.svg';
import danmuOff from 'bundle-text:./img/danmu-off.svg';

export default function setting(art, danmuku) {
    const { addClass, append, setStyle } = art.constructor.utils;

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
                    html: '同步播放速度',
                    icon: '',
                    switch: danmuku.option.synchronousPlayback,
                    onSwitch(item) {
                        danmuku.config({
                            synchronousPlayback: !item.switch,
                        });
                        return !item.switch;
                    },
                },
            ],
        });
    });
}
