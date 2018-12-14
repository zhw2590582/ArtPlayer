import Flv from './flv';

function artplayerPluginFlv(art) {
    const {
        template: { $video },
    } = art;
    return {
        load: url =>
            new Promise(resolve => {
                const flv = new Flv($video, url);
                return resolve(flv.mediaSource.url);
            }),
    };
}

window.artplayerPluginFlv = artplayerPluginFlv;
export default artplayerPluginFlv;
