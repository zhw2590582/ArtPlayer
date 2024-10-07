import style from 'bundle-text:./style.less';

export default function artplayerPluginDanmukuMask(option) {
    return (art) => {
        return {
            name: 'artplayerPluginDanmukuMask',
        };
    };
}

if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-danmuku-mask';
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

if (typeof window !== 'undefined') {
    window['artplayerPluginDanmukuMask'] = artplayerPluginDanmukuMask;
}
