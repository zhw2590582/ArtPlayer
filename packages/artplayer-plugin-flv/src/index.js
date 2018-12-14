function artplayerPluginFlv(art) {
    return {
        attach: url => new Promise(resolve => {
            resolve('https://blog.zhw-island.com/assets-cdn/video/one-more-time-one-more-chance-480p.mp4');
        }),
    };
}

window.artplayerPluginFlv = artplayerPluginFlv;
export default artplayerPluginFlv;
