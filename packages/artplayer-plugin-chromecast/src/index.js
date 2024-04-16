function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

function getMimeType(url) {
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
}

export default function artplayerPluginChromecast(option) {
    const DEFAULT_ICON = `<svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M512 96H64v99c-13-2-26.4-3-40-3H0V96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H288V456c0-13.6-1-27-3-40H512V96zM24 224c128.1 0 232 103.9 232 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM0 344c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24z"/></svg>`;
    const DEFAULT_SDK = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';

    window['__onGCastApiAvailable'] = function (isAvailable) {
        if (isAvailable) {
            cast.framework.CastContext.getInstance().setOptions({
                receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
            });
        }
    };

    return async (art) => {
        if (!window.chrome || !window.chrome.cast) {
            await loadScript(option.sdk || DEFAULT_SDK);
        }

        function castVideo(session) {
            const url = option.url || art.option.url;
            const mimeType = option.mimeType || getMimeType(url);
            const mediaInfo = new chrome.cast.media.MediaInfo(url, mimeType);
            const request = new chrome.cast.media.LoadRequest(mediaInfo);
            session.loadMedia(request).then(
                function () {
                    console.log('Media loaded successfully');
                },
                function (error) {
                    art.notice.show = 'Error casting media';
                    console.log('Error casting media', error);
                },
            );
        }

        art.controls.add({
            name: 'chromecast',
            position: 'right',
            tooltip: 'Chromecast',
            html: `<i class="art-icon art-icon-cast">${option.icon || DEFAULT_ICON}</i>`,
            click() {
                const castSession = cast.framework.CastContext.getInstance().getCurrentSession();

                if (castSession) {
                    castVideo(castSession);
                } else {
                    cast.framework.CastContext.getInstance()
                        .requestSession()
                        .then(
                            function (session) {
                                castVideo(session);
                            },
                            function (error) {
                                art.notice.show = 'Error connecting to cast session';
                                console.log('Error connecting to cast session', error);
                            },
                        );
                }
            },
        });

        return {
            name: 'artplayerPluginChromecast',
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginChromecast'] = artplayerPluginChromecast;
}
