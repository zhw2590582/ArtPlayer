import Flv from './flv';

function artplayerPluginFlv(art) {
    let flv = null;

    art.on('destroy', () => {
        if (flv) {
            flv.destroy();
        }
    });

    return {
        flv,
        init: (mediaElement, url) => {
            flv = new Flv(mediaElement, url);
            flv.load();
        },
    };
}

window.artplayerPluginFlv = artplayerPluginFlv;
export default artplayerPluginFlv;
