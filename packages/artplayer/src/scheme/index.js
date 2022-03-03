import { errorHandle } from '../utils';

const a = 'array';
const b = 'boolean';
const s = 'string';
const n = 'number';
const o = 'object';
const f = 'function';
const r = 'regexp';

function validElement(value, type, paths) {
    return errorHandle(type === s || value instanceof Element, `${paths.join('.')} require '${s}' or 'Element' type`);
}

export const ComponentOption = {
    html: validElement,
    disable: `?${b}`,
    name: `?${s}`,
    index: `?${n}`,
    style: `?${o}`,
    click: `?${f}`,
    mounted: `?${f}`,
    tooltip: `?${s}`,
    width: `?${n}`,
    selector: `?${a}`,
    onSelect: `?${f}`,
};

export default {
    container: validElement,
    url: s,
    poster: s,
    title: s,
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
    ads: [
        {
            url: s,
        },
    ],
    plugins: [f],
    whitelist: [`${s}|${f}|${r}`],
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
        urls: [s],
        column: n,
        row:n
    },
    subtitle: {
        url: s,
        type: s,
        style: o,
        encoding: s,
        bilingual: b,
    },
    moreVideoAttr: o,
    icons: o,
    customType: o,
};
