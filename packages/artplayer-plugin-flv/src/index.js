import checkSupport from './checkSupport';
import CreatMediaSource from './creatMediaSource';

class Flv {
    constructor(art) {
        checkSupport(art);
        this.mediaSource = new CreatMediaSource(art);
        this.load = url => {
            console.log(url);
        };
    }
}

function artplayerPluginFlv(art) {
    const flv = new Flv(art);
    return {
        load: url => new Promise(resolve => {
            flv.load(url);
            return resolve(flv.mediaSource.url);
        }),
    };
}

window.artplayerPluginFlv = artplayerPluginFlv;
export default artplayerPluginFlv;
