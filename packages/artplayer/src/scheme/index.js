import { errorHandle } from '../utils';

const b = 'boolean';
const s = 'string';
const n = 'number';
const o = 'object';
const a = 'array';
const f = 'function';
const r = 'regexp';

function validElement(value, type, paths) {
    return errorHandle(type === s || value instanceof Element, `${paths.join('.')} require '${s}' or 'Element' type`);
}

const component = {
    html: validElement,
    disable: `?${b}`,
    name: `?${s}`,
    index: `?${n}`,
    style: `?${o}`,
    click: `?${f}`,
    mounted: `?${f}`,
    tooltip: `?${s}`,
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
    rotate: b,
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
    localVideo: b,
    localSubtitle: b,
    useSSR: b,
    plugins: [f],
    whitelist: [`${s}|${f}|${r}`],
    layers: [component],
    contextmenu: [component],
    controls: [
        {
            ...component,
            position: (value, type, paths) => {
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
        width: n,
        height: n,
        column: n,
    },
    subtitle: {
        url: s,
        style: o,
        encoding: s,
        bilingual: b,
    },
    moreVideoAttr: o,
    icons: o,
    customType: o,
};
