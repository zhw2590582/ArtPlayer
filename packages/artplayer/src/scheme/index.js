import { errorHandle } from '../utils';

const a = 'array';
const b = 'boolean';
const s = 'string';
const n = 'number';
const o = 'object';
const f = 'function';

function validElement(value, type, paths) {
    return errorHandle(
        type === s || type === n || value instanceof Element,
        `${paths.join('.')} require '${s}' or 'Element' type`,
    );
}

export const ComponentOption = {
    html: validElement,
    disable: `?${b}`,
    name: `?${s}`,
    index: `?${n}`,
    style: `?${o}`,
    click: `?${f}`,
    mounted: `?${f}`,
    tooltip: `?${s}|${n}`,
    width: `?${n}`,
    selector: `?${a}`,
    onSelect: `?${f}`,
    switch: `?${b}`,
    onSwitch: `?${f}`,
    range: `?${a}`,
    onRange: `?${f}`,
    onChange: `?${f}`,
};

export default {
    id: s,
    container: validElement,
    url: s,
    poster: s,
    type: s,
    theme: s,
    lang: s,
    volume: n,
    isLive: b,
    muted: b,
    autoplay: b,
    autoSize: b,
    autoMini: b,
    loop: b,
    flip: b,
    playbackRate: b,
    aspectRatio: b,
    screenshot: b,
    setting: b,
    hotkey: b,
    pip: b,
    mutex: b,
    backdrop: b,
    fullscreen: b,
    fullscreenWeb: b,
    subtitleOffset: b,
    miniProgressBar: b,
    useSSR: b,
    playsInline: b,
    lock: b,
    fastForward: b,
    autoPlayback: b,
    autoOrientation: b,
    airplay: b,
    plugins: [f],
    layers: [ComponentOption],
    contextmenu: [ComponentOption],
    settings: [ComponentOption],
    controls: [
        {
            ...ComponentOption,
            position: (value, _, paths) => {
                const position = ['top', 'left', 'right'];
                return errorHandle(
                    position.includes(value),
                    `${paths.join('.')} only accept ${position.toString()} as parameters`,
                );
            },
        },
    ],
    quality: [
        {
            default: `?${b}`,
            html: s,
            url: s,
        },
    ],
    highlight: [
        {
            time: n,
            text: s,
        },
    ],
    thumbnails: {
        url: s,
        number: n,
        column: n,
        width: n,
        height: n,
    },
    subtitle: {
        url: s,
        type: s,
        style: o,
        escape: b,
        encoding: s,
        onVttLoad: f,
    },
    moreVideoAttr: o,
    i18n: o,
    icons: o,
    cssVar: o,
    customType: o,
};
