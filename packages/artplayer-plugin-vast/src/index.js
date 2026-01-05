const SDK_URL = '//imasdk.googleapis.com/js/sdkloader/ima3.js';

export default function artplayerPluginVast(option) {
    return (art) => {
        const {
            template: { $player, $video },
            constructor: {
                utils: { setStyle, setStyles, append, remove, isMobile },
            },
        } = art;

        let adsLoader = null;
        let adsManager = null;
        let adDisplayContainer = null;
        let adDisplayContainerInitialized = false;
        let $container = null;
        let $play = null;
        let isAdPlaying = false;
        let originalState = {};

        const events = {
            ADS_MANAGER_LOADED: 'adsManagerLoaded',
            AD_LOADED: 'adLoaded',
            AD_STARTED: 'adStarted',
            AD_PAUSED: 'adPaused',
            AD_RESUMED: 'adResumed',
            AD_SKIPPED: 'adSkipped',
            AD_COMPLETE: 'adComplete',
            ALL_ADS_COMPLETED: 'allAdsCompleted',
            AD_ERROR: 'adError',
            AD_CLICK: 'adClick',
        };

        function loadSdk() {
            return new Promise((resolve, reject) => {
                if (window.google && window.google.ima) {
                    resolve(window.google.ima);
                } else {
                    const script = document.createElement('script');
                    script.src = SDK_URL;
                    script.async = true;
                    script.onload = () => resolve(window.google.ima);
                    script.onerror = reject;
                    document.body.appendChild(script);
                }
            });
        }

        function createContainer() {
            if ($container) return;
            $container = document.createElement('div');
            $container.id = 'artplayer-vast';
            setStyles($container, {
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                zIndex: '150',
                display: 'none',
                pointerEvents: 'auto',
            });
            append($player, $container);

            $play = document.createElement('div');
            setStyles($play, {
                position: 'absolute',
                zIndex: '160',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                display: 'none',
                width: '70px',
                height: '70px',
            });
            $play.innerHTML = `
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="rgba(255,255,255,0.9)">
                    <path d="M8 5v14l11-7z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            `;
            append($player, $play);

            $play.addEventListener('click', () => {
                if (adsManager) {
                    adsManager.resume();
                }
            });
        }

        function hijack() {
            if (isAdPlaying) return;
            isAdPlaying = true;

            originalState = {
                hotkey: art.option.hotkey,
                scrubbing: art.option.scrubbing,
                controls: art.controls.show,
                contextmenu: art.option.contextmenu,
                lock: art.option.lock,
                autoPlayback: art.option.autoPlayback,
            };

            art.option.hotkey = false;
            art.option.scrubbing = false;
            art.controls.show = false;

            if (!art.paused) art.pause();
            if ($container) setStyle($container, 'display', 'block');
        }

        function release() {
            if (!isAdPlaying) return;
            isAdPlaying = false;

            art.option.hotkey = originalState.hotkey;
            art.option.scrubbing = originalState.scrubbing;
            art.controls.show = originalState.controls;

            if ($container) setStyle($container, 'display', 'none');
            if ($play) setStyle($play, 'display', 'none');

            art.play();
        }

        function onAdError(event) {
            const error = event.getError();
            art.emit(`vast:${events.AD_ERROR}`, error);
            console.error('Vast Error:', error);
            if (adsManager) {
                adsManager.destroy();
            }
            release();
        }

        function onAdEvent(event) {
            const type = event.type;
            const ima = window.google.ima;

            switch (type) {
                case ima.AdEvent.Type.LOADED:
                    art.emit(`vast:${events.AD_LOADED}`, event);
                    break;
                case ima.AdEvent.Type.STARTED:
                    art.emit(`vast:${events.AD_STARTED}`, event);
                    setStyle($play, 'display', 'none');
                    break;
                case ima.AdEvent.Type.PAUSED:
                    art.emit(`vast:${events.AD_PAUSED}`, event);
                    setStyle($play, 'display', 'block');
                    break;
                case ima.AdEvent.Type.RESUMED:
                    art.emit(`vast:${events.AD_RESUMED}`, event);
                    setStyle($play, 'display', 'none');
                    break;
                case ima.AdEvent.Type.COMPLETE:
                    art.emit(`vast:${events.AD_COMPLETE}`, event);
                    break;
                case ima.AdEvent.Type.SKIPPED:
                    art.emit(`vast:${events.AD_SKIPPED}`, event);
                    break;
                case ima.AdEvent.Type.CLICK:
                    art.emit(`vast:${events.AD_CLICK}`, event);
                    break;
                case ima.AdEvent.Type.ALL_ADS_COMPLETED:
                    art.emit(`vast:${events.ALL_ADS_COMPLETED}`, event);
                    release();
                    break;
            }
        }

        function onContentPauseRequested() {
            hijack();
        }

        function onContentResumeRequested() {
            release();
        }

        function initAdsManager(adsManagerLoadedEvent) {
            const ima = window.google.ima;
            const adsRenderingSettings = new ima.AdsRenderingSettings();
            adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

            if (adsManager) adsManager.destroy();

            adsManager = adsManagerLoadedEvent.getAdsManager($video, adsRenderingSettings);

            adsManager.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, onAdError);
            adsManager.addEventListener(ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested);
            adsManager.addEventListener(ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested);

            [
                ima.AdEvent.Type.LOADED,
                ima.AdEvent.Type.STARTED,
                ima.AdEvent.Type.PAUSED,
                ima.AdEvent.Type.RESUMED,
                ima.AdEvent.Type.COMPLETE,
                ima.AdEvent.Type.SKIPPED,
                ima.AdEvent.Type.CLICK,
                ima.AdEvent.Type.ALL_ADS_COMPLETED,
            ].forEach((eventType) => {
                adsManager.addEventListener(eventType, onAdEvent);
            });

            try {
                const { width, height } = $player.getBoundingClientRect();
                adsManager.init(width, height, ima.ViewMode.NORMAL);
                adsManager.start();
            } catch (adError) {
                onAdError({ getError: () => adError });
            }
        }

        function requestAds(adsRequest) {
            loadSdk()
                .then((ima) => {
                    createContainer();

                    if (!adsLoader) {
                        if (ima.ImaSdkSettings && ima.ImaSdkSettings.VpaidMode) {
                            ima.settings.setVpaidMode(ima.ImaSdkSettings.VpaidMode.DISABLED);
                        }
                        ima.settings.setDisableCustomPlaybackForIOS10Plus(true);

                        adDisplayContainer = new ima.AdDisplayContainer($container, $video);
                        adsLoader = new ima.AdsLoader(adDisplayContainer);
                        adsLoader.addEventListener(
                            ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                            initAdsManager,
                            false,
                        );
                        adsLoader.addEventListener(ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);
                    }

                    if (!adDisplayContainerInitialized && adDisplayContainer) {
                        adDisplayContainer.initialize();
                        adDisplayContainerInitialized = true;
                    }

                    adsLoader.requestAds(adsRequest);
                })
                .catch((err) => {
                    console.error('Vast SDK Load Error:', err);
                });
        }

        function playAdTag(url) {
            loadSdk().then((ima) => {
                const adsRequest = new ima.AdsRequest();
                adsRequest.adTagUrl = url;
                requestAds(adsRequest);
            });
        }

        function playAdsResponse(response) {
            loadSdk().then((ima) => {
                const adsRequest = new ima.AdsRequest();
                adsRequest.adsResponse = response;
                requestAds(adsRequest);
            });
        }

        function resize() {
            if (adsManager && $player) {
                const { width, height } = $player.getBoundingClientRect();
                adsManager.resize(width, height, window.google.ima.ViewMode.NORMAL);
            }
        }

        art.on('resize', resize);
        art.on('destroy', () => {
            if (adsManager) adsManager.destroy();
            if (adDisplayContainer) adDisplayContainer.destroy();
            if ($container) remove($container);
            if ($play) remove($play);
        });

        if (option.url) {
            playAdTag(option.url);
        } else if (option.adsResponse) {
            playAdsResponse(option.adsResponse);
        }

        return {
            name: 'artplayerPluginVast',
            playAdTag,
            playAdsResponse,
            get adsLoader() {
                return adsLoader;
            },
            get adsManager() {
                return adsManager;
            },
        };
    };
}

if (typeof window !== 'undefined') {
    window.artplayerPluginVast = artplayerPluginVast;
}
