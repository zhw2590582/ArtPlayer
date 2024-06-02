import style from 'bundle-text:./style.less';

export default function artplayerPluginChapter(option) {
    return (art) => {
        return {
            name: 'artplayerPluginChapter',
        };
    };
}

if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-chapter';
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
    window['artplayerPluginChapter'] = artplayerPluginChapter;
}
