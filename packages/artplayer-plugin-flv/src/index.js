import Flv from './flv';

function artplayerPluginFlv(art) {
    const {
        template: { $video },
    } = art;
    const flv = new Flv($video);
    return {
        load: url =>
            new Promise(resolve => {
                flv.loadUrl(url).start();
                return resolve(flv.mediaSource.url);
            }),
    };
}

window.artplayerPluginFlv = artplayerPluginFlv;
export default artplayerPluginFlv;
