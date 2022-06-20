import style from 'bundle-text:./style.less';

export default function artplayerPluginAds(option) {
    return (art) => {
        const {
            template: { $player },
            constructor: {
                utils: { query, append, setStyle },
            },
        } = art;

        let $ads = null;
        let $timer = null;
        let $close = null;
        let $countdown = null;

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
            setStyle($timer, 'display', 'flex');

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

        function show() {
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

            art.proxy($ads, 'click', () => {
                if (option.url) window.open(option.url);
                art.emit('artplayerPluginAds:click', option);
            });

            return $ads;
        }

        art.on('ready', () => {
            art.once('play', () => {
                show();
                art.pause();
                if (option.video) {
                    art.proxy($ads, 'ended', skip);
                    art.proxy($ads, 'error', skip);
                    art.proxy($ads, 'loadedmetadata', () => {
                        play();
                        $ads.play();
                    });
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
