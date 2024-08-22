export default function artplayerProxyLibmedia(opt = {}) {
    return (art) => {
        const { option, constructor } = art;
        const { createElement, def } = constructor.utils;

        return document.createElement('video');
    };
}

if (typeof window !== 'undefined') {
    window['artplayerProxyLibmedia'] = artplayerProxyLibmedia;
}
