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
        `Artplayer.js@${version} is not compatible the artplayerPluginAliyundrive@${artplayerPluginAliyundrive.version}. Please update it to version Artplayer.js@4.6.x`,
    );
}

export default function artplayerPluginAliyundrive() {
    return (art) => {
        checkVersion(art);

        const {
            template: { $bottom },
            constructor: {
                utils: { append, secondToTime, addClass },
            },
        } = art;

        addClass($bottom, 'artplayer-plugin-aliyundrive');
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
            name: 'artplayerPluginAliyundrive',
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
