const $iframe = document.createElement('iframe');
$iframe.allowFullscreen = true;
$iframe.width = '100%';
$iframe.height = '100%';

const $container = document.querySelector('.artplayer-app');
$container.innerHTML = '';
$container.appendChild($iframe);

const iframe = new ArtplayerPluginIframe({
    iframe: $iframe,
    url: '/iframe.html',
});

iframe.message(({ type, data }) => {
    switch (type) {
        case 'fullscreenWeb':
            if (data) {
                $iframe.classList.add('fullscreenWeb');
            } else {
                $iframe.classList.remove('fullscreenWeb');
            }
            break;
        default:
            break;
    }
});

iframe.commit(() => {
    var art = new Artplayer({
        container: '.artplayer-app',
        url: '/assets/sample/video.mp4',
        fullscreen: true,
        fullscreenWeb: true,
    });

    art.on('fullscreenWeb', (state) => {
        ArtplayerPluginIframe.postMessage({
            type: 'fullscreenWeb',
            data: state,
        });
    });
});
