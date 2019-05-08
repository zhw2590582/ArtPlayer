import blurImageUrl from 'blur-image-url';

function artplayerPluginBlur(art) {
    const { errorHandle, clamp } = art.constructor.utils;
    const { player } = art;
    return {
        name: 'artplayerPluginBlur',
        attach($ref, radius = 15) {
            errorHandle($ref instanceof Element, 'The attach element is not a dom element');
            $ref.style.backgroundRepeat = 'no-repeat';
            $ref.style.transition = 'all .2s ease';

            function show() {
                const { left, top } = $ref.getBoundingClientRect();
                $ref.style.backgroundImage = 'none';
                $ref.style.backgroundSize = `${player.width}px ${player.height}px`;
                $ref.style.backgroundPosition = `${player.left - left}px ${player.top - top}px`;
                player.getScreenshotBlobUrl().then(url => {
                    blurImageUrl(url, clamp(radius, 0, 50)).then(img => {
                        $ref.style.backgroundImage = `url(${img})`;
                        $ref.style.visibility = 'visible';
                        $ref.style.opacity = '1';
                        $ref.style.pointerEvents = 'auto';
                    });
                });
            }

            function hide() {
                $ref.style.visibility = 'hidden';
                $ref.style.opacity = '0';
                $ref.style.pointerEvents = 'none';
                $ref.style.backgroundImage = 'none';
            }

            hide();
            art.on('video:pause', show);
            art.on('video:ended', show);
            art.on('video:seeked', show);
            art.on('video:playing', hide);
            art.on('video:timeupdate', hide);
        },
    };
}

export default artplayerPluginBlur;
