import style from 'bundle-text:./style.less';

export default function artplayerPluginAds(option) {
    return (art) => {
        const {
            constructor: {
                utils: { append },
            },
            template: { $player },
        } = art;

        const $ads = append($player, '<div class="artplayer-plugin-ads"></div>');
        append($ads, option.video ? `<video src="${option.video}" controls="false"></video>` : option.html);

        return {
            name: 'artplayerPluginAds',
            skip() {
                //
            },
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
