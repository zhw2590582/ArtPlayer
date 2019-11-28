import { errorHandle } from '../utils';

function validElement(value, type, paths) {
    return errorHandle(
        type === 'string' || value instanceof Element,
        `${paths.join('.')} require 'string' or 'Element' type`,
    );
}

export default {
    container: validElement,
    url: 'string',
    poster: 'string',
    title: 'string',
    theme: 'string',
    lang: 'string',
    volume: 'number',
    isLive: 'boolean',
    muted: 'boolean',
    autoplay: 'boolean',
    autoSize: 'boolean',
    loop: 'boolean',
    flip: 'boolean',
    playbackRate: 'boolean',
    aspectRatio: 'boolean',
    screenshot: 'boolean',
    setting: 'boolean',
    hotkey: 'boolean',
    pip: 'boolean',
    mutex: 'boolean',
    fullscreen: 'boolean',
    fullscreenWeb: 'boolean',
    subtitleOffset: 'boolean',
    miniProgressBar: 'boolean',
    localVideo: 'boolean',
    localSubtitle: 'boolean',
    autoPip: 'boolean',
    networkMonitor: 'boolean',
    plugins: ['function'],
    whitelist: ['string|function|regexp'],
    layers: [
        {
            disable: 'boolean|undefined',
            name: 'string|undefined',
            index: 'number|undefined',
            html: validElement,
            style: 'object|undefined',
            click: 'function|undefined',
            mounted: 'function|undefined',
            tooltip: 'string|undefined',
        },
    ],
    contextmenu: [
        {
            disable: 'boolean|undefined',
            name: 'string|undefined',
            index: 'number|undefined',
            html: validElement,
            style: 'object|undefined',
            click: 'function|undefined',
            mounted: 'function|undefined',
            tooltip: 'string|undefined',
        },
    ],
    quality: [
        {
            default: 'boolean|undefined',
            name: 'string',
            url: 'string',
        },
    ],
    controls: [
        {
            disable: 'boolean|undefined',
            name: 'string|undefined',
            index: 'number|undefined',
            html: validElement,
            style: 'object|undefined',
            click: 'function|undefined',
            mounted: 'function|undefined',
            tooltip: 'string|undefined',
            position: (value, type, paths) => {
                const position = ['top', 'left', 'right'];
                return errorHandle(
                    position.includes(value),
                    `${paths.join('.')} only accept ${position.toString()} as parameters`,
                );
            },
        },
    ],
    highlight: [
        {
            time: 'number',
            text: 'string',
        },
    ],
    thumbnails: {
        url: 'string',
        number: 'number',
        width: 'number',
        height: 'number',
        column: 'number',
    },
    subtitle: {
        url: 'string',
        style: 'object',
    },
    moreVideoAttr: 'object',
    icons: 'object',
    customType: 'object',
};
