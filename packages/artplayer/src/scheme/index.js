import { ArtPlayerError } from '../utils';

function validElement(paths, value, type) {
    if (type === 'string') {
        if (value.trim() === '') {
            throw new ArtPlayerError(`${paths.join('.')} can not be empty`);
        } else {
            return true;
        }
    }

    if (value instanceof Element) {
        return true;
    }

    throw new ArtPlayerError(`${paths.join('.')} require 'string' or 'Element' type, but got '${type}'`);
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
            position: (paths, value) => ['top', 'left', 'right'].includes(value),
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
            type: 'object',
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
            type: 'object',
            url: 'string',
            style: 'object',
        },
    },
    moreVideoAttr: 'object',
    icons: 'object',
    customType: 'object',
    lang: 'string',
};
