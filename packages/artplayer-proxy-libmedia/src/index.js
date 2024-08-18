export default function artplayerProxyLibmedia(option) {
    return (art) => {
        return document.createElement('video');
    };
}

if (typeof window !== 'undefined') {
    window['artplayerProxyLibmedia'] = artplayerProxyLibmedia;
}
