import gifshot from 'gifshot';

function artplayerPluginGif(art) {
    console.log(gifshot);
    return {
        name: 'artplayerPluginGif',
    };
}

window.artplayerPluginGif = artplayerPluginGif;
export default artplayerPluginGif;
