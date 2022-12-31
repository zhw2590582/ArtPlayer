import style from 'bundle-text:./style.less';

export default function artplayerPluginAliyundrive(option) {
    return (art) => {
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
