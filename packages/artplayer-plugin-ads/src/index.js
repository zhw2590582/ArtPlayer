import style from 'bundle-text:./style.less';

export default function artplayerPluginAds(option) {
    return (art) => {
        const {
            template: { $player },
            icons: { volume, volumeClose, fullscreenOn, fullscreenOff },
            constructor: {
                validator,
                utils: { query, append, setStyle, errorHandle },
            },
        } = art;

        option = validator(option, {
            html: '?string',
            video: '?string',
            url: '?string',
            playDuration: 'number',
            totalDuration: 'number',
        });

        let $ads = null;
        let $timer = null;
        let $close = null;
        let $countdown = null;
        let $control = null;

        let time = 0;
        let timer = null;
        let isEnd = false;

        function skip() {
            isEnd = true;
            art.play();
            if (option.video) $ads.pause();
            setStyle(art.template.$ads, 'display', 'none');
            art.emit('artplayerPluginAds:skip', option);
        }

        function play() {
            if (isEnd) return;

            timer = setTimeout(() => {
                time += 1;

                const playDuration = option.playDuration - time;
                if (playDuration >= 1) {
                    $close.innerHTML = `${playDuration}秒后可关闭广告`;
                } else {
                    $close.innerHTML = '关闭广告';
                    art.proxy($close, 'click', skip);
                }

                $countdown.innerHTML = `${option.totalDuration - time}秒`;

                if (time >= option.totalDuration) {
                    skip();
                } else {
                    play();
                }
            }, 1000);
        }

        function pause() {
            if (isEnd) return;
            clearTimeout(timer);
        }

        function init() {
            art.template.$ads = append($player, '<div class="artplayer-plugin-ads"></div>');

            $ads = append(
                art.template.$ads,
                option.video
                    ? `<video class="artplayer-plugin-ads-video" src="${option.video}"></video>`
                    : `<div class="artplayer-plugin-ads-html">${option.html}</div>`,
            );

            $timer = append(
                art.template.$ads,
                `<div class="artplayer-plugin-ads-timer">
                    <div class="artplayer-plugin-ads-close">${option.playDuration}秒后可关闭广告</div>
                    <div class="artplayer-plugin-ads-countdown">${option.totalDuration}秒</div>
                </div>`,
            );

            $close = query('.artplayer-plugin-ads-close', $timer);
            $countdown = query('.artplayer-plugin-ads-countdown', $timer);

            $control = append(
                art.template.$ads,
                `<div class="artplayer-plugin-ads-control">
                    <div class="artplayer-plugin-ads-detail">查看详情</div>
                    <div class="artplayer-plugin-ads-muted"></div>
                    <div class="artplayer-plugin-ads-fullscreen"></div>
                </div>`,
            );

            const $detail = query('.artplayer-plugin-ads-detail', $control);
            const $muted = query('.artplayer-plugin-ads-muted', $control);
            const $fullscreen = query('.artplayer-plugin-ads-fullscreen', $control);

            if (option.video) {
                const $volume = append($muted, volume);
                const $volumeClose = append($muted, volumeClose);
                setStyle($volumeClose, 'display', 'none');

                art.proxy($ads, 'loadedmetadata', () => {
                    if ($ads.muted) {
                        setStyle($volume, 'display', 'none');
                        setStyle($volumeClose, 'display', 'inline-flex');
                    } else {
                        setStyle($volume, 'display', 'inline-flex');
                        setStyle($volumeClose, 'display', 'none');
                    }
                });

                art.proxy($muted, 'click', () => {
                    $ads.muted = !$ads.muted;
                    if ($ads.muted) {
                        setStyle($volume, 'display', 'none');
                        setStyle($volumeClose, 'display', 'inline-flex');
                    } else {
                        setStyle($volume, 'display', 'inline-flex');
                        setStyle($volumeClose, 'display', 'none');
                    }
                });
            } else {
                setStyle($muted, 'display', 'none');
            }

            const $fullscreenOn = append($fullscreen, fullscreenOn);
            const $fullscreenOff = append($fullscreen, fullscreenOff);
            setStyle($fullscreenOff, 'display', 'none');

            art.proxy($fullscreen, 'click', () => {
                art.fullscreen = !art.fullscreen;
                if (art.fullscreen) {
                    setStyle($fullscreenOn, 'display', 'inline-flex');
                    setStyle($fullscreenOff, 'display', 'none');
                } else {
                    setStyle($fullscreenOn, 'display', 'none');
                    setStyle($fullscreenOff, 'display', 'inline-flex');
                }
            });

            art.proxy($ads, 'click', () => {
                if (option.url) window.open(option.url);
                art.emit('artplayerPluginAds:click', option);
            });

            art.proxy($detail, 'click', () => {
                if (option.url) window.open(option.url);
                art.emit('artplayerPluginAds:click', option);
            });
        }

        art.on('ready', () => {
            art.once('play', () => {
                init();
                art.pause();
                if (option.video) {
                    art.proxy($ads, 'error', skip);
                    art.proxy($ads, 'loadedmetadata', () => {
                        play();
                        $ads.play();
                        setStyle($timer, 'display', 'flex');
                    });
                } else {
                    play();
                    setStyle($timer, 'display', 'flex');
                }
            });

            art.proxy(document, 'visibilitychange', () => {
                if (document.hidden) {
                    pause();
                } else {
                    play();
                }
            });
        });

        return {
            name: 'artplayerPluginAds',
            skip,
            pause,
            play,
        };
    };
}

artplayerPluginAds.env = process.env.NODE_ENV;
artplayerPluginAds.version = process.env.APP_VER;
artplayerPluginAds.build = process.env.BUILD_DATE;

if (typeof document !== 'undefined') {
    if (!document.getElementById('artplayer-plugin-ads')) {
        const $style = document.createElement('style');
        $style.id = 'artplayer-plugin-ads';
        $style.textContent = style;
        document.head.appendChild($style);
    }
}

if (typeof window !== 'undefined') {
    window['artplayerPluginAds'] = artplayerPluginAds;
}
