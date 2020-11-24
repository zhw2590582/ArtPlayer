import ASS from 'assjs';
import './style.scss';

function artplayerPluginAss(url) {
    return (art) => {
        let ass = null;
        fetch(url)
            .then((res) => res.text())
            .then((text) => {
                const { $video, $subtitle } = art.template;
                $subtitle.classList.add('artplayer-plugin-ass');

                art.once('ready', () => {
                    ass = new ASS(text, $video, {
                        container: $subtitle,
                        resampling: 'video_width',
                    });

                    ass.resize();
                    art.emit('artplayerPluginAss', ass);
                    art.on('resize', () => ass.resize());
                    art.on('destroy', () => ass.destroy());
                });
            });
        return {
            name: 'artplayerPluginAss',
            ass,
        };
    };
}

export default artplayerPluginAss;
