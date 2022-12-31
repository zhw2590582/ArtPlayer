import style from 'bundle-text:./style.less';

export default function artplayerPluginAliyundrive(option = { onlyOnFullscreen: true, playlist: [] }) {
    return (art) => {
        const {
            template: { $player, $bottom },
            constructor: {
                utils: { append, query, secondToTime, setStyle },
            },
        } = art;

        let index = 0;

        function play() {
            const playItme = option.playlist[index];
            if (!playItme) return;
            art.poster = playItme.poster || '';
            playItme.quality = playItme.quality || [];
            const quality = playItme.quality.find((item) => item.default) || playItme.quality[0];
            art.url = playItme.url || quality.url || '';
        }

        function next() {
            const nextIndex = index + 1;
            index = nextIndex > option.playlist.length - 1 ? 0 : nextIndex;
            play();
        }

        function prev() {
            const prevIndex = index - 1;
            index = prevIndex < 0 ? 0 : prevIndex;
            play();
        }

        function initControl() {
            const $control = append(
                $player,
                `
                    <div class="artplayer-plugin-aliyundrive">
                        <div class="apa-control">
                            <div class="apa-control-current"></div>
                            <div class="apa-control-progress">
                                <div class="apa-control-progress-inner">
                                    <div class="apa-control-loaded"></div>
                                    <div class="apa-control-played">
                                        <div class="apa-control-indicator"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="apa-control-duration"></div>
                        </div>
                        <div class="apa-tool"></div>
                    </div>
                `,
            );

            const $current = query('.apa-control-current', $control);
            const $duration = query('.apa-control-duration', $control);
            const $played = query('.apa-control-played', $control);
            const $loaded = query('.apa-control-loaded', $control);

            const events = ['video:loadedmetadata', 'video:timeupdate', 'video:progress'];
            for (let index = 0; index < events.length; index++) {
                art.on(events[index], () => {
                    $current.innerText = secondToTime(art.currentTime);
                    $duration.innerText = secondToTime(art.duration);
                    setStyle($played, 'width', `${art.played * 100}%`);
                    setStyle($loaded, 'width', `${art.loaded * 100}%`);
                });
            }

            if (option.onlyOnFullscreen) {
                setStyle($control, 'display', 'none');
                setStyle($bottom, 'display', null);
                const events = ['fullscreen', 'fullscreenWeb'];
                for (let index = 0; index < events.length; index++) {
                    art.on(events[index], (state) => {
                        if (state) {
                            setStyle($control, 'display', null);
                            setStyle($bottom, 'display', 'none');
                        } else {
                            setStyle($control, 'display', 'none');
                            setStyle($bottom, 'display', null);
                        }
                    });
                }
            } else {
                setStyle($bottom, 'display', 'none');
            }
        }

        initControl();
        play();

        return {
            name: 'artplayerPluginAliyundrive',
            play,
            next,
            prev,
        };
    };
}

artplayerPluginAliyundrive.env = process.env.NODE_ENV;
artplayerPluginAliyundrive.version = process.env.APP_VER;
artplayerPluginAliyundrive.build = process.env.BUILD_DATE;

if (typeof document !== 'undefined') {
    if (!document.getElementById('artplayer-plugin-aliyundrive')) {
        const $style = document.createElement('style');
        $style.id = 'artplayer-plugin-aliyundrive';
        $style.textContent = style;
        document.head.appendChild($style);
    }
}

if (typeof window !== 'undefined') {
    window['artplayerPluginAliyundrive'] = artplayerPluginAliyundrive;
}
