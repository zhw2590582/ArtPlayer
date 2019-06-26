import { errorHandle } from '../utils';

function validElement(value, type, paths) {
    return errorHandle(
        type === 'string' || value instanceof Element,
        `${paths.join('.')} require 'string' or 'Element' type`,
    );
}

export default {
    container: {
        validator: validElement,
        required: true,
    },
    url: {
        type: 'string|function',
        required: true,
    },
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
    plugins: {
        type: 'array',
        child: {
            type: 'function',
        },
    },
    whitelist: {
        type: 'array',
        child: {
            type: 'string|function|regexp',
        },
    },
    layers: {
        type: 'array',
        child: {
            type: 'object|function',
            disable: 'boolean',
            name: 'string',
            index: 'number',
            html: validElement,
            style: 'object',
            click: 'function',
            mounted: 'function',
        },
    },
    contextmenu: {
        type: 'array',
        child: {
            type: 'object|function',
            disable: 'boolean',
            name: 'string',
            index: 'number',
            html: validElement,
            style: 'object',
            click: 'function',
            mounted: 'function',
        },
    },
    quality: {
        type: 'array',
        child: {
            default: 'boolean',
            name: 'string',
            url: 'string',
        },
    },
    controls: {
        type: 'array',
        child: {
            type: 'object|function',
            disable: 'boolean',
            name: 'string',
            index: 'number',
            html: validElement,
            style: 'object',
            click: 'function',
            mounted: 'function',
            position: (value, type, paths) => {
                const position = ['top', 'left', 'right'];
                return errorHandle(
                    position.includes(value),
                    `${paths.join('.')} only accept ${position.toString()} as parameters`,
                );
            },
        },
    },
    highlight: {
        type: 'array',
        child: {
            type: 'object',
            time: 'number',
            text: 'string',
        },
    },
    thumbnails: {
        type: 'object',
        child: {
            url: 'string',
            number: 'number',
            width: 'number',
            height: 'number',
            column: 'number',
        },
    },
    subtitle: {
        type: 'object',
        child: {
            url: 'string',
            style: 'object',
        },
    },
    moreVideoAttr: 'object',
    icons: 'object',
    customType: 'object',
};
