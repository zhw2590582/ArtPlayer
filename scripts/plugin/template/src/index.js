import style from 'bundle-text:./style.less';

export default function {{export}}(option) {
    return (art) => {
        return {
            name: '{{export}}',
        };
    };
}

if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-{{name}}';
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
    window['{{export}}'] = {{export}};
}
