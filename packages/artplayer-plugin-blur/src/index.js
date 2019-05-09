import blurImageUrl from 'blur-image-url';

function artplayerPluginBlur(art) {
    const { errorHandle, clamp } = art.constructor.utils;
    const { player } = art;
    let blurUrlCache = '';
    return {
        name: 'artplayerPluginBlur',
        attach($ref, radius = 15) {
            errorHandle($ref instanceof Element, 'The attach element is not a dom element');
            $ref.style.backgroundRepeat = 'no-repeat';
            $ref.style.transition = 'all .2s ease';

            function hide() {
                window.URL.revokeObjectURL(blurUrlCache);
                $ref.classList.remove('artplayer-blur-show');
                $ref.style.visibility = 'hidden';
                $ref.style.opacity = '0';
                $ref.style.backgroundImage = 'none';
            }

            function show() {
                const { left, top } = $ref.getBoundingClientRect();
                $ref.style.backgroundImage = 'none';
                $ref.style.backgroundSize = `${player.width}px ${player.height}px`;
                $ref.style.backgroundPosition = `${player.left - left}px ${player.top - top}px`;
                const time = player.currentTime;
                player.getScreenshotBlobUrl().then(screenshotBlobUrl => {
                    blurImageUrl(screenshotBlobUrl, clamp(radius, 0, 50)).then(blurUrl => {
                        window.URL.revokeObjectURL(screenshotBlobUrl);
                        if (!player.playing && time === player.currentTime) {
                            blurUrlCache = blurUrl;
                            $ref.classList.add('artplayer-blur-show');
                            $ref.style.visibility = 'visible';
                            $ref.style.opacity = '1';
                            $ref.style.backgroundImage = `url(${blurUrl})`;
                        } else {
                            hide();
                        }
                    });
                });
            }

            hide();
            art.on('video:pause', show);
            art.on('video:seeked', show);
            art.on('video:playing', hide);
            art.on('video:seeking', hide);
            art.on('video:timeupdate', hide);
        },
    };
}

export default artplayerPluginBlur;
