import style from 'bundle-text:./style.less';

function checkVersion(art) {
    const {
        version,
        utils: { errorHandle },
    } = art.constructor;
    const arr = version.split('.').map(Number);
    const major = arr[0];
    const minor = arr[1] / 100;
    errorHandle(
        major + minor >= 4.06,
        `Artplayer.js@${version} is not compatible the artplayerPluginControl@${artplayerPluginControl.version}. Please update it to version Artplayer.js@4.6.x`,
    );
}

export default function artplayerPluginControl() {
    return (art) => {
        checkVersion(art);

        const {
            template: { $bottom, $player },
            constructor: {
                utils: { append, secondToTime, addClass, removeClass, hasClass, isMobile },
            },
        } = art;

        if (isMobile) return;

        const className = 'artplayer-plugin-control';
        addClass($player, className);

        const $current = append($bottom, `<div class="apa-control-current"></div>`);
        const $duration = append($bottom, `<div class="apa-control-duration"></div>`);

        const events = ['video:loadedmetadata', 'video:timeupdate', 'video:progress'];

        for (let index = 0; index < events.length; index++) {
            art.on(events[index], () => {
                $current.innerText = secondToTime(art.currentTime);
                $duration.innerText = secondToTime(art.duration);
            });
        }

        return {
            name: 'artplayerPluginControl',
            get enable() {
                return hasClass($player, className);
            },
            set enable(state) {
                if (state) {
                    addClass($player, className);
                } else {
                    removeClass($player, className);
                }
            },
        };
    };
}

artplayerPluginControl.env = process.env.NODE_ENV;
artplayerPluginControl.version = process.env.APP_VER;
artplayerPluginControl.build = process.env.BUILD_DATE;

if (typeof document !== 'undefined') {
    if (!document.getElementById('artplayer-plugin-control')) {
        const $style = document.createElement('style');
        $style.id = 'artplayer-plugin-control';
        $style.textContent = style;
        document.head.appendChild($style);
    }
}

if (typeof window !== 'undefined') {
    window['artplayerPluginControl'] = artplayerPluginControl;
}
