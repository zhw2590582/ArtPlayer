import { Player, PlayerOptions, loadImaSdk } from '@glomex/vast-ima-player';

export default function artplayerPluginVast(callback) {
    return async (art) => {
        const { template, constructor } = art;
        const { createElement, setStyles } = constructor.utils;
        const { $video, $player } = template;

        await loadImaSdk();
        const google = window.google;
        const ima = google.ima;

        const adsRenderingSettings = new ima.AdsRenderingSettings();
        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        adsRenderingSettings.enablePreloading = true;

        const playerOptions = new PlayerOptions();
        let isAdPlaying = false;
        let imaPlayer = null;
        let $container = null;

        function createContainer() {
            const container = createElement('div');
            const id = `art-vast-${Date.now()}`;
            container.id = id;
            setStyles(container, {
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                zIndex: '150',
                backgroundColor: 'black',
                display: 'none',
                pointerEvents: 'auto',
            });
            return container;
        }

        function initPlayer() {
            $container = createContainer();
            $player.appendChild($container);
            imaPlayer = new Player(ima, $video, $container, adsRenderingSettings, playerOptions);

            // ✅ 事件绑定
            imaPlayer.onAdStarted = () => {
                isAdPlaying = true;
                $container.style.display = 'block';
                art.pause();
            };

            imaPlayer.onAdEnd = () => {
                isAdPlaying = false;
                $container.style.display = 'none';
                art.play();
            };

            imaPlayer.onAdError = (error) => {
                console.error('VAST Ad Error:', error);
                isAdPlaying = false;
                $container.style.display = 'none';
                art.play();
            };
        }

        function destroyPlayer() {
            if ($container && $container.parentNode) {
                $container.parentNode.removeChild($container);
            }
            $container = null;
            imaPlayer = null;
        }

        function playUrl(url) {
            if (isAdPlaying) return;
            if (!imaPlayer) initPlayer();
            const request = new ima.AdsRequest();
            request.adTagUrl = url;
            imaPlayer.playAds(request);
        }

        function playRes(res) {
            if (isAdPlaying) return;
            if (!imaPlayer) initPlayer();
            const request = new ima.AdsRequest();
            request.adsResponse = res;
            imaPlayer.playAds(request);
        }

        if (typeof callback === 'function') {
            await callback({
                art,
                playUrl,
                playRes,
                ima,
                imaPlayer,
                get container() {
                    return $container;
                },
            });
        }

        return {
            name: 'artplayerPluginVast',
            destroy: destroyPlayer,
        };
    };
}

if (typeof window !== 'undefined') {
    window.artplayerPluginVast = artplayerPluginVast;
}
