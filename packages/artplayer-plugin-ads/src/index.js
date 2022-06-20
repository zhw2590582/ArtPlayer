import style from 'bundle-text:./style.less';

export default function artplayerPluginAds(option) {
    return (art) => {
        const {
            constructor: {
                utils: { append },
            },
            template: { $player },
        } = art;

        function skip() {
            //
        }

        function toggleFullscreen() {
            //
        }

        function toggleMuted() {
            //
        }

        function show() {
            art.template.$ads = append($player, '<div class="artplayer-plugin-ads"></div>');

            const html = option.video
                ? `<video class="artplayer-plugin-ads-video" src="${option.video}" controls="false"></video>`
                : option.html;

            const $ads = append(art.template.$ads, html);

            art.proxy($ads, 'click', () => {
                if (option.url) window.open(option.url);
                art.emit('artplayerPluginAds:click', option);
            });

            return $ads;
        }

        art.on('ready', () => {
            art.once('play', () => {
                art.pause();
                const $ads = show();
                const isVideo = $ads instanceof HTMLVideoElement;
            });
        });

        return {
            name: 'artplayerPluginAds',
            skip,
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
