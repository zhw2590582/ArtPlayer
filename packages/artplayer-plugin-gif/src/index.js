import gifshot from 'gifshot';

function artplayerPluginGif(art) {
    return {
        name: 'artplayerPluginGif',
        create(config = {}, callback) {
            gifshot.createGIF(
                {
                    ...config,
                    video: [art.template.$video.src],
                },
                obj => {
                    if (!obj.error) {
                        if (callback) {
                            callback(obj.image);
                        }
                    } else {
                        console.log(obj.error);
                    }
                },
            );
        },
    };
}

window.artplayerPluginGif = artplayerPluginGif;
export default artplayerPluginGif;
