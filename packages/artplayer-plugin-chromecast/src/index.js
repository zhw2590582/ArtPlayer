const loadScript = (src) =>
    new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });

const getMimeType = (url) => {
    const extension = url.split('?')[0].split('#')[0].split('.').pop().toLowerCase();
    const mimeTypes = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        ogg: 'video/ogg',
        ogv: 'video/ogg',
        mp3: 'audio/mp3',
        wav: 'audio/wav',
        flv: 'video/x-flv',
        mov: 'video/quicktime',
        avi: 'video/x-msvideo',
        wmv: 'video/x-ms-wmv',
        mpd: 'application/dash+xml',
        m3u8: 'application/x-mpegURL',
    };
    return mimeTypes[extension] || 'application/octet-stream';
};

export default function artplayerPluginChromecast(option) {
    const DEFAULT_ICON = `<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M512 96H64v99c-13-2-26.4-3-40-3H0V96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H288V456c0-13.6-1-27-3-40H512V96zM24 224c128.1 0 232 103.9 232 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM0 344c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24z"/></svg>`;
    const DEFAULT_SDK = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';

    let isCastInitialized = false;
    let castSession = null;
    let castState = null;

    const initializeCastApi = () => {
        return new Promise((resolve, reject) => {
            window['__onGCastApiAvailable'] = (isAvailable) => {
                if (isAvailable) {
                    const context = window.cast.framework.CastContext.getInstance();
                    context.setOptions({
                        receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                        autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
                    });

                    // Listen for session state changes
                    context.addEventListener(
                        window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
                        (event) => {
                            const SessionState = window.cast.framework.SessionState;
                            castState = event.sessionState;
                            castSession = event.session;

                            switch (event.sessionState) {
                                case SessionState.NO_SESSION:
                                    option.onStateChange?.('disconnected');
                                    updateCastButton('disconnected');
                                    break;
                                case SessionState.SESSION_STARTING:
                                    option.onStateChange?.('connecting');
                                    updateCastButton('connecting');
                                    break;
                                case SessionState.SESSION_STARTED:
                                    option.onStateChange?.('connected');
                                    updateCastButton('connected');
                                    break;
                                case SessionState.SESSION_ENDING:
                                    option.onStateChange?.('disconnecting');
                                    updateCastButton('disconnecting');
                                    break;
                                case SessionState.SESSION_RESUMED:
                                    option.onStateChange?.('connected');
                                    updateCastButton('connected');
                                    break;
                            }
                        },
                    );

                    // Listen for cast state changes
                    context.addEventListener(window.cast.framework.CastContextEventType.CAST_STATE_CHANGED, (event) => {
                        const CastState = window.cast.framework.CastState;
                        switch (event.castState) {
                            case CastState.NO_DEVICES_AVAILABLE:
                                option.onCastAvailable?.(false);
                                break;
                            case CastState.NOT_CONNECTED:
                                option.onCastAvailable?.(true);
                                break;
                            case CastState.CONNECTING:
                            case CastState.CONNECTED:
                                option.onCastAvailable?.(true);
                                break;
                        }
                    });

                    isCastInitialized = true;
                    resolve();
                } else {
                    reject(new Error('Cast API is not available'));
                }
            };
            if (!window.chrome || !window.chrome.cast) {
                loadScript(option.sdk || DEFAULT_SDK).catch(reject);
            }
        });
    };

    const castVideo = (art, session) => {
        const url = option.url || art.option.url;
        const mediaInfo = new window.chrome.cast.media.MediaInfo(url, option.mimeType || getMimeType(url));
        const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
        session
            .loadMedia(request)
            .then(() => {
                art.notice.show = 'Casting started';
                option.onCastStart?.();
            })
            .catch((error) => {
                art.notice.show = 'Error casting media';
                option.onError?.(error);
                throw error;
            });
    };

    const updateCastButton = (state) => {
        const button = document.querySelector('.art-icon-cast');
        if (button) {
            switch (state) {
                case 'connected':
                    button.style.color = 'red';
                    break;
                case 'connecting':
                case 'disconnecting':
                    button.style.color = 'orange';
                    break;
                case 'disconnected':
                default:
                    button.style.color = 'white';
                    break;
            }
        }
    };

    return async (art) => {
        art.controls.add({
            name: 'chromecast',
            position: 'right',
            tooltip: 'Chromecast',
            html: `<i class="art-icon art-icon-cast">${option.icon || DEFAULT_ICON}</i>`,
            click: async () => {
                if (!isCastInitialized) {
                    try {
                        await initializeCastApi();
                    } catch (error) {
                        art.notice.show = 'Failed to initialize Cast API';
                        option.onError?.(error);
                        throw error;
                    }
                }

                const context = window.cast.framework.CastContext.getInstance();
                if (castSession) {
                    castVideo(art, castSession);
                } else {
                    try {
                        const session = await context.requestSession();
                        castVideo(art, session);
                    } catch (error) {
                        art.notice.show = 'Error connecting to cast session';
                        option.onError?.(error);
                        throw error;
                    }
                }
            },
        });

        return {
            name: 'artplayerPluginChromecast',
            getCastState: () => castState,
            isCasting: () => castSession !== null,
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginChromecast'] = artplayerPluginChromecast;
}
