export default function artplayerProxyWebAV(option) {
    return (art) => {
        return document.createElement('video');
    };
}

if (typeof window !== 'undefined') {
    window['artplayerProxyWebAV'] = artplayerProxyWebAV;
}
