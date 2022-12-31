import style from 'bundle-text:./style.less';
import iconNext from 'bundle-text:./icons/next.svg';

export default function artplayerPluginAliyundrive(option = { onlyOnFullscreen: true, playlist: [] }) {
    return (art) => {
        const {
            template: { $player, $bottom },
            constructor: {
                utils: { append, query, secondToTime, setStyle, clamp, addClass, tooltip, errorHandle, isMobile },
            },
        } = art;

        setStyle($bottom, 'display', 'none');

        let index = 0;
        let $control = null;
        let $next = null;

        function next() {
            const nextIndex = index + 1;
            index = nextIndex > option.playlist.length - 1 ? 0 : nextIndex;
            init();
        }

        function prev() {
            const prevIndex = index - 1;
            index = prevIndex < 0 ? 0 : prevIndex;
            init();
        }

        function updateI18n() {
            art.i18n.update({
                'zh-cn': {
                    Next: '下一个',
                },
                'zh-tw': {
                    Next: '下一個',
                },
            });
        }

        function createIcon(html, name) {
            const icon = document.createElement('i');
            addClass(icon, 'art-icon');
            addClass(icon, `art-icon-${name}`);
            append(icon, html);
            return icon;
        }

        function createControl() {
            $control = append(
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
                                    <div class="apa-control-time"></div>
                                </div>
                            </div>
                            <div class="apa-control-duration"></div>
                        </div>
                        <div class="apa-tool">
                            <div class="apa-tool-left">
                                <div class="apa-tool-state"></div>
                                <div class="apa-tool-next"></div>
                                <div class="apa-tool-volume"></div>
                            </div>
                            <div class="apa-tool-right">2</div>
                        </div>
                    </div>
                `,
            );
        }

        function createProgress() {
            let isDroging = false;
            const $progress = query('.apa-control-progress', $control);
            const $current = query('.apa-control-current', $control);
            const $duration = query('.apa-control-duration', $control);
            const $played = query('.apa-control-played', $control);
            const $loaded = query('.apa-control-loaded', $control);
            const $time = query('.apa-control-time', $control);

            function getPosFromEvent(event) {
                const { left } = $progress.getBoundingClientRect();
                const width = clamp(event.pageX - left, 0, $progress.clientWidth);
                const percentage = clamp(width / $progress.clientWidth, 0, 1);
                const second = (width / $progress.clientWidth) * art.duration;
                const time = secondToTime(second);
                return { width, second, percentage, time };
            }

            art.proxy($progress, 'mousemove', (event) => {
                setStyle($time, 'display', 'block');
                const { time, width } = getPosFromEvent(event);
                $time.innerText = time;
                const tipWidth = $time.clientWidth;
                setStyle($time, 'left', `${width - tipWidth / 2}px`);
            });

            art.proxy($progress, 'mouseout', () => {
                setStyle($time, 'display', 'none');
            });

            art.proxy($progress, 'mousedown', (event) => {
                if (event.button === 0) {
                    isDroging = true;
                    const { percentage, second } = getPosFromEvent(event);
                    setStyle($played, 'width', `${percentage * 100}%`);
                    art.seek = second;
                }
            });

            art.proxy(document, 'mousemove', (event) => {
                if (isDroging) {
                    const { percentage, second } = getPosFromEvent(event);
                    setStyle($played, 'width', `${percentage * 100}%`);
                    art.seek = second;
                }
            });

            art.proxy(document, 'mouseup', () => {
                if (isDroging) {
                    isDroging = false;
                }
            });

            const events = ['video:loadedmetadata', 'video:timeupdate', 'video:progress'];
            for (let index = 0; index < events.length; index++) {
                art.on(events[index], () => {
                    $current.innerText = secondToTime(art.currentTime);
                    $duration.innerText = secondToTime(art.duration);
                    setStyle($played, 'width', `${art.played * 100}%`);
                    setStyle($loaded, 'width', `${art.loaded * 100}%`);
                });
            }
        }

        function createState() {
            const $state = query('.apa-tool-state', $control);
            const $play = append($state, art.icons.play);
            const $pause = append($state, art.icons.pause);

            tooltip($play, art.i18n.get('Play'));
            tooltip($pause, art.i18n.get('Pause'));

            art.proxy($play, 'click', () => {
                art.play();
            });

            art.proxy($pause, 'click', () => {
                art.pause();
            });

            function showPlay() {
                setStyle($play, 'display', 'flex');
                setStyle($pause, 'display', 'none');
            }

            function showPause() {
                setStyle($play, 'display', 'none');
                setStyle($pause, 'display', 'flex');
            }

            if (art.playing) {
                showPause();
            } else {
                showPlay();
            }

            art.on('video:playing', () => {
                showPause();
            });

            art.on('video:pause', () => {
                showPlay();
            });
        }

        function createNext() {
            $next = query('.apa-tool-next', $control);
            append($next, createIcon(iconNext, 'next'));
            tooltip($next, art.i18n.get('Next'));

            art.proxy($next, 'click', () => {
                next();
                console.log(index);
                art.play();
            });
        }

        function createVolume() {
            let isDroging = false;
            const $wrap = query('.apa-tool-volume', $control);
            const panelWidth = art.constructor.VOLUME_PANEL_WIDTH;
            const handleWidth = art.constructor.VOLUME_HANDLE_WIDTH;
            const $volume = append($wrap, art.icons.volume);
            const $volumeClose = append($wrap, art.icons.volumeClose);
            const $volumePanel = append($wrap, '<div class="apa-tool-volume-panel"></div>');
            const $volumeHandle = append($volumePanel, '<div class="apa-tool-volume-handle"></div>');
            tooltip($volume, art.i18n.get('Mute'));
            setStyle($volumeClose, 'display', 'none');

            if (isMobile) {
                setStyle($volumePanel, 'display', 'none');
            }

            function volumeChangeFromEvent(event) {
                const { left: panelLeft } = $volumePanel.getBoundingClientRect();
                const percentage =
                    clamp(event.pageX - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) /
                    (panelWidth - handleWidth);
                return percentage;
            }

            function setVolumeHandle(percentage = 0.7) {
                if (art.muted || percentage === 0) {
                    setStyle($volume, 'display', 'none');
                    setStyle($volumeClose, 'display', 'flex');
                    setStyle($volumeHandle, 'left', '0');
                } else {
                    const width = (panelWidth - handleWidth) * percentage;
                    setStyle($volume, 'display', 'flex');
                    setStyle($volumeClose, 'display', 'none');
                    setStyle($volumeHandle, 'left', `${width}px`);
                }
            }

            setVolumeHandle(art.volume);

            art.on('video:volumechange', () => {
                setVolumeHandle(art.volume);
            });

            art.proxy($volume, 'click', () => {
                art.muted = true;
            });

            art.proxy($volumeClose, 'click', () => {
                art.muted = false;
            });

            art.proxy($volumePanel, 'click', (event) => {
                art.muted = false;
                art.volume = volumeChangeFromEvent(event);
            });

            art.proxy($volumeHandle, 'mousedown', () => {
                isDroging = true;
            });

            art.proxy($wrap, 'mousemove', (event) => {
                if (isDroging) {
                    art.muted = false;
                    art.volume = volumeChangeFromEvent(event);
                }
            });

            art.proxy(document, 'mouseup', () => {
                if (isDroging) {
                    isDroging = false;
                }
            });
        }

        function init() {
            const playItme = option.playlist[index];
            if (!playItme) return;
            art.poster = playItme.poster || '';
            playItme.quality = playItme.quality || [];
            const quality = playItme.quality.find((item) => item.default) || playItme.quality[0];
            errorHandle(quality && quality.url, 'Unable to find the default quality url');
            art.url = quality.url;
        }

        updateI18n();
        createControl();
        createProgress();
        createState();
        createNext();
        createVolume();
        init();

        return {
            name: 'artplayerPluginAliyundrive',
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
